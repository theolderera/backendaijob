import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env') });

import { User, UserRole } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Experience } from '../experience/entities/experience.entity';
import { Education } from '../education/entities/education.entity';
import { Skill } from '../skills/entities/skill.entity';
import { UserSkill } from '../skills/entities/user-skill.entity';
import { Language } from '../languages/entities/language.entity';
import { ProfileLanguage } from '../languages/entities/profile-language.entity';
import { Post } from '../posts/entities/post.entity';
import { Like } from '../posts/entities/like.entity';
import { Comment } from '../posts/entities/comment.entity';
import { Connection, ConnectionStatus } from '../connections/entities/connection.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { Message } from '../messages/entities/message.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { Job } from '../jobs/entities/job.entity';
import { JobApplication, ApplicationStatus } from '../job-applications/entities/job-application.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { OrgMember } from '../organizations/entities/org-member.entity';

const AppDataSource = new DataSource({
  type: 'better-sqlite3' as any,
  database: process.env.DB_PATH ?? './database.sqlite',
  entities: [
    User, Profile, Experience, Education,
    Skill, UserSkill, Language, ProfileLanguage,
    Post, Like, Comment,
    Connection, Conversation, Message,
    Notification, Job, JobApplication,
    Organization, OrgMember,
  ],
  synchronize: true,
  logging: false,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('📦 Database connected. Seeding...');

  // Clear existing data
  await AppDataSource.query('PRAGMA foreign_keys = OFF');
  for (const entity of [
    'likes', 'comments', 'notifications', 'messages', 'conversations',
    'connections', 'job_applications', 'jobs', 'organization_members',
    'organizations', 'profile_languages', 'user_skills', 'user_experiences',
    'user_educations', 'profiles', 'posts', 'users', 'skills', 'languages',
  ]) {
    try { await AppDataSource.query(`DELETE FROM ${entity}`); } catch {}
  }
  await AppDataSource.query('PRAGMA foreign_keys = ON');

  const hash = await bcrypt.hash('password123', 10);

  // ── USERS ──────────────────────────────────────────────────────────────────
  const userRepo = AppDataSource.getRepository(User);
  const usersData = [
    // Org users (5)
    { fullName: 'TechCorp HR', email: 'hr@techcorp.com', role: UserRole.Organization },
    { fullName: 'InnovateLab Team', email: 'team@innovatelab.com', role: UserRole.Organization },
    { fullName: 'CloudBase Inc', email: 'contact@cloudbase.io', role: UserRole.Organization },
    { fullName: 'DesignStudio Co', email: 'hello@designstudio.co', role: UserRole.Organization },
    { fullName: 'DataDriven Corp', email: 'info@datadriven.com', role: UserRole.Organization },
    // Candidate users (10)
    { fullName: 'Alex Johnson', email: 'alex.johnson@email.com', role: UserRole.Candidate },
    { fullName: 'Sara Williams', email: 'sara.w@email.com', role: UserRole.Candidate },
    { fullName: 'Michael Chen', email: 'michael.chen@email.com', role: UserRole.Candidate },
    { fullName: 'Emily Davis', email: 'emily.d@email.com', role: UserRole.Candidate },
    { fullName: 'James Wilson', email: 'james.w@email.com', role: UserRole.Candidate },
    { fullName: 'Olivia Martinez', email: 'olivia.m@email.com', role: UserRole.Candidate },
    { fullName: 'Noah Thompson', email: 'noah.t@email.com', role: UserRole.Candidate },
    { fullName: 'Ava Anderson', email: 'ava.a@email.com', role: UserRole.Candidate },
    { fullName: 'Liam Jackson', email: 'liam.j@email.com', role: UserRole.Candidate },
    { fullName: 'Sophia White', email: 'sophia.w@email.com', role: UserRole.Candidate },
  ];

  const users: User[] = [];
  for (const u of usersData) {
    const user = userRepo.create({ ...u, passwordHash: hash, phoneNumber: '+1-555-0100' });
    users.push(await userRepo.save(user));
  }
  console.log(`✅ Created ${users.length} users`);

  // ── SKILLS ─────────────────────────────────────────────────────────────────
  const skillRepo = AppDataSource.getRepository(Skill);
  const skillNames = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
    'SQL', 'GraphQL', 'Docker', 'Kubernetes', 'AWS',
    'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Figma', 'Agile',
    'Git', 'REST APIs', 'MongoDB', 'PostgreSQL', 'NestJS',
  ];
  const skills: Skill[] = [];
  for (const name of skillNames) {
    skills.push(await skillRepo.save(skillRepo.create({ name })));
  }

  // ── LANGUAGES ──────────────────────────────────────────────────────────────
  const langRepo = AppDataSource.getRepository(Language);
  const langsData = [
    { code: 'en', name: 'English' }, { code: 'ru', name: 'Russian' },
    { code: 'tj', name: 'Tajik' }, { code: 'de', name: 'German' }, { code: 'fr', name: 'French' },
  ];
  const languages: Language[] = [];
  for (const l of langsData) {
    languages.push(await langRepo.save(langRepo.create(l)));
  }

  // ── PROFILES ───────────────────────────────────────────────────────────────
  const profileRepo = AppDataSource.getRepository(Profile);
  const profileData = [
    { headline: 'Head of Engineering at TechCorp', bio: 'Building world-class engineering teams.', location: 'San Francisco, CA', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
    { headline: 'Innovation Lead at InnovateLab', bio: 'Turning ideas into products that matter.', location: 'New York, NY', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
    { headline: 'CTO at CloudBase Inc', bio: 'Cloud-first infrastructure for modern teams.', location: 'Austin, TX', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
    { headline: 'Creative Director at DesignStudio', bio: 'Making beautiful products people love.', location: 'Seattle, WA', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
    { headline: 'Data Science Lead at DataDriven', bio: 'Data-driven decisions for a better world.', location: 'Boston, MA', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
    { headline: 'Senior Frontend Developer', bio: 'Passionate about clean code and great UX. 5+ years building web apps with React and TypeScript.', location: 'San Francisco, CA', avatarUrl: 'https://i.pravatar.cc/150?img=6' },
    { headline: 'Full-Stack Engineer', bio: 'Building scalable applications end-to-end. Open source contributor.', location: 'Chicago, IL', avatarUrl: 'https://i.pravatar.cc/150?img=7' },
    { headline: 'Backend Developer | Node.js Expert', bio: 'API architect with a love for performance optimization.', location: 'Los Angeles, CA', avatarUrl: 'https://i.pravatar.cc/150?img=8' },
    { headline: 'Data Scientist', bio: 'Turning data into insights. Python and ML enthusiast.', location: 'New York, NY', avatarUrl: 'https://i.pravatar.cc/150?img=9' },
    { headline: 'DevOps Engineer', bio: 'Bridging the gap between dev and ops with Kubernetes and AWS.', location: 'Dallas, TX', avatarUrl: 'https://i.pravatar.cc/150?img=10' },
    { headline: 'UX/UI Designer', bio: 'Creating user-centric designs that delight and convert.', location: 'Miami, FL', avatarUrl: 'https://i.pravatar.cc/150?img=11' },
    { headline: 'Mobile Developer (React Native)', bio: 'Cross-platform mobile apps for iOS and Android.', location: 'Portland, OR', avatarUrl: 'https://i.pravatar.cc/150?img=12' },
    { headline: 'Machine Learning Engineer', bio: 'Building intelligent systems with PyTorch and TensorFlow.', location: 'Seattle, WA', avatarUrl: 'https://i.pravatar.cc/150?img=13' },
    { headline: 'Product Manager', bio: 'Shipping products users love, on time and under budget.', location: 'Austin, TX', avatarUrl: 'https://i.pravatar.cc/150?img=14' },
    { headline: 'Cloud Architect', bio: 'Designing resilient cloud architectures on AWS and GCP.', location: 'Denver, CO', avatarUrl: 'https://i.pravatar.cc/150?img=15' },
  ];

  const profiles: Profile[] = [];
  for (let i = 0; i < users.length; i++) {
    const p = profileRepo.create({ userId: users[i].id, ...profileData[i] });
    profiles.push(await profileRepo.save(p));
  }
  console.log(`✅ Created ${profiles.length} profiles`);

  // ── ORGANIZATIONS ──────────────────────────────────────────────────────────
  const orgRepo = AppDataSource.getRepository(Organization);
  const orgsData = [
    { name: 'TechCorp', description: 'Building the future of software.', industry: 'Technology', location: 'San Francisco, CA', website: 'https://techcorp.example.com', logoUrl: 'https://picsum.photos/seed/techcorp/100/100' },
    { name: 'InnovateLab', description: 'Where innovation meets execution.', industry: 'Research & Development', location: 'New York, NY', website: 'https://innovatelab.example.com', logoUrl: 'https://picsum.photos/seed/innovate/100/100' },
    { name: 'CloudBase Inc', description: 'Cloud infrastructure simplified.', industry: 'Cloud Services', location: 'Austin, TX', website: 'https://cloudbase.example.com', logoUrl: 'https://picsum.photos/seed/cloud/100/100' },
    { name: 'DesignStudio', description: 'Crafting beautiful digital experiences.', industry: 'Design', location: 'Seattle, WA', website: 'https://designstudio.example.com', logoUrl: 'https://picsum.photos/seed/design/100/100' },
    { name: 'DataDriven Corp', description: 'Analytics and data intelligence.', industry: 'Data & Analytics', location: 'Boston, MA', website: 'https://datadriven.example.com', logoUrl: 'https://picsum.photos/seed/data/100/100' },
  ];

  const orgs: Organization[] = [];
  for (let i = 0; i < 5; i++) {
    const org = orgRepo.create({ ...orgsData[i], ownerId: users[i].id });
    orgs.push(await orgRepo.save(org));
  }
  console.log(`✅ Created ${orgs.length} organizations`);

  // ── USER SKILLS ────────────────────────────────────────────────────────────
  const userSkillRepo = AppDataSource.getRepository(UserSkill);
  const candidateUsers = users.slice(5);
  const skillSets = [
    [0, 1, 2, 3],       // Alex: JS, TS, React, Node.js
    [0, 2, 6, 16],      // Sara: JS, React, GraphQL, REST APIs
    [3, 19, 9, 17],     // Michael: Node.js, NestJS, AWS, MongoDB
    [4, 10, 11, 5],     // Emily: Python, ML, Data Analysis, SQL
    [7, 8, 9, 15],      // James: Docker, K8s, AWS, Git
    [12, 13, 1, 2],     // Olivia: UI/UX, Figma, TS, React
    [2, 0, 3, 16],      // Noah: React, JS, Node.js, REST APIs
    [4, 10, 5, 18],     // Ava: Python, ML, SQL, PostgreSQL
    [1, 3, 19, 9],      // Liam: TS, Node.js, NestJS, AWS
    [12, 13, 2, 14],    // Sophia: UI/UX, Figma, React, Agile
  ];

  for (let i = 0; i < candidateUsers.length; i++) {
    for (const skillIdx of skillSets[i]) {
      await userSkillRepo.save(
        userSkillRepo.create({ userId: candidateUsers[i].id, skillId: skills[skillIdx].id }),
      );
    }
  }
  console.log('✅ Created user skills');

  // ── PROFILE LANGUAGES ──────────────────────────────────────────────────────
  const plRepo = AppDataSource.getRepository(ProfileLanguage);
  for (let i = 0; i < profiles.length; i++) {
    await plRepo.save(plRepo.create({ profileId: profiles[i].id, languageId: languages[0].id, level: 'Native' }));
    if (i % 3 === 0) {
      await plRepo.save(plRepo.create({ profileId: profiles[i].id, languageId: languages[1].id, level: 'Intermediate' }));
    }
  }
  console.log('✅ Created profile languages');

  // ── EXPERIENCE ─────────────────────────────────────────────────────────────
  const expRepo = AppDataSource.getRepository(Experience);
  for (const user of candidateUsers) {
    await expRepo.save(expRepo.create({
      userId: user.id, title: 'Senior Developer', company: 'Previous Company',
      location: 'Remote', startDate: '2021-01', endDate: '2023-12',
      isCurrent: false, description: 'Led frontend development for multiple products.',
    }));
    await expRepo.save(expRepo.create({
      userId: user.id, title: 'Junior Developer', company: 'Startup Inc',
      location: 'New York', startDate: '2019-06', endDate: '2020-12',
      isCurrent: false, description: 'Built REST APIs and React components.',
    }));
  }
  console.log('✅ Created experiences');

  // ── EDUCATION ──────────────────────────────────────────────────────────────
  const eduRepo = AppDataSource.getRepository(Education);
  const degrees = ['B.S. Computer Science', 'B.S. Software Engineering', 'B.A. Information Technology', 'M.S. Data Science'];
  const schools = ['MIT', 'Stanford University', 'UC Berkeley', 'Carnegie Mellon', 'Georgia Tech'];
  for (let i = 0; i < candidateUsers.length; i++) {
    await eduRepo.save(eduRepo.create({
      userId: candidateUsers[i].id,
      institution: schools[i % schools.length],
      degree: degrees[i % degrees.length],
      field: 'Computer Science',
      startDate: '2015-09',
      endDate: '2019-05',
      description: 'Graduated with honors.',
    }));
  }
  console.log('✅ Created educations');

  // ── JOBS ───────────────────────────────────────────────────────────────────
  const jobRepo = AppDataSource.getRepository(Job);
  const jobsData = [
    { title: 'Senior React Developer', description: 'We need an experienced React developer proficient in TypeScript, hooks, and modern state management to lead our frontend team.', location: 'San Francisco, CA', employmentType: 'Full-Time', experienceLevel: 'Senior', salary: '$120k-$150k/year' },
    { title: 'Node.js Backend Engineer', description: 'Join our backend team to build scalable REST APIs and microservices using Node.js, NestJS, and PostgreSQL.', location: 'Remote', employmentType: 'Full-Time', experienceLevel: 'Middle', salary: '$100k-$130k/year' },
    { title: 'Product Designer', description: 'Design beautiful user experiences for our SaaS products using Figma. UI/UX design experience required.', location: 'New York, NY', employmentType: 'Full-Time', experienceLevel: 'Middle', salary: '$90k-$110k/year' },
    { title: 'Cloud Infrastructure Engineer', description: 'Manage and scale our AWS infrastructure. Experience with Kubernetes, Terraform, and CI/CD pipelines essential.', location: 'Austin, TX', employmentType: 'Full-Time', experienceLevel: 'Senior', salary: '$130k-$160k/year' },
    { title: 'Data Scientist', description: 'Build machine learning models and data pipelines. Proficiency in Python, pandas, and scikit-learn required.', location: 'Boston, MA', employmentType: 'Full-Time', experienceLevel: 'Middle', salary: '$110k-$140k/year' },
    { title: 'Full-Stack Engineer (TypeScript)', description: 'Work across the stack with React on the frontend and NestJS/Node on the backend. We love TypeScript.', location: 'Remote', employmentType: 'Full-Time', experienceLevel: 'Middle', salary: '$100k-$130k/year' },
    { title: 'Mobile Developer (React Native)', description: 'Build cross-platform mobile apps for our growing user base. React Native and TypeScript expertise required.', location: 'Los Angeles, CA', employmentType: 'Full-Time', experienceLevel: 'Middle', salary: '$95k-$120k/year' },
    { title: 'DevOps Engineer', description: 'Streamline our CI/CD pipeline and manage Docker/Kubernetes clusters on AWS.', location: 'Dallas, TX', employmentType: 'Full-Time', experienceLevel: 'Senior', salary: '$115k-$145k/year' },
    { title: 'Junior Frontend Developer', description: 'Great opportunity for a junior dev to grow with us. React and JavaScript fundamentals required.', location: 'San Francisco, CA', employmentType: 'Full-Time', experienceLevel: 'Junior', salary: '$60k-$80k/year' },
    { title: 'Machine Learning Engineer', description: 'Join our AI team to build and deploy production ML models. TensorFlow/PyTorch experience needed.', location: 'Seattle, WA', employmentType: 'Full-Time', experienceLevel: 'Senior', salary: '$140k-$170k/year' },
    { title: 'UI/UX Designer (Figma)', description: 'Design and prototype user interfaces for our design system. Deep Figma expertise and eye for detail.', location: 'Seattle, WA', employmentType: 'Full-Time', experienceLevel: 'Middle', salary: '$85k-$105k/year' },
    { title: 'Backend Developer (Python)', description: 'Build data pipelines and APIs using Python. Django or FastAPI experience preferred.', location: 'Boston, MA', employmentType: 'Full-Time', experienceLevel: 'Middle', salary: '$95k-$125k/year' },
    { title: 'Technical Lead', description: 'Lead a team of 5 engineers. Architecture decisions, code reviews, and roadmap planning. Strong Node.js and system design background.', location: 'New York, NY', employmentType: 'Full-Time', experienceLevel: 'Expert', salary: '$150k-$200k/year' },
    { title: 'Frontend Engineer (Vue.js)', description: 'Build responsive SPAs with Vue.js. TypeScript and modern CSS required.', location: 'Remote', employmentType: 'Contract', experienceLevel: 'Middle', salary: '$80/hour' },
    { title: 'Freelance GraphQL Developer', description: 'Contract role for GraphQL API development with Apollo Server and TypeScript.', location: 'Remote', employmentType: 'Freelance', experienceLevel: 'Middle', salary: '$70/hour' },
  ];

  const jobs: Job[] = [];
  for (let i = 0; i < jobsData.length; i++) {
    const org = orgs[i % orgs.length];
    const job = jobRepo.create({ ...jobsData[i], organizationId: org.id });
    jobs.push(await jobRepo.save(job));
  }
  console.log(`✅ Created ${jobs.length} jobs`);

  // ── POSTS ──────────────────────────────────────────────────────────────────
  const postRepo = AppDataSource.getRepository(Post);
  const postsData = [
    { content: '🚀 Excited to announce that we just launched our new product! After months of hard work, our team delivered something truly amazing. Proud of everyone involved! #ProductLaunch #Tech', userId: users[0].id, imageUrl: 'https://picsum.photos/seed/post1/800/400' },
    { content: 'Just finished reading "Clean Code" by Robert Martin. Every developer should read this book. Key takeaway: write code for humans first, computers second. What\'s your favorite programming book? 📚', userId: users[5].id },
    { content: 'Hot take: TypeScript is not optional anymore. If you\'re starting a new project in 2024 without TypeScript, you\'re setting yourself up for pain. The type safety alone saves hours of debugging. Agree or disagree? 🤔', userId: users[6].id },
    { content: 'We\'re hiring! 🎯 Looking for senior React developers to join our growing team at TechCorp. DM me or apply at our careers page. Great benefits, remote-friendly culture. #Hiring #ReactJS', userId: users[0].id },
    { content: 'TIL: CSS grid can do basically everything you\'ve been using JavaScript for in layouts. If you\'re still using JS for anything layout-related, check out CSS grid and subgrid. Mind-blowing stuff. 💡', userId: users[7].id },
    { content: 'Passed my AWS Solutions Architect exam this morning! 🎉 3 months of studying, 500+ practice questions, and finally got it. If anyone is preparing for it, happy to share resources. #AWS #CertificationJourney', userId: users[9].id, imageUrl: 'https://picsum.photos/seed/post6/800/400' },
    { content: 'The difference between a senior and junior developer isn\'t just years of experience. It\'s the ability to ask the right questions, know when NOT to code, and think about long-term maintainability.', userId: users[5].id },
    { content: '📊 Our latest data shows remote work productivity is up 23% vs pre-pandemic office work. Yet companies are still mandating return to office. What\'s your take on RTO policies? #RemoteWork #FutureOfWork', userId: users[1].id },
    { content: 'Open source tip: if you want to contribute to major OSS projects, start by fixing documentation bugs. It builds context about the codebase and makes future code contributions 10x easier. #OpenSource', userId: users[8].id },
    { content: 'Kubernetes is amazing until it\'s not. Spent 4 hours yesterday debugging a CrashLoopBackOff only to realize it was a missing environment variable. Always check the simple things first! 😅 #DevOps #K8s', userId: users[9].id },
    { content: 'Sharing a lesson from my career: say yes to stretch assignments early on. The discomfort of doing something you\'re not sure about is exactly where growth happens. Embrace the uncomfortable.', userId: users[10].id },
    { content: '🎨 Just shipped our new design system! 200+ components, full dark mode support, and accessibility-first. Built with Figma and React. It\'s been 6 months in the making. Check it out! #DesignSystem #UI', userId: users[3].id, imageUrl: 'https://picsum.photos/seed/post12/800/400' },
    { content: 'PSA: Stop using console.log for debugging in 2024. Learn to use the browser debugger or VS Code debugger. Set breakpoints, inspect call stacks, watch variables. It will change your life.', userId: users[6].id },
    { content: 'Machine learning models are only as good as their training data. We spent 3x more time cleaning data than building the model. Data quality > model complexity. #MachineLearning #DataScience', userId: users[8].id },
    { content: 'Interviewed 50+ candidates last quarter. The #1 thing that sets great candidates apart: they ask thoughtful questions about the team, culture, and technical challenges. Prepare your questions! #JobSearch', userId: users[2].id },
    { content: '🌱 Mentorship matters. I wouldn\'t be where I am today without my mentor at my first job. If you have 1 hour per month, find a junior developer to mentor. The impact is immeasurable. #Mentorship', userId: users[5].id },
    { content: 'We just open-sourced our internal CLI tool for deployment automation. 1000+ stars on GitHub in the first week! The developer community is incredible. #OpenSource #DevTools', userId: users[4].id },
    { content: 'GraphQL vs REST: I\'ve used both extensively. For most CRUD apps, REST is simpler. GraphQL shines when clients have wildly different data needs. Don\'t use GraphQL just because it\'s trendy.', userId: users[7].id },
    { content: 'Career advice from someone who\'s been rejected 30+ times: each rejection is feedback, not failure. Keep a list of what you learned from each interview. Progress compounds. #CareerAdvice #JobSearch', userId: users[11].id },
    { content: 'New blog post: "How we reduced our API response time by 60% using Redis caching and database query optimization." Link in comments! #Performance #Backend #NodeJS', userId: users[6].id, imageUrl: 'https://picsum.photos/seed/post20/800/400' },
    { content: 'Accessibility is not a feature — it\'s a requirement. If your app doesn\'t work with a screen reader, you\'re excluding millions of users. Start with semantic HTML and ARIA labels. #A11y #WebDev', userId: users[10].id },
    { content: 'Just hit 5 years at InnovateLab! 🎂 What started as a 3-person startup is now a team of 80. Grateful for every challenge, every failure, and every success along the way. Here\'s to the next 5!', userId: users[1].id },
    { content: 'The hardest part of software engineering isn\'t writing code. It\'s understanding the problem well enough to write the right code. Spend 50% of your time on problem definition. #SoftwareEngineering', userId: users[5].id },
    { content: 'Excited to share: our AI model just achieved 94% accuracy on the benchmark dataset! 6 months of iteration, hyperparameter tuning, and feature engineering. The team crushed it. 🤖 #AI #MachineLearning', userId: users[4].id, imageUrl: 'https://picsum.photos/seed/post24/800/400' },
    { content: 'Tech interview tip: talk through your thought process out loud. Interviewers care more about HOW you think than whether you get the perfect answer. A wrong answer with great reasoning > silent right answer.', userId: users[12].id },
    { content: 'Docker compose has made local development so much better. Spin up your entire stack with one command. If your team still has "it works on my machine" problems, containerize everything. #Docker #DevOps', userId: users[9].id },
    { content: 'We\'re launching a free mentorship program for early-career developers! 10 spots available, 3-month commitment. Applications open next Monday. DM me for details. #Mentorship #CareerDevelopment', userId: users[0].id },
    { content: 'Soft skills tip: learn to write clear, concise technical documentation. Engineers who can communicate complex ideas simply are 10x more effective than those who can\'t. #SoftSkills #TechWriting', userId: users[13].id },
    { content: 'After 2 years of remote work, I finally set up a proper home office. Standing desk, dual monitors, good lighting. Productivity has increased noticeably. What\'s your home office setup? 🖥️', userId: users[8].id, imageUrl: 'https://picsum.photos/seed/post29/800/400' },
    { content: 'Unpopular opinion: most microservices architectures are overengineered for their scale. Start with a well-structured monolith. Extract services when you hit real scaling problems, not imaginary ones.', userId: users[7].id },
  ];

  const posts: Post[] = [];
  for (const pd of postsData) {
    posts.push(await postRepo.save(postRepo.create(pd)));
  }
  console.log(`✅ Created ${posts.length} posts`);

  // ── LIKES ──────────────────────────────────────────────────────────────────
  const likeRepo = AppDataSource.getRepository(Like);
  const likePairs: [number, number][] = [
    [0, 1], [0, 2], [1, 0], [1, 3], [2, 1], [2, 4], [3, 0], [3, 2],
    [4, 1], [4, 5], [5, 3], [5, 6], [6, 4], [6, 7], [7, 5], [7, 8],
    [8, 6], [8, 9], [9, 7], [9, 10], [10, 8], [10, 11], [11, 9], [11, 12],
    [12, 10], [12, 13], [13, 11], [13, 14], [14, 12], [14, 0],
    [0, 15], [1, 16], [2, 17], [3, 18], [4, 19], [5, 20], [6, 21], [7, 22], [8, 23], [9, 24],
    [10, 25], [11, 26], [12, 27], [13, 28], [14, 29],
  ];
  for (const [uIdx, pIdx] of likePairs) {
    if (pIdx < posts.length && uIdx < users.length) {
      try {
        await likeRepo.save(likeRepo.create({ userId: users[uIdx].id, postId: posts[pIdx].id }));
      } catch {}
    }
  }
  console.log('✅ Created likes');

  // ── COMMENTS ───────────────────────────────────────────────────────────────
  const commentRepo = AppDataSource.getRepository(Comment);
  const commentsData = [
    { postIdx: 0, userIdx: 5, content: 'Congratulations! This is amazing news. What was the biggest technical challenge during the launch?' },
    { postIdx: 0, userIdx: 6, content: 'Fantastic work! Looking forward to trying it out.' },
    { postIdx: 1, userIdx: 7, content: '"A Pragmatic Programmer" by Hunt & Thomas is also great. Changed how I think about software development.' },
    { postIdx: 2, userIdx: 8, content: '100% agree. Started a project without TypeScript last year and deeply regret it. Type errors caught at compile time saved us countless bugs.' },
    { postIdx: 2, userIdx: 9, content: 'TypeScript can be overkill for small scripts but absolutely essential for anything team-built.' },
    { postIdx: 3, userIdx: 5, content: 'This is exactly the role I\'ve been looking for! Sending my application now.' },
    { postIdx: 5, userIdx: 10, content: 'Congratulations!! Which resources did you use for studying? I\'m preparing for the same exam.' },
    { postIdx: 5, userIdx: 11, content: 'That\'s huge! AWS SAA is one of the toughest certs. Well deserved!' },
    { postIdx: 7, userIdx: 5, content: 'The data is clear but corporate culture is hard to change. Companies invest in real estate and don\'t want to admit it\'s not needed.' },
    { postIdx: 9, userIdx: 6, content: 'The struggle is real. K8s is incredible once it works but the debugging can be brutal. +1 for checking env vars first!' },
    { postIdx: 11, userIdx: 12, content: 'This is beautiful! Can you share more about the component architecture? Especially interested in how you handled the theming.' },
    { postIdx: 14, userIdx: 7, content: 'Question preparation is underrated advice. I landed my current job largely because of the questions I asked at the end.' },
    { postIdx: 16, userIdx: 8, content: 'Just starred it on GitHub! Can\'t wait to try this. Does it support multi-environment deployments?' },
    { postIdx: 19, userIdx: 9, content: 'Great write-up! Did you also try CDN caching on top of Redis? We got another 40% improvement that way.' },
    { postIdx: 21, userIdx: 5, content: '5 years and still going strong! Here\'s to many more. InnovateLab has been an inspiration in the industry.' },
  ];

  for (const c of commentsData) {
    if (c.postIdx < posts.length && c.userIdx < users.length) {
      await commentRepo.save(commentRepo.create({
        postId: posts[c.postIdx].id,
        userId: users[c.userIdx].id,
        content: c.content,
      }));
    }
  }
  console.log('✅ Created comments');

  // ── CONNECTIONS ────────────────────────────────────────────────────────────
  const connRepo = AppDataSource.getRepository(Connection);
  const connectionPairs = [
    [5, 6, ConnectionStatus.Accepted],
    [5, 7, ConnectionStatus.Accepted],
    [6, 8, ConnectionStatus.Accepted],
    [7, 9, ConnectionStatus.Accepted],
    [8, 10, ConnectionStatus.Accepted],
    [9, 11, ConnectionStatus.Accepted],
    [10, 12, ConnectionStatus.Accepted],
    [11, 13, ConnectionStatus.Accepted],
    [12, 14, ConnectionStatus.Accepted],
    [5, 8, ConnectionStatus.Accepted],
    [6, 11, ConnectionStatus.Accepted],
    [7, 12, ConnectionStatus.Accepted],
    [5, 9, ConnectionStatus.Pending],
    [6, 10, ConnectionStatus.Pending],
    [7, 13, ConnectionStatus.Pending],
  ] as [number, number, ConnectionStatus][];

  for (const [rIdx, aIdx, status] of connectionPairs) {
    try {
      await connRepo.save(connRepo.create({
        requesterId: users[rIdx].id,
        addresseeId: users[aIdx].id,
        status,
      }));
    } catch {}
  }
  console.log('✅ Created connections');

  // ── CONVERSATIONS & MESSAGES ───────────────────────────────────────────────
  const convRepo = AppDataSource.getRepository(Conversation);
  const msgRepo = AppDataSource.getRepository(Message);

  const conversations = [
    { user1Id: users[5].id, user2Id: users[6].id },
    { user1Id: users[7].id, user2Id: users[8].id },
    { user1Id: users[5].id, user2Id: users[0].id },
  ];

  const conversationMessages = [
    [
      { sender: 5, content: 'Hey Alex! I saw your post about TypeScript — couldn\'t agree more!' },
      { sender: 6, content: 'Thanks Sara! Have you fully migrated to TS on your current project?' },
      { sender: 5, content: 'Yes, about 80% done. The migration is painful but worth it.' },
      { sender: 6, content: 'Same here. We used ts-migrate to automate most of it. Saved days.' },
      { sender: 5, content: 'Oh nice, I hadn\'t heard of ts-migrate. Will check it out!' },
    ],
    [
      { sender: 7, content: 'Hi! I saw you\'re hiring for a Node.js role at TechCorp?' },
      { sender: 8, content: 'Yes! Are you interested?' },
      { sender: 7, content: 'Very much so. I\'ve been working with Node.js and NestJS for 4 years.' },
      { sender: 8, content: 'Perfect fit! Send me your resume and I\'ll fast-track your application.' },
    ],
    [
      { sender: 5, content: 'Hello! I\'m interested in the React Developer position you posted.' },
      { sender: 0, content: 'Great! Can you tell me about your React experience?' },
      { sender: 5, content: 'I\'ve been working with React for 5 years, including hooks, context, and Redux Toolkit.' },
      { sender: 0, content: 'Impressive! When would you be available for an interview?' },
      { sender: 5, content: 'I\'m flexible. Any day next week works for me.' },
      { sender: 0, content: 'Great, let\'s schedule Tuesday at 2pm EST. I\'ll send a calendar invite.' },
    ],
  ];

  for (let i = 0; i < conversations.length; i++) {
    const conv = await convRepo.save(convRepo.create(conversations[i]));
    for (const msg of conversationMessages[i]) {
      await msgRepo.save(msgRepo.create({
        conversationId: conv.id,
        senderId: users[msg.sender].id,
        content: msg.content,
      }));
    }
  }
  console.log('✅ Created conversations & messages');

  // ── JOB APPLICATIONS ───────────────────────────────────────────────────────
  const appRepo = AppDataSource.getRepository(JobApplication);
  const applicationData = [
    { userIdx: 5, jobIdx: 0, status: ApplicationStatus.Interview },
    { userIdx: 5, jobIdx: 5, status: ApplicationStatus.Pending },
    { userIdx: 6, jobIdx: 1, status: ApplicationStatus.Accepted },
    { userIdx: 6, jobIdx: 5, status: ApplicationStatus.Pending },
    { userIdx: 7, jobIdx: 1, status: ApplicationStatus.Pending },
    { userIdx: 7, jobIdx: 7, status: ApplicationStatus.Rejected },
    { userIdx: 8, jobIdx: 4, status: ApplicationStatus.Pending },
    { userIdx: 8, jobIdx: 9, status: ApplicationStatus.Interview },
    { userIdx: 9, jobIdx: 3, status: ApplicationStatus.Pending },
    { userIdx: 9, jobIdx: 7, status: ApplicationStatus.Accepted },
    { userIdx: 10, jobIdx: 2, status: ApplicationStatus.Pending },
    { userIdx: 10, jobIdx: 10, status: ApplicationStatus.Pending },
    { userIdx: 11, jobIdx: 5, status: ApplicationStatus.Interview },
    { userIdx: 12, jobIdx: 9, status: ApplicationStatus.Pending },
    { userIdx: 13, jobIdx: 2, status: ApplicationStatus.Accepted },
    { userIdx: 14, jobIdx: 3, status: ApplicationStatus.Pending },
    { userIdx: 5, jobIdx: 8, status: ApplicationStatus.Rejected },
    { userIdx: 6, jobIdx: 0, status: ApplicationStatus.Pending },
    { userIdx: 7, jobIdx: 5, status: ApplicationStatus.Pending },
    { userIdx: 8, jobIdx: 11, status: ApplicationStatus.Interview },
  ];

  for (const a of applicationData) {
    if (a.jobIdx < jobs.length && a.userIdx < users.length) {
      try {
        await appRepo.save(appRepo.create({
          userId: users[a.userIdx].id,
          jobId: jobs[a.jobIdx].id,
          status: a.status,
          coverLetter: 'I am very excited about this opportunity and believe my skills and experience make me an ideal candidate.',
        }));
      } catch {}
    }
  }
  console.log('✅ Created job applications');

  // ── NOTIFICATIONS ──────────────────────────────────────────────────────────
  const notifRepo = AppDataSource.getRepository(Notification);
  const notifsData = [
    { userIdx: 5, title: 'New connection request', message: 'Alex Johnson wants to connect with you.', type: 'connection', link: '/network' },
    { userIdx: 5, title: 'Someone liked your post', message: 'Michael Chen liked your post about TypeScript.', type: 'like', link: '/' },
    { userIdx: 5, title: 'Application update', message: 'Your application for Senior React Developer is now in Interview stage.', type: 'job', link: '/jobs/1' },
    { userIdx: 6, title: 'Connection accepted', message: 'Sara Williams accepted your connection request.', type: 'connection', link: '/profile/6' },
    { userIdx: 6, title: 'New comment on your post', message: 'James Wilson commented on your TypeScript post.', type: 'comment', link: '/' },
    { userIdx: 7, title: 'Application update', message: 'Your application for Node.js Backend Engineer was accepted!', type: 'job', link: '/jobs/2' },
    { userIdx: 8, title: 'New connection request', message: 'Liam Jackson wants to connect.', type: 'connection', link: '/network' },
    { userIdx: 9, title: 'Someone liked your post', message: 'Your AWS certification post received 15 likes!', type: 'like', link: '/' },
    { userIdx: 10, title: 'New message', message: 'Alex Johnson sent you a message.', type: 'message', link: '/messages' },
    { userIdx: 5, title: 'Job recommendation', message: 'New job matching your profile: Full-Stack Engineer at CloudBase Inc.', type: 'job', link: '/jobs' },
    { userIdx: 6, title: 'New job posted', message: 'TechCorp posted a new React Developer position.', type: 'job', link: '/jobs' },
    { userIdx: 7, title: 'Profile viewed', message: '5 people viewed your profile this week.', type: 'general', link: '/profile/8' },
  ];

  for (const n of notifsData) {
    await notifRepo.save(notifRepo.create({
      userId: users[n.userIdx].id,
      title: n.title,
      message: n.message,
      type: n.type,
      link: n.link,
      isRead: Math.random() > 0.5,
    }));
  }
  console.log('✅ Created notifications');

  await AppDataSource.destroy();
  console.log('\n🌱 Database seeded successfully!');
  console.log('📧 Test accounts (all password: password123):');
  console.log('   Candidate: alex.johnson@email.com');
  console.log('   Organization: hr@techcorp.com');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
