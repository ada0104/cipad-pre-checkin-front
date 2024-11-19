<template>
  <Teleport to="body">
    <div class="lottie-alert-overlay">
      <div class="lottie-animation">
        <Vue3Lottie :animationData="animationData" :loop="true" :autoplay="true" class="lottie" />
        <p class="lottie-text">{{ lottie_text }}</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, watch } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'

const animationData = ref(null)

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  lottie_text: {
    type: String,
    default: ''
  }
})

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
const localTheme = localStorage.getItem('theme')
const isDarkTheme = localTheme === 'dark' || (localTheme === null && prefersDarkScheme.matches)

const getLottieFileName = (name: string) => {
  return isDarkTheme ? `${name}_dark` : `${name}_light`
}

const loadLottieData = async (name: string) => {
  if (name) {
    try {
      const lottieFileName = getLottieFileName(name)
      const { default: lottieData } = await import(`@/assets/lottie/${lottieFileName}.json`)
      animationData.value = lottieData
    } catch (error) {
      console.error('Lottie JSON 文件加載失敗', error)
    }
  }
}

onMounted(() => {
  loadLottieData(props.name)
})

watch(
  () => props.name,
  (newName) => {
    loadLottieData(newName)
  }
)

prefersDarkScheme.addEventListener('change', (e) => {
  const newIsDarkTheme = e.matches
  if (newIsDarkTheme !== isDarkTheme) {
    loadLottieData(props.name)
  }
})
</script>
