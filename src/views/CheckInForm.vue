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
    <div class="card">
      <div class="card-content">
        <p class="card-title">填寫資料</p>

        <div class="form-block">
          <div class="block-content">
            <div class="form-title">
              <p class="form-title-text">個人證件資料</p>
              <button class="btn">重新上傳</button>
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
                  class="input-field"
                  placeholder="請輸入姓名"
                  value="陳筱玲"
                />
                <button @click="clearInput" class="clear-button">
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
                  class="input-field date"
                  value="1968/06/05"
                />
              </div>
            </div>
          </div>

          <div>
            <div class="form-title">
              <p class="form-title-text">聯絡方式</p>
            </div>
          </div>
          <div>
            <div class="form-title">
              <p class="form-title-text">發票格式</p>
            </div>
          </div>
        </div>
        <div>
        </div>

        <div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import Button from '@/components/Button.vue'

const imageSrcs = ref('')

const clearInput = () => {
  alert('Input cleared')
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

.card {
  width: 1113px;
  @include flex-center;
  flex-direction: column;

  .card-content {
    width: 563px;
    @include flex-center;
    flex-direction: column;
    gap: 48px;
  }
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
  color: var(--On-Surface);
  font-size: 20px;
  font-weight: 350;
  line-height: 140%;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);

  .back-icon {
    color: var(--On-Surface);
  }
}

.form-title {
  display: flex;
  padding-bottom: 13px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-bottom: 1px solid var(--Outline);

  .form-title-text {
    color: var(--Primary);
    font-size: 24px;
    font-weight: 700;
    line-height: 110%;
  }
}

.btn {
  border-radius: 99px;
  background: var(--Prim-Cont);
  color: var(--On-Prim);
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
  padding: 6px 12px;
}

.card-title {
  color: var(--On-Surface-Var);
}

.block-content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 24px;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-label {
  color: var(--On-Surface-Var);
  font-size: 16px;
  font-weight: 500;
  line-height: 110%;
}

.input-container {
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
  margin-top: 6px;
}

.input-field {
  @include input-field;
  background: var(--Input-box);
  color: var(--On-input-box);

  &.date {
    background: var(--Surface-Dim);
    color: var(--On-input-sec);
  }
}

.clear-button {
  position: absolute;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
}

.image-preview-block {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.image-preview-container {
  background: var(--Input-box);
  color: var(--Outline);
  width: 260px;
  height: 156px;
  @include flex-center;
  border-radius: 16px;
  padding: 3px;
}

.image-preview {
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
</style>
