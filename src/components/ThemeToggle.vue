<template>
<button @click="toggleTheme" class="theme-toggle-button">
    <span v-if="isDarkTheme" aria-label="Light Theme">
      <img src="../assets/light.svg">
    </span>
    <span v-else aria-label="Dark Theme">
      <img src="../assets/dark.svg">
    </span>
  </button>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const localTheme = localStorage.getItem('theme');
  const isDarkTheme = ref(localTheme === 'dark' || (localTheme === null && prefersDarkScheme.matches));

  const setTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value;
    setTheme(isDarkTheme.value);
  };

  onMounted(() => {
    setTheme(isDarkTheme.value);

    prefersDarkScheme.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        isDarkTheme.value = e.matches;
        setTheme(isDarkTheme.value);
      }
    });
  });
</script>

<style lang="scss" scoped>
.theme-toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
}

.theme-toggle-button svg {
  fill: currentColor;
  transition: transform 0.3s ease;
}

.theme-toggle-button:hover svg {
  transform: scale(1.1);
}
</style>
