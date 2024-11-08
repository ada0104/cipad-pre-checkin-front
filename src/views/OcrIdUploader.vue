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
        <span>{{$t('return')}}</span>
      </router-link>
      <div class="title">
        <p>{{$t('preCheckIn')}}</p>
      </div>
    </div>
    <div class="card">
      <p class="card-title">{{$t('uploadPersonalIdentification')}}</p>
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
          {{$t('nextStep')}}
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
import LottieAnimation from '@/components/Lottie.vue';

import { useIdImageStore } from '@/stores/idimage'
import { useOrderStore, useUrlTokenStore } from '@/stores/order'
import { useI18n } from 'vue-i18n';

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
const urlTokenStore = useUrlTokenStore();
const router = useRouter()
const { t } = useI18n();

const uploadRef = ref<any>(null)
const isLoading = ref<boolean>(false)
const isDisabled = ref<boolean>(true)
const isImageChanged = ref<boolean>(false)

const selectedOption = ref({
  name: 'id',
  label: t('identification.id') // 使用 i18n 翻譯
});

const options = ref([
  { name: 'id', label: t('identification.id') },
  { name: 'passport', label: t('identification.passport') }
]);

const uploadLabelMap = computed(() => ({
  id: {
    front: t('uploadLabel.idFront'),
    back: t('uploadLabel.idBack')
  },
  passport: {
    front: t('uploadLabel.passportFront')
  }
}));

const computedLabels = computed(() => {
  const selectedName = selectedOption.value?.name as 'id' | 'passport';

  return {
    name: selectedName,
    labels: uploadLabelMap.value[selectedName]
  };
});

const updateSelectedOption = (option: Option) => {
  selectedOption.value = option
}

const checkIfCanProceed = computed(() => {
  const selectedName = selectedOption.value.name as keyof typeof uploadLabelMap;
  const requiredFields = Object.keys(uploadLabelMap[selectedName] || {});
  const imageData = idImage.idImages[selectedName] || {};

  const canProceed = requiredFields.every((field) => imageData[field]);

  return canProceed;
});

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

enum ErrorType {
  RecognitionFailed, // 證件辨識失敗
  UnsupportedFormat, // 證件格式錯誤
  MinorAccessDenied, // 未成年阻擋
  UnknownError // 未知錯誤
}

const ocrErrorCodeMap: { [key: string]: ErrorType } = {
  '1000': ErrorType.MinorAccessDenied,
  '1001': ErrorType.MinorAccessDenied,
  '1002': ErrorType.RecognitionFailed,
  '1003': ErrorType.RecognitionFailed,
  '1004': ErrorType.RecognitionFailed,
  '1005': ErrorType.RecognitionFailed,
  '5003': ErrorType.RecognitionFailed,
  '5004': ErrorType.RecognitionFailed
}

const showError = ref<boolean>(false)
const errorTitle = ref<string>('')
const errorContent = ref<Array<{ text: string; class?: string }>>([])
const errorButtonText = ref<string>('')
const errorClass = ref<string>('')
const errorSubText = ref<string>('')
const currentErrorType = ref<ErrorType | null>(null)

function updateErrorMessages(type: ErrorType): void {
  errorClass.value = ''
  errorSubText.value = ''
  currentErrorType.value = type

  switch (type) {
    case ErrorType.RecognitionFailed:
      errorTitle.value = t('identificationFailed')
      errorContent.value = [{ text: t('documentImageCannotBeRecognized') }, { text: t('pleaseReselect') }]
      errorButtonText.value = t('reUpload')
      break
    case ErrorType.MinorAccessDenied:
      errorTitle.value = t('minorBlocked')
      errorContent.value = [
        { text: t('identifiedAsUnder18') },
        { text: t('onlineRegistrationNotAvailable') },
        { text: t('pleaseCheckInWithGuardian') }
      ]
      errorButtonText.value = t('iUnderstand')
      errorSubText.value = t('iAmOfLegalAgeTryAgain')
      errorClass.value = 'purple'
      break
    case ErrorType.UnsupportedFormat:
      errorTitle.value = t('invalidDocumentFormat')
      errorContent.value = [
        { text: t('backOfIdCard') },
        { text: t('imageFormatDoesNotMatch') },
        { text: t('reUpload') }
      ]
      errorButtonText.value = t('reUpload')
      break
    default:
      errorTitle.value = t('unknownError')
      errorContent.value = [{ text: t('unknownErrorOccurred') }, { text: t('pleaseTryAgainLater') }]
      errorButtonText.value = t('close')
      break
  }

  showError.value = true
}

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

// 完成上傳後開始進行OCR辨識
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
<style lang="scss" scoped>
</style>
