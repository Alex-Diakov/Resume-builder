import React from 'react';
import { ResumeData } from './types';
import { 
  Globe, 
  Linkedin, 
  Mail, 
  MapPin, 
  Layers, 
  Zap, 
  LayoutTemplate, 
  Terminal 
} from 'lucide-react';

export const INITIAL_RESUME_DATA: ResumeData = {
  name: "Alex Diakov",
  title: "Senior Product Designer | FinTech, AI & Complex Systems",
  summary: [
    "Specializing in systems for industries where a design mistake can cost millions. With 7+ years of experience, my focus is on architecture over aesthetics.",
    "My work at Hitachi and Tobii was centered on reducing cognitive load in data-heavy environments. I leverage AI to build functional React prototypes, bridging the gap between design and engineering to ship complex systems faster.",
    "With a focus on ownership and autonomy, I am a self-managed product unit seeking to build scalable product ecosystems turning operational chaos into something predictable."
  ],
  contact: {
    website: "linkedin.com/in/alex-diakov",
    linkedin: "linkedin.com/in/alex-diakov",
    email: "diakovoleksandr@gmail.com",
    location: "Kyiv, Ukraine"
  },
  experience: [
    {
      role: "Product Designer",
      company: "Hitachi High-Tech",
      duration: "May 2024 – Dec 2024",
      type: "Contract",
      highlights: [
        {
          title: "HMI Ecosystem",
          description: "Designed HMI ecosystem for semiconductor manufacturing hardware, where error prevention is critical."
        },
        {
          title: "Safety UI Patterns",
          description: "Implemented UI patterns for irreversible actions and real-time status monitoring, leading to a projected reduction in errors."
        },
        {
          title: "Workflow Optimization",
          description: "Refactored engineering workflows into streamlined digital experiences, reducing average operator task time."
        }
      ]
    },
    {
      role: "Senior User Experience Designer",
      company: "Tobii",
      duration: "Mar 2021 – May 2024",
      type: "Full-time",
      highlights: [
        {
          title: "Analytics Framework",
          description: "Designed the interaction layer for Tobii's core analytics platform. Designed frameworks to interpret massive biometric datasets (gaze plots) without cognitive overload, directly impacting data-driven decisions for researchers."
        },
        {
          title: "Workflow Efficiency",
          description: "Optimized research setup workflows, reducing user setup times by 52% and minimizing common errors."
        },
        {
          title: "Project Initiative",
          description: "Redesign of the core user interface which resulted in a 37% increase in software usage and satisfaction."
        }
      ]
    },
    {
      role: "Senior User Experience Designer",
      company: "Filmocracy",
      duration: "Apr 2020 – Mar 2021",
      type: "Full-time",
      highlights: [
        {
          title: "Economic Layer",
          description: "Architected the core economic layer, translating user engagement into measurable asset value. Designed content staking mechanics, where user ratings directly influenced rewards and content visibility."
        },
        {
          title: "Strategy",
          description: "Designed a strategy loop with incentive-driven mechanics, increasing user retention by 15%."
        },
        {
          title: "Platform Evolution",
          description: "Transformed a passive content consumption model into an interactive social economy, significantly improving data and platform stickiness."
        }
      ]
    },
    {
      role: "Lead UX/UI Designer",
      company: "Various Clients",
      duration: "Apr 2018 – Mar 2020",
      type: "Full-time",
      highlights: [
        {
          title: "Client Success",
          description: "Designed solutions for diverse clients, maintaining a 95% satisfaction rate. Consistently delivered improved UX scores on key accounts by up to 26%."
        }
      ]
    }
  ],
  projects: [
    {
      title: "AI-Driven SaaS Platform",
      role: "Co-Founder & Product Lead",
      description: "Founded and architected an AI-driven SaaS platform, taking the product from 0 to MVP while working full-time.",
      details: [
        { label: "Architecture", value: "Designed the scalable ecosystem, overseeing AWS infrastructure planning and LLM integration." },
        { label: "Monetization", value: "Built proprietary CRM and token-based monetization model to track usage costs and revenue." },
        { label: "Outcome", value: "Delivered production-ready MVP. Successfully validated technical feasibility and user flows before project was sunset due to funding constraints." }
      ]
    },
    {
      title: "Cognitive Training Platform",
      role: "Founder & Product Lead",
      description: "Developed a digital resource for cognitive training, combining articles and interactive logic tests.",
      details: [
        { label: "Engineering", value: "Pushed Webflow boundaries by integrating custom HTML/CSS/JS to create interactive testing without a complex backend." },
        { label: "Growth", value: "Managed end-to-end SEO strategy and GA integration, achieving first-page rankings for key keywords." }
      ]
    },
  ],
  skills: {
    "Expertise": "FinTech/DeFi Architecture, Complex Data Visualization, B2B SaaS, Risk Management UI, Zero-Trust Governance, Stakeholder Management.",
    "Design": "Figma (Variables, Auto-layout), Information Architecture (IA), HMI Design, Rapid Prototyping.",
    "Technical": "HTML/CSS Structure, Webflow (Expert), SEO & Analytics, Technical Logic Validation, React/JS Prototyping."
  },
  education: [
    {
      institution: "TOBII ACADEMY",
      certification: "Certified in Screen-Based & Wearable Eye Tracking",
      year: "2022"
    }
  ]
};

export const RESUME_PRESETS: Record<string, { label: string; data: ResumeData }> = {
  designer: {
    label: "Senior Product Designer",
    data: INITIAL_RESUME_DATA
  },
  engineer: {
    label: "Senior Full-Stack Engineer",
    data: {
      name: "Alex Diakov",
      title: "Senior Full-Stack Engineer | React, Node.js & Cloud Architectures",
      summary: [
        "Senior software engineer with 7+ years of experience designing and deploying high-performance React web applications, microservices, and secure cloud setups.",
        "Proven expertise in optimizing render efficiency, constructing atomic component structures, and orchestrating serverless APIs. Passionate about marrying engineering precision with fluid UI/UX experiences."
      ],
      contact: {
        website: "github.com/alex-diakov",
        linkedin: "linkedin.com/in/alex-diakov",
        email: "diakovoleksandr@gmail.com",
        location: "Kyiv, Ukraine"
      },
      experience: [
        {
          role: "Lead Full-Stack Engineer",
          company: "Hitachi High-Tech",
          duration: "May 2024 – Dec 2024",
          type: "Contract",
          highlights: [
            {
              title: "HMI Dashboard UI",
              description: "Engineered high-performance real-time instrumentation dashboards using React, WebSockets, and Canvas, reducing telemetry lag by 40%."
            },
            {
              title: "State Architecture",
              description: "Refactored decentralized application states into standardized atomic managers, mitigating unnecessary virtual-DOM cycles."
            },
            {
              title: "CI/CD Orchestration",
              description: "Established continuous-delivery runners with strict Cypress testing gates, reducing release-cycle times on the main pipeline."
            }
          ]
        },
        {
          role: "Senior Frontend Developer",
          company: "Tobii",
          duration: "Mar 2021 – May 2024",
          type: "Full-time",
          highlights: [
            {
              title: "Analytics Portal",
              description: "Shipped core interactive layer visualizing massive eye-tracking logs. Implemented lazy-loaded dynamic viewports, allowing analysis of long-running sessions."
            },
            {
              title: "Bundle Core Refactor",
              description: "Audited build targets and treeshook packages, optimizing critical load times by 35% and improving lighthouse scores."
            }
          ]
        },
        {
          role: "Lead Systems Engineer",
          company: "Filmocracy",
          duration: "Apr 2020 – Mar 2021",
          type: "Full-time",
          highlights: [
            {
              title: "Decentralized Ledger UI",
              description: "Designed secure wallet interaction and checkout gateways, boosting successful transactions by 22%."
            }
          ]
        }
      ],
      projects: [
        {
          title: "Kubernetes Cloud Deployer",
          role: "Founder & Lead Developer",
          description: "Engineered a container deployment platform enabling 1-click stack configs under secure isolation.",
          details: [
            { label: "Engineering", value: "Built using Go, React, and Redis cache. Deployed strictly as microservices with isolated state nodes." },
            { label: "Outcome", value: "Scaled to 150+ prototype clusters successfully with minimal operational overhead." }
          ]
        }
      ],
      skills: {
        "Languages": "TypeScript, JavaScript (ES6+), Go, HTML5/CSS3 Core structures.",
        "Frameworks": "React, Next.js, Express, Tailwind CSS, GraphQL, Apollo.",
        "Automation": "Docker, Kubernetes, AWS Services (S3, Lambda, EC2), GitHub Actions."
      },
      education: [
        {
          institution: "TOBII ACADEMY",
          certification: "Certified Eye-Tracking Systems Integrator",
          year: "2022"
        }
      ]
    }
  },
  manager: {
    label: "Senior Product Manager",
    data: {
      name: "Alex Diakov",
      title: "Senior Product Manager | High-Scale B2B SaaS & Growth Operations",
      summary: [
        "Results-oriented Product Manager with 7+ years of experience leading cross-functional agile teams. Focused on user-acquisition formulas, product pricing models, and stakeholder alignment.",
        "Adept at translating complex technological architectures and business metrics into straightforward product roadmaps that elevate team output and customer lifetime value."
      ],
      contact: {
        website: "linkedin.com/in/alex-diakov",
        linkedin: "linkedin.com/in/alex-diakov",
        email: "diakovoleksandr@gmail.com",
        location: "Kyiv, Ukraine"
      },
      experience: [
        {
          role: "Senior Product Manager",
          company: "Hitachi High-Tech",
          duration: "May 2024 – Dec 2024",
          type: "Contract",
          highlights: [
            {
              title: "Strategic Vision",
              description: "Formulated the next-gen IoT dashboard product roadmap, aligning key stakeholders across design and engineering departments."
            },
            {
              title: "KPI Optimization",
              description: "Introduced detailed event instrumentation and analytics, revealing bottleneck drop-offs and reclaiming user onboarding rates."
            }
          ]
        },
        {
          role: "Product Owner — BI Framework",
          company: "Tobii",
          duration: "Mar 2021 – May 2024",
          type: "Full-time",
          highlights: [
            {
              title: "SaaS Launch",
              description: "Collaborated in launching Tobii Cloud subscription model, generating consistent ARR growth in the first 12 months."
            },
            {
              title: "Product Discovery",
              description: "Conducted 40+ structured ethnographic interviews, synthesizing pain-points to refine core UX patterns."
            }
          ]
        }
      ],
      projects: [
        {
          title: "A/B Platform Infrastructure",
          role: "Product Lead",
          description: "Conceived and executed an internal A/B experiments engine to run low-friction client validation pools.",
          details: [
            { label: "Impact", value: "Slashed experiment configuration time from 10 days to 2, increasing experimentation volume." }
          ]
        }
      ],
      skills: {
        "Strategic": "Product Roadmapping, OKR Alignment, Customer Discovery, Cohort Studies.",
        "Technical": "SQL Querying, Amplitude, Google Analytics, Jira & Notion setup.",
        "Agile": "Scrum Master Certification, Sprint Planning, backlogs prioritization."
      },
      education: [
        {
          institution: "PRODUCT ALLIANCE",
          certification: "Executive Product Management Program",
          year: "2021"
        }
      ]
    }
  }
};

export const ICONS = {
  website: <Globe className="w-3.5 h-3.5 mr-1.5" />,
  linkedin: <Linkedin className="w-3.5 h-3.5 mr-1.5" />,
  email: <Mail className="w-3.5 h-3.5 mr-1.5" />,
  location: <MapPin className="w-3.5 h-3.5 mr-1.5" />,
  categoryExpertise: <Layers className="w-4 h-4 text-resume-accent mr-2" />,
  categoryDesign: <LayoutTemplate className="w-4 h-4 text-resume-accent mr-2" />,
  categoryAI: <Zap className="w-4 h-4 text-resume-accent mr-2" />,
  categoryTech: <Terminal className="w-4 h-4 text-resume-accent mr-2" />,
};