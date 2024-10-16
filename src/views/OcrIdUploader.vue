<template>
  <Header />
  <main>
    <div class="title-block">
      <router-link to="/" class="no-underline back-route">
        <SvgIcon name="back" class="back-icon" />
        <span>返回</span>
      </router-link>
      <div class="title">
        <p>預先登記入住</p>
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <p class="card-title">上傳個人證件</p>
        <Select
          :selectedOption="selectedOption"
          :options="options"
          @update:selectedOption="updateSelectedOption"
        />
        <Upload ref="uploadRef" :name="computedLabels.name" :labels="computedLabels.labels" />
        <Button buttonClass="btn primary-btn" :disabled="isDisabled" @click="handleNextStep">
          下一步
        </Button>
        <p v-if="isLoading">Loading...</p>
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
import Header from '@/components/Header.vue'
import Button from '@/components/Button.vue'
import Select from '@/components/Select.vue'
import Upload from '@/components/Upload.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import { useIdImageStore } from '@/stores/idimage'
import { useOrderStore } from '@/stores/order'
import { useRouter } from 'vue-router'
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
const router = useRouter()

const uploadRef = ref<any>(null)
const isLoading = ref<boolean>(false)
const isDisabled = ref<boolean>(true)

const selectedOption = ref<Option>({
  name: 'id',
  label: '身分證'
})

const options = ref<Option[]>([
  { name: 'id', label: '身分證' },
  { name: 'passport', label: '護照' }
])

const uploadLabelMap: UploadLabelMap = {
  id: {
    front: '身分證正面',
    back: '身分證反面'
  },
  passport: {
    front: '護照個人頁'
  }
}

const computedLabels = computed(() => {
  const selectedName = selectedOption.value?.name

  return {
    name: selectedName,
    labels: uploadLabelMap[selectedName] || {}
  }
})

const updateSelectedOption = (option: Option) => {
  selectedOption.value = option
}

const checkIfCanProceed = computed(() => {
  const selectedName = selectedOption.value.name
  const requiredFields = Object.keys(uploadLabelMap[selectedName] || {})
  const imageData = idImage.idImages[selectedName] || {}

  return requiredFields.every((field) => imageData[field])
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
  idImage.clearStore()
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
      errorTitle.value = '證件辨識失敗'
      errorContent.value = [{ text: '證件圖片無法辨識' }, { text: '請重新選擇' }]
      errorButtonText.value = '重新上傳'
      break
    case ErrorType.MinorAccessDenied:
      errorTitle.value = '未成年阻擋'
      errorContent.value = [
        { text: '辨識您為未滿18歲身分，' },
        { text: '無法使用線上登記，' },
        { text: '請協同監護人於旅店櫃檯辦理入住。' }
      ]
      errorButtonText.value = '我瞭解了'
      errorSubText.value = '我已成年，重新嘗試'
      errorClass.value = 'purple'
      break
    case ErrorType.UnsupportedFormat:
      errorTitle.value = '證件格式錯誤'
      errorContent.value = [
        { text: '{身分證反面}' },
        { text: '圖片格式不符' },
        { text: '請重新上傳' }
      ]
      errorButtonText.value = '重新上傳'
      break
    default:
      errorTitle.value = '未知錯誤'
      errorContent.value = [{ text: '發生未知錯誤' }, { text: '請稍後再試' }]
      errorButtonText.value = '關閉'
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
      };

      idImage.setIdOcrResult(response);
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
.card {
  width: 1113px;
  display: flex;
  justify-content: center;

  .card-content {
    display: inline-block;
    width: auto;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.card-title {
  color: var(--On-Surface-Var);
  margin-bottom: 32px;
}

.btn {
  width: 100%;
}

.upload-group {
  display: flex;
  gap: 24px;
}
</style>
