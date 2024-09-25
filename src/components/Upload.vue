<template>
  <div class="id-card-container">
    <div
      v-for="(label, side) in currentLabels"
      :key="side"
      class="upload-container"
      @click="() => triggerFileInput(side)"
    >
      <input
        type="file"
        :ref="el => {
          fileInputs[side] = el as HTMLInputElement;
        }"
        accept="image/*"
        capture="environment"
        @change="(event) => handleImageUpload(props.name, side, event)"
        hidden
      />
      <div v-if="imageSrcs[props.name] && imageSrcs[props.name][side]" class="image-preview">
        <img :src="imageSrcs[props.name][side]" />
      </div>
      <div v-else>
        <SvgIcon name="upload" class="upload-icon" />
        <p>{{ label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, watch } from 'vue';
import imageCompression from 'browser-image-compression';
import { useIdImageStore } from '@/stores/idimage';

const idImage = useIdImageStore();

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  labels: {
    type: Object as () => {
      front?: string;
      back?: string;
    },
    required: true,
  },
});

const fileInputs = ref<{ [key: string]: HTMLInputElement | undefined }>({});
const imageSrcs = ref<{ [key: string]: { [side: string]: string } }>({});

const triggerFileInput = (side: string) => {
  fileInputs.value[side]?.click();
};

const handleImageUpload = async (name: string, side: string, event: any) => {
  const target = event.target as HTMLInputElement;
  const imageFile = target.files?.[0];

  if (!imageFile) return;

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    const base64String = await imageCompression.getDataUrlFromFile(compressedFile);

    if (!imageSrcs.value[name]) {
      imageSrcs.value[name] = {};
    }
    imageSrcs.value[name][side] = base64String;

    await uploadToServer(name, side, base64String);
    event.target.value = '';
  } catch (error) {
    console.error('Error during image compression or upload:', error);
  }
};

const uploadToServer = (name: string, side: string, base64String: string) => {
  idImage.setImage64BaseData(name, side, base64String);
};

const currentLabels = computed(() => {
  return {
    ...(props.labels.front && { front: props.labels.front }),
    ...(props.labels.back && { back: props.labels.back }),
  };
});

watch(() => props.name, (newName, oldName) => {
  imageSrcs.value[oldName] = {};
  idImage.clearStore();
});
</script>

<style scoped lang="scss">
.upload-container {
  background: var(--Input-box);
  color: var(--Outline);
  width: 448px;
  height: 282px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: 16px;
  cursor: pointer;

  text-align: center;
  font-size: 20px;
  font-weight: 350;
  line-height: 140%;
  margin-top: 24px;
  margin-bottom: 32px;
  padding: 12px;
}

.upload-icon {
  width: 58px;
  height: 58px;
  margin-bottom: 10px;
  color: var(--On-Surface-Var);
}

.image-preview {
  border-radius: 16px;
  border: 1px solid var(--Outline);
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.id-card-container {
  display: flex;
  gap: 24px;
}
</style>
