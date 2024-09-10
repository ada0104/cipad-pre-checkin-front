<template>
<Header/>
<main>
  <Title :title="'登記入住資料'" />
  <Card cardClass="card" cardPadding="31px 58px">
    <template #header>
      <p class="card-title m-b-16">雀客快捷 台中一中</p>
      <p class="card-sec-title">訂單編號 SCE355</p>
      <p class="card-text">(2024/07/30 - 2024/08/01)</p>
    </template>
  </Card>
  <Card>
    <template #header>
      <p class="card-title">訂購人陳小華</p>
      <p class="card-title m-b-48">是否為本次入住旅客？</p>
    </template>
    <template #content>
      <ButtonGroup>
        <Button buttonClass="button secondary-btn">否，不同人</Button>
        <router-link to="/form" class="no-underline">
          <Button buttonClass="button primary-btn">是，同一人</Button>
        </router-link>
      </ButtonGroup>
    </template>
  </Card>
</main>
</template>

<script setup lang="ts">
import Title from '@/components/Title.vue';
import Header from '@/components/Header.vue';
import Card from '@/components/Card.vue';
import Button from '@/components/Button.vue';
import ButtonGroup from '@/components/ButtonGroup.vue';
</script>
