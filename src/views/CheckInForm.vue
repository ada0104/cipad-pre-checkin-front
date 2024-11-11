<template>
  <Header />
  <main class="form">
    <div class="title-block">
      <Button buttonClass="" @click="handleBackAction" class="back-route">
        <SvgIcon name="back" class="back-icon" />
        <span>{{ $t('return') }}</span>
      </Button>
      <div class="title">
        <p>{{ $t('preCheckIn') }}</p>
      </div>
    </div>
    <div v-if="!showContact" class="card">
      <div class="card-content">
        <p class="card-title">{{ $t('fillInInformation') }}</p>
        <div class="form-block">
          <!----- 基本資料 ----->
          <div class="block-content">
            <div class="form-title">
              <p class="form-title-text">{{ $t('personalIdentificationInformation') }}</p>
              <router-link to="/upload" class="no-underline">
                <button class="back-to-upload-btn">{{ $t('reUpload') }}</button>
              </router-link>
            </div>
            <div class="image-preview-block">
              <div v-for="(src, side) in idImageArray" :key="side" class="image-preview-container">
                <div class="image-preview-img">
                  <canvas
                    :ref="
                      (el) => {
                        if (el) canvasRefs[side] = el as HTMLCanvasElement
                      }
                    "
                    width="254"
                    height="150"
                  >
                  </canvas>
                </div>
              </div>
            </div>
            <div class="input-wrapper">
              <div>
                <label for="name-input" class="input-label">{{ $t('name') }}</label>
                <label v-if="v$.userName.$error" class="error-message">{{
                  userNameErrorMessage
                }}</label>
              </div>
              <div class="input-container">
                <input
                  type="text"
                  id="name-input"
                  ref="userNameInput"
                  v-model="userName"
                  class="input-field"
                  :class="{ 'error-border': v$.userName.$error }"
                  :readonly="isReadonly"
                  @blur="v$.userName.$touch()"
                />
                <button v-if="!hasEdited" @click="enableInput" class="clear-button" type="button">
                  <SvgIcon name="close" class="clear-icon" />
                </button>
              </div>
            </div>
            <div class="input-wrapper">
              <label for="date-input" class="input-label">{{ $t('dateOfBirth') }}</label>
              <div class="input-container">
                <input
                  type="text"
                  id="date-input"
                  ref="dateInput"
                  v-model="birthday"
                  class="input-field date"
                  readonly
                />
              </div>
            </div>
          </div>
          <!----- 聯絡方式 ----->
          <div class="block-content">
            <div class="form-title">
              <p class="form-title-text">{{ $t('contactInformation') }}</p>
            </div>
            <!----- 電子信箱 ----->
            <div class="input-wrapper">
              <div>
                <label for="email-input" class="input-label">{{ $t('emailAddress') }}</label>
                <label v-if="v$.email.$error" class="error-message">{{ emailErrorMessage }}</label>
              </div>
              <div class="input-container">
                <input
                  type="text"
                  id="email-input"
                  v-model="email"
                  class="input-field"
                  :class="{ 'error-border': v$.email.$error }"
                  :placeholder="$t('enterEmailAddress')"
                  @blur="v$.email.$touch()"
                />
              </div>
            </div>
            <!----- 手機號碼 ----->
            <div class="input-wrapper">
              <div>
                <label for="name-input" class="input-label">{{ $t('mobileNumber') }}</label>
                <label v-if="v$.phone.$error" class="error-message">{{ phoneErrorMessage }}</label>
                <label v-else class="error-message phone-sub ">{{ $t('validationPhoneNumberTaiwanOnly') }}</label>
              </div>
              <div class="input-container phone-input">
                <div
                  :class="{ 'error-border': v$.phone.$error }"
                  class="input-field country-code">
                  <span>+886</span>
                  <span>|</span>
                </div>
                <input
                  type="tel"
                  id="phone-input"
                  v-model="phone"
                  class="input-field phone-input"
                  :class="{ 'error-border': v$.phone.$error }"
                  :placeholder="$t('enterMobileNumber')"
                  @blur="v$.phone.$touch()"
                />
              </div>
            </div>
          </div>
          <!----- 發票格式 ----->
          <div>
            <div class="form-title">
              <p class="form-title-text">{{ $t('invoiceFormat') }}</p>
              <p class="form-title-sub">{{ $t('thisStoreUsesPaperInvoices') }}</p>
            </div>
            <div class="radio-group">
              <label class="radio-label">
                <input
                  type="radio"
                  name="invoice-type"
                  value="two-step"
                  v-model="selectedInvoiceType"
                />
                <span class="radio-custom"></span>
                <span class="label-text">{{ $t('twoPartPersonalInvoice') }}</span>
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  name="invoice-type"
                  value="three-step"
                  v-model="selectedInvoiceType"
                />
                <span class="radio-custom"></span>
                <span class="label-text">{{ $t('threePartPersonalInvoice') }}</span>
              </label>
              <p v-if="v$.cloudCarrier.$error" class="error-message">
                {{ cloudCarrierErrorMessage }}
              </p>
              <p v-if="v$.companyId.$error" class="error-message">
                {{ companyIdErrorMessage }}
              </p>
            </div>
            <!-- 二聯式個人發票時顯示 -->
            <div v-if="selectedInvoiceType === 'two-step'">
              <div class="input-container">
                <input
                  type="text"
                  id="cloud-carrier-input"
                  v-model="cloudCarrier"
                  class="input-field"
                  :class="{ 'error-border': v$.cloudCarrier.$error }"
                  :placeholder="$t('enterCloudCarrierOptional')"
                  @blur="v$.cloudCarrier.$touch()"
                />
              </div>
            </div>
            <!-- 三聯式個人發票時顯示 -->
            <div v-if="selectedInvoiceType === 'three-step'">
              <div class="input-container">
                <input
                  type="text"
                  id="company-id-input"
                  v-model="companyId"
                  class="input-field"
                  :class="{ 'error-border': v$.companyId.$error }"
                  :placeholder="$t('enterCompanyTaxId')"
                  @blur="v$.companyId.$touch()"
                />
              </div>
              <div class="input-container invoice-co-name">
                <p v-if="v$.companyName.$error" class="error-message">
                  {{ companyNameErrorMessage }}
                </p>
                <input
                  type="text"
                  id="company-name-input"
                  v-model="companyName"
                  class="input-field"
                  :class="{ 'error-border': v$.companyName.$error }"
                  :placeholder="$t('enterCompanyNameOptional')"
                />
              </div>
            </div>
          </div>
        </div>
        <!----- 隱私條款 ----->
        <div class="custom-checkbox">
          <input
            type="checkbox"
            id="checkbox"
            class="checkbox-input"
            v-model="acceptTerms"
            @change="handleCheckboxChange"
          />
          <label for="checkbox" :class="{ 'error-checkbox': showErrorMessage }">
            <SvgIcon v-if="acceptTerms" name="check" class="check-icon" />
          </label>
          <div>
            <span class="label-text" :class="{ 'error-label': showErrorMessage }"
              >{{ $t('iAgreeToTerms') }}
            </span>
            <button
              type="button"
              class="link-button"
              :class="{ 'error-label': showErrorMessage }"
              @click="togglePrivacyPolicy"
            >
            {{ $t('privacyPolicy') }}
            </button>
          </div>
          <span v-if="showErrorMessage" class="error-message">
            {{ acceptTermsErrorMessage }}
          </span>
        </div>
        <Button buttonClass="btn primary-btn" :disabled="isDisabled" @click="handleNextStep">
          {{ $t('submit') }}
        </Button>
      </div>
    </div>
    <PrivacyPolicy v-if="showContact" @close="togglePrivacyPolicy" class="privacyPolicy"/>
    <div v-if="isLoading" class="loading-animation">
      <LottieAnimation name="upload" :lottie_text="$t('uploadingData')" />
    </div>
  </main>
  <ErrorAlert
    v-if="showError"
    :title="errorTitle"
    :content="errorContent"
    :buttonText="errorButtonText"
    :class="errorClass"
    @buttonClick="handleRetryUpload(currentErrorType)"
  >
    <template #extra-button v-if="showExtraButton">
      <div class="no-underline back-edit" @click="handleBackAction">
        <SvgIcon name="back" class="back-icon" />
        <span>{{ $t('returnToEdit') }}</span>
      </div>
      <Button buttonClass="btn secondary-btn pass-btn" @click="handleExtraAction"
        >{{ $t('skipAndDoNotAccess') }}</Button
      >
    </template>
  </ErrorAlert>
</template>
<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue'

import Header from '@/components/Header.vue'
import Button from '@/components/Button.vue'
import PrivacyPolicy from '@/components/PrivacyPolicy.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LottieAnimation from '@/components/Lottie.vue';

import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email as emailValidator, minLength, maxLength } from '@vuelidate/validators'
import { setMemberData, type NewMemberDataRequest } from '@/api/api'
import { useI18n } from 'vue-i18n';

import { useOrderStore } from '@/stores/order'
import { useIdImageStore } from '@/stores/idimage'
import { useMemberDataStore } from '@/stores/member'

const router = useRouter()
const idImage = useIdImageStore()
const orderStore = useOrderStore()
const memberDataStore = useMemberDataStore()
const { t } = useI18n();

// 表單動作
const isLoading = ref<boolean>(false)
const isDisabled = ref<boolean>(true)
const showError = ref<boolean>(false)
const selectedInvoiceType = ref<'two-step' | 'three-step'>('two-step')

// 表單資料
const userName = ref<string>('')
const birthday = ref<string>('')
const email = ref<string>('')
const phone = ref<string>('')
const cloudCarrier = ref<string | null>(null);
const companyId = ref<string | null>(null);
const companyName = ref<string | null>(null);
const pmsSource = ref<string>('')
const orderNumber = ref<string>('')
const acceptTerms = ref<boolean>(false)
const isDefault = ref<boolean>(true)
const hasBeenChecked = ref<boolean>(false)
const showErrorMessage = ref<boolean>(false)

// 證件照浮水印處理
const idImageArray = computed(() => {
  return idImage.idImages[Object.keys(idImage.idImages)[0]]
})

type CanvasRefs = {
  [key: string]: HTMLCanvasElement | null
}

const canvasRefs = ref<CanvasRefs>({})
const addWatermark = (canvas: HTMLCanvasElement, imageUrl: string) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const img = new Image()
  img.crossOrigin = 'Anonymous'
  img.onload = () => {
    // 先繪製圖片
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    // 設置浮水印的樣式
    const watermarkText = '僅供平臺使用'
    const fontSize = 12
    const fontFamily = '"Noto Sans"'
    const fontWeight = '500'
    const fillStyle = 'rgba(0, 0, 0, 0.5)'

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    ctx.fillStyle = fillStyle
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 設置浮水印的旋轉角度（20.951度）
    const angle = 20.951 * (Math.PI / 180)

    // 保存當前狀態
    ctx.save()

    // 將畫布旋轉
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(angle)
    ctx.translate(-canvas.width / 2, -canvas.height / 2)

    // 計算浮水印間距和位置
    const textWidth = ctx.measureText(watermarkText).width
    const textHeight = 0.3
    const xOffset = 15
    const yOffset = 25

    // 使用雙重循環來繪製浮水印
    for (let y = -canvas.height; y < canvas.height * 2; y += textHeight + yOffset) {
      for (let x = -canvas.width; x < canvas.width * 2; x += textWidth + xOffset) {
        const offsetX = (y / (textHeight + yOffset)) % 2 === 0 ? 0 : xOffset / 2
        ctx.fillText(watermarkText, x + offsetX, y)
      }
    }
    // 恢復畫布到初始狀態
    ctx.restore()
  }

  img.src = imageUrl
}
// 當 idImageArray 或 canvasRefs 更新時，處理浮水印
const applyWatermarks = () => {
  nextTick(() => {
    Object.keys(canvasRefs.value).forEach((side) => {
      const canvas = canvasRefs.value[side]
      if (canvas && idImageArray.value[side]) {
        addWatermark(canvas, idImageArray.value[side])
      }
    })
  })
}

watch(selectedInvoiceType, (newType) => {
  if (newType === 'two-step') {
    companyId.value = '';
    companyName.value = '';
  } else if (newType === 'three-step') {
    cloudCarrier.value = '';
  }
});

onMounted(() => {
  const assignMemberData = (data: any) => {
    userName.value = data.name;
    birthday.value = data.birthday;
    phone.value = data.phone || '';
    email.value = data.email || '';
    cloudCarrier.value = data.invoice?.barcode || '';
    companyId.value = data.invoice?.compiled || '';
    companyName.value = data.invoice?.company || '';
  };

  if (memberDataStore.defaultMemberData.code === '0') {
    assignMemberData(memberDataStore.defaultMemberData.data);
  } else {
    assignMemberData(idImage.idOcrResult.data);
  }

  const { pms, order_number } = orderStore.orderData.orderData;
  pmsSource.value = pms;
  orderNumber.value = order_number;

  applyWatermarks();
});

watch([idImageArray, canvasRefs], applyWatermarks)

// 姓名欄位可編輯
const userNameInput = ref<HTMLInputElement | null>(null)
const isReadonly = ref<boolean>(true)
const hasEdited = ref<boolean>(false)
const enableInput = () => {
  isReadonly.value = false
  userName.value = ''
  hasEdited.value = true
  userNameInput.value?.focus()
}

// 顯示/關閉 隱私條款
const showContact = ref<boolean>(false)
const togglePrivacyPolicy = () => {
  showContact.value = !showContact.value
  if (!showContact.value) {
    applyWatermarks();
  }
}

// 驗證規則
const rules = {
  userName: { required },
  email: {
    required,
    email: emailValidator
  },
  phone: {
    required: (value: string) => !value || value.length === 10,
    numeric: (value: string) => !value || /^\d+$/.test(value)
  },
  companyId: {
    required: (value: string) => (selectedInvoiceType.value === 'three-step' ? !!value : true),
    minLength: minLength(8)
  },
  cloudCarrier: {
    minLength: minLength(8),
    maxLength: maxLength(8),
    startsWithSlash: (value: string) => {
      return value ? value.startsWith('/') : true;
    },
  },
  companyName: {},
  acceptTerms: {
    required: (value: boolean) => value === true
  }
}

const v$ = useVuelidate(rules, {
  userName,
  email,
  phone,
  cloudCarrier,
  companyId,
  companyName,
  acceptTerms
})

watch(
  () => v$.value.$invalid,
  (isInvalid) => {
    isDisabled.value = isInvalid
  }
)

// 驗證-錯誤訊息
const handleCheckboxChange = () => {
  if (acceptTerms.value) {
    hasBeenChecked.value = true
    showErrorMessage.value = false
  } else if (hasBeenChecked.value) {
    showErrorMessage.value = true
  }
}

const userNameErrorMessage = computed(() => {
  if (!v$.value.userName.required.$response) return t('required')

  return ''
})

const emailErrorMessage = computed(() => {
  if (!v$.value.email.required.$response) return t('required')
  if (!v$.value.email.email.$response) return t('pleaseEnterValidEmail')

  return ''
})

const phoneErrorMessage = computed(() => {
  if (!v$.value.phone.numeric.$response) return t('mobileNumberCanOnlyContainDigits');
  if (!v$.value.phone.required.$response) return '手機號碼必須為10位數字';

  return '';
});

const cloudCarrierErrorMessage = computed(() => {
  if (!v$.value.cloudCarrier.minLength.$response) return t('atLeast8CharactersRequired')
  if (!v$.value.cloudCarrier.maxLength.$response) return t('upTo8CharactersAllowed')
  if (!v$.value.cloudCarrier.startsWithSlash.$response) return `${t('firstCharacterMustBe')} /`;


  return ''
})

const companyIdErrorMessage = computed(() => {
  if (!v$.value.companyId.required.$response) return t('required')
  if (!v$.value.companyId.minLength.$response) return t('atLeast8CharactersRequired')

  return ''
})

const companyNameErrorMessage = computed(() => {
  return ''
})

const acceptTermsErrorMessage = computed(() => {
  if (!v$.value.acceptTerms.required.$response) return t('required')

  return ''
})

// API-回傳成功/錯誤訊息
enum ErrorType {
  UploadFailed, // 資料上傳失敗
  SaveDataNotification, // 資料儲存
  hasQRNotification, // 已有 pre-checkin 圖片
  noOcrImage, // 沒有 OCR 資料
  UnknownError // 未知錯誤
}

const setMemberDataErrorCodeMap: { [key: string]: ErrorType } = {
  '1000': ErrorType.UploadFailed,
  '1001': ErrorType.hasQRNotification,
  '1002': ErrorType.UploadFailed,
  '1003': ErrorType.noOcrImage,
  '5003': ErrorType.UploadFailed,
  '5004': ErrorType.UploadFailed,
}

const errorTitle = ref<string>('')
const errorContent = ref<Array<{ text: string; class?: string }>>([])
const errorButtonText = ref<string>('')
const errorClass = ref<string>('')
const showExtraButton = ref<boolean>(false)
const currentErrorType = ref<ErrorType | null>(null)

function updateErrorMessages (type: ErrorType): void {
  errorClass.value = ''
  currentErrorType.value = type

  switch (type) {
    case ErrorType.UploadFailed:
      errorTitle.value = t('dataUploadFailed')
      errorContent.value = [{ text: '請確認網路穩定後' }, { text: t('tryAgain'), class: 'mt-20' }]
      errorButtonText.value = t('reUpload')
      break
    case ErrorType.hasQRNotification:
      errorTitle.value = t('dataUploadFailed')
      errorContent.value = [{ text: '已取過 預先報到 QRcode' }]
      errorButtonText.value = '進入QRcode頁面'
      break
    case ErrorType.noOcrImage:
      errorTitle.value = t('dataUploadFailed')
      errorContent.value = [{ text: t('pleaseCompleteDocumentVerificationFirst')}]
      errorButtonText.value = t('returnToDocumentUpload')
      break
    case ErrorType.SaveDataNotification:
      errorTitle.value = '存取預設資料'
      errorContent.value = [
        { text: `${t('setThisDataAs')} ${userName.value} ${t('default')}` },
        { text: `${email.value}`, class: 'fz-20 mt-20' },
        { text: t('futureBookingsWithThisEmail'), class: 'fz-20 fc-p mt-20' }
      ]
      showExtraButton.value = true
      errorButtonText.value = '存為預設'
      errorClass.value = 'purple extra'
      break
    default:
      errorTitle.value = t('unknownError')
      errorContent.value = [{ text: t('unknownErrorOccurred') }, { text: t('pleaseTryAgainLater') }]
      errorButtonText.value = t('close')
      break
  }

  showError.value = true
}

const handleNextStep = () => {
  submitFormData()
}

const handleRetryUpload = (errorType: ErrorType | null) => {
  if (
    errorType === ErrorType.UploadFailed || errorType === ErrorType.SaveDataNotification) {
    showExtraButton.value = false
    saveFormData()
  }

  // 如果已經有qrcode自動跳轉 就不顯示按鈕
  if (errorType === ErrorType.hasQRNotification) {
    router.push('/checkin')
  }

  if (errorType === ErrorType.noOcrImage) {
    router.push('/upload')
  }

  showError.value = false
}

const handleExtraAction = () => {
  showError.value = false
  isDefault.value = false
  saveFormData()
}

const handleBackAction = () => {
  if (showContact.value) {
    showContact.value = false;
    applyWatermarks();
  } else {
    router.push('/upload')
  }
}

const saveFormData = async () => {
  const newMemberData: NewMemberDataRequest = {
    source: pmsSource.value,
    country_codes: '+886',
    phone: phone.value,
    name: userName.value,
    email: email.value,
    birthday: birthday.value,
    barcode: cloudCarrier.value,
    compiled: companyId.value,
    company: companyName.value,
    order_number: orderNumber.value,
    is_default: isDefault.value
  }

  isLoading.value = true
  let success = false;

  try {
    const res = await setMemberData(newMemberData)
    const errorType = setMemberDataErrorCodeMap[res.code]

    if (res.code !== '0') {
      updateErrorMessages(errorType)
    }

    if (res.code === '0') {
      success = true;
      memberDataStore.setSendableEmail(userName.value, email.value)
    }
  } catch (error) {
     updateErrorMessages(ErrorType.UnknownError)
  } finally {
    isLoading.value = false

    if (success) {
      router.push('/checkin');
    }
  }
}

const submitFormData = async () => {
  updateErrorMessages(ErrorType.SaveDataNotification)
}
</script>
<style lang="scss" scoped>
</style>
