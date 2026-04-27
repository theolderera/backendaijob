"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: path.join(__dirname, '../../.env') });
const user_entity_1 = require("../users/entities/user.entity");
const profile_entity_1 = require("../profiles/entities/profile.entity");
const experience_entity_1 = require("../experience/entities/experience.entity");
const education_entity_1 = require("../education/entities/education.entity");
const skill_entity_1 = require("../skills/entities/skill.entity");
const user_skill_entity_1 = require("../skills/entities/user-skill.entity");
const language_entity_1 = require("../languages/entities/language.entity");
const profile_language_entity_1 = require("../languages/entities/profile-language.entity");
const post_entity_1 = require("../posts/entities/post.entity");
const like_entity_1 = require("../posts/entities/like.entity");
const comment_entity_1 = require("../posts/entities/comment.entity");
const connection_entity_1 = require("../connections/entities/connection.entity");
const conversation_entity_1 = require("../conversations/entities/conversation.entity");
const message_entity_1 = require("../messages/entities/message.entity");
const notification_entity_1 = require("../notifications/entities/notification.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const job_application_entity_1 = require("../job-applications/entities/job-application.entity");
const organization_entity_1 = require("../organizations/entities/organization.entity");
const org_member_entity_1 = require("../organizations/entities/org-member.entity");
const AppDataSource = new typeorm_1.DataSource({
    type: 'better-sqlite3',
    database: process.env.DB_PATH ?? './database.sqlite',
    entities: [
        user_entity_1.User, profile_entity_1.Profile, experience_entity_1.Experience, education_entity_1.Education,
        skill_entity_1.Skill, user_skill_entity_1.UserSkill, language_entity_1.Language, profile_language_entity_1.ProfileLanguage,
        post_entity_1.Post, like_entity_1.Like, comment_entity_1.Comment,
        connection_entity_1.Connection, conversation_entity_1.Conversation, message_entity_1.Message,
        notification_entity_1.Notification, job_entity_1.Job, job_application_entity_1.JobApplication,
        organization_entity_1.Organization, org_member_entity_1.OrgMember,
    ],
    synchronize: true,
    logging: false,
});
async function seed() {
    await AppDataSource.initialize();
    console.log('📦 Database connected. Seeding...');
    await AppDataSource.query('PRAGMA foreign_keys = OFF');
    for (const entity of [
        'likes', 'comments', 'notifications', 'messages', 'conversations',
        'connections', 'job_applications', 'jobs', 'organization_members',
        'organizations', 'profile_languages', 'user_skills', 'user_experiences',
        'user_educations', 'profiles', 'posts', 'users', 'skills', 'languages',
    ]) {
        try {
            await AppDataSource.query(`DELETE FROM ${entity}`);
        }
        catch { }
    }
    await AppDataSource.query('PRAGMA foreign_keys = ON');
    const hash = await bcrypt.hash('password123', 10);
    const userRepo = AppDataSource.getRepository(user_entity_1.User);
    const usersData = [
        { fullName: 'TechCorp HR', email: 'hr@techcorp.com', role: user_entity_1.UserRole.Organization },
        { fullName: 'InnovateLab Team', email: 'team@innovatelab.com', role: user_entity_1.UserRole.Organization },
        { fullName: 'CloudBase Inc', email: 'contact@cloudbase.io', role: user_entity_1.UserRole.Organization },
        { fullName: 'DesignStudio Co', email: 'hello@designstudio.co', role: user_entity_1.UserRole.Organization },
        { fullName: 'DataDriven Corp', email: 'info@datadriven.com', role: user_entity_1.UserRole.Organization },
        { fullName: 'Alex Johnson', email: 'alex.johnson@email.com', role: user_entity_1.UserRole.Candidate },
        { fullName: 'Sara Williams', email: 'sara.w@email.com', role: user_entity_1.UserRole.Candidate },
        { fullName: 'Michael Chen', email: 'michael.chen@email.com', role: user_entity_1.UserRole.Candidate },
        { fullName: 'Emily Davis', email: 'emily.d@email.com', role: user_entity_1.UserRole.Candidate },
        { fullName: 'James Wilson', email: 'james.w@email.com', role: user_entity_1.UserRole.Candidate },
        { fullName: 'Olivia Martinez', email: 'olivia.m@email.com', role: user_entity_1.UserRole.Candidate },
        { fullName: 'Noah Thompson', email: 'noah.t@email.com', role: user_entity_1.UserRole.Candidate },
        { fullName: 'Ava Anderson', email: 'ava.a@email.com', role: user_entity_1.UserRole.Candidate },
        { fullName: 'Liam Jackson', email: 'liam.j@email.com', role: user_entity_1.UserRole.Candidate },
        { fullName: 'Sophia White', email: 'sophia.w@email.com', role: user_entity_1.UserRole.Candidate },
    ];
    const users = [];
    for (const u of usersData) {
        const user = userRepo.create({ ...u, passwordHash: hash, phoneNumber: '+1-555-0100' });
        users.push(await userRepo.save(user));
    }
    console.log(`✅ Created ${users.length} users`);
    const skillRepo = AppDataSource.getRepository(skill_entity_1.Skill);
    const skillNames = [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
        'SQL', 'GraphQL', 'Docker', 'Kubernetes', 'AWS',
        'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Figma', 'Agile',
        'Git', 'REST APIs', 'MongoDB', 'PostgreSQL', 'NestJS',
    ];
    const skills = [];
    for (const name of skillNames) {
        skills.push(await skillRepo.save(skillRepo.create({ name })));
    }
    const langRepo = AppDataSource.getRepository(language_entity_1.Language);
    const langsData = [
        { code: 'en', name: 'English' }, { code: 'ru', name: 'Russian' },
        { code: 'tj', name: 'Tajik' }, { code: 'de', name: 'German' }, { code: 'fr', name: 'French' },
    ];
    const languages = [];
    for (const l of langsData) {
        languages.push(await langRepo.save(langRepo.create(l)));
    }
    const profileRepo = AppDataSource.getRepository(profile_entity_1.Profile);
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
    const profiles = [];
    for (let i = 0; i < users.length; i++) {
        const p = profileRepo.create({ userId: users[i].id, ...profileData[i] });
        profiles.push(await profileRepo.save(p));
    }
    console.log(`✅ Created ${profiles.length} profiles`);
    const orgRepo = AppDataSource.getRepository(organization_entity_1.Organization);
    const orgsData = [
        { name: 'TechCorp', description: 'Building the future of software.', industry: 'Technology', location: 'San Francisco, CA', website: 'https://techcorp.example.com', logoUrl: 'https://picsum.photos/seed/techcorp/100/100' },
        { name: 'InnovateLab', description: 'Where innovation meets execution.', industry: 'Research & Development', location: 'New York, NY', website: 'https://innovatelab.example.com', logoUrl: 'https://picsum.photos/seed/innovate/100/100' },
        { name: 'CloudBase Inc', description: 'Cloud infrastructure simplified.', industry: 'Cloud Services', location: 'Austin, TX', website: 'https://cloudbase.example.com', logoUrl: 'https://picsum.photos/seed/cloud/100/100' },
        { name: 'DesignStudio', description: 'Crafting beautiful digital experiences.', industry: 'Design', location: 'Seattle, WA', website: 'https://designstudio.example.com', logoUrl: 'https://picsum.photos/seed/design/100/100' },
        { name: 'DataDriven Corp', description: 'Analytics and data intelligence.', industry: 'Data & Analytics', location: 'Boston, MA', website: 'https://datadriven.example.com', logoUrl: 'https://picsum.photos/seed/data/100/100' },
    ];
    const orgs = [];
    for (let i = 0; i < 5; i++) {
        const org = orgRepo.create({ ...orgsData[i], ownerId: users[i].id });
        orgs.push(await orgRepo.save(org));
    }
    console.log(`✅ Created ${orgs.length} organizations`);
    const userSkillRepo = AppDataSource.getRepository(user_skill_entity_1.UserSkill);
    const candidateUsers = users.slice(5);
    const skillSets = [
        [0, 1, 2, 3],
        [0, 2, 6, 16],
        [3, 19, 9, 17],
        [4, 10, 11, 5],
        [7, 8, 9, 15],
        [12, 13, 1, 2],
        [2, 0, 3, 16],
        [4, 10, 5, 18],
        [1, 3, 19, 9],
        [12, 13, 2, 14],
    ];
    for (let i = 0; i < candidateUsers.length; i++) {
        for (const skillIdx of skillSets[i]) {
            await userSkillRepo.save(userSkillRepo.create({ userId: candidateUsers[i].id, skillId: skills[skillIdx].id }));
        }
    }
    console.log('✅ Created user skills');
    const plRepo = AppDataSource.getRepository(profile_language_entity_1.ProfileLanguage);
    for (let i = 0; i < profiles.length; i++) {
        await plRepo.save(plRepo.create({ profileId: profiles[i].id, languageId: languages[0].id, level: 'Native' }));
        if (i % 3 === 0) {
            await plRepo.save(plRepo.create({ profileId: profiles[i].id, languageId: languages[1].id, level: 'Intermediate' }));
        }
    }
    console.log('✅ Created profile languages');
    const expRepo = AppDataSource.getRepository(experience_entity_1.Experience);
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
    const eduRepo = AppDataSource.getRepository(education_entity_1.Education);
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
    const jobRepo = AppDataSource.getRepository(job_entity_1.Job);
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
    const jobs = [];
    for (let i = 0; i < jobsData.length; i++) {
        const org = orgs[i % orgs.length];
        const job = jobRepo.create({ ...jobsData[i], organizationId: org.id });
        jobs.push(await jobRepo.save(job));
    }
    console.log(`✅ Created ${jobs.length} jobs`);
    const postRepo = AppDataSource.getRepository(post_entity_1.Post);
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
    const posts = [];
    for (const pd of postsData) {
        posts.push(await postRepo.save(postRepo.create(pd)));
    }
    console.log(`✅ Created ${posts.length} posts`);
    const likeRepo = AppDataSource.getRepository(like_entity_1.Like);
    const likePairs = [
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
            }
            catch { }
        }
    }
    console.log('✅ Created likes');
    const commentRepo = AppDataSource.getRepository(comment_entity_1.Comment);
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
    const connRepo = AppDataSource.getRepository(connection_entity_1.Connection);
    const connectionPairs = [
        [5, 6, connection_entity_1.ConnectionStatus.Accepted],
        [5, 7, connection_entity_1.ConnectionStatus.Accepted],
        [6, 8, connection_entity_1.ConnectionStatus.Accepted],
        [7, 9, connection_entity_1.ConnectionStatus.Accepted],
        [8, 10, connection_entity_1.ConnectionStatus.Accepted],
        [9, 11, connection_entity_1.ConnectionStatus.Accepted],
        [10, 12, connection_entity_1.ConnectionStatus.Accepted],
        [11, 13, connection_entity_1.ConnectionStatus.Accepted],
        [12, 14, connection_entity_1.ConnectionStatus.Accepted],
        [5, 8, connection_entity_1.ConnectionStatus.Accepted],
        [6, 11, connection_entity_1.ConnectionStatus.Accepted],
        [7, 12, connection_entity_1.ConnectionStatus.Accepted],
        [5, 9, connection_entity_1.ConnectionStatus.Pending],
        [6, 10, connection_entity_1.ConnectionStatus.Pending],
        [7, 13, connection_entity_1.ConnectionStatus.Pending],
    ];
    for (const [rIdx, aIdx, status] of connectionPairs) {
        try {
            await connRepo.save(connRepo.create({
                requesterId: users[rIdx].id,
                addresseeId: users[aIdx].id,
                status,
            }));
        }
        catch { }
    }
    console.log('✅ Created connections');
    const convRepo = AppDataSource.getRepository(conversation_entity_1.Conversation);
    const msgRepo = AppDataSource.getRepository(message_entity_1.Message);
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
    const appRepo = AppDataSource.getRepository(job_application_entity_1.JobApplication);
    const applicationData = [
        { userIdx: 5, jobIdx: 0, status: job_application_entity_1.ApplicationStatus.Interview },
        { userIdx: 5, jobIdx: 5, status: job_application_entity_1.ApplicationStatus.Pending },
        { userIdx: 6, jobIdx: 1, status: job_application_entity_1.ApplicationStatus.Accepted },
        { userIdx: 6, jobIdx: 5, status: job_application_entity_1.ApplicationStatus.Pending },
        { userIdx: 7, jobIdx: 1, status: job_application_entity_1.ApplicationStatus.Pending },
        { userIdx: 7, jobIdx: 7, status: job_application_entity_1.ApplicationStatus.Rejected },
        { userIdx: 8, jobIdx: 4, status: job_application_entity_1.ApplicationStatus.Pending },
        { userIdx: 8, jobIdx: 9, status: job_application_entity_1.ApplicationStatus.Interview },
        { userIdx: 9, jobIdx: 3, status: job_application_entity_1.ApplicationStatus.Pending },
        { userIdx: 9, jobIdx: 7, status: job_application_entity_1.ApplicationStatus.Accepted },
        { userIdx: 10, jobIdx: 2, status: job_application_entity_1.ApplicationStatus.Pending },
        { userIdx: 10, jobIdx: 10, status: job_application_entity_1.ApplicationStatus.Pending },
        { userIdx: 11, jobIdx: 5, status: job_application_entity_1.ApplicationStatus.Interview },
        { userIdx: 12, jobIdx: 9, status: job_application_entity_1.ApplicationStatus.Pending },
        { userIdx: 13, jobIdx: 2, status: job_application_entity_1.ApplicationStatus.Accepted },
        { userIdx: 14, jobIdx: 3, status: job_application_entity_1.ApplicationStatus.Pending },
        { userIdx: 5, jobIdx: 8, status: job_application_entity_1.ApplicationStatus.Rejected },
        { userIdx: 6, jobIdx: 0, status: job_application_entity_1.ApplicationStatus.Pending },
        { userIdx: 7, jobIdx: 5, status: job_application_entity_1.ApplicationStatus.Pending },
        { userIdx: 8, jobIdx: 11, status: job_application_entity_1.ApplicationStatus.Interview },
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
            }
            catch { }
        }
    }
    console.log('✅ Created job applications');
    const notifRepo = AppDataSource.getRepository(notification_entity_1.Notification);
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
//# sourceMappingURL=seed.js.map