<template>
  <Header />
  <main class="ocr">
    <div class="title-block">
      <router-link
        :to="{
          name: 'home',
          params: { urlToken: urlTokenStore.urlToken }
        }"
        class="no-underline back-route"
      >
        <SvgIcon name="back" class="back-icon" />
        <span>{{ $t('return') }}</span>
      </router-link>
      <div class="title">
        <p>{{ $t('preCheckIn') }}</p>
      </div>
    </div>
    <div class="card">
      <p class="card-title">{{ $t('uploadPersonalIdentification') }}</p>
      <div class="card-content">
        <Select
          :selectedOption="selectedOption"
          :options="options"
          @update:selectedOption="updateSelectedOption"
        />
        <Upload
          ref="uploadRef"
          :name="computedLabels.name"
          :labels="computedLabels.labels"
          @imageChanged="isImageChanged = true"
        />
        <Button buttonClass="btn primary-btn" :disabled="isDisabled" @click="handleNextStep">
          {{ $t('nextStep') }}
        </Button>
        <div v-if="isLoading" class="loading-animation">
          <LottieAnimation name="id_ocr" :lottie_text="$t('documentUnderReview')" />
        </div>
      </div>
    </div>
  </main>
  <ErrorAlert
    v-if="showError"
    :title="errorTitle"
    :content="errorContent"
    :buttonText="errorButtonText"
    :subText="errorSubText"
    :class="errorClass"
    @buttonClick="handleRetryUpload(currentErrorType)"
    @subTextClick="handleSubTextClick(currentErrorType)"
  />
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import Header from '@/components/Header.vue'
import Button from '@/components/Button.vue'
import Select from '@/components/Select.vue'
import Upload from '@/components/Upload.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LottieAnimation from '@/components/Lottie.vue'

import { useIdImageStore } from '@/stores/idimage'
import { useOrderStore, useUrlTokenStore } from '@/stores/order'
import { useI18n } from 'vue-i18n'

import { useErrorHandling, ErrorType } from '@/composables/useErrorHandling'
import { getOcrData, type OcrDataResponse, type OcrDataRequest } from '@/api/api'

interface Option {
  name: string
  label: string
}

interface UploadLabelMap {
  [key: string]: {
    front: string
    back?: string
  }
}

const idImage = useIdImageStore()
const urlTokenStore = useUrlTokenStore()
const router = useRouter()
const { t } = useI18n()

const uploadRef = ref<any>(null)
const isLoading = ref<boolean>(false)
const isDisabled = ref<boolean>(true)
const isImageChanged = ref<boolean>(false)

interface SelectedOption {
  name: string
  label: string
}

const selectedOption = ref<SelectedOption>({
  name: 'id',
  label: t('identification.id')
})

const options = ref([
  { name: 'id', label: t('identification.id') },
  { name: 'passport', label: t('identification.passport') }
])

const uploadLabelMap = computed(() => ({
  id: {
    front: t('uploadLabel.idFront'),
    back: t('uploadLabel.idBack')
  },
  passport: {
    front: t('uploadLabel.passportFront')
  }
}))

const computedLabels = computed(() => {
  const selectedName = selectedOption.value?.name as 'id' | 'passport'

  return {
    name: selectedName,
    labels: uploadLabelMap.value[selectedName]
  }
})

const updateSelectedOption = (option: Option) => {
  selectedOption.value = option
}

const checkIfCanProceed = computed(() => {
  const selectedName = selectedOption.value.name as 'id' | 'passport'
  const requiredFields = Object.keys(uploadLabelMap.value[selectedName] || {})
  const imageData = idImage.idImages[selectedName] || {}

  const canProceed = requiredFields.every((field) => imageData[field])

  return canProceed
})

const handleNextStep = () => {
  if (!isDisabled.value) {
    getOcrImageData()
  }
}

watch(checkIfCanProceed, (canProceed) => {
  isDisabled.value = !canProceed
})

onMounted(() => {
  const existingImages = Object.keys(idImage.idImages)

  if (existingImages.length > 0) {
    const firstExistingImage = existingImages[0]
    const option = options.value.find((option) => option.name === firstExistingImage)

    if (option) {
      updateSelectedOption(option)
    }
  }
  isDisabled.value = !checkIfCanProceed.value
})

const {
  showError,
  errorTitle,
  errorContent,
  errorSubText,
  errorButtonText,
  errorClass,
  currentErrorType,
  ocrErrorCodeMap,
  updateErrorMessages
} = useErrorHandling()

const handleRetryUpload = (errorType: ErrorType | null) => {
  if (errorType === ErrorType.MinorAccessDenied) {
    router.push('/')
  }

  uploadRef.value.clearUploadData()
  showError.value = false
}

const handleSubTextClick = (errorType: ErrorType | null) => {
  if (errorType === ErrorType.MinorAccessDenied) {
    uploadRef.value.clearUploadData()
  }

  showError.value = false
}

const getOcrImageData = async () => {
  isLoading.value = true

  const orderStore = useOrderStore()
  const orderNumber = orderStore.orderData.orderData.order_number
  const idImageStore = useIdImageStore()
  const images = idImageStore.idImages

  // 將資料整理成api格式
  const imageType = Object.keys(images)[0]
  const { front, back } = Object.values(images)[0]

  const removeBase64Prefix = (image: string) => image.replace(/^data:image\/\w+;base64,/, '')
  const ocrRequestData: OcrDataRequest = {
    order_number: orderNumber,
    image_type: imageType,
    image1: removeBase64Prefix(front),
    ...(back && { image2: removeBase64Prefix(back) })
  }

  try {
    const { ocrData } = await getOcrData(ocrRequestData)

    if (ocrData.code !== '0') {
      const errorType = ocrErrorCodeMap[ocrData.code]

      if (Array.isArray(ocrData.data)) {
        console.log(ocrData.data[0].code)

        const code = ocrData.data[0].code
        const match = code.match(/_(\w+)_/)

        if (code === 'UNRECOGNIZED_DOCUMENT') {
          const documentSide = 'UNRECOGNIZED_DOCUMENT'
          updateErrorMessages(errorType, documentSide)
          return
        }

        if (match) {
          const documentSide = match ? match[1] : undefined
          updateErrorMessages(errorType, documentSide)
          return
        }
      }

      updateErrorMessages(errorType)
    }

    if (ocrData.code === '0') {
      const response: OcrDataResponse = {
        code: ocrData.code,
        message: ocrData.message,
        data: ocrData.data
      }

      idImage.setIdOcrResult(response)
      router.push('/form')
    }
  } catch (error) {
    updateErrorMessages(ErrorType.UnknownError)
  } finally {
    isLoading.value = false
  }
}
</script>
