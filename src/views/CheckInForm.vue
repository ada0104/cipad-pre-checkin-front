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
              <button class="back-to-upload-btn">重新上傳</button>
            </div>
            <div class="image-preview-block">
              <div v-for="i in 2" :key="i" class="image-preview-container">
                <div class="image-preview">
                  <img :src="imageSrcs[i - 1]" />
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
                  :class="{'error-border': v$.name.$error}"
                  :readonly="isReadonly"
                  @blur="v$.name.$touch()"
                />
                <button v-if="!hasEdited" @click="enableInput" class="clear-button" type="button">
                  <SvgIcon name="close" class="theme-icon" />
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
                  :class="{'error-border': v$.email.$error}"
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
                  :class="{'error-border': v$.phone.$error}"
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
            </div>
            <!-- 二聯式個人發票時顯示 -->
            <div v-if="selectedInvoiceType === 'two-step'">
              <p v-if="v$.cloudCarrier.$error" class="error-message">{{ cloudCarrierErrorMessage }}</p>
              <div class="input-container">
                <input
                  type="text"
                  id="cloud-carrier-input"
                  v-model="cloudCarrier"
                  class="input-field"
                  :class="{'error-border': v$.cloudCarrier.$error}"
                  placeholder="輸入雲端載具(選填)"
                  @blur="v$.cloudCarrier.$touch()"
                />
              </div>
            </div>
            <!-- 三聯式個人發票時顯示 -->
            <div v-if="selectedInvoiceType === 'three-step'">
              <p v-if="v$.companyId.$error" class="error-message">{{ companyIdErrorMessage }}</p>
              <div class="input-container">
                <input
                  type="text"
                  id="company-id-input"
                  v-model="companyId"
                  class="input-field"
                  :class="{'error-border': v$.companyId.$error}"
                  placeholder="輸入公司統一編號"
                  @blur="v$.companyId.$touch()"
                />
              </div>
              <div class="input-container invoice-co-name">
                <p v-if="v$.companyName.$error" class="error-message">{{ companyNameErrorMessage }}</p>
                <input
                  type="text"
                  id="company-name-input"
                  v-model="companyName"
                  class="input-field"
                  :class="{'error-border': v$.companyName.$error}"
                  placeholder="輸入公司行號抬頭(選填)"
                />
              </div>
            </div>
          </div>
        </div>
        <!----- 隱私條款 ----->
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              id="accept-terms"
              class="checkbox-input"
              v-model="acceptTerms"
              />
            <span class="checkbox-custom"></span>
            <span class="label-text">我同意CIPAD GUEST平臺之</span>
            <button type="button" class="link-button" @click="togglePrivacyPolicy">
              隱私權使用條款
            </button>
            <span v-if="v$.acceptTerms.$error" class="error-message">{{acceptTermsErrorMessage}}</span>
          </label>
        </div>
        <Button
          buttonClass="btn primary-btn"
          :disabled="isDisabled"
          @click="handleNextStep"
        >
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
import { ref, watch, computed } from 'vue'
import Header from '@/components/Header.vue'
import Select from '@/components/Select.vue'
import Button from '@/components/Button.vue'
import PrivacyPolicy from '@/components/PrivacyPolicy.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core'
import { required, email as emailValidator, minLength, maxLength } from '@vuelidate/validators'

const router = useRouter();

// 表單動作
const isDisabled = ref<boolean>(true)
const showError = ref<boolean>(false)
const selectedInvoiceType = ref<'two-step' | 'three-step'>('two-step')

// 表單資料
const imageSrcs = ref<string[]>(['', '']);
const name = ref<string>('陳筱玲')
const email = ref<string>('')
const phone = ref<string>('')
const cloudCarrier = ref<string>('')
const companyId = ref<string>('')
const companyName = ref<string>('')
const acceptTerms = ref(false);

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
    required: (value: string) => selectedInvoiceType.value === 'three-step' ? !!value : true,
    minLength: minLength(8)
  },
  companyName: {},
  acceptTerms: { required },
}

const v$ = useVuelidate(rules, {
    name,
    email,
    phone,
    cloudCarrier,
    companyId,
    companyName,
    acceptTerms
  });

watch(
  () => v$.value.$invalid,
  (isInvalid) => {
    isDisabled.value = isInvalid;
  }
);

const nameErrorMessage = computed(() => {
  if (!v$.value.name.required.$response) return '*必填';

  return '';
});

const emailErrorMessage = computed(() => {
  if (!v$.value.email.required.$response) return '*必填';
  if (!v$.value.email.email.$response) return '請輸入有效的電子信箱';

  return ''
})

const phoneErrorMessage = computed(() => {
  if (!v$.value.phone.required.$response) return '*必填';
  if (!v$.value.phone.numeric.$response) return '手機號碼只能包含數字';
  if (!v$.value.phone.minLength.$response ||
      !v$.value.phone.maxLength.$response)
      return '手機號碼必須為10位數字';

  return '';
});

const cloudCarrierErrorMessage = computed(() => {
  return ''
})

const companyIdErrorMessage = computed(() => {
  if (!v$.value.companyId.required.$response) return '*必填';
  if (!v$.value.companyId.minLength.$response) return '公司統一編號至少需要8個字符'

  return ''
})

const companyNameErrorMessage = computed(() => {
  return ''
})

const acceptTermsErrorMessage = computed(() => {
  if (!v$.value.acceptTerms.required.$response) return '*必填';
  return ''
})

const handleNextStep = () => {
  router.push('/checkin');
}

// 照片浮水印
// function addTextToImage(base64Image, text) {
//     // 創建一個 Image 物件
//     const img = new Image();
//     img.src = base64Image;

//     img.onload = function() {
//         // 創建 canvas
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');

//         // 設定 canvas 大小
//         canvas.width = img.width;
//         canvas.height = img.height + 50; // 在圖片下方預留空間加文字

//         // 將圖片繪製到 canvas 上
//         ctx.drawImage(img, 0, 0);

//         // 設定文字樣式
//         ctx.font = '20px Arial';
//         ctx.fillStyle = 'black';
//         ctx.textAlign = 'center';

//         // 將文字添加到圖片下方
//         ctx.fillText(text, canvas.width / 2, img.height + 30);

//         // 將 canvas 轉換為 Base64 圖片
//         const resultBase64Image = canvas.toDataURL('image/png');

//         // 在這裡可以將 resultBase64Image 進行後續處理或顯示
//         console.log(resultBase64Image);
//     };
// }

// 使用範例
// const base64Image = '你的Base64圖片';
// const text = 'Pre Check-in 用於限制檢查';
// addTextToImage(base64Image, text);

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
  showError.value = false;
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
  color: var(--Primary);
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font: inherit;
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
  }

  &-img {
    border-radius: 14px;
    border: 1px solid var(--Outline);
    width: 100%;
    height: 100%;
    overflow: hidden;

    img {
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

.checkbox-group {
  display: flex;
  align-items: center;
  margin: 10px 0;

  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px 4px;

    color: var(--On-input-sec);
    font-size: 20px;
    font-weight: 350;
    line-height: 140%;

    .checkbox-input {
      display: none;
    }

    .checkbox-custom {
      width: 20px;
      height: 20px;
      border: 2px solid var(--Primary);
      border-radius: 4px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      &::after {
        content: '';
        width: 12px;
        height: 12px;
        background-color: var(--Primary);
        transform: scale(0);
        transition: transform 0.2s ease-in-out;
      }
    }

    .checkbox-input:checked + .checkbox-custom::after {
      transform: scale(1);
    }
  }
}

.error-message {
  float:right;
  @include text-style(400, 14px, var(--Error));
  vertical-align: middle;
}
</style>
