import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type OcrDataResponse } from '@/api/api'

export const useIdImageStore = defineStore('idImage', () => {
  const idImages = ref<Record<string, Record<string, string>>>({});
  const idOcrResult = ref<OcrDataResponse>({
    code: '',
    message: '',
    data: {
      name: '',
      age: '',
      birthday: ''
    }
  });

  function setImage64BaseData(name: string, side: string, image64BaseData: string) {
    if (!idImages.value[name]) {
      idImages.value[name] = {};
    }
    idImages.value[name][side] = image64BaseData;
  }

  function clearStore() {
    idImages.value = {};
    idOcrResult.value = {
      code: '',
      message: '',
      data: {
        name: '',
        age: '',
        birthday: ''
      }
    };
  }

  function setIdOcrResult(response: OcrDataResponse) {
    idOcrResult.value = response;
  }

  return {
    idImages,
    idOcrResult,
    setImage64BaseData,
    setIdOcrResult,
    clearStore
  };
});
