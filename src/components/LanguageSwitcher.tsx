import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18n.language === 'ru' ? 'ru' : 'en';
    const newLang = currentLang === 'en' ? 'ru' : 'en';
    i18n.changeLanguage(newLang);
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('language', newLang);
    }
  };

  const currentLang = i18n.language === 'ru' ? 'ru' : 'en';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 gap-2"
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase">{currentLang}</span>
    </Button>
  );
};

