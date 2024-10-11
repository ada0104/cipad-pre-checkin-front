<template>
  <Teleport to="body">
    <div v-if="show" class="error-alert-overlay">
      <div :class="['error-alert', errorClass]" v-bind="$attrs">
        <div class="alert-text">
          <p class="alert-title">{{ title }}</p>
          <div class="alert-content">
            <div v-for="(line, index) in content" :key="index" :class="line.class">
              {{ line.text }}
              <br v-if="index < content.length - 1" />
            </div>
          </div>
        </div>
        <div class="alert-footer">
          <div class="btn-group">
            <slot name="extra-button"></slot>
            <button class="alert-button" @click="handleButtonClick">
              {{ buttonText }}
            </button>
          </div>
          <div class="alert-subtext" v-if="subText">{{ subText }}</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { ref, defineProps, defineEmits, withDefaults } from 'vue'

interface ContentLine {
  text: string
  class?: string
}

interface Props {
  title?: string
  content: ContentLine[]
  buttonText?: string
  subText?: string
  extraButton?: boolean
  errorClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  buttonText: '',
  subText: '',
  errorClass: ''
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'buttonClick'): void
}>()

const show = ref<boolean>(true)

const handleButtonClick = (): void => {
  emit('buttonClick')
  closeAlert()
}

const closeAlert = (): void => {
  show.value = false
  emit('close')
}
</script>
<style lang="scss" scoped>
.error-alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--Overlay, rgba(0, 0, 0, 0.75));
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;

  .error-alert {
    &.purple {
      .alert-title {
        color: var(--Primary);
        margin-bottom: 24px;
      }

      .alert-button {
        background: var(--Prim-Cont);
        color: var(--On-Prim);
      }

      :slotted(button) {
        margin-left: 10px;
      }
    }
    &.extra {
      width: 800px;

      .btn-group {
        height: 82px;
        display: flex;
        width: 100%;
        justify-content: flex-end;
        align-items: center;
        gap: 12px;
      }
      .alert-button {
        width: 307px;
      }
    }
    width: 592px;
    padding: 48px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 48px;
    text-align: center;
    background: var(--Surface);
    box-shadow:
      0px 155px 43px 0px rgba(28, 28, 28, 0),
      0px 99px 40px 0px rgba(28, 28, 28, 0.01),
      0px 56px 33px 0px rgba(28, 28, 28, 0.05),
      0px 25px 25px 0px rgba(28, 28, 28, 0.09),
      0px 6px 14px 0px rgba(28, 28, 28, 0.1);

    .alert-title {
      color: var(--Error);
      text-align: center;
      font-size: 32px;
      font-weight: 700;
      line-height: 110%;
      margin-bottom: 48px;
    }

    .alert-content {
      color: var(--On-input-sec);
      text-align: center;
      font-size: 24px;
      font-weight: 400;
      line-height: 140%;
      letter-spacing: 1.92px;

      .fz-20 {
        font-size: 20px;
        font-weight: 350;
      }
      .mt-20 {
        margin-top: 12px;
      }
      .fc-p {
        color: var(--Secondary);
      }
    }
    .alert-footer {
      display: flex;
      gap: 24px;
      width: 100%;
      flex-direction: column;
      align-items: center;
    }

    .btn-group {
      display: flex;
      width: 100%;
    }

    .alert-button {
      width: 100%;
      padding: 24px 48px;
      border-radius: 16px;
      background: var(--Error-Cont);
      color: var(--On-Error-Cont);
      border: none;
      cursor: pointer;
      transition: background-color 0.3s;
      text-align: center;

      font-size: 24px;
      font-weight: 400;
      line-height: 140%;
      letter-spacing: 1.92px;
    }
    .alert-subtext {
      color: var(--On-input-sec);
      text-align: right;
      font-size: 20px;
      font-weight: 500;
      line-height: 110%;
      border-bottom: 1px solid var(--On-input-sec);
    }
  }
}
</style>
