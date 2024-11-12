<template>
  <div class="download-template">
    <div>
      <img src="@/assets/icons/logo.svg" alt="Logo" class="logo" />
    </div>
    <div class="template-container">
      <div>
        <h1 class="domain">{{ domainName }}</h1>
        <p class="sub-title">{{ $t('orderConfirmation') }}</p>
      </div>
      <div class="qr-code-container">
        <img :src="qrCode" alt="QRcode" class="qr-code" />
        <p class="label">{{ $t('orderNumber') }}</p>
        <p class="label">{{ orderNumber }}</p>
      </div>
      <div>
        <p class="sub-title">{{ $t('checkInTimeOpen') }}</p>
        <p class="check-in-time">{{ checkInDate }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  domainName: string
  qrCode: string
  orderNumber: string
  checkInDate: string
}

defineProps<Props>()
</script>
