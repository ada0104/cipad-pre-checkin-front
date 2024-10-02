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
        <Button
          buttonClass="btn primary-btn"
          :disabled="isDisabled"
          @click="handleNextStep"
        >
          下一步
        </Button>
      </div>
    </div>
  </main>
  <Button buttonClass="primary-btn" @click="() => updateErrorMessages(ErrorType.RecognitionFailed)">測試證件阻擋</Button>
  <Button buttonClass="primary-btn" @click="() => updateErrorMessages(ErrorType.MinorAccessDenied)">測試未成年阻擋</Button>
  <Button buttonClass="primary-btn" @click="() => updateErrorMessages(ErrorType.UnsupportedFormat)">測試證件格式錯誤</Button>
  <ErrorAlert
    v-if="showError"
    :title="errorTitle"
    :content="errorContent"
    :buttonText="errorButtonText"
    :subText="errorSubText"
    :class="errorClass"
    @close="handleErrorClose"
    @buttonClick="handleRetryUpload"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import Header from '@/components/Header.vue';
import Button from '@/components/Button.vue';
import Select from '@/components/Select.vue';
import Upload from '@/components/Upload.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import { useIdImageStore } from '@/stores/idimage';
import { useRouter } from 'vue-router';

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

const idImage = useIdImageStore();
const router = useRouter();

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

function handleNextStep() {
  if (!isDisabled.value) {
    router.push('/form');
  }
}

enum ErrorType {
  RecognitionFailed = 0, // 證件辨識失敗
  UnsupportedFormat = 1, // 證件格式錯誤
  MinorAccessDenied = 2, // 未成年阻擋
  UnknownError = 3       // 未知錯誤
}

const showError = ref<boolean>(false);
const errorTitle = ref<string>('');
const errorContent = ref<string>('');
const errorButtonText = ref<string>('');
const errorClass = ref<string>('');
const errorSubText = ref<string>('');

function updateErrorMessages(type: ErrorType): void {
  errorClass.value = '';
  errorSubText.value = '';

  switch (type) {
    case ErrorType.RecognitionFailed:
      errorTitle.value = '證件辨識失敗';
      errorContent.value = '證件圖片無法辨識<br>請重新選擇';
      errorButtonText.value = '重新上傳';
      break;
    case ErrorType.MinorAccessDenied:
      errorTitle.value = '未成年阻擋';
      errorContent.value = '辨識您為未滿18歲身分，<br>無法使用線上登記，<br>請協同監護人於旅店櫃檯辦理入住。';
      errorButtonText.value = '我瞭解了';
      errorSubText.value = '我已成年，重新嘗試';
      errorClass.value = 'purple';
      break;
    case ErrorType.UnsupportedFormat:
      errorTitle.value = '證件格式錯誤';
      errorContent.value = '{身分證反面}<br>圖片格式不符<br>請重新上傳';
      errorButtonText.value = '重新上傳';
      break;
    default:
      errorTitle.value = '未知錯誤';
      errorContent.value = '發生未知錯誤<br>請稍後再試';
      errorButtonText.value = '關閉';
      break;
  }

  showError.value = true;
}

const handleErrorClose = (): void => {
  showError.value = false;
};
const handleRetryUpload = (): void => {
  console.log('重試按鈕被點擊');
  showError.value = false;
};
const triggerError = (): void => {
  showError.value = true;
};
</script>


<style lang="scss" scoped>
.card {
  width: 1113px;
  display: flex;
  justify-content: center;

  .card-content {
    display: inline-block;
    width: auto;

    &:last-child {
      margin-bottom: 0;
    }
  }
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
