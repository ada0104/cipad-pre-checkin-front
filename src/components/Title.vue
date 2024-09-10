<template>
<div class="title">
  <p>{{title}}</p>
</div>
</template>

<script setup>
const props = defineProps({
    title: String,
})
</script>

<style scoped lang="scss">
.title {
  width: fit-content;
  border-radius: 99px;
  border: 3px solid var(--Primary);
  margin-bottom: 32px;
  padding: 16px 32px;

  p {
    font-family: "Noto Sans TC";
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%;
    color: var(--Primary);
  }
}
</style>
