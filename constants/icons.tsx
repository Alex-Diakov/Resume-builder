import React from 'react';
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
