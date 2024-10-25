<template>
  <div class="download-template">
    <div>
      <img src="@/assets/icons/logo.svg" alt="Logo" class="logo" />
    </div>
    <div class="template-container">
      <div>
        <h1 class="domain">{{ domainName }}</h1>
        <p class="sub-title">訂單憑證</p>
      </div>
      <div class="qr-code-container">
        <img :src="qrCode" alt="QRcode" class="qr-code" />
        <p class="label">訂單編號</p>
        <p class="label">{{ orderNumber }}</p>
      </div>
      <div>
        <p class="sub-title">開放入住時間</p>
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

<style lang="scss" scoped>
.download-template {
  width: 390px;
  height: 844px;
  background: linear-gradient(44deg, #f1f0f7 -1.03%, #dce1ff 101.53%);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;

  .logo {
    width: 191px;
    height: 35px;
  }

  .template-container {
    width: 343px;
    height: 543px;
    border-radius: 32px;
    background: var(--Card-Background);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 32px 0px;
    box-shadow:
      0px 421px 118px 0px rgba(150, 150, 150, 0),
      0px 269px 108px 0px rgba(150, 150, 150, 0.01),
      0px 151px 91px 0px rgba(150, 150, 150, 0.05),
      0px 67px 67px 0px rgba(150, 150, 150, 0.09),
      0px 17px 37px 0px rgba(150, 150, 150, 0.1);

      .domain {
        margin-bottom: 12px;
        color: #4D5C92;
        text-align: center;
        font-size: 24px;
        font-weight: 400;
        line-height: 140%;
        letter-spacing: 1.92px;
      }

      .sub-title {
        color: #757680;
        text-align: center;

        font-size: 20px;
        font-weight: 350;
        line-height: 140%;
      }

      .check-in-time {
        margin-top: 12px;
        color: #03174B;
        text-align: center;
        font-size: 24px;
        font-weight: 400;
        line-height: 140%;
      }

      .qr-code-container {
        width: 232px;
        height: 283px;
        border-radius: 16px;
        background: #FFF;
        transform: rotate(-0.035deg);
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;

        .qr-code {
          width: 150px;
          height: 150px;
        }
        .label {
          color: #03174B;
          text-align: center;

          font-size: 24px;
          font-weight: 400;
          line-height: 140%;
          letter-spacing: 1.92px;
        }
      }
  }
}
</style>
