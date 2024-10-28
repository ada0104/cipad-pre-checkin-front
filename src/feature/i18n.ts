import { createI18n } from 'vue-i18n';
import tw from '@/feature/locals/tw.json';
import en from '@/feature/locals/en.json';

const messages = {
  zh: tw,
  en: en
};

const i18n = createI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  messages,
});

export default i18n;
