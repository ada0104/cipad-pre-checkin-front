<template>
  <Header />
  <main>
    <div class="title-block">
      <router-link to="/" class="no-underline back-route">
        <SvgIcon name="back" class="back-icon" />
        <span>返回</span>
      </router-link>
      <div class="title">
        <p>預先登記入住</p>
      </div>
    </div>
    <div class="card">
      <div class="card-content">
        <p class="card-title">上傳個人證件</p>
        <Select
          :selectedOption="selectedOption"
          :options="options"
          @update:selectedOption="updateSelectedOption"
        />
        <Upload
          :name="computedLabels.name"
          :labels="computedLabels.labels"
        />
        <router-link to="/form" class="no-underline">
          <Button buttonClass="btn primary-btn" :disabled="isDisabled">
            下一步
          </Button>
        </router-link>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import Header from '@/components/Header.vue';
import Button from '@/components/Button.vue';
import Select from '@/components/Select.vue';
import Upload from '@/components/Upload.vue';
import { useIdImageStore } from '@/stores/idimage';

interface Option {
  name: string;
  label: string;
}

interface UploadLabelMap {
  [key: string]: {
    front: string;
    back?: string;
  };
}

const isDisabled = ref<boolean>(true);
const selectedOption = ref<Option>({
  name: 'id-card',
  label: '身分證',
});

const options = ref<Option[]>([
  { name: 'id-card', label: '身分證' },
  { name: 'passport', label: '護照' },
]);

const uploadLabelMap: UploadLabelMap = {
  'id-card': {
    front: '身分證正面',
    back: '身分證反面',
  },
  'passport': {
    front: '護照個人頁',
  },
};

const computedLabels = computed(() => {
  const selectedName = selectedOption.value?.name;
  return {
    name: selectedName,
    labels: uploadLabelMap[selectedName] || {},
  };
});

const updateSelectedOption = (option: Option) => {
  selectedOption.value = option;
};

const idImage = useIdImageStore();

const checkIfCanProceed = computed(() => {
  const selectedName = selectedOption.value.name;
  const requiredFields = Object.keys(uploadLabelMap[selectedName] || {});
  const imageData = idImage.idImages[selectedName] || {};

  return requiredFields.every(field => imageData[field]);
});

watch(checkIfCanProceed, (canProceed) => {
  isDisabled.value = !canProceed;
});

onMounted(() => {
  idImage.clearStore();
});
</script>

<style lang="scss" scoped>
.back-route {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--On-Surface);
  font-size: 20px;
  font-weight: 350;
  line-height: 140%;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);

  .back-icon {
    color: var(--On-Surface);
  }
}

.card {
  width: 1113px;
  display: flex;
  justify-content: center;
}

.card-content {
  display: inline-block;
  width: auto;
}

.card-content:last-child {
  margin-bottom: 0;
}

.card-title {
  color: var(--On-Surface-Var);
  margin-bottom: 32px;
}

.btn {
  width: 100%;
}

.upload-group {
  display: flex;
  gap: 24px;
}
</style>
