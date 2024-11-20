import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export enum ErrorType {
  RecognitionFailed, // 證件辨識失敗
  MinorAccessDenied, // 未成年阻擋
  UnknownError, // 未知錯誤
  UploadFailed, // 資料上傳失敗
  SaveDataNotification, // 儲存資料通知
  HasQRNotification, // QR 已被領取
  NoOcrImage, // 未完成 OCR 驗證
  RecognitionMismatch // 證件辨識失敗
}

export function useErrorHandling() {
  const { t } = useI18n()

  const showError = ref<boolean>(false)
  const errorTitle = ref<string>('')
  const errorContent = ref<Array<{ text: string; class?: string }>>([])
  const errorButtonText = ref<string>('')
  const errorClass = ref<string>('')
  const errorSubText = ref<string>('')
  const showExtraButton = ref<boolean>(false)
  const currentErrorType = ref<ErrorType | null>(null)

  const setMemberDataErrorCodeMap: { [key: string]: ErrorType } = {
    '1000': ErrorType.UploadFailed,
    '1001': ErrorType.HasQRNotification,
    '1002': ErrorType.UploadFailed,
    '1003': ErrorType.NoOcrImage,
    '5003': ErrorType.UploadFailed,
    '5004': ErrorType.UploadFailed
  }

  const ocrErrorCodeMap: { [key: string]: ErrorType } = {
    '1000': ErrorType.MinorAccessDenied,
    '1001': ErrorType.MinorAccessDenied,
    '1002': ErrorType.RecognitionFailed,
    '1003': ErrorType.RecognitionFailed,
    '1004': ErrorType.RecognitionMismatch,
    '1005': ErrorType.RecognitionFailed,
    '5003': ErrorType.RecognitionFailed,
    '5004': ErrorType.RecognitionFailed
  }

  const updateErrorMessages = (
    type: ErrorType,
    documentSide?: string,
    userName: string = '',
    email: string = ''
  ): void => {
    errorClass.value = ''
    errorSubText.value = ''
    showExtraButton.value = false
    currentErrorType.value = type

    let additionalErrorMessage = '';
    if (documentSide === 'BACK') {
      additionalErrorMessage = t('uploadLabel.idBack');
    } else if (documentSide === 'DOCUMENT') {
      additionalErrorMessage = t('uploadLabel.idFront');
    } else if (documentSide === 'UNRECOGNIZED_DOCUMENT') {
      additionalErrorMessage = t('unrecognizedDocument');
    }

    switch (type) {
      case ErrorType.RecognitionFailed:
        errorTitle.value = t('identificationFailed')
        errorContent.value = [{ text: t('documentImageCannotBeRecognized') }, { text: t('pleaseReselect') }]
        errorButtonText.value = t('reUpload')
        break
      case ErrorType.RecognitionMismatch:
        errorTitle.value = t('invalidDocumentFormat')
        errorContent.value = [
          ...(additionalErrorMessage ? [{ text: additionalErrorMessage }] : []),
          { text: t('imageFormatDoesNotMatch') },
          { text: t('reUpload') }
        ]
        errorButtonText.value = t('reUpload')
        break
      case ErrorType.MinorAccessDenied:
        errorTitle.value = t('minorBlocked')
        errorContent.value = [
          { text: t('identifiedAsUnder18') },
          { text: t('onlineRegistrationNotAvailable') },
          { text: t('pleaseCheckInWithGuardian') }
        ]
        errorButtonText.value = t('iUnderstand')
        errorSubText.value = t('iAmOfLegalAgeTryAgain')
        errorClass.value = 'purple'
        break
      case ErrorType.UploadFailed:
        errorTitle.value = t('dataUploadFailed')
        errorContent.value = [{ text: t('networkCheckMessage') }, { text: t('tryAgain'), class: 'mt-20' }]
        errorButtonText.value = t('reUpload')
        break
      case ErrorType.HasQRNotification:
        errorTitle.value = t('dataUploadFailed')
        errorContent.value = [{ text: t('qrcodeAlreadyClaimed') }]
        errorButtonText.value = t('navigateToQrcodePage')
        break
      case ErrorType.NoOcrImage:
        errorTitle.value = t('dataUploadFailed')
        errorContent.value = [{ text: t('pleaseCompleteDocumentVerificationFirst') }]
        errorButtonText.value = t('returnToDocumentUpload')
        break
      case ErrorType.SaveDataNotification:
        errorTitle.value = t('fetchDefaultData')
        errorContent.value = [
          { text: `${t('setThisDataAs')} ${userName} ${t('default')}` },
          { text: `${email}`, class: 'fz-20 mt-20' },
          { text: t('futureBookingsWithThisEmail'), class: 'fz-20 fc-p mt-20' }
        ]
        showExtraButton.value = true
        errorButtonText.value = t('saveAsDefault')
        errorClass.value = 'purple extra'
        break
      default:
        errorTitle.value = t('unknownError')
        errorContent.value = [{ text: t('unknownErrorOccurred') }, { text: t('pleaseTryAgainLater') }]
        errorButtonText.value = t('close')
        break
    }

    showError.value = true
  }

  return {
    showError,
    errorTitle,
    errorContent,
    errorSubText,
    errorButtonText,
    errorClass,
    showExtraButton,
    currentErrorType,
    setMemberDataErrorCodeMap,
    ocrErrorCodeMap,
    updateErrorMessages
  }
}
