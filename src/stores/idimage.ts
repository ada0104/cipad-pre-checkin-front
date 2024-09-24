import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useIdImageStore = defineStore('idImage', () => {
  const idImages = ref<Record<string, Record<string, string>>>({});

  function setImage64BaseData(name: string, side: string, image64BaseData: string) {
    if (!idImages.value[name]) {
      idImages.value[name] = {};
    }
    idImages.value[name][side] = image64BaseData;
    console.log(idImages.value)
  }

  function clearStore() {
    idImages.value = {};
  }

  return {
    idImages,
    setImage64BaseData,
    clearStore
  };
});
