<template>
  <Header />
  <div v-if="isLoading">Loading...</div>
  <main v-else>
    <div class="title-block">
      <div class="title">
        <p>登記入住資料</p>
      </div>
    </div>
    <div class="card card-1">
      <p class="card-title m-b-16">{{ orderDomain }}</p>
      <p class="card-sec-title">訂單編號 {{ orderId }}</p>
      <p v-if="!showError" class="card-text">({{ orderCheckInDate }} - {{ orderCheckOutDate }})</p>
    </div>
    <div v-if="!showError" class="card card-2">
      <p class="card-title">訂購人 - {{ orderName }}</p>
      <p class="card-title m-b-48">是否為本次入住旅客？</p>
      <div class="btn-group">
        <Button buttonClass="btn secondary-btn">否，不同人</Button>
        <router-link to="/upload" class="no-underline">
          <Button buttonClass="btn primary-btn">是，同一人</Button>
        </router-link>
      </div>
    </div>
    <div v-if="showError" class="card card-2">
      <p class="error-title">預先登記權限關閉</p>
      <p class="error-text">
        因您的訂單內容變更<br>
        暫時無法使用【預先登記入住】服務<br>
        請改於旅館現場辦理入住<br><br>
        造成您的困擾，敬請見諒
      </p>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getData, type OrderDataRequest } from '@/api/api'
import { useOrderStore } from '@/stores/order'
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

const orderStore = useOrderStore()
const router = useRouter()

const getOrderData = async () => {
  isLoading.value = true

  const orderDataRequest: OrderDataRequest = {
    url_token: 'MGQUJ',
  }

  try {
    const data = await getData(orderDataRequest)
    const dataStatus = data.orderData?.code;

    if (dataStatus === '0' && data.orderDetailData?.code === '0') {
      orderId.value = data.orderData.order_number;
      orderName.value = data.orderData.name;
      orderDomain.value = data.orderData.domain;

      if (data.orderDetailData?.data?.length > 0) {
        const [orderDetail] = data.orderDetailData.data;
        orderCheckInDate.value = orderDetail.check_in;
        orderCheckOutDate.value = orderDetail.check_out;
      }

      orderStore.setOrderData(data);
    } else if (dataStatus === '1001') {
      orderStore.setOrderData(data);
      router.push('/checkin');
    } else if (data.orderDetailData?.code === '1002') {
      orderId.value = data.orderData.order_number;
      orderName.value = data.orderData.name;
      orderDomain.value = data.orderData.domain;
      showError.value = true;
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
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
