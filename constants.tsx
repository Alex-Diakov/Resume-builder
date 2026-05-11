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