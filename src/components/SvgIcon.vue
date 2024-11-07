<template>
  <svg :class="className" class="default">
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  name: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  className: ''
})
</script>
<style scoped>
.default {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
</style>
