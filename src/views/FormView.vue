<template>
  <Header />
  <main>
    <div class="title">
      <p>預先登記入住</p>
    </div>
    <div class="card">
      <p class="card-title">上傳個人證件</p>
      <Select
        :selectedOption="selectedOption"
        :options="options"
        @update:selectedOption="updateSelectedOption"
      />
      <Button buttonClass="btn primary-btn">下一步</Button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Header from '@/components/Header.vue';
import Button from '@/components/Button.vue';
import Select from '@/components/Select.vue';
import API from '@/views/API.vue';

const selectedOption = ref({ value: 'id-card', label: '身分證' });

const options = ref([
  { value: 'id-card', label: '身分證' },
  { value: 'passport', label: '護照' },
  { value: 'driver-license', label: '駕照' },
]);

const updateSelectedOption = (option: { value: string; label: string }) => {
  selectedOption.value = { ...option };
};

</script>

<style lang="scss" scoped>
.card {
  width: 1113px;
  display: flex;
  gap: 32px;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: stretch;
}

.card-title {
  color: var(--On-Surface-Var);
}

.btn {
  width: 100%;
}
</style>
