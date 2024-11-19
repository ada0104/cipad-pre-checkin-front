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
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modelValue: boolean
  id?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const handleChange = (event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked
  emit('update:modelValue', isChecked)
}
</script>
