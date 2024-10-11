<template>
  <button @click="toggleTheme" class="theme-toggle-button">
    <SvgIcon :name="isDarkTheme ? 'light' : 'dark'" class="theme-icon" />
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import $ from 'jquery';

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
const localTheme = localStorage.getItem('theme')
const isDarkTheme = ref(localTheme === 'dark' || (localTheme === null && prefersDarkScheme.matches))

const setTheme = (isDark: boolean) => {
  if (isDark) {
    $('html').attr('data-theme', 'dark');
    localStorage.setItem('theme', 'dark')
  } else {
    $('html').attr('data-theme', 'light');
    localStorage.setItem('theme', 'light')
  }
}

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  setTheme(isDarkTheme.value)
}

onMounted(() => {
  setTheme(isDarkTheme.value)

  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDarkTheme.value = e.matches
      setTheme(isDarkTheme.value)
    }
  })
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
