import { ref } from 'vue'
import $ from 'jquery'

const isDarkTheme = ref(false)

export const useTheme = () => {
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
  const localTheme = localStorage.getItem('theme')

  const initTheme = () => {
    isDarkTheme.value = localTheme === 'dark' ||
      (localTheme === null && prefersDarkScheme.matches)
    setTheme(isDarkTheme.value)
  }

  const setTheme = (isDark: boolean) => {
    isDarkTheme.value = isDark
    const theme = isDark ? 'dark' : 'light'
    $('html').attr('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  const toggleTheme = () => {
    setTheme(!isDarkTheme.value)
  }

  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches)
    }
  })

  initTheme()

  return {
    isDarkTheme,
    toggleTheme,
    setTheme
  }
}