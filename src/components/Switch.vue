<template>
  <div class="toggle-switch">
    <input
      type="checkbox"
      :id="id"
      :checked="modelValue"
      @change="handleChange"
      class="toggle-input"
    />
    <label :for="id" class="toggle-label">
      <span class="toggle-slider"></span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  id?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const handleChange = (event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked;
  emit('update:modelValue', isChecked);
};
</script>

<style scoped lang="scss">
.toggle-switch {
  display: block;
  position: relative;

  .toggle-input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;

    &:checked + .toggle-label {
      background: var(--Prim-Cont);

      .toggle-slider {
        transform: translateX(24px);
      }
    }
  }

  .toggle-label {
    display: block;
    background: var(--Prim-Cont);
    border-radius: 99px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    padding: 3px;
    width: 52px;
    align-items: center;

    .toggle-slider {
      width: 22px;
      height: 22px;
      background-color: var(--On-Prim);
      border-radius: 50%;
      transition: transform 0.3s ease;
      display: block;
    }
  }
}
</style>
