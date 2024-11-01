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
        :ref="
          (el) => {
            fileInputs[side] = el as HTMLInputElement
          }
        "
        accept="image/*"
        capture="environment"
        @change="(event) => handleImageUpload(props.name, side, event)"
        hidden
      />
      <div v-if="imageSrcs[props.name] && imageSrcs[props.name][side]" class="image-preview">
        <img :src="imageSrcs[props.name][side]" />
        <div class="overlay" @click.stop="deleteImage(side)">
          <SvgIcon name="delete" class="delete-icon" />
          <p>移除</p>
        </div>
      </div>
      <div v-else>
        <SvgIcon name="upload" class="upload-icon" />
        <p>{{ label }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, computed, watch, onMounted, defineEmits } from 'vue'
import imageCompression from 'browser-image-compression'
import { useIdImageStore } from '@/stores/idimage'

const emit = defineEmits(['imageChanged'])
const idImage = useIdImageStore()

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  labels: {
    type: Object as () => {
      front?: string
      back?: string
    },
    required: true
  }
})

const fileInputs = ref<{ [key: string]: HTMLInputElement | undefined }>({})
const imageSrcs = ref<{ [key: string]: { [side: string]: string } }>({})

const triggerFileInput = (side: string) => {
  fileInputs.value[side]?.click()
}

const handleImageUpload = async (name: string, side: string, event: any) => {
  const target = event.target as HTMLInputElement
  const imageFile = target.files?.[0]

  if (!imageFile) return

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  }

  try {
    const compressedFile = await imageCompression(imageFile, options)
    const base64String = await imageCompression.getDataUrlFromFile(compressedFile)

    if (!imageSrcs.value[name]) {
      imageSrcs.value[name] = {}
    }
    imageSrcs.value[name][side] = base64String

    await saveToStore(name, side, base64String)
    event.target.value = ''

    emit('imageChanged', true);
  } catch (error) {
    console.error('Error during image compression or upload:', error)
  }
}

const saveToStore = (name: string, side: string, base64String: string) => {
  const existingImages = Object.keys(idImage.idImages)[0];

  if (existingImages !== name) {
    imageSrcs.value[existingImages] = {}
    idImage.clearStore()
  }

  idImage.setImage64BaseData(name, side, base64String)
}

const currentLabels = computed(() => {
  return {
    ...(props.labels.front && { front: props.labels.front }),
    ...(props.labels.back && { back: props.labels.back })
  }
})

const deleteImage = (side: string) => {
  if (imageSrcs.value[props.name]) {
    delete imageSrcs.value[props.name][side]
    delete idImage.idImages[props.name][side]
  }
  if (fileInputs.value[side]) {
    fileInputs.value[side]!.value = ''
  }
}

const clearUploadData = () => {
  imageSrcs.value = {}
  idImage.clearStore()
}

defineExpose({
  clearUploadData
})

onMounted(() => {
  if (Object.keys(idImage.idImages).length > 0) {
    imageSrcs.value = idImage.idImages;
  }
});
</script>
<style scoped lang="scss">
@mixin text-style($weight, $size, $color) {
  font-weight: $weight;
  font-size: $size;
  color: $color;
  line-height: 140%;
  text-align: center;
}

.upload-container {
  background: var(--Input-box);
  width: 448px;
  height: 282px;
  margin-top: 24px;
  margin-bottom: 32px;
  padding: 12px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: 16px;
  cursor: pointer;

  @include text-style(350, 20px, var(--Outline));
}

.upload-icon {
  width: 58px;
  height: 58px;
  margin-bottom: 10px;
  color: var(--On-Surface-Var);
}

.image-preview {
  position: relative;
  border-radius: 16px;
  border: 1px solid var(--Outline);
  width: 100%;
  height: 100%;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
}

.id-card-container {
  display: flex;
  gap: 24px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: var(--On-Prim);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover .overlay {
  opacity: 1;
}

.delete-icon {
  width: 58px;
  height: 58px;
  color: var(--On-Prim);
}
</style>
