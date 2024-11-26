import { ref, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email as emailValidator, minLength, maxLength } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'

export function useFormValidation(formData: any, selectedInvoiceType: any) {
  const { t } = useI18n()
  const isDisabled = ref(true)

  function validTaxId(taxId: string): boolean {
    const invalidList = ['00000000', '11111111'] // 黑名單
    if (!/^\d{8}$/.test(taxId) || invalidList.includes(taxId)) return false

    const validateOperator = [1, 2, 1, 2, 1, 2, 4, 1]
    let sum = 0

    for (let i = 0; i < validateOperator.length; i++) {
      const digit = parseInt(taxId[i], 10)
      const product = digit * validateOperator[i]
      sum += Math.floor(product / 10) + (product % 10) // 個位數 + 十位數
    }

    // 驗證條件
    return sum % 10 === 0 || (taxId[6] === '7' && (sum + 1) % 5 === 0)
  }

  const rules = {
    userName: { required },
    email: {
      required,
      email: emailValidator
    },
    phone: {
      required: (value: string) => !value || value.length === 9,
      numeric: (value: string) => !value || /^\d+$/.test(value)
    },
    companyId: {
      required: (value: string) => (selectedInvoiceType.value === 'three-step' ? !!value : true),
      validTaxId: (value: string) => !value || validTaxId(value),
      minLength: minLength(8),
    },
    cloudCarrier: {
      minLength: minLength(8),
      maxLength: maxLength(8),
      startsWithSlash: (value: string) => {
        return value ? value.startsWith('/') : true
      }
    },
    companyName: {},
    acceptTerms: {
      required: (value: boolean) => value === true
    }
  }

  const v$ = useVuelidate(rules, formData)

  const errorMessages = {
    userName: computed(() => {
      if (!v$.value.userName.required.$response) return t('required')
      return ''
    }),
    email: computed(() => {
      if (!v$.value.email.required.$response) return t('required')
      if (!v$.value.email.email.$response) return t('pleaseEnterValidEmail')
      return ''
    }),
    phone: computed(() => {
      if (!v$.value.phone.numeric.$response) return t('mobileNumberCanOnlyContainDigits')
      if (!v$.value.phone.required.$response) return t('invalidPhoneNumber')
      return ''
    }),
    cloudCarrier: computed(() => {
      if (!v$.value.cloudCarrier.minLength.$response) return t('atLeast8CharactersRequired')
      if (!v$.value.cloudCarrier.maxLength.$response) return t('upTo8CharactersAllowed')
      if (!v$.value.cloudCarrier.startsWithSlash.$response) return `${t('firstCharacterMustBe')} /`
      return ''
    }),
    companyId: computed(() => {
      if (!v$.value.companyId.required.$response) return t('required')
      if (!v$.value.companyId.minLength.$response) return t('atLeast8CharactersRequired')
      if (!v$.value.companyId.validTaxId.$response) return t('invalidTaxId')

      return ''
    }),
    companyName: computed(() => ''),
    acceptTerms: computed(() => {
      if (!v$.value.acceptTerms.required.$response) return t('required')
      return ''
    })
  }

  watch(
    () => v$.value.$invalid,
    (isInvalid) => {
      isDisabled.value = isInvalid
    }
  )

  return {
    v$,
    isDisabled,
    errorMessages
  }
}
