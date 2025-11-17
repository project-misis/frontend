import { useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight, Users, Globe, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthDialog } from './AuthDialog';
import { useAuth } from '@/hooks/use-auth';

export const HeroSection = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openUserAuth, setOpenUserAuth] = useState(false);
  const [openMentorAuth, setOpenMentorAuth] = useState(false);

  return (
    <section className="relative z-10 min-h-[60vh] flex flex-col items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-primary">{t('hero.badge')}</span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
          {t('hero.titlePart1')}{' '}
          <span className="text-primary">{t('hero.titleHighlight')}</span>
          <br />
          {t('hero.titlePart2')}
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('hero.description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {user ? (
            <Button
              size="lg"
              className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
              onClick={() => navigate('/profile')}
            >
              {t('hero.viewProfile')}
              <User className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                onClick={() => setOpenUserAuth(true)}
              >
                {t('hero.findMentor')}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group border-primary/30 text-primary hover:text-primary transition-colors duration-200 hover:bg-primary/5 hover:border-primary/50 hover:shadow-md hover:shadow-primary/10"
                onClick={() => setOpenMentorAuth(true)}
              >
                <Users className="mr-2 w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                {t('hero.becomeMentor')}
              </Button>
            </>
          )}
        </div>

        {/*   <div className="grid grid-cols-3 gap-8 pt-12 border-t border-primary/10"> */}
        {/*     <div className="space-y-2"> */}
        {/*       <div className="text-3xl font-bold text-primary font-mono">50+</div> */}
        {/*       <div className="text-sm text-muted-foreground">{t('hero.countries')}</div> */}
        {/*     </div> */}
        {/*     <div className="space-y-2"> */}
        {/*       <div className="text-3xl font-bold text-primary font-mono">1000+</div> */}
        {/*       <div className="text-sm text-muted-foreground">{t('hero.mentors')}</div> */}
        {/*     </div> */}
        {/*     <div className="space-y-2"> */}
        {/*       <div className="text-3xl font-bold text-primary font-mono">5000+</div> */}
        {/*       <div className="text-sm text-muted-foreground">{t('hero.students')}</div> */}
        {/*     </div> */}
        {/*   </div> */}
      </div>

      <AuthDialog open={openUserAuth} onOpenChange={setOpenUserAuth} role="user" />
      <AuthDialog open={openMentorAuth} onOpenChange={setOpenMentorAuth} role="mentor" />
    </section>
  );
};
