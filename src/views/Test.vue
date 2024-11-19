<template>
  <main class="test">
    <div class="input-wrapper">
      <div>
        <label for="order-input" class="input-label">請輸入訂單號碼</label>
      </div>
      <div class="input-container">
        <input id="order-input" type="text" v-model="orderNumber" class="input-field" />
      </div>
    </div>
    <button
      class="btn primary-btn dodge-button"
      :style="buttonStyle"
      @mouseover="handleMouseOver"
      @click="submitOrder"
    >
      送出
    </button>

    <div class="grid-background">
      <div class="grid-item" v-for="(item, index) in gridItems" :key="index"></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const orderNumber = ref('')
const buttonPosition = ref({ x: 0, y: 0 })

const buttonStyle = computed(() => ({
  transform: `translate(${buttonPosition.value.x}px, ${buttonPosition.value.y}px)`,
  transition: orderNumber.value ? 'transform 0.3s ease-out' : 'transform 0.2s ease-out'
}))

watch(orderNumber, (newVal) => {
  if (newVal) buttonPosition.value = { x: 0, y: 0 }
})

async function fetchToken() {
  const response = await fetch('https://uat-dns-only.funcoin.tw/dunqian/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'password',
      username: 'admin@dunqian.com',
      password: 'secret'
    })
  })

  const data = await response.json()
  if (data.access_token) {
    return data.access_token
  } else {
    throw new Error(data.message)
  }
}

async function fetchOrderData(orderNumber: string) {
  const response = await fetch(
    `/dunqian/pms/get_order_data?pms=mastripms&domain=dqhotel&order_number=${orderNumber}`
  )
  const data = await response.json()

  if (data.code === '0' && data.data?.length) {
    return data.data[0]
  } else {
    throw new Error(data.message)
  }
}

async function fetchPciUrl(accessToken: string, orderData: any) {
  const pciRequestData = {
    pms: 'mastripms',
    domain: 'dqhotel',
    order_number: orderNumber.value,
    email: orderData.email,
    name: orderData.name
  }

  const response = await fetch('https://uat-dns-only.funcoin.tw/dunqian/pre_checkin/pci_url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(pciRequestData)
  })

  const data = await response.json()
  if (data.code === '0' && data.url) {
    return data.url
  } else {
    throw new Error(data.message)
  }
}

const handleMouseOver = (event: MouseEvent) => {
  if (orderNumber.value) return
  const button = event.target as HTMLElement
  const buttonRect = button.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const randomX = (Math.random() - 0.5) * 300
  const randomY = (Math.random() - 0.5) * 300

  const newX = Math.max(
    -viewportWidth / 2 + buttonRect.width,
    Math.min(viewportWidth / 2 - buttonRect.width, buttonPosition.value.x + randomX)
  )

  const newY = Math.max(
    -viewportHeight / 2 + buttonRect.height,
    Math.min(viewportHeight / 2 - buttonRect.height, buttonPosition.value.y + randomY)
  )

  buttonPosition.value = { x: newX, y: newY }
}

const submitOrder = async () => {
  if (!orderNumber.value) {
    alert('一定要輸入訂單號喔！')
    return
  }

  try {
    const token = await fetchToken()
    const orderData = await fetchOrderData(orderNumber.value)
    const pciUrl = await fetchPciUrl(token, orderData)

    setTimeout(() => {
      router.push(`/${pciUrl}`)
    }, 1000)
  } catch (error) {
    alert(error)
    console.error(error)
  }
}

const gridSize = 80
const gridItems = ref<number[]>([])

onMounted(() => {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const numCols = Math.floor(viewportWidth / gridSize)
  const numRows = Math.floor(viewportHeight / gridSize)

  const totalGridItems = numCols * numRows
  gridItems.value = Array(totalGridItems).fill(0)
})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Klee+One&display=swap');

html,
body {
  font-family: 'Klee One', sans-serif;
  margin: 0;
  padding: 0;
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.test {
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(135deg, #0a192f, #112240);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
  position: relative;
}

.input-wrapper {
  z-index: 1;
  background: rgba(16, 36, 84, 0.8);
  padding: 2.5rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(66, 211, 255, 0.3);
  text-align: center;
}

.input-label {
  font-family: 'Klee One', sans-serif;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #64ffda;
}

.input-container {
  position: relative;
  margin-top: 1rem;
}

.input-field {
  width: 300px;
  padding: 1rem;
  font-size: 1rem;
  color: #fff;
  border: 1px solid rgba(66, 211, 255, 0.3);
  border-radius: 0.5rem;
  background: rgba(16, 36, 84, 0.5);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  box-shadow:
    inset 0 0 10px rgba(66, 211, 255, 0.2),
    0 0 10px rgba(66, 211, 255, 0.1);
}

.input-field:focus {
  outline: none;
  border-color: #64ffda;
  background: rgba(16, 36, 84, 0.7);
  box-shadow:
    0 0 20px rgba(100, 255, 218, 0.5),
    inset 0 0 20px rgba(100, 255, 218, 0.2);
}

.btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease-out;
  z-index: 1;
  font-family: 'Klee One', sans-serif;
  font-size: 1.2rem;
}

.primary-btn {
  background: linear-gradient(45deg, #0a192f, #112240);
  color: #64ffda;
  border: 1px solid #64ffda;
}

.primary-btn:hover {
  background: rgba(100, 255, 218, 0.1);
  box-shadow:
    0 0 30px rgba(100, 255, 218, 0.5),
    inset 0 0 15px rgba(100, 255, 218, 0.3);
}

.dodge-button {
  will-change: transform;
}

.grid-background {
  display: grid;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(auto-fill, 80px);
  grid-template-rows: repeat(auto-fill, 80px);
  gap: 2px;
}

.grid-item {
  background-color: rgba(0, 0, 0, 0.3);
  border: 0.5px rgba(3, 37, 47, 0.907);
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
}

.grid-item:hover {
  background-color: rgba(66, 211, 255, 0.7);
  box-shadow: 0 0 50px 20px rgba(66, 211, 255, 0.4);
}
</style>
