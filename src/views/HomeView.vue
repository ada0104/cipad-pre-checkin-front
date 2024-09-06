<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
import WelcomeItem from '../components/WelcomeItem.vue'
const counter = useCounterStore()

const add = () => {
  counter.increment()
}
const search = () => {
  fetch('/api/pre_checkin/HbNjl').then(res => { })
}
</script>

<template>
  <main>
    <WelcomeItem />
    <div>Current Count: {{ counter.count }}</div>
    <button @click="add()">增加＋＋</button>
    <button @click="search()">取得api資料</button>
  </main>
</template>
