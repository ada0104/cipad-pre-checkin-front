<template>
  <Header />
  <main>
    <div class="title-block">
      <router-link to="/upload" class="no-underline back-route">
        <SvgIcon name="back" class="back-icon" />
        <span>返回</span>
      </router-link>
      <div class="title">
        <p>預先登記入住</p>
      </div>
    </div>
    <div v-if="!showContact" class="card">
      <div class="card-content">
        <p class="card-title">填寫資料</p>
        <div class="form-block">
          <!----- 基本資料 ----->
          <div class="block-content">
            <div class="form-title">
              <p class="form-title-text">個人證件資料</p>
              <router-link to="/upload" class="no-underline">
                <button class="back-to-upload-btn">重新上傳</button>
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
                <label for="name-input" class="input-label">姓名</label>
                <label v-if="v$.name.$error" class="error-message">{{ nameErrorMessage }}</label>
              </div>
              <div class="input-container">
                <input
                  type="text"
                  id="name-input"
                  ref="nameInput"
                  v-model="name"
                  class="input-field"
                  :class="{ 'error-border': v$.name.$error }"
                  :readonly="isReadonly"
                  @blur="v$.name.$touch()"
                />
                <button v-if="!hasEdited" @click="enableInput" class="clear-button" type="button">
                  <SvgIcon name="close" class="clear-icon" />
                </button>
              </div>
            </div>
            <div class="input-wrapper">
              <label for="date-input" class="input-label">生日</label>
              <div class="input-container">
                <input
                  type="text"
                  id="date-input"
                  ref="dateInput"
                  class="input-field date"
                  value="1968/06/05"
                  readonly
                />
              </div>
            </div>
          </div>
          <!----- 聯絡方式 ----->
          <div class="block-content">
            <div class="form-title">
              <p class="form-title-text">聯絡方式</p>
            </div>
            <!----- 電子信箱 ----->
            <div class="input-wrapper">
              <div>
                <label for="email-input" class="input-label">電子信箱</label>
                <label v-if="v$.email.$error" class="error-message">{{ emailErrorMessage }}</label>
              </div>
              <div class="input-container">
                <input
                  type="text"
                  id="email-input"
                  v-model="email"
                  class="input-field"
                  :class="{ 'error-border': v$.email.$error }"
                  placeholder="輸入電子信箱"
                  @blur="v$.email.$touch()"
                />
              </div>
            </div>
            <!----- 手機號碼 ----->
            <div class="input-wrapper">
              <div>
                <label for="name-input" class="input-label">手機號碼</label>
                <label v-if="v$.phone.$error" class="error-message">{{ phoneErrorMessage }}</label>
              </div>
              <div class="input-container phone-input">
                <Select
                  :selectedOption="selectedOption"
                  :options="options"
                  @update:selectedOption="updateSelectedOption"
                  class="phone-select"
                />
                <input
                  type="tel"
                  id="phone-input"
                  v-model="phone"
                  class="input-field"
                  :class="{ 'error-border': v$.phone.$error }"
                  placeholder="輸入手機號碼"
                  @blur="v$.phone.$touch()"
                />
              </div>
            </div>
          </div>
          <!----- 發票格式 ----->
          <div>
            <div class="form-title">
              <p class="form-title-text">發票格式</p>
              <p class="form-title-sub">本店採用紙本發票</p>
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
                <span class="label-text">二聯式個人發票</span>
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  name="invoice-type"
                  value="three-step"
                  v-model="selectedInvoiceType"
                />
                <span class="radio-custom"></span>
                <span class="label-text">三聯式個人發票</span>
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
                  placeholder="輸入雲端載具(選填)"
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
                  placeholder="輸入公司統一編號"
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
                  placeholder="輸入公司行號抬頭(選填)"
                />
              </div>
            </div>
          </div>
        </div>
        <!----- 隱私條款 ----->
        <div class="custom-checkbox"  @blur="v$.acceptTerms.$touch()">
          <input
            type="checkbox"
            id="checkbox"
            class="checkbox-input"
            v-model="acceptTerms"
          />
          <label for="checkbox">
            <SvgIcon v-if="acceptTerms" name="check" class="check-icon" />
          </label>
          <span class="label-text">我同意CIPAD GUEST平臺之</span>
          <button type="button" class="link-button" @click="togglePrivacyPolicy">
            隱私權使用條款
          </button>
          <span v-if="v$.acceptTerms.$error" class="error-message">
            {{ acceptTermsErrorMessage }}
          </span>
        </div>
        <Button buttonClass="btn primary-btn" :disabled="isDisabled" @click="handleNextStep">
          送出
        </Button>
      </div>
    </div>
    <PrivacyPolicy v-if="showContact" @close="togglePrivacyPolicy" />
  </main>
  <ErrorAlert
    v-if="showError"
    :title="errorTitle"
    :content="errorContent"
    :buttonText="errorButtonText"
    :subText="errorSubText"
    :class="errorClass"
    @buttonClick="handleRetryUpload"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import Header from '@/components/Header.vue'
import Select from '@/components/Select.vue'
import Button from '@/components/Button.vue'
import PrivacyPolicy from '@/components/PrivacyPolicy.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { useIdImageStore } from '@/stores/idimage'
import { required, email as emailValidator, minLength, maxLength } from '@vuelidate/validators'
import SvgIcon from '@/components/SvgIcon.vue'

const router = useRouter()
const idImage = useIdImageStore()

// 表單動作
const isDisabled = ref<boolean>(true)
const showError = ref<boolean>(false)
const selectedInvoiceType = ref<'two-step' | 'three-step'>('two-step')

// 表單資料
const name = ref<string>('陳筱玲')
const email = ref<string>('')
const phone = ref<string>('')
const cloudCarrier = ref<string>('')
const companyId = ref<string>('')
const companyName = ref<string>('')
const acceptTerms = ref(false)

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
    const xOffset = 15 // x 軸間距
    const yOffset = 25 // y 軸間距

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
onMounted(applyWatermarks)
watch([idImageArray, canvasRefs], applyWatermarks)

// 姓名欄位可編輯
const nameInput = ref<HTMLInputElement | null>(null)
const isReadonly = ref<boolean>(true)
const hasEdited = ref<boolean>(false)
const enableInput = () => {
  isReadonly.value = false
  name.value = ''
  hasEdited.value = true
  nameInput.value?.focus()
}

// 手機國碼下拉清單
interface Option {
  name: string
  label: string
}
const selectedOption = ref<Option>({
  name: 'Taiwan',
  label: '+886'
})
const options = ref<Option[]>([
  { name: 'Taiwan', label: '+886' },
  { name: 'Tainan', label: '+887' }
])
const updateSelectedOption = (option: Option) => {
  selectedOption.value = option
}

// 顯示/關閉 隱私條款
const showContact = ref<boolean>(false)
const togglePrivacyPolicy = () => {
  showContact.value = !showContact.value
}

// 驗證規則
const rules = {
  name: { required },
  email: {
    required,
    email: emailValidator
  },
  phone: {
    required,
    minLength: minLength(10),
    maxLength: maxLength(10),
    numeric: (value: string) => /^\d+$/.test(value)
  },
  cloudCarrier: {},
  companyId: {
    required: (value: string) => (selectedInvoiceType.value === 'three-step' ? !!value : true),
    minLength: minLength(8)
  },
  companyName: {},
  acceptTerms: {
    required: (value: boolean) => value === true
  }
}

const v$ = useVuelidate(rules, {
  name,
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

const nameErrorMessage = computed(() => {
  if (!v$.value.name.required.$response) return '*必填'

  return ''
})

const emailErrorMessage = computed(() => {
  if (!v$.value.email.required.$response) return '*必填'
  if (!v$.value.email.email.$response) return '請輸入有效的電子信箱'

  return ''
})

const phoneErrorMessage = computed(() => {
  if (!v$.value.phone.required.$response) return '*必填'
  if (!v$.value.phone.numeric.$response) return '手機號碼只能包含數字'
  if (!v$.value.phone.minLength.$response || !v$.value.phone.maxLength.$response)
    return '手機號碼必須為10位數字'

  return ''
})

const cloudCarrierErrorMessage = computed(() => {
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

const handleNextStep = () => {
  router.push('/checkin')
}

// 錯誤訊息
enum ErrorType {
  UploadFailed = 0 // 資料上傳失敗
}

const errorTitle = ref<string>('')
const errorContent = ref<string>('')
const errorButtonText = ref<string>('')
const errorClass = ref<string>('')
const errorSubText = ref<string>('')

const updateErrorMessages = (type: ErrorType): void => {
  errorClass.value = ''
  errorSubText.value = ''

  switch (type) {
    case ErrorType.UploadFailed:
      errorTitle.value = '資料上傳失敗'
      errorContent.value = '請確認網路穩定後<br>重新嘗試'
      errorButtonText.value = '重新上傳'
      break
    default:
      errorTitle.value = '未知錯誤'
      errorContent.value = '發生未知錯誤<br>請稍後再試'
      errorButtonText.value = '關閉'
      break
  }

  showError.value = true
}

const handleRetryUpload = (): void => {
  showError.value = false
}

// api error call method
// updateErrorMessages(ErrorType.UploadFailed);
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
    gap: 10px;

    .phone-select {
      width: 200px;
    }

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

    .check-icon {
      color: var(--On-Prim);
    }
  }
  .label-text {
    @include text-style(350, 20px, var(--On-input-sec));
    margin-right: 4px;
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
}
</style>
