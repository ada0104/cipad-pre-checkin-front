<template>
  <Header />
  <main>
    <div class="title-block">
      <div class="title">
        <p>登記入住資料</p>
      </div>
    </div>
    <div class="card card-1">
      <p class="card-title m-b-16">{{ orderDomain }}</p>
      <p class="card-sec-title">訂單編號 {{ orderId }}</p>
      <p class="card-text">({{ orderCheckInDate }} - {{ orderCheckOutDate }})</p>
    </div>
    <div class="card card-2">
      <p class="card-title">訂購人 - {{ orderName }}</p>
      <p class="card-title m-b-48">是否為本次入住旅客？</p>
      <div class="btn-group">
        <Button buttonClass="btn secondary-btn">否，不同人</Button>
        <router-link to="/upload" class="no-underline">
          <Button buttonClass="btn primary-btn">是，同一人</Button>
        </router-link>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getData } from '@/api/api';
import { useOrderStore } from '@/stores/order';
import Header from '@/components/Header.vue'
import Button from '@/components/Button.vue'

const orderId = ref<string>('');
const orderName = ref<string>('');
const orderDomain = ref<string>('');
const orderCheckInDate = ref<string>('');
const orderCheckOutDate = ref<string>('');

const orderStore = useOrderStore();

const getOrderData = async () => {
  const data = await getData();
  orderStore.setOrderData(data);

  orderId.value = data.orderData.order_number;
  orderName.value = data.orderData.name;
  orderDomain.value = data.orderData.domain;

  const [orderDetail] = data.orderDetailData.data;
  orderCheckInDate.value = orderDetail.check_in;
  orderCheckOutDate.value = orderDetail.check_out;
};

onMounted(() => {
  orderStore.clearStore();
  getOrderData();
});
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
}

.btn-group {
  gap: $spacing-small;
}

.no-underline {
  text-decoration: none;
}
</style>
