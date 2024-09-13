<template>
<svg :class="className">
    <use :xlink:href="`#icon-${name}`"></use>
</svg>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  name: {
    type: String,
      required: true
  },
  className: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
</style>
