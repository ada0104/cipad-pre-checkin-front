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
                  errorMessages.userName
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
                <label v-if="v$.email.$error" class="error-message">{{ errorMessages.email }}</label>
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
                <label v-if="v$.phone.$error" class="error-message">{{ errorMessages.phone }}</label>
                <label v-else class="error-message phone-sub">{{
                  $t('validationPhoneNumberTaiwanOnly')
                }}</label>
              </div>
              <div class="input-container phone-input">
                <div :class="{ 'error-border': v$.phone.$error }" class="input-field country-code">
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
                  @input="removeLeadingZero"
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
                {{ errorMessages.cloudCarrier }}
              </p>
              <p v-if="v$.companyId.$error" class="error-message">
                {{ errorMessages.companyId }}
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
                  {{ errorMessages.companyName }}
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
            {{ errorMessages.acceptTerms }}
          </span>
        </div>
        <Button buttonClass="btn primary-btn" :disabled="isDisabled" @click="handleNextStep">
          {{ $t('submit') }}
        </Button>
      </div>
    </div>
    <PrivacyPolicy v-if="showContact" @close="togglePrivacyPolicy" class="privacyPolicy" />
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
      <Button buttonClass="btn secondary-btn pass-btn" @click="handleExtraAction">{{
        $t('skipAndDoNotAccess')
      }}</Button>
    </template>
  </ErrorAlert>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setMemberData, type NewMemberDataRequest } from '@/api/api'

// Components
import Header from '@/components/Header.vue'
import Button from '@/components/Button.vue'
import PrivacyPolicy from '@/components/PrivacyPolicy.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LottieAnimation from '@/components/Lottie.vue'

// Stores
import { useOrderStore } from '@/stores/order'
import { useIdImageStore } from '@/stores/idimage'
import { useMemberDataStore } from '@/stores/member'

// Composables
import { useFormValidation } from '@/composables/useFormValidation'
import { useIdImageCanvas } from '@/composables/useIdImageCanvas'
import { useErrorHandling, ErrorType } from '@/composables/useErrorHandling'

const router = useRouter()
const idImage = useIdImageStore()
const orderStore = useOrderStore()
const memberDataStore = useMemberDataStore()
const { t } = useI18n()

// 表單動作
const isLoading = ref<boolean>(false)
const selectedInvoiceType = ref<'two-step' | 'three-step'>('two-step')

// 表單資料
const userName = ref<string>('')
const birthday = ref<string>('')
const email = ref<string>('')
const phone = ref<string>('')
const cloudCarrier = ref<string | null>(null)
const companyId = ref<string | null>(null)
const companyName = ref<string | null>(null)
const pmsSource = ref<string>('')
const orderNumber = ref<string>('')
const acceptTerms = ref<boolean>(false)
const isDefault = ref<boolean>(true)
const hasBeenChecked = ref<boolean>(false)
const showErrorMessage = ref<boolean>(false)

// 使用 composables
const formData = {
  userName,
  email,
  phone,
  cloudCarrier,
  companyId,
  companyName,
  acceptTerms
}

const { v$, isDisabled, errorMessages } = useFormValidation(formData, selectedInvoiceType)
const { canvasRefs, applyWatermarks } = useIdImageCanvas()
const {
  showError,
  errorTitle,
  errorContent,
  errorButtonText,
  errorClass,
  showExtraButton,
  currentErrorType,
  setMemberDataErrorCodeMap,
  updateErrorMessages
} = useErrorHandling()

// 證件照浮水印處理
const idImageArray = computed(() => {
  return idImage.idImages[Object.keys(idImage.idImages)[0]]
})

watch([idImageArray, canvasRefs], () => {
  applyWatermarks(idImageArray.value)
})

watch(selectedInvoiceType, (newType) => {
  if (newType === 'two-step') {
    companyId.value = ''
    companyName.value = ''
  } else if (newType === 'three-step') {
    cloudCarrier.value = ''
  }
})

const removeLeadingZero = () => {
  if (phone.value && phone.value[0] === '0') {
    phone.value = phone.value.slice(1)
  }
}

onMounted(() => {
  const assignMemberData = (data: any) => {
    userName.value = data.name
    birthday.value = data.birthday
    phone.value = data.phone || ''
    email.value = data.email || ''
    cloudCarrier.value = data.invoice?.barcode || ''
    companyId.value = data.invoice?.compiled || ''
    companyName.value = data.invoice?.company || ''
  }

  if (memberDataStore.defaultMemberData.code === '0') {
    assignMemberData(memberDataStore.defaultMemberData.data)
  } else {
    assignMemberData(idImage.idOcrResult.data)
  }

  const { pms, order_number } = orderStore.orderData.orderData
  pmsSource.value = pms
  orderNumber.value = order_number
  removeLeadingZero()
  applyWatermarks(idImageArray.value)
})

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
    applyWatermarks(idImageArray.value)
  }
}

const handleCheckboxChange = () => {
  if (acceptTerms.value) {
    hasBeenChecked.value = true
    showErrorMessage.value = false
  } else if (hasBeenChecked.value) {
    showErrorMessage.value = true
  }
}

const handleNextStep = () => {
  submitFormData()
}

const handleRetryUpload = (errorType: ErrorType | null) => {
  if (errorType === ErrorType.UploadFailed || errorType === ErrorType.SaveDataNotification) {
    showExtraButton.value = false
    saveFormData()
  }

  if (errorType === ErrorType.HasQRNotification) {
    router.push('/checkin')
  }

  if (errorType === ErrorType.NoOcrImage) {
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
    showContact.value = false
    applyWatermarks(idImageArray.value)
  } else {
    router.push('/upload')
  }
}

const saveFormData = async () => {
  let paddedPhoneValue =
    phone.value.length === 9 ? String(phone.value).padStart(10, '0') : phone.value

  const newMemberData: NewMemberDataRequest = {
    source: pmsSource.value,
    country_codes: '+886',
    phone: paddedPhoneValue,
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
  let success = false

  try {
    const res = await setMemberData(newMemberData)
    const errorType = setMemberDataErrorCodeMap[res.code]

    if (res.code !== '0') {
      updateErrorMessages(errorType)
    }

    if (res.code === '0') {
      success = true
      memberDataStore.setSendableEmail(userName.value, email.value)
    }
  } catch (error) {
    updateErrorMessages(ErrorType.UnknownError)
  } finally {
    isLoading.value = false

    if (success) {
      router.push('/checkin')
    }
  }
}

const submitFormData = async () => {
  updateErrorMessages(ErrorType.SaveDataNotification, userName.value, email.value)
}
</script>