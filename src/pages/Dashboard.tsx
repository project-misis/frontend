import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MatrixBackground } from '@/components/MatrixBackground';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Users,
  BookOpen,
  Activity,
  Mail,
  MessageCircle,
  CalendarDays,
  Clock,
  MapPin,
  ExternalLink,
  BookMarked,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

type DashboardSection = 'mentors' | 'activities' | 'studybooks';

type Mentor = {
  id: string;
  name: string;
  expertise: string;
  description: string;
  avatarUrl: string;
  telegram: string;
  email: string;
};

const MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Алексей Смирнов',
    expertise: 'Программирование на C++',
    description: 'Студент МИСИС, увлечён конкурентным программированием, помогает новичкам освоить основы и алгоритмы.',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?skinColor=ffdbb4&seed=Lesha_s',
    telegram: '@aleksey_cpp',
    email: 'alexey.smirnov@misis.ru',
  },
  {
    id: '2',
    name: 'Мария Иванова',
    expertise: 'Журналистика и SMM',
    description: 'Активистка студенческого медиа-центра МИСИС, ведёт курсы по созданию текстов и продвижению в соцсетях.',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?skinColor=ffdbb4&seed=MariaIvan',
    telegram: '@maria_journal',
    email: 'm.ivanova@misis.ru',
  },
  {
    id: '3',
    name: 'Дмитрий Орлов',
    expertise: 'Web-разработка',
    description: 'Разрабатывает сайты и приложения, консультирует студентов по JavaScript, React и базам данных.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abcd',
    telegram: '@orlov_web',
    email: 'd.orlov@misis.ru',
  },
  {
    id: '4',
    name: 'Екатерина Васильева',
    expertise: 'Маркетинг',
    description: 'Организатор событий и студенческих акций, разбирается в digital-маркетинге, помогает приобрести soft skills.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=L',
    telegram: '@ekaterina_marketing',
    email: 'ekaterina.vasilieva@misis.ru',
  },
  {
    id: '5',
    name: 'Михаил Соколов',
    expertise: 'DevOps и облака',
    description: 'Специалист по CI/CD, Docker и облачным решениям, ведёт практики по инфраструктуре.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ABCDEFGH',
    telegram: '@mikhail_devops',
    email: 'm.sokolov@misis.ru',
  },
  {
    id: '6',
    name: 'Анна Кузнецова',
    expertise: 'Психология',
    description: 'Студентка факультета социальных наук, проводит тренинги по стресс-менеджменту и развитию креативности.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    telegram: '@anna_psy',
    email: 'a.kuznetsova@misis.ru',
  },
];

type ActivityItem = {
  id: string;
  title: string;
  focus: string;
  description: string;
  date: string;
  time: string;
  location: string;
  host: string;
  signupLink: string;
  contactEmail: string;
};

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'a1',
    title: 'Студенческий хакатон MISIS',
    focus: 'IT и инновации',
    description:
      '48-часовой хакатон с командным программированием — создаём прототипы для реальных задач университета и компаний-партнёров.',
    date: '12–14 апреля 2026',
    time: '10:00 – 22:00 MSK',
    location: 'МИСИС, Москва (ауд. 301) + онлайн',
    host: 'Центр цифровых решений МИСИС',
    signupLink: 'https://misis.ru/events/hackathon',
    contactEmail: 'hackathon@misis.ru',
  },
  {
    id: 'a2',
    title: 'Воркшоп «Карьерный старт»',
    focus: 'Трудоустройство',
    description:
      'Практический воркшоп: разбор резюме, пробные собеседования и советы для начинающих специалистов в IT и инженерии.',
    date: '25 апреля 2026',
    time: '15:30 – 18:00 MSK',
    location: 'МИСИС, Москва (кафе Loft)',
    host: 'Студенческий совет МИСИС',
    signupLink: 'https://misis.ru/events/career',
    contactEmail: 'career@misis.ru',
  },
  {
    id: 'a3',
    title: 'Круглый стол: Университет и город',
    focus: 'Сообщество',
    description:
      'Открытая дискуссия с экспертами: как студенты МИСИС меняют город, волонтёрские инициативы, проекты для школьников и горожан.',
    date: 'Первая среда месяца',
    time: '17:00 – 19:00 MSK',
    location: 'МИСИС, Москва (зал библиотека) + Zoom',
    host: 'Молодёжный центр МИСИС',
    signupLink: 'https://misis.ru/events/community',
    contactEmail: 'community@misis.ru',
  },
  {
    id: 'a4',
    title: 'Киновечер «Фильм на большой перемене»',
    focus: 'Досуг и общение',
    description:
      'Неофициальный киновечер для студентов: горячий чай, любимый фильм на проекторе и приятная компания. После просмотра — обсуждение фильма.',
    date: '29 апреля 2026',
    time: '18:30 – 21:30 MSK',
    location: 'МИСИС, Москва (Читальный зал, корпус А)',
    host: 'Студенческий культурный клуб',
    signupLink: 'https://misis.ru/events/movie-night',
    contactEmail: 'cultureclub@misis.ru',
  },
];

type Studybook = {
  id: string;
  title: string;
  author: string;
  summary: string;
  topics: string[];
  format: 'PDF' | 'Notion' | 'Slide Deck' | 'Interactive';
  pages: number;
  language: string;
  resourceUrl: string;
};

const STUDYBOOKS: Studybook[] = [
  {
    id: 's1',
    title: 'Сборник задач по аналитической геометрии (RU)',
    author: 'Кафедра высшей математики МИСИС',
    summary:
      'Полностью русскоязычный сборник задач и кратких конспектов по прямым, плоскостям и квадрикам с примерами оформления решений.',
    topics: ['Геометрия', 'Линейная алгебра', 'Практика'],
    format: 'PDF',
    pages: 210,
    language: 'Русский',
    resourceUrl: 'https://example.com/resources/russian-analytic-geometry',
  },
  {
    id: 's2',
    title: 'Методичка по физике твёрдого тела (RU)',
    author: 'Проф. А. П. Кулаков',
    summary:
      'Подробные лекционные заметки и расчётные работы по кристаллографии, тепловым явлениям и зонной теории. Русский текст, формулы TeX.',
    topics: ['Физика', 'Материаловедение', 'Расчёты'],
    format: 'PDF',
    pages: 168,
    language: 'Русский',
    resourceUrl: 'https://example.com/resources/russian-solid-state',
  },
  {
    id: 's3',
    title: 'Практикум по дата-анализу (EN)',
    author: 'MISIS Data Lab',
    summary:
      'Англоязычные ноутбуки с лабораторными по Python, pandas и визуализации данных для инженерных кейсов металлургии.',
    topics: ['Python', 'Data Analysis', 'Visualization'],
    format: 'PDF',
    pages: 142,
    language: 'English',
    resourceUrl: 'https://example.com/resources/english-data-lab',
  },
  {
    id: 's4',
    title: 'Advanced Materials Modeling (EN)',
    author: 'Center for Computational Materials',
    summary:
      'Учебник на английском с пошаговыми примерами по DFT, молекулярной динамике и построению моделей сплавов в Quantum ESPRESSO.',
    topics: ['Simulation', 'Materials', 'DFT'],
    format: 'Slide Deck',
    pages: 96,
    language: 'English',
    resourceUrl: 'https://example.com/resources/english-materials-modeling',
  },
  {
    id: 's5',
    title: 'Cours accéléré de chimie inorganique (FR)',
    author: 'Département francophone MISIS',
    summary:
      'Конспекты и задачи на французском языке по координационным соединениям, диаграммам фаз и электрохимическим процессам.',
    topics: ['Chimie', 'Matériaux', 'Exercices'],
    format: 'PDF',
    pages: 120,
    language: 'Français',
    resourceUrl: 'https://example.com/resources/french-inorganic',
  },
  {
    id: 's6',
    title: 'Atelier IA pour ingénieurs (FR)',
    author: 'Comité francophone MISIS',
    summary:
      'Лабораторные на французском языке по применению PyTorch и FastAI к технологическим данным: классификация дефектов и прогноз износа.',
    topics: ['Intelligence artificielle', 'PyTorch', 'Industrie'],
    format: 'Interactive',
    pages: 84,
    language: 'Français',
    resourceUrl: 'https://example.com/resources/french-ai-workshop',
  },
];

type SelectedItem =
  | { type: 'mentor'; data: Mentor }
  | { type: 'activity'; data: ActivityItem }
  | { type: 'studybook'; data: Studybook };

const DashboardContent = () => {
  const { t } = useTranslation();
  const { setOpenMobile, isMobile } = useSidebar();
  const [activeSection, setActiveSection] = useState<DashboardSection>('mentors');
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const navigate = useNavigate();

  const sections: { id: DashboardSection; icon: typeof Users; labelKey: string }[] = [
    { id: 'mentors', icon: Users, labelKey: 'dashboard.sidebar.mentors' },
    { id: 'activities', icon: Activity, labelKey: 'dashboard.sidebar.activities' },
    { id: 'studybooks', icon: BookOpen, labelKey: 'dashboard.sidebar.studybooks' },
  ];

  const getSectionContent = () => {
    switch (activeSection) {
      case 'mentors':
        return t('dashboard.content.mentors');
      case 'activities':
        return t('dashboard.content.activities');
      case 'studybooks':
        return t('dashboard.content.studybooks');
      default:
        return '';
    }
  };

  const handleSectionClick = (sectionId: DashboardSection) => {
    setActiveSection(sectionId);
    // Close sidebar on mobile after selection
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-primary/10 bg-card/60 backdrop-blur-sm"
        variant="inset"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t('dashboard.sidebar.title')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <SidebarMenuItem key={section.id}>
                      <SidebarMenuButton
                        isActive={activeSection === section.id}
                        onClick={() => handleSectionClick(section.id)}
                        tooltip={t(section.labelKey)}
                      >
                        <Icon />
                        <span>{t(section.labelKey)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* Footer for Main Page and Profile links (bottom) */}
          <SidebarFooter className="mt-auto">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate('/')}
                  tooltip={t('dashboard.sidebar.home')}
                >
                  <BookOpen />
                  <span>{t('dashboard.sidebar.home')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate('/profile')}
                  tooltip={t('dashboard.sidebar.profile')}
                >
                  <Users />
                  <span>{t('dashboard.sidebar.profile')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-0">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-primary/10 px-4 md:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
        </header>
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                {t(`dashboard.sections.${activeSection}.title`)}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                {getSectionContent()}
              </p>
            </div>

            {activeSection === 'mentors' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {MENTORS.map((mentor) => (
                  <Card
                    key={mentor.id}
                    className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 bg-card/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 cursor-pointer"
                    onClick={() => setSelectedItem({ type: 'mentor', data: mentor })}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                          <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {mentor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl mb-1 truncate">{mentor.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-primary font-medium">
                            <span>{mentor.expertise}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {mentor.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeSection === 'activities' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {ACTIVITIES.map((activity) => (
                  <Card
                    key={activity.id}
                    className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 bg-card/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 cursor-pointer"
                    onClick={() => setSelectedItem({ type: 'activity', data: activity })}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl border border-primary/20 bg-primary/10 flex items-center justify-center text-primary group-hover:border-primary/40 transition-colors">
                          <CalendarDays className="w-8 h-8" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs uppercase tracking-wide">
                            {activity.focus}
                          </div>
                          <CardTitle className="text-xl leading-tight">{activity.title}</CardTitle>
                          <div className="grid gap-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4" />
                              {activity.date}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {activity.time}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {activity.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {activity.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeSection === 'studybooks' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {STUDYBOOKS.map((book) => (
                  <Card
                    key={book.id}
                    className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 bg-card/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 cursor-pointer"
                    onClick={() => setSelectedItem({ type: 'studybook', data: book })}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl border border-primary/20 bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                          <BookOpen className="w-8 h-8" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <CardTitle className="text-lg leading-tight line-clamp-2">{book.title}</CardTitle>
                          <div className="text-xs text-muted-foreground">{book.author}</div>
                          <div className="flex flex-wrap gap-2 text-xs text-primary">
                            <span className="rounded-full bg-primary/10 px-3 py-1">
                              {t('dashboard.studybooks.languageShort', { language: book.language })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed line-clamp-3">
                        {book.summary}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </SidebarInset>

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="bg-background/85 backdrop-blur-sm border-primary/20 max-w-2xl max-h-[85vh] overflow-hidden p-0">
          {selectedItem && (
            <div className="flex flex-col gap-4 p-6 overflow-y-auto">
              {selectedItem.type === 'mentor' && (
                <>
                  <DialogHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-20 h-20 border-2 border-primary/20">
                        <AvatarImage src={selectedItem.data.avatarUrl} alt={selectedItem.data.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                          {selectedItem.data.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <DialogTitle className="text-2xl mb-2">{selectedItem.data.name}</DialogTitle>
                        <DialogDescription className="text-base text-primary font-medium">
                          {selectedItem.data.expertise}
                        </DialogDescription>
                        <div className="mt-2 text-sm text-muted-foreground">
                        </div>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">{t('dashboard.mentors.about')}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedItem.data.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-3">{t('dashboard.mentors.contacts')}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <MessageCircle className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.mentors.telegram')}</div>
                            <a
                              href={`https://t.me/${selectedItem.data.telegram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              {selectedItem.data.telegram}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <Mail className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-xs text-muted-foreground">{t('dashboard.mentors.email')}</div>
                            <a
                              href={`mailto:${selectedItem.data.email}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {selectedItem.data.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedItem.type === 'activity' && (
                <>
                  <DialogHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-2xl border border-primary/20 bg-primary/10 flex items-center justify-center text-primary">
                        <CalendarDays className="w-9 h-9" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs uppercase tracking-wide">
                          {selectedItem.data.focus}
                        </div>
                        <DialogTitle className="text-2xl leading-tight">{selectedItem.data.title}</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                          {selectedItem.data.host}
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">{t('dashboard.activities.date')}:</span>
                        {selectedItem.data.date}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">{t('dashboard.activities.time')}:</span>
                        {selectedItem.data.time}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">{t('dashboard.activities.location')}:</span>
                        {selectedItem.data.location}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">{t('dashboard.activities.about')}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedItem.data.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        asChild
                      >
                        <a href={selectedItem.data.signupLink} target="_blank" rel="noopener noreferrer">
                          {t('dashboard.activities.signup')}
                        </a>
                      </Button>
                      <a
                        href={`mailto:${selectedItem.data.contactEmail}`}
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        {selectedItem.data.contactEmail}
                      </a>
                    </div>
                  </div>
                </>
              )}

              {selectedItem.type === 'studybook' && (
                <>
                  <DialogHeader>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="w-full sm:w-36 h-48 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-center text-primary shadow-sm">
                        <BookOpen className="w-12 h-12" />
                      </div>
                        <div className="flex-1 space-y-3">
                        <DialogTitle className="text-2xl leading-tight">{selectedItem.data.title}</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                          {t('dashboard.studybooks.author')}: <span className="text-foreground">{selectedItem.data.author}</span>
                        </DialogDescription>
                        <div className="flex flex-wrap gap-2 text-xs text-primary">
                          <span className="rounded-full bg-primary/10 px-3 py-1">
                            {selectedItem.data.pages} {t('dashboard.studybooks.pages')}
                          </span>
                            <span className="rounded-full bg-primary/10 px-3 py-1">
                              {t('dashboard.studybooks.language')}: {selectedItem.data.language}
                            </span>
                        </div>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">{t('dashboard.studybooks.summary')}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedItem.data.summary}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">{t('dashboard.studybooks.topics')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.data.topics.map((topic) => (
                          <span
                            key={topic}
                            className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        asChild
                      >
                        <a href={selectedItem.data.resourceUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {t('dashboard.studybooks.openResource')}
                        </a>
                      </Button>
                      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <BookMarked className="w-4 h-4 text-primary" />
                        {selectedItem.data.format}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <MatrixBackground />
      <LanguageSwitcher />

      <SidebarProvider defaultOpen={true} className="relative z-10 flex h-full">
        <DashboardContent />
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
