<template>
  <Header />
  <div v-if="isLoading" class="loading-animation">
    <LottieAnimation name="loading" lottie_text="Loading" />
  </div>
  <main v-else>
    <div class="title-block">
      <div class="title">
        <p>{{$t('登記入住資料')}}</p>
      </div>
    </div>
    <div v-if="!showNoUrlToken" class="card card-1">
      <p class="card-title m-b-16">{{ orderDomain }}</p>
      <p class="card-sec-title">{{$t('訂單編號')}} {{ orderId }}</p>
      <p v-if="!showError" class="card-text">
        (
        <span>{{ new Date(orderCheckInDate).toLocaleDateString() }}</span> -
        <span>{{ new Date(orderCheckOutDate).toLocaleDateString() }}</span>
        )
      </p>
    </div>
    <div v-if="!showError && !showNoUrlToken" class="card card-2">
      <p class="card-title">{{$t('訂購人')}} - {{ orderName }}</p>
      <p class="card-title m-b-48">{{$t('是否為本次入住旅客？')}}</p>
      <div class="btn-group">
        <Button buttonClass="btn secondary-btn" @click="handleNextStep(false)">{{$t('否，不同人')}}</Button>
        <Button buttonClass="btn primary-btn" @click="handleNextStep(true)">{{$t('是，同一人')}}</Button>
      </div>
    </div>
    <div v-if="showError" class="card card-2">
      <p class="error-title">{{$t('預先登記權限關閉')}}</p>
      <p class="error-text">
        {{$t('因您的訂單內容變更')}}<br />
        {{$t('暫時無法使用【預先登記入住】服務')}}<br />
        {{$t('請改於旅館現場辦理入住')}}<br /><br />
        {{$t('造成您的困擾，敬請見諒')}}
      </p>
    </div>
    <div v-if="showNoUrlToken" class="card card-2">
      <p class="error-title">{{$t('輸入網址錯誤')}}</p>
      <p class="error-text">{{$t('無法取得')}}urlToken</p>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LottieAnimation from '@/components/Lottie.vue';

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
</style>
