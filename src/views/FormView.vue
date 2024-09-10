
<template>
  <Header />
  <main>
    <Title :title="'預先登記入住'"/>
    <Card cardClass="card" cardPadding="48px 96px">
    <template #header>
      <p class="card-title on-surface-color">上傳個人證件</p>
    </template>
  </Card>
  </main>
</template>

<script setup lang="ts">
import Title from '@/components/Title.vue';
import Header from '@/components/Header.vue';
import Card from '@/components/Card.vue';
</script>