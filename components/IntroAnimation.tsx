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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden font-mono"
        >
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

          <div className="relative w-full max-w-5xl px-6 h-64 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute flex flex-col items-center justify-center text-center w-full"
            >
              <motion.div
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 bg-white shrink-0 flex items-center justify-center rounded-2xl shadow-[0_0_80px_rgba(255,255,255,0.15)] mb-8"
              >
                <ScanLine className="w-12 h-12 text-black" />
              </motion.div>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-6xl md:text-8xl font-bold font-sans tracking-tighter text-white mb-6"
              >
                Resume Pro
              </motion.div>
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm md:text-lg text-gray-400 font-mono tracking-[0.4em] uppercase"
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
