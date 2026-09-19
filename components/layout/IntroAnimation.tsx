import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScanLine } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setShow(false), 2500),
      setTimeout(() => onComplete(), 3000),
    ];
    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ds-canvas text-ds-text-high overflow-hidden font-mono"
        >
          {/* Background subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

          <div className="relative w-full max-w-5xl px-6 h-64 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute flex flex-col items-center justify-center text-center w-full"
            >
              <motion.div
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                className="w-20 h-20 bg-ds-panel shrink-0 flex items-center justify-center rounded-ds-xl shadow-ds-glow mb-6 border border-ds-border"
              >
                <ScanLine className="w-10 h-10 text-ds-primary" />
              </motion.div>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-bold font-sans tracking-tight text-ds-text-high mb-4"
              >
                Resume Pro
              </motion.div>
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs md:text-sm text-ds-text-muted font-mono tracking-[0.3em] uppercase"
              >
                Neuro-Cognitive Executive Platform
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
