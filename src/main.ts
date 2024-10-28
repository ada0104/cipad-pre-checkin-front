import '@/assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from '@/feature/i18n'

import App from './App.vue'
import router from './router'
import Vue3Lottie from 'vue3-lottie'
import SvgIcon from '@/components/SvgIcon.vue'
import "virtual:svg-icons-register"

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Vue3Lottie)
app.use(i18n)
app.component('SvgIcon', SvgIcon)

app.mount('#app')
