import { useTranslation } from 'react-i18next';
import { MatrixBackground } from '@/components/MatrixBackground';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MatrixBackground />
      <LanguageSwitcher />
      <main className="relative z-10 pt-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{t('profile.title')}</h1>
            <p className="text-muted-foreground">{t('profile.subtitle')}</p>
          </div>
          <Card className="p-6 bg-card/60 backdrop-blur-sm border-primary/10">
            {user ? (
              <div className="grid gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24 border-2 border-primary/20">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t('profile.fields.fullName')}</div>
                  <div className="text-lg font-medium">{user.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t('profile.fields.email')}</div>
                  <div className="text-lg font-medium">{user.email}</div>
                </div>
                {user.role === 'mentor' ? (
                  <div>
                    <div className="text-sm text-muted-foreground">{t('profile.fields.expertise')}</div>
                    <div className="text-lg font-medium">{user.expertise || '—'}</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-muted-foreground">{t('profile.fields.interests')}</div>
                    <div className="text-lg font-medium">{user.interests || '—'}</div>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => navigate('/')}> {t('dashboard.sidebar.home')} </Button>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => navigate('/dashboard')}> {t('profile.actions.continue')} </Button>
                  <Button variant="destructive" onClick={async () => { await logout(); navigate('/'); }}> {t('profile.actions.logout')} </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">No user logged in.</p>
                <Button onClick={() => navigate('/')}>{t('dashboard.sidebar.home')}</Button>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;



