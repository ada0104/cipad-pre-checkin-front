<template>
  <div class="header">
    <div class="logo">
      <img src="@/assets/logo.svg" />
    </div>
    <div class="header-right">
      <div class="lang">
        <span
          class="tw"
          @click="changeLanguage('zh')"
          :class="{ active: isActive('zh') }">{{ $t('中文') }}</span>
        <span>/</span>
        <span
          class="en"
          @click="changeLanguage('en')"
          :class="{ active: isActive('en') }">{{ $t('EN') }}</span>
      </div>
      <ThemeToggle />
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const changeLanguage = (lang: string) => {
  locale.value = lang
}

const isActive = (lang: string) => {
  return locale.value === lang
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;

  .logo {
    height: 44px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .lang {
      display: flex;
      gap: 10px;

      .tw {
        color: var(--Sec-Cont);
        cursor: pointer;

        &.active {
          color: var(--Primary);
        }
      }

      .en {
        color: var(--Sec-Cont);
        cursor: pointer;

        &.active {
          color: var(--Primary);
        }
      }
    }
  }
}
</style>
