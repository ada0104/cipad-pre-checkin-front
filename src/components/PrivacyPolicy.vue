<template>
  <div class="card">
    <div class="card-title">隱私權條款</div>
    <PrivacyPolicy />
    <Button buttonClass="btn primary-btn" @click="$emit('close')">關閉</Button>
  </div>
</template>
<script setup lang="ts">
import Button from '@/components/Button.vue'
import PrivacyPolicy from '@/assets/privacy-policy/tw.vue'
</script>
<style lang="scss" scoped>
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin text-style($weight, $size, $color) {
  font-weight: $weight;
  font-size: $size;
  color: $color;
  line-height: 140%;
  text-align: center;
  letter-spacing: 1.92px;
}

.btn {
  width: 100%;
}

.card {
  width: 1113px;
  @include flex-center;
  flex-direction: column;
  gap: 30px;
  overflow: auto;

  &-title {
    @include text-style(400, 28px, var(--Primary));
  }
}

.privacy-text {
  max-width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
}
</style>
