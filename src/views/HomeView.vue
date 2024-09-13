<template>
<Header/>
<main>
  <div class="card card-1">
    <p class="card-title m-b-16">雀客快捷 台中一中</p>
    <p class="card-sec-title">訂單編號 SCE355</p>
    <p class="card-text">(2024/07/30 - 2024/08/01)</p>
  </div>
  <div class="card card-2">
      <p class="card-title">訂購人陳小華</p>
      <p class="card-title m-b-48">是否為本次入住旅客？</p>
      <div class="btn-group">
        <Button buttonClass="btn secondary-btn">否，不同人</Button>
        <router-link to="/form" class="no-underline">
          <Button buttonClass="btn primary-btn">是，同一人</Button>
        </router-link>
      </div>
  </div>
</main>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import Button from '@/components/Button.vue';
</script>

<style lang="scss" scoped>
.card {
  width: 612px;
}

.card-1 {
  padding: 31px 58px;
}

.card-2 {
  padding: 58px;
}

.card-sec-title {
  text-align: center;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  color: var(--Secondary);
  font-size: 24px;
  letter-spacing: 1.92px;
}

.card-text {
  text-align: center;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  color: var(--On-Surface-Var);
  font-size: 20px;
  font-weight: 350;
}
</style>
