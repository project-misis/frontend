import { MatrixBackground } from '@/components/MatrixBackground';
import { MultilingualGreeting } from '@/components/MultilingualGreeting';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <MatrixBackground />
      <LanguageSwitcher />
      
      <main className="relative z-10 pt-20">
        <MultilingualGreeting />
        <HeroSection />
        <FeaturesSection />
      </main>
    </div>
  );
};

export default Index;
