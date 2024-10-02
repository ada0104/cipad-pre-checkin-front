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
          <div class="block-content">
            <div class="form-title">
              <p class="form-title-text">個人證件資料</p>
              <button class="back-to-upload-btn">重新上傳</button>
            </div>
            <div class="image-preview-block">
              <div v-for="i in 2" :key="i" class="image-preview-container">
                <div class="image-preview">
                  <img :src="imageSrcs" />
                </div>
              </div>
            </div>
            <div class="input-wrapper">
              <label for="name-input" class="input-label">姓名</label>
              <div class="input-container">
                <input
                  type="text"
                  id="name-input"
                  ref="nameInput"
                  v-model="name"
                  class="input-field"
                  :readonly="isReadonly"
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
          <div class="block-content">
            <div class="form-title">
              <p class="form-title-text">聯絡方式</p>
            </div>
            <div class="input-wrapper">
              <label for="name-input" class="input-label">電子信箱</label>
              <div class="input-container">
                <input
                  type="text"
                  id="email-input"
                  ref="emailInput"
                  :email
                  class="input-field"
                  placeholder="輸入電子信箱"
                />
              </div>
            </div>
            <div class="input-wrapper">
              <label for="name-input" class="input-label">手機號碼</label>
              <div class="input-container phone-input">
                <Select
                  :selectedOption="selectedOption"
                  :options="options"
                  @update:selectedOption="updateSelectedOption"
                  class="phone-select"
                />
                <input
                  type="text"
                  id="email-input"
                  ref="emailInput"
                  :email
                  class="input-field"
                  placeholder="輸入手機號碼"
                />
              </div>
            </div>
          </div>
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
              <div class="input-container">
                <input
                  type="text"
                  id="cloud-carrier-input"
                  v-model="cloudCarrier"
                  class="input-field"
                  placeholder="輸入雲端載具(選填)"
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
                  placeholder="輸入公司統一編號"
                />
              </div>
              <div class="input-container invoice-co-name">
                <input
                  type="text"
                  id="company-name-input"
                  v-model="companyName"
                  class="input-field"
                  placeholder="輸入公司行號抬頭(選填)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" id="accept-terms" class="checkbox-input" />
            <span class="checkbox-custom"></span>
            <span class="label-text">我同意CIPAD GUEST平臺之</span>
            <button type="button" class="link-button" @click="showPrivacyPolicy">隱私權使用條款</button>
          </label>
        </div>
        <router-link to="/form" class="no-underline">
          <Button buttonClass="btn primary-btn" :disabled="isDisabled">送出</Button>
        </router-link>
      </div>
    </div>
    <PrivacyPolicy v-if="showContact" @close="hidePrivacyPolicy"/>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Select from '@/components/Select.vue'
import Button from '@/components/Button.vue'
import PrivacyPolicy from '@/components/PrivacyPolicy.vue';

const isReadonly = ref<boolean>(true)
const hasEdited = ref<boolean>(false)
const name = ref<string>('陳筱玲')
const email = ref<string>('')
const nameInput = ref<HTMLInputElement | null>(null)
const emailInput = ref<HTMLInputElement | null>(null)
const imageSrcs = ref<string>('')
const isDisabled = ref<boolean>(true)
const showContact = ref<boolean>(false)
const selectedInvoiceType = ref<'two-step' | 'three-step'>('two-step')
const cloudCarrier = ref<string>('')
const companyId = ref<string>('')
const companyName = ref<string>('')

const showPrivacyPolicy = () => {
  showContact.value = true
}

const hidePrivacyPolicy = () => {
  showContact.value = false
}

const enableInput = () => {
  isReadonly.value = false
  name.value = ''
  hasEdited.value = true
  nameInput.value?.focus()
}
interface Option {
  name: string
  label: string
}
const selectedOption = ref<Option>({
  name: 'tw',
  label: '+886'
})
const options = ref<Option[]>([
  { name: 'tw', label: '+886' },
  { name: 'ch', label: '+887' }
])

const updateSelectedOption = (option: Option) => {
  selectedOption.value = option
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
    @include text-style(400, 20px, var(--On-Surface-Var));
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
    font-family: Arial, sans-serif;
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

    color: var(--On-input-sec, #E0E0E0);
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
</style>
