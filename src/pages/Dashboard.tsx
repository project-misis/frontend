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
  students: number;
  telegram: string;
  email: string;
};

const MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    expertise: 'Frontend Development',
    description: 'Senior React developer with 8+ years of experience. Specialized in modern web technologies and UI/UX design.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    students: 124,
    telegram: '@sarahchen_dev',
    email: 'sarah.chen@example.com',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    expertise: 'Data Science',
    description: 'Data scientist and ML engineer. Expert in Python, TensorFlow, and building scalable data pipelines.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    students: 98,
    telegram: '@mrodriguez_ds',
    email: 'michael.rodriguez@example.com',
  },
  {
    id: '3',
    name: 'Emma Thompson',
    expertise: 'Backend Development',
    description: 'Full-stack engineer specializing in Node.js, Go, and cloud architecture. AWS certified solutions architect.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    students: 156,
    telegram: '@emmathompson_dev',
    email: 'emma.thompson@example.com',
  },
  {
    id: '4',
    name: 'James Park',
    expertise: 'Mobile Development',
    description: 'iOS and Android developer with expertise in React Native and Flutter. Published 20+ apps on app stores.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    students: 87,
    telegram: '@jamespark_mobile',
    email: 'james.park@example.com',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    expertise: 'DevOps & Cloud',
    description: 'DevOps engineer with expertise in Kubernetes, Docker, and CI/CD pipelines. Helping teams scale infrastructure.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    students: 112,
    telegram: '@lisaanderson_devops',
    email: 'lisa.anderson@example.com',
  },
  {
    id: '6',
    name: 'David Kim',
    expertise: 'Cybersecurity',
    description: 'Security expert with 10+ years in penetration testing and secure coding practices. CISSP certified.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    students: 76,
    telegram: '@davidkim_security',
    email: 'david.kim@example.com',
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
    title: 'Cross-Cultural Hackathon',
    focus: 'Innovation Sprint',
    description:
      '48-hour online hackathon pairing international students with seasoned mentors to build impactful prototypes addressing global education challenges.',
    date: 'March 22–24, 2026',
    time: '09:00 – 21:00 GMT',
    location: 'Remote • GatherTown',
    host: 'Global Mentorship Alliance',
    signupLink: 'https://example.com/events/hackathon',
    contactEmail: 'events@mentorship.io',
  },
  {
    id: 'a2',
    title: 'Career Accelerator Workshop',
    focus: 'Job Market',
    description:
      'Interactive workshop covering portfolio reviews, live mock interviews, and market insights for tech roles across Europe, Asia, and North America.',
    date: 'April 12, 2026',
    time: '15:00 – 18:30 CET',
    location: 'Hybrid • Berlin & Zoom',
    host: 'International Career Lab',
    signupLink: 'https://example.com/events/career-accelerator',
    contactEmail: 'careerlab@mentorship.io',
  },
  {
    id: 'a3',
    title: 'Monthly Mentor Roundtable',
    focus: 'Community',
    description:
      'Roundtable discussion where mentors share best practices, success stories, and actionable frameworks for supporting intercultural mentee journeys.',
    date: 'First Thursday of every month',
    time: '19:00 – 20:30 JST',
    location: 'Remote • Google Meet',
    host: 'Mentor Council',
    signupLink: 'https://example.com/events/roundtable',
    contactEmail: 'council@mentorship.io',
  },
];

type Studybook = {
  id: string;
  title: string;
  author: string;
  summary: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
  format: 'PDF' | 'Notion' | 'Slide Deck' | 'Interactive';
  pages: number;
  coverUrl: string;
  resourceUrl: string;
};

const STUDYBOOKS: Studybook[] = [
  {
    id: 's1',
    title: 'Global Product Design Playbook',
    author: 'Dr. Ana Silva',
    summary:
      'Comprehensive guide to building inclusive digital products for multicultural audiences, covering research, design systems, and localization tactics.',
    level: 'Advanced',
    topics: ['UX Research', 'Localization', 'Design Systems'],
    format: 'PDF',
    pages: 186,
    coverUrl: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=800&q=80',
    resourceUrl: 'https://example.com/resources/design-playbook.pdf',
  },
  {
    id: 's2',
    title: 'Data Storytelling Toolkit',
    author: 'Mentorship Analytics Guild',
    summary:
      'Interactive Notion workspace with templates, dashboards, and workshops for turning raw data into compelling narratives for mentees and stakeholders.',
    level: 'Intermediate',
    topics: ['Data Visualization', 'Narrative Design', 'Workshops'],
    format: 'Notion',
    pages: 74,
    coverUrl: 'https://images.unsplash.com/photo-1523473827534-08621aa93b3b?auto=format&fit=crop&w=800&q=80',
    resourceUrl: 'https://example.com/resources/data-storytelling',
  },
  {
    id: 's3',
    title: 'Remote Mentorship Starter Kit',
    author: 'Global Mentorship Alliance',
    summary:
      'Step-by-step toolkit for launching remote mentorship cohorts, including onboarding guides, session agendas, and cultural sensitivity checklists.',
    level: 'Beginner',
    topics: ['Remote Work', 'Program Design', 'Cultural Intelligence'],
    format: 'Interactive',
    pages: 92,
    coverUrl: 'https://images.unsplash.com/photo-1523473827534-48202b6cdb62?auto=format&fit=crop&w=800&q=80',
    resourceUrl: 'https://example.com/resources/mentorship-starter-kit',
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
                            <span>{mentor.students} {t('dashboard.mentors.students')}</span>
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
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden border border-primary/20 shadow-sm">
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <CardTitle className="text-lg leading-tight line-clamp-2">{book.title}</CardTitle>
                          <div className="text-xs text-muted-foreground">{book.author}</div>
                          <div className="flex flex-wrap gap-2 text-xs text-primary">
                            <span className="rounded-full bg-primary/10 px-3 py-1">{book.level}</span>
                            <span className="rounded-full bg-primary/10 px-3 py-1">{book.format}</span>
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
                          {selectedItem.data.students} {t('dashboard.mentors.students')}
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
                      <div className="relative w-full sm:w-36 h-48 rounded-xl overflow-hidden border border-primary/20 shadow-sm">
                        <img
                          src={selectedItem.data.coverUrl}
                          alt={selectedItem.data.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <DialogTitle className="text-2xl leading-tight">{selectedItem.data.title}</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                          {t('dashboard.studybooks.author')}: <span className="text-foreground">{selectedItem.data.author}</span>
                        </DialogDescription>
                        <div className="flex flex-wrap gap-2 text-xs text-primary">
                          <span className="rounded-full bg-primary/10 px-3 py-1">
                            {t('dashboard.studybooks.level')}: {selectedItem.data.level}
                          </span>
                          <span className="rounded-full bg-primary/10 px-3 py-1">
                            {t('dashboard.studybooks.format')}: {selectedItem.data.format}
                          </span>
                          <span className="rounded-full bg-primary/10 px-3 py-1">
                            {selectedItem.data.pages} {t('dashboard.studybooks.pages')}
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
                        {t('dashboard.studybooks.formatLabel', { format: selectedItem.data.format })}
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

