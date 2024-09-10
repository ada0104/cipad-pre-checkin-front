<template>
  <div class="header">
    <div class="logo">
        <img src="@/assets/logo.svg">
    </div>
    <div class="header-right">
        <p>中文 / EN</p>
        <div class="mode">
          <ThemeToggle />
        </div>
    </div>
  </div>
</template>

<script setup>
import ThemeToggle from '@/components/ThemeToggle.vue';
</script>

<style scoped lang="scss">
.header {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;

  .logo {
    height: 44px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }
}
</style>
