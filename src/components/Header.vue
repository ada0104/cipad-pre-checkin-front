<template>
  <div class="header">
    <div class="logo">
      <img src="@/assets/logo.svg" />
    </div>
    <div class="header-right">
      <div class="lang">
        <span class="ch-tw">中文</span>
        <span class="en">/</span>
        <span class="en">EN</span>
      </div>
      <ThemeToggle />
    </div>
  </div>
</template>
<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
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

    .lang {
      display: flex;
      gap: 10px;

      .ch-tw {
        color: var(--Primary);
      }

      .en {
        color: var(--Sec-Cont);
      }
    }
  }
}
</style>
