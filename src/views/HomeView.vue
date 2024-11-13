<template>
  <Header />
  <main class="home">
    <div class="title-block">
      <div class="title">
        <p>{{ $t('checkInInfo') }}</p>
      </div>
    </div>
    <div class="card-block">
      <div v-if="showNoUrlToken" class="card card-2">
        <p class="error-title">{{ $t('incorrectUrl') }}</p>
        <p class="error-text">{{ $t('orderUrlIncomplete') }}</p>
        <p class="error-text">{{ $t('returnToEmailUseCorrectLink') }}</p>
      </div>
      <div v-else-if="isLoading" class="loading">
        <div class="card card-1">
          <Vue3Lottie :animationData="Loading" :loop="true" :autoplay="true" class="lottie" />
        </div>
        <div class="card card-2">
          <Vue3Lottie :animationData="Loading" :loop="true" :autoplay="true" class="lottie" />
        </div>
      </div>
      <div v-else-if="showError" class="card card-2">
        <p class="error-title">{{ $t('preCheckInAccessClosed') }}</p>
        <p class="error-text">
          {{ $t('dueToChangesInYourOrder') }}<br />
          {{ $t('preCheckInServiceTemporarilyUnavailable') }}<br />
          {{ $t('pleaseCheckInAtTheHotel') }}<br /><br />
          {{ $t('apologizeForTheInconvenience') }}
        </p>
      </div>
      <div v-else>
        <div class="card card-1">
          <p class="card-title m-b-16">{{ orderDomain }}</p>
          <p class="card-sec-title">{{ $t('orderNumber') }} {{ orderId }}</p>
          <p v-if="!showError" class="card-text">
            (
            <span>{{ new Date(orderCheckInDate).toLocaleDateString() }}</span> -
            <span>{{ new Date(orderCheckOutDate).toLocaleDateString() }}</span>
            )
          </p>
        </div>
        <div class="card card-2">
          <p class="card-title">{{ $t('buyer') }} - {{ orderName }}</p>
          <p class="card-title m-b-48">{{ $t('isThisGuestForThisStay') }}</p>
          <div class="btn-group">
            <Button buttonClass="btn secondary-btn" @click="handleNextStep(false)">{{ $t('noDifferentPerson') }}</Button>
            <Button buttonClass="btn primary-btn" @click="handleNextStep(true)">{{ $t('yesSamePerson') }}</Button>
          </div>
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
import { useIdImageStore } from '@/stores/idimage'
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
const idImage = useIdImageStore();

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
    memberDataStore.clearStore()
    idImage.clearStore()

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