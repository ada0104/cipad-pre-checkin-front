import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type DefaultMemberDataResponse } from '@/api/api'

import { useIdImageStore } from '@/stores/idimage'

export const useMemberDataStore = defineStore('memberData', () => {
  const defaultMemberData = ref<DefaultMemberDataResponse>({
    code: '',
    message: '',
    data: {
      country_codes: '',
      phone: '',
      name: '',
      email: '',
      birthday: '',
      invoice: {
        barcode: null,
        Compiled: null,
        company: null
      },
      image_type: '',
      image1: '',
      image2: ''
      }
  });

  function setMemberData(memberData: DefaultMemberDataResponse) {
    defaultMemberData.value = memberData;

    setDataToStore();
  }

  function setDataToStore() {
    const idImage = useIdImageStore();
    const { image_type: name, image1, image2 } = defaultMemberData.value.data;

    const addBase64Prefix = (image: string) => `data:image/jpeg;base64,${image}`;

    const setImageData = (side: 'front' | 'back', image?: string) => {
      if (image) {
        idImage.setImage64BaseData(name, side, addBase64Prefix(image));
      }
    };

    setImageData('front', image1);
    setImageData('back', image2);
  }

  function clearStore() {
    defaultMemberData.value = <DefaultMemberDataResponse>{};
  }

  return {
    defaultMemberData,
    setMemberData,
    clearStore
  };
});
