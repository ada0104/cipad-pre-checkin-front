<template>
<button :class="buttonClass" :type="type">
    <slot></slot>
</button>
</template>

<script setup lang="ts">
const props = defineProps({
    buttonClass: {
        type: String,
        default: 'button'
    },
    type: {
        type: String,
        default: 'button'
    }
});
</script>

<style scoped lang="scss">
.button {
  display: flex;
  padding: 24px 48px;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 16px;
  font-family: "Noto Sans TC";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  letter-spacing: 1.92px;
}
</style>
