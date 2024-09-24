<template>
  <svg :class="className">
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  name: string;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  className: '',
});
</script>

<style scoped>
svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
</style>
