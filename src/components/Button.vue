<template>
  <button
    :class="[buttonClass, { 'btn-disabled': disabled }]"
    :disabled="disabled"
    type="button"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  buttonClass: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  buttonClass: 'btn',
  disabled: false,
});

</script>

<style scoped lang="scss">
.btn {
  display: flex;
  padding: 24px 48px;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 16px;
  font-size: 24px;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: 1.92px;
  cursor: pointer;

  &.btn-disabled {
    background: var(--Surface-Dim);
    color: var(--On-Surface-Var);
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>
