<template>
  <Header />
  <main>
    <div class="title-block">
      <div class="title">
        <p>登記入住資料</p>
      </div>
    </div>
    <div class="card card-1">
      <p class="card-title m-b-16">雀客快捷 臺中一中</p>
      <p class="card-sec-title">訂單編號 SCE355</p>
      <p class="card-text">(2024/07/30 - 2024/08/01)</p>
    </div>
    <div class="card card-2">
      <p class="card-title">訂購人 - 陳小華</p>
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
import Header from '@/components/Header.vue'
import Button from '@/components/Button.vue'
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
  display: flex;
  gap: $spacing-small;
  justify-content: center;
}

.no-underline {
  text-decoration: none;
}
</style>
