<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
const counter = useCounterStore()

const add = () => {
  counter.increment()
}
const search = () => {
  fetch('/dunqian/pre_checkin/HbNjl').then(async res => {
    const data = await res.json()
    console.log(data);
  })
}
</script>

<template>
  <main>
    <div>Current Count: {{ counter.count }}</div>
    <button @click="add()">增加＋＋</button>
    <button @click="search()">取得api資料</button>
    <RouterLink to="/">Home</RouterLink>
  </main>
</template>
