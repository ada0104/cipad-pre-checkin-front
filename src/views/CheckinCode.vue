<template>
  <Header />
  <main>
    <div class="title-block">
      <div class="title">
        <p>預先登記完成</p>
      </div>
    </div>
    <div class="card">
      <div>
        <p class="card-title">{{ orderDomain }}</p>
        <p class="sub-title">訂單憑證</p>
      </div>
      <div class="qr-card">
        <img class="qr-code" :src="formattedQrCodeImage" alt="QRcode" />
        <p v-if="!formattedQrCodeImage" class="order-error">取得 QR code 失敗</p>
        <p class="order-id">訂單編號</p>
        <p class="order-id">{{ orderNumber }}</p>
      </div>
      <div>
        <p class="sub-title">開放入住時間</p>
        <p class="check-in-time">{{ orderCheckInDate }}</p>
      </div>
    </div>
    <div class="card download">
      <Button buttonClass="btn primary-btn" @click="handleDownload">下載圖片</Button>
      <div class="svg-text">
        <SvgIcon name="email" class="email-icon" />
        <p class="email-text">已同步寄至入住人Email信箱</p>
      </div>
    </div>
    <div class="card card-button">
      <div>
        <p class="card-button-title">如何使用？</p>
        <span class="card-button-text"
          >於本店自住機臺點選『 <span class="point">預辦入住 快速通關</span> 』 <br />掃描訂單憑證QR
          CODE，完成付款，即可領取房卡
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
.card {
  width: 612px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 32px 157px;
  margin-bottom: 24px;

  .card-title {
    color: var(--Primary);
    text-align: center;
    font-size: 32px;
    font-weight: 400;
    line-height: 140%;
    letter-spacing: 2.56px;
    margin-bottom: 30px;
  }

  .sub-title {
    color: var(--On-input-sec);
    text-align: center;
    font-size: 20px;
    font-weight: 350;
    line-height: 140%;
    margin-bottom: 12px;
  }

  .qr-card {
    width: 100%;
    display: flex;
    padding: 24px;
    align-items: center;
    gap: 12px;
    border-radius: 16px;
    background: var(--Input-box);
    margin-bottom: 0px;
    flex-direction: column;
    margin-bottom: 30px;

    .qr-code {
      width: 150px;
      height: 150px;
    }
    .order-error {
      color: var(--On-Error-Cont);
      text-align: center;
      font-size: 24px;
      font-weight: 400;
      line-height: 140%;
      letter-spacing: 1.92px;
    }

    .order-id {
      color: var(--On-input-box);
      text-align: center;
      font-size: 24px;
      font-weight: 400;
      line-height: 140%;
      letter-spacing: 1.92px;
    }
  }

  .check-in-time {
    color: var(--Primary);
    text-align: center;
    font-size: 24px;
    font-weight: 400;
    line-height: 140%;
    letter-spacing: 1.92px;
  }

  &.download {
    height: 184px;
    padding: 24px;
    gap: 24px;
    border-radius: 16px 16px 0 0;
    margin-bottom: 0px;

    .btn {
      width: 100%;
    }

    .svg-text {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 11px;

      .email-icon {
        color: var(--Secondary);
      }
      .email-text {
        color: var(--Secondary);
        text-align: center;
        font-size: 20px;
        font-weight: 350;
        line-height: 140%;
      }
    }
  }

  &.card-button {
    height: 124px;
    border-radius: 0px 0px 16px 16px;
    display: flex;
    padding: 22px 95px;
    justify-content: space-between;
    background: var(--Input-box);
    margin-bottom: 96px;
    flex-direction: row;
    align-items: center;

    .card-button-title {
      color: var(--On-Surface);
      font-size: 20px;
      font-weight: 700;
      line-height: 110%;
      margin-bottom: 16px;
    }
    .card-button-text {
      color: var(--On-input-sec);
      font-size: 14px;
      font-weight: 400;
      line-height: 140%;

      .point {
        color: var(--Primary);
        font-size: 14px;
        font-weight: 500;
        line-height: 110%;
      }
    }
    .icon {
      color: var(--Primary);
      width: 78px;
      height: 78px;
    }
  }
}

.hidden-template {
  position: absolute;
  top: -100%;
  left: -100%;
  z-index: 0;
}
</style>
