<template>
  <Header />
  <main class="code">
    <div class="title-block">
      <div class="title">
        <p>{{ $t('preCheckInCompleted') }}</p>
      </div>
    </div>
    <div class="card">
      <div>
        <p class="card-title">{{ orderDomain }}</p>
        <p class="sub-title">{{ $t('orderConfirmation') }}</p>
      </div>
      <div class="qr-card">
        <img class="qr-code" :src="formattedQrCodeImage" alt="QRcode" />
        <p v-if="!formattedQrCodeImage" class="order-error">{{ $t('failedToObtainQRCode') }}</p>
        <p class="order-id">{{ $t('orderNumber') }}</p>
        <p class="order-id">{{ orderNumber }}</p>
      </div>
      <div>
        <p class="sub-title">{{ $t('checkInTimeOpen') }}</p>
        <p class="check-in-time">{{ orderCheckInDate }}</p>
      </div>
    </div>
    <div class="card download">
      <Button buttonClass="btn primary-btn" @click="handleDownload">{{ $t('downloadImage') }}</Button>
      <div class="svg-text">
        <SvgIcon name="email" class="email-icon" />
        <p class="email-text">{{ $t('sentToGuestsEmail') }}</p>
      </div>
    </div>
    <div class="card card-button">
      <div>
        <p class="card-button-title">{{ $t('howToUse') }}</p>
        <span class="card-button-text"
          >{{ $t('selectAtSelfCheckInKiosk') }} <span class="point">{{ $t('preCheckInFastTrack') }}</span> 』 <br />{{ $t('scanQRCodeCompletePaymentCollectRoomKey') }}
        </span>
      </div>
      <SvgIcon name="icon" class="icon" />
    </div>
  </main>
  <DownloadTemplate
    ref="downloadTemplateRef"
    :domainName="orderDomain"
    :qrCode="formattedQrCodeImage"
    :orderNumber="orderNumber"
    :checkInDate="orderCheckInDate"
    class="hidden-template"
  />
</template>
<script setup lang="ts">
import { onMounted, ref, computed, nextTick, type ComponentPublicInstance, type Ref } from 'vue'
import dayjs from 'dayjs'
import html2canvas from 'html2canvas'

import Header from '@/components/Header.vue'
import Button from '@/components/Button.vue'
import DownloadTemplate from '@/components/Download.vue'

import { useMemberDataStore } from '@/stores/member'
import { useOrderStore, useUrlTokenStore } from '@/stores/order'
import { getQRcodeData, type QRcodeDataRequest, setSentEmailData, type SentEmailRequest } from '@/api/api'

const isLoading = ref<boolean>(false)
const orderDomain = ref<string>('')
const orderCheckInDate = ref<string>('')
const orderCheckOutDate = ref<string>('')
const orderNumber = ref<string>('')
const qrCodeImage = ref<string>('')

const orderStore = useOrderStore()
const urlTokenStore = useUrlTokenStore()
const memberDataStore = useMemberDataStore()

orderNumber.value = orderStore.orderData.orderData.order_number
orderDomain.value = orderStore.orderData.orderData.domain
orderDomain.value = orderStore.orderData.orderData.domain
orderDomain.value = orderStore.orderData.orderData.domain

if (orderStore.orderData.orderDetailData) {
  const checkIn = orderStore.orderData.orderDetailData.data[0].check_in
  const checkOut = orderStore.orderData.orderDetailData.data[0].check_out

  orderCheckInDate.value = dayjs(checkIn).format('YYYY/M/D HH:mm')
  orderCheckOutDate.value = dayjs(checkOut).format('YYYY/M/D HH:mm')
}

const getQRcodeImage = async () => {
  isLoading.value = true
  const orderUrlToken = urlTokenStore.urlToken
  const qrcodeDataRequest: QRcodeDataRequest = {
    order_number: orderNumber.value,
    url_token: orderUrlToken
  }

  try {
    const qrcodeData = await getQRcodeData(qrcodeDataRequest)
    if (qrcodeData.code === '0' && qrcodeData.img) {
      qrCodeImage.value = qrcodeData.img
    } else {
      console.error('Failed to fetch QR code image')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

const setSentEmail = async () => {
  const sentEmailRequest: SentEmailRequest = {
    mail: memberDataStore.sendableEmail,
    name: memberDataStore.sendableName,
    domain: orderDomain.value,
    order_number: orderNumber.value,
    check_in_date: dayjs(orderCheckInDate.value).format('YYYY-M-D'),
    check_out_date: dayjs(orderCheckOutDate.value).format('YYYY-M-D'),
  }

  try {
    const sentEmailData = await setSentEmailData(sentEmailRequest)
    if (sentEmailData.code === '0') {
      console.log('Email sent successfully');
    } else {
      console.error('Failed to sent Email')
    }
  } catch (error) {
    console.error('Error sent Email :', error)
  }
}

const formattedQrCodeImage = computed(() => {
  return `data:image/png;base64,${qrCodeImage.value}`
})

const downloadTemplateRef: Ref<ComponentPublicInstance<
  InstanceType<typeof DownloadTemplate>
> | null> = ref(null)

const handleDownload = async () => {
  try {
    await nextTick()

    const canvas = await html2canvas(downloadTemplateRef.value?.$el as HTMLElement, {
      scale: 2,
      logging: false,
    })

    const imgUrl = canvas.toDataURL('image/jpeg', true)
    const link = document.createElement('a')
    link.download = 'Check-in QR Code.png'
    link.href = imgUrl
    link.click()
  } catch (error) {
    console.error('download Check-in QR Code error :', error)
  }
}

onMounted(async () => {
  if (orderStore.orderData.orderData.img) {
    qrCodeImage.value = orderStore.orderData.orderData.img
  } else {
    await getQRcodeImage()
    await setSentEmail()
  }
})
</script>
<style lang="scss" scoped>
</style>
