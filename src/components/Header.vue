<template>
  <div class="header">
    <div class="logo">
      <img src="@/assets/logo.svg" alt="Cipad" />
    </div>

    <div class="header-right header-right--desktop">
      <div class="lang">
        <span
          class="tw"
          @click="changeLanguage('zh')"
          :class="{ active: isActive('zh') }"
        >{{ $t('chinese') }}</span>
        <span>/</span>
        <span
          class="en"
          @click="changeLanguage('en')"
          :class="{ active: isActive('en') }"
        >{{ $t('english') }}</span>
      </div>
      <ThemeToggle />
    </div>

    <div class="header-right header-right--mobile">
      <SvgIcon v-if="!showSettings" name="nav" class="nav" @click="toggleSettings" />
    </div>

    <div v-if="showSettings" class="settings-modal">
      <div class="modal-content">
        <div class="modal-header">
          <SvgIcon name="close" class="close-button" @click="toggleSettings" />
        </div>

        <div class="settings-section">
          <div class="setting-item">
            <label>{{ $t('language') }}</label>
            <div class="toggle-container">
              <span :class="{ active: isActive('zh') }">{{ $t('chinese') }}</span>
              <Switch
                v-model="langCheckbox"
                id="language-toggle"
                @change="changeLanguage(langCheckbox ? 'en' : 'zh')"
              />
              <span :class="{ active: isActive('en') }">{{ $t('english') }}</span>
            </div>
          </div>
          <div class="setting-item">
            <label>{{ $t('theme') }}</label>
            <div class="toggle-container">
              <span>{{ $t('light') }}</span>
              <Switch
                :model-value="isDarkTheme"
                id="theme-toggle"
                @update:model-value="handleThemeChange"
              />
              <span>{{ $t('dark') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ThemeToggle from '@/components/ThemeToggle.vue';
import Switch from '@/components/Switch.vue';
import { useTheme } from '@/composables/useTheme'

const { locale } = useI18n();
const { isDarkTheme, setTheme } = useTheme()

const showSettings = ref<boolean>(false);

const handleThemeChange = (value: boolean) => {
  setTheme(value)
}

const langCheckbox = computed({
  get: () => locale.value === 'en',
  set: (value: boolean) => changeLanguage(value ? 'en' : 'zh'),
});

const toggleSettings = () => {
  showSettings.value = !showSettings.value;
};

const changeLanguage = (lang: string) => {
  locale.value = lang;
};

const isActive = (lang: string) => locale.value === lang;

watch(showSettings, (newValue) => {
  if (newValue) {
    langCheckbox.value = locale.value === 'en';
  }
});
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 44px 25px;
  background-color: var(--bg-color);
  position: relative;

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 46px;

    img {
      height: 100%;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    &--desktop {
      .lang {
        display: flex;
        gap: 10px;

        .tw, .en {
          color: var(--Sec-Cont);
          cursor: pointer;

          &.active {
            color: var(--Primary);
          }
        }
      }
    }

    &--mobile {
      display: none;

      .nav {
        color: var(--Primary);
        cursor: pointer;
      }
    }
  }
}

.settings-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;

  .modal-content {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;

    .modal-header {
      display: flex;
      justify-content: flex-end;
      margin: 50px 18px 28px 26px;

      .close-button {
        width: 40px;
        height: 40px;
        cursor: pointer;
        color: var(--Outline);
      }
    }
  }
}

.settings-section {
  background: var(--Surface);
  padding: 32px;
  border-radius: 32px;
  margin: 0 25px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 41px;

  .setting-item {

    label {
      color: var(--On-Surface-Var);
      font-size: 14px;
      font-weight: 500;
      line-height: 110%;
    }

    .toggle-container {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 23px;

      span {
        color: var(--On-Surface-Var);
        font-size: 16px;
        font-weight: 500;
        line-height: 110%;

        &.active {
          color: var(--Primary);
        }
      }
    }
  }
}

@media (min-width: 768px) {
  .header {
    .header-right {
      &--mobile {
        display: none;
      }
      &--desktop {
        display: flex;
      }
    }
  }

  .settings-modal {
    display: none;
  }
}

@media (max-width: 767px) {
  .header {
    margin: 56px 26px 28px 26px;
    height: auto;
    padding: 0;
    .header-right {
      &--desktop {
        display: none;
      }
      &--mobile {
        display: flex;
      }
    }
  }
}
</style>