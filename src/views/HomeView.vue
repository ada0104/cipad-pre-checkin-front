<template>
  <Header />
  <main>
    <div class="title-block">
      <div class="title">
        <p>登記入住資料</p>
      </div>
    </div>
    <div v-if="showNoUrlToken" class="card card-2">
      <p class="error-title">網址有誤</p>
      <p class="error-text">訂單網址不完整</p>
      <p class="error-text">請回到Email信件，使用正確導引連結</p>
    </div>
    <div class="loading" v-else-if="isLoading">
      <div class="card card-1">
        <Vue3Lottie :animationData="Loading" :loop="true" :autoplay="true" class="lottie" />
      </div>
      <div class="card card-2">
        <Vue3Lottie :animationData="Loading" :loop="true" :autoplay="true" class="lottie" />
      </div>
    </div>
    <div v-else-if="showError" class="card card-2">
      <p class="error-title">預先登記權限關閉</p>
      <p class="error-text">
        因您的訂單內容變更<br />
        暫時無法使用【預先登記入住】服務<br />
        請改於旅館現場辦理入住<br /><br />
        造成您的困擾，敬請見諒
      </p>
    </div>
    <div v-else>
      <div class="card card-1">
        <p class="card-title m-b-16">{{ orderDomain }}</p>
        <p class="card-sec-title">訂單編號 {{ orderId }}</p>
        <p v-if="!showError" class="card-text">
          (
          <span>{{ new Date(orderCheckInDate).toLocaleDateString() }}</span> -
          <span>{{ new Date(orderCheckOutDate).toLocaleDateString() }}</span>
          )
        </p>
      </div>
      <div class="card card-2">
        <p class="card-title">訂購人 - {{ orderName }}</p>
        <p class="card-title m-b-48">是否為本次入住旅客？</p>
        <div class="btn-group">
          <Button buttonClass="btn secondary-btn" @click="handleNextStep(false)">否，不同人</Button>
          <Button buttonClass="btn primary-btn" @click="handleNextStep(true)">是，同一人</Button>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
import Loading from '@/assets/lottie/loading.json'

import {
  getData,
  getMemberData,
  type OrderDataRequest,
  type OrderDataResponse,
  type DefaultMemberDataRequest,
  type OrderDetailDataResponse
} from '@/api/api'

import { useOrderStore, useUrlTokenStore } from '@/stores/order'
import { useMemberDataStore } from '@/stores/member'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Button from '@/components/Button.vue'

const orderId = ref<string>('')
const orderName = ref<string>('')
const orderDomain = ref<string>('')
const orderCheckInDate = ref<string>('')
const orderCheckOutDate = ref<string>('')
const isLoading = ref<boolean>(false)
const showError = ref<boolean>(false)
const showNoUrlToken = ref<boolean>(false)

const orderStore = useOrderStore()
const urlTokenStore = useUrlTokenStore()

const memberDataStore = useMemberDataStore()
const router = useRouter()
const orderDataRequest: OrderDataRequest = {
  url_token: urlTokenStore.urlToken
}

const prepareMemberDataRequest = (): DefaultMemberDataRequest => {
  const { pms, email, order_number } = orderStore.orderData.orderData

  return {
    pms: pms,
    email: email,
    order_number: order_number
  }
}

const handleNextStep = async (isSameOne: boolean) => {
  if (!isSameOne) {
    return router.push('/upload')
  }

  try {
    const memberData = await getMemberData(prepareMemberDataRequest())

    if (memberData.code === '0' && memberData.data) {
      memberDataStore.setMemberData(memberData)
    }
  } catch (error) {
    console.error('getMemberData error:', error)
  }

  router.push('/upload')
}

const setViewOrderData = (data: {
  orderData: OrderDataResponse
  orderDetailData?: OrderDetailDataResponse
}) => {
  const { orderData } = data
  orderId.value = orderData.order_number
  orderName.value = orderData.name
  orderDomain.value = orderData.domain

  if (!showError.value && data.orderDetailData) {
    const [orderDetail] = data.orderDetailData.data
    orderCheckInDate.value = orderDetail.check_in
    orderCheckOutDate.value = orderDetail.check_out
  }
}

const getOrderData = async () => {
  isLoading.value = true

  try {
    const data = await getData(orderDataRequest)
    const dataStatus = data.orderData?.code

    if (dataStatus === '0' && data.orderDetailData?.code === '0') {
      setViewOrderData(data)
      orderStore.setOrderData(data)
    } else if (dataStatus === '1001' && data.orderDetailData?.code === '0') {
      orderStore.setOrderData(data)
      router.push('/checkin')
    } else if (dataStatus === '1000') {
      showNoUrlToken.value = true
    } else {
      showError.value = true
      setViewOrderData(data)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (urlTokenStore.urlToken === '') {
    showNoUrlToken.value = true
    return
  }
  orderStore.clearStore()
  await getOrderData()
})
</script>
<style lang="scss" scoped>
@mixin card-base {
  width: 612px;
}

@mixin text-style($weight, $size, $color) {
  font-weight: $weight;
  font-size: $size;
  color: $color;
  line-height: 140%;
  text-align: center;
}

$spacing-large: 58px;
$spacing-medium: 31px;
$spacing-small: 16px;

.card {
  @include card-base;

  &-1 {
    padding: $spacing-medium $spacing-large;
  }

  &-2 {
    padding: $spacing-large;
  }

  &-title {
    @include text-style(400, 32px, var(--On-Surface));
    letter-spacing: 2.56px;

    &.m-b-16 {
      margin-bottom: $spacing-small;
    }

    &.m-b-48 {
      margin-bottom: 48px;
    }
  }

  &-sec-title {
    @include text-style(400, 24px, var(--Secondary));
    letter-spacing: 2px;
  }

  &-text {
    @include text-style(400, 20px, var(--On-Surface-Var));
  }

  .error-title {
    @include text-style(700, 32px, var(--Prim-Cont));
    margin-bottom: 24px;
  }
  .error-text {
    @include text-style(400, 24px, var(--On-input-sec));
    letter-spacing: 1.92px;
  }
}

.btn-group {
  gap: $spacing-small;
}

.no-underline {
  text-decoration: none;
}

.loading {
  .card-1 {
    height: 191px;
    position:relative;
    padding: 0;
    width: 100%;
    overflow: hidden;
  }
  .card-2 {
    height: 341px;
    padding: 0;
    overflow: hidden;
  }

  .lottie {
    width: 100%;
    height: 410px;
    position: relative;
    object-fit: cover;
  }
}

</style>
