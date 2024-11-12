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