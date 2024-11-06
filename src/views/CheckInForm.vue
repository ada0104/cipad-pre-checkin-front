<template>
  <Header />
  <main>
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
                <label v-else class="error-message phone-sub ">*僅限臺灣手機號碼</label>
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
          <span v-if="showErrorMessage" class="error-message">
            {{ acceptTermsErrorMessage }}
          </span>
        </div>
        <Button buttonClass="btn primary-btn" :disabled="isDisabled" @click="handleNextStep">
          {{ $t('submit') }}
        </Button>
      </div>
    </div>
    <PrivacyPolicy v-if="showContact" @close="togglePrivacyPolicy" />
    <div v-if="isLoading" class="loading-animation">
      <LottieAnimation name="upload" lottie_text="{{ $t('uploadingData') }}" />
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

import { useOrderStore } from '@/stores/order'
import { useIdImageStore } from '@/stores/idimage'
import { useMemberDataStore } from '@/stores/member'

const router = useRouter()
const idImage = useIdImageStore()
const orderStore = useOrderStore()
const memberDataStore = useMemberDataStore()

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
  if (!v$.value.userName.required.$response) return '*必填'

  return ''
})

const emailErrorMessage = computed(() => {
  if (!v$.value.email.required.$response) return '*必填'
  if (!v$.value.email.email.$response) return '請輸入有效的電子信箱'

  return ''
})

const phoneErrorMessage = computed(() => {
  if (!v$.value.phone.numeric.$response) return '手機號碼只能包含數字';
  if (!v$.value.phone.required.$response) return '手機號碼必須為10位數字';

  return '';
});

const cloudCarrierErrorMessage = computed(() => {
  if (!v$.value.cloudCarrier.minLength.$response) return '至少需要8個字符'
  if (!v$.value.cloudCarrier.maxLength.$response) return '最多8個字符'
  if (!v$.value.cloudCarrier.startsWithSlash.$response) return '第一碼為 /'

  return ''
})

const companyIdErrorMessage = computed(() => {
  if (!v$.value.companyId.required.$response) return '*必填'
  if (!v$.value.companyId.minLength.$response) return '至少需要8個字符'

  return ''
})

const companyNameErrorMessage = computed(() => {
  return ''
})

const acceptTermsErrorMessage = computed(() => {
  if (!v$.value.acceptTerms.required.$response) return '*必填'

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
      errorTitle.value = '資料上傳失敗'
      errorContent.value = [{ text: '請確認網路穩定後' }, { text: '重新嘗試', class: 'mt-20' }]
      errorButtonText.value = '重新上傳'
      break
    case ErrorType.hasQRNotification:
      errorTitle.value = '資料上傳失敗'
      errorContent.value = [{ text: '已取過 預先報到 QRcode' }]
      errorButtonText.value = '進入QRcode頁面'
      break
    case ErrorType.noOcrImage:
      errorTitle.value = '資料上傳失敗'
      errorContent.value = [{ text: '請先完成證件驗證' }]
      errorButtonText.value = '返回證件上傳'
      break
    case ErrorType.SaveDataNotification:
      errorTitle.value = '存取預設資料'
      errorContent.value = [
        { text: `是否將本次資料設為${userName.value}的預設？` },
        { text: `${email.value}`, class: 'fz-20 mt-20' },
        { text: '未來使用此信箱訂房，即可自動帶入登記資料！', class: 'fz-20 fc-p mt-20' }
      ]
      showExtraButton.value = true
      errorButtonText.value = '存為預設'
      errorClass.value = 'purple extra'
      break
    default:
      errorTitle.value = '未知錯誤'
      errorContent.value = [{ text: '發生未知錯誤' }, { text: '請稍後再試' }]
      errorButtonText.value = '關閉'
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
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin input-field {
  width: 100%;
  padding: 20px 22px;
  border-radius: 16px;
  outline: none;
  border: none;
  font-size: 20px;
  font-weight: 350;
  line-height: 140%;
}

@mixin title-text {
  color: var(--Primary);
  font-size: 24px;
  font-weight: 700;
  line-height: 110%;
}

@mixin text-style($weight, $size, $color) {
  font-weight: $weight;
  font-size: $size;
  color: $color;
  line-height: 140%;
  text-align: center;
}

.card {
  width: 1113px;
  @include flex-center;
  flex-direction: column;

  &-content {
    width: 563px;
    display: flex;
    flex-direction: column;
    gap: 48px;
  }

  &-title {
    @include text-style(400, 32px, var(--On-Surface-Var));
  }
}

.link-button {
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font: inherit;
  @include text-style(500, 20px, var(--Secondary));
}

.form-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.back-route {
  display: flex;
  align-items: center;
  gap: 6px;
  @include text-style(350, 20px, var(--On-Surface));
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  .back-icon {
    color: inherit;
  }
}

.form-title {
  display: flex;
  padding-bottom: 13px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-bottom: 1px solid var(--Outline);

  &-text {
    @include title-text;
  }

  &-sub {
    @include text-style(400, 14px, var(--On-Surface-Var));
    letter-spacing: 1px;
  }
}

.back-to-upload-btn {
  border-radius: 99px;
  background: var(--Prim-Cont);
  @include text-style(400, 14px, var(--On-Prim));
  padding: 6px 12px;

  &:hover {
    background: var(--Sec-Cont);
    color: var(--On-Sec-Cont);
  }
  &:active {
    background: linear-gradient(0deg, var(--Overlay) 0%, var(--Overlay) 100%), var(--Sec-Cont);
  }
}

.btn {
  width: 100%;
}

.back-edit {
  display: flex;
  gap: 6px;
  color: var(--On-Surface-Var);
  align-items: center;
  font-size: 20px;
  font-weight: 350;
  line-height: 140%;
}

.pass-btn {
  border-radius: 16px;
  background: var(--Sec-Cont);
  width: 224px;
  font-size: 24px;
  letter-spacing: 1px;
}

.block-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input {
  &-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &-label {
    @include text-style(500, 16px, var(--On-Surface-Var));
    text-align: left;
  }

  &-container {
    display: flex;
    position: relative;
    align-items: center;
    width: 100%;
    margin-top: 6px;

    &.invoice-co-name {
      margin-top: 16px;
    }
  }

  &-field {
    @include input-field;
    background: var(--Input-box);
    color: var(--On-input-box);
    caret-color: var(--Outline);

    &::placeholder {
      @include text-style(350, 20px, var(--On-Surface-Var));
      text-align: left;
    }

    &.date {
      background: var(--Surface-Dim);
      color: var(--On-input-sec);
    }

    &.error-border {
      border: 2px solid var(--Error);
    }

    &.country-code {
      width: 20%;
      border-radius: 16px 0px 0px 16px;
      color: var(--On-Surface-Var);
      padding: 20px 0px 20px 20px;
      border-right: none;

      span {
        margin-right: 11px;
      }
    }

    &.phone-input {
      border-radius: 0px 16px 16px 0px;
      padding: 20px 0px;
      border-left: none;
    }
  }
}

.clear-button {
  position: absolute;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  .clear-icon {
    color: var(--Outline);
  }
}

.image-preview {
  &-block {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  &-container {
    background: var(--Input-box);
    color: var(--Outline);
    width: 260px;
    height: 156px;
    @include flex-center;
    border-radius: 16px;
    padding: 3px;
    display: flex;
    justify-content: center;

    &:only-child {
      margin: 0 auto;
    }
  }

  &-img {
    border-radius: 14px;
    border: 1px solid var(--Outline);
    width: 100%;
    height: 100%;
    overflow: hidden;

    canvas {
      width: 260px;
      height: 156px;
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
    }
  }
}

.radio {
  &-group {
    display: flex;
    gap: 20px;
    height: 70px;
    align-items: center;

    .error-message {
      margin-top: auto;
      margin-bottom: 8px;
      margin-left: auto;
    }
  }

  &-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 10px;
    @include text-style(350, 20px, var(--On-Surface-Var));

    input[type='radio'] {
      display: none;
    }

    input[type='radio']:checked + .radio-custom + span {
      color: var(--Primary);
    }

    input[type='radio']:not(:checked) + .radio-custom + span {
      color: var(--On-Surface-Var);
    }
  }

  &-custom {
    width: 20px;
    height: 20px;
    border: 2px solid var(--Outline);
    border-radius: 50%;
    position: relative;
    background-color: var(--Surface);

    &::after {
      content: '';
      width: 12px;
      height: 12px;
      background: var(--On-Surface);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      transition: transform 0.2s ease-in-out;
    }
  }

  &-label input[type='radio']:checked + &-custom::after {
    transform: translate(-50%, -50%) scale(1);
  }
}

.custom-checkbox {
  display: flex;
  align-items: center;

  .checkbox-input {
    display: none;
  }

  .error-message {
    margin-top: auto;
    margin-bottom: 8px;
    margin-left: auto;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border: 1px solid var(--On-input-sec);
    border-radius: 6px;
    cursor: pointer;
    margin-right: 8px;

    &.error-checkbox {
      border: 1px solid var(--Error);
      background: #ffcec6;
    }

    .check-icon {
      color: var(--On-Prim);
    }
  }
  .label-text {
    @include text-style(350, 20px, var(--On-input-sec));
    margin-right: 4px;
  }
  .error-label {
    color: var(--Error);
  }

  input:checked + label {
    border-radius: 6px;
    border: 1px solid var(--Primary);
    background: var(--Primary);
  }
}

.error-message {
  float: right;
  @include text-style(400, 14px, var(--Error));
  vertical-align: middle;

  &.phone-sub {
    color: var(--On-Surface-Var);
    letter-spacing: 1px;
  }
}
</style>
