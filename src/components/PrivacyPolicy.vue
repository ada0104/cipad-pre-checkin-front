<template>
  <div class="card">
    <div class="card-title">{{ $t('privacyPolicy') }}</div>
    <component :is="currentPrivacyPolicy" />
    <Button buttonClass="btn primary-btn" @click="$emit('close')">{{ $t('close') }}</Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '@/components/Button.vue'
import PrivacyPolicyTW from '@/assets/privacy-policy/tw.vue'
import PrivacyPolicyEN from '@/assets/privacy-policy/en.vue'

const { locale } = useI18n()

const currentPrivacyPolicy = computed(() => {
  return locale.value === 'zh' ? PrivacyPolicyTW : PrivacyPolicyEN
})
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


</style>
