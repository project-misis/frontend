import { Card } from './ui/card';
import { MessageSquare, Video, BookOpen, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: MessageSquare,
      title: t('features.realTimeChat.title'),
      description: t('features.realTimeChat.description'),
    },
    {
      icon: Video,
      title: t('features.videoSessions.title'),
      description: t('features.videoSessions.description'),
    },
    {
      icon: BookOpen,
      title: t('features.resourceLibrary.title'),
      description: t('features.resourceLibrary.description'),
    },
    {
      icon: Award,
      title: t('features.achievementTracking.title'),
      description: t('features.achievementTracking.description'),
    },
  ];

  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-5xl font-bold mb-4">
            {t('features.titlePart1')}{' '}
            <span className="text-primary">{t('features.titleHighlight')}</span>
          </h3>
          <p className="text-lg text-muted-foreground">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
