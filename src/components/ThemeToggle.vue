<template>
  <button @click="toggleTheme" class="theme-toggle-button">
    <SvgIcon :name="currentThemeIcon" class="theme-icon" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDarkTheme, toggleTheme } = useTheme()

const currentThemeIcon = computed(() => {
  return isDarkTheme.value ? 'light' : 'dark'
})
</script>

<style lang="scss" scoped>
.theme-toggle-button {
  background-color: var(--svg-fill-color);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  padding: 8px;
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;

  .theme-icon {
    color: var(--On-Inv-Surf);
  }

  &:hover {
    background-color: var(--Overlay, rgba(54, 56, 70, 0.66));
  }
}
</style>
