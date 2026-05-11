
import React from 'react';
import { SHADOW_CONTENT, SHADOW_COLORS } from '../shadowConstants';

const Page: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div 
    className={`resume-sheet w-[210mm] min-h-[297mm] mx-auto bg-white shadow-xl mb-8 relative overflow-hidden print:shadow-none print:mb-0 print:break-after-page ${className}`}
    style={{ pageBreakAfter: 'always' }}
  >
    {children}
  </div>
);

const SectionHeader: React.FC<{ title: string; color: string }> = ({ title, color }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold uppercase tracking-wide" style={{ color }}>{title}</h2>
  </div>
);

const LeftBarBlock: React.FC<{ title: string; text: string; color: string; label?: string }> = ({ title, text, color, label }) => (
  <div className="flex gap-4 mb-6 break-inside-avoid">
    <div className="w-1.5 shrink-0 rounded-sm" style={{ backgroundColor: color }}></div>
    <div>
      <h3 className="font-bold text-sm mb-2 uppercase tracking-wide" style={{ color }}>
        {label ? `${label} — ` : ''}{title}
      </h3>
      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  </div>
);

const CircleNum: React.FC<{ num: number; color: string }> = ({ num, color }) => (
  <div 
    className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 mt-1"
    style={{ backgroundColor: color }}
  >
    {num}
  </div>
);

export const ShadowGuide: React.FC = () => {
  const { cover, intro, block1, block2, block3, block4, closing } = SHADOW_CONTENT;

  return (
    <div id="resume-content" className="flex flex-col items-center py-8 bg-gray-800 print:bg-white print:py-0">
      
      {/* PAGE 1: COVER */}
      <Page className="bg-[#111827] text-white flex flex-col justify-between p-0 relative">
        {/* Top Content */}
        <div className="pt-20 px-14">
           {/* Result Badge */}
           <div className="mb-16 border border-emerald-500 bg-emerald-900/20 rounded-lg p-4 text-center">
             <div className="text-emerald-500 font-bold text-lg mb-1">{cover.badge.title}</div>
             <div className="text-emerald-200/70 text-sm">{cover.badge.subtitle}</div>
           </div>

           {/* Title */}
           <div className="text-center mb-12">
             <h1 className="text-5xl font-bold mb-4 tracking-tight">{cover.title}</h1>
             <h2 className="text-4xl font-bold text-amber-500 mb-8">{cover.subtitle}</h2>
             <div className="text-slate-400 space-y-1 text-lg">
               {cover.description.map((line, i) => <div key={i}>{line}</div>)}
             </div>
           </div>

           {/* Divider */}
           <div className="w-full h-px bg-amber-500/50 my-12 mx-auto max-w-md"></div>

           {/* Blocks Grid */}
           <div className="grid grid-cols-4 gap-3 mb-12">
             {cover.blocks.map((block, i) => {
               const colorMap: Record<string, string> = { RED: '#EF4444', PURPLE: '#A855F7', ORANGE: '#F97316', CYAN: '#06B6D4' };
               const bgMap: Record<string, string> = { RED: 'rgba(239,68,68,0.2)', PURPLE: 'rgba(168,85,247,0.2)', ORANGE: 'rgba(249,115,22,0.2)', CYAN: 'rgba(6,182,212,0.2)' };
               return (
                 <div key={i} className="bg-gray-800 rounded-lg p-3 flex flex-col justify-between h-28 border border-gray-700">
                   <div className="text-center">
                     <div className="text-white text-xs font-bold whitespace-pre-line leading-tight">{block.title}</div>
                   </div>
                   <div className="mt-2">
                     <div className="h-3 w-full rounded-sm mb-1" style={{ backgroundColor: colorMap[block.color] }}></div>
                     <div className="text-[10px] text-center font-bold text-gray-400">{block.label}</div>
                   </div>
                 </div>
               );
             })}
           </div>
        </div>

        {/* Bottom Content */}
        <div className="bg-white/5 mx-14 mb-14 rounded-xl p-6 border border-white/10">
          <div className="text-cyan-500 font-bold mb-1">{cover.author.name}</div>
          <div className="text-slate-400 text-sm mb-4">{cover.author.role}</div>
          <div className="space-y-1">
            {cover.author.links.map((link, i) => (
              <div key={i} className="flex text-sm">
                <span className="text-slate-400 w-20">{link.label}</span>
                <span className="text-cyan-500">{link.url}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-8 text-center px-14">
          <div className="text-slate-500 text-xs">{cover.author.footer[0]}</div>
          <div className="text-slate-600 text-xs mt-1">{cover.author.footer[1]}</div>
        </div>

        {/* Gold Bottom Bar */}
        <div className="h-2 w-full bg-amber-500 absolute bottom-0 left-0"></div>
      </Page>

      {/* PAGE 2: INTRO */}
      <Page className="p-14 pt-16 text-gray-900">
        <h2 className="text-2xl font-bold text-amber-500 mb-2">{intro.title}</h2>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{intro.subtitle}</h2>
        
        <p className="text-sm leading-relaxed mb-8">{intro.text}</p>
        
        <div className="h-px w-full bg-amber-500 mb-8"></div>

        <h3 className="font-bold text-lg mb-4">{intro.listTitle}</h3>
        <ul className="space-y-3 mb-8">
          {intro.list.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="text-amber-500 font-bold">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="h-px w-full bg-amber-500 mb-8"></div>

        <h3 className="font-bold text-lg mb-4">{intro.blocksTitle}</h3>
        <div className="space-y-4 mb-8">
          {intro.blocks.map((block, i) => {
             const colorMap: Record<string, string> = { RED: '#EF4444', PURPLE: '#A855F7', ORANGE: '#F97316', CYAN: '#06B6D4' };
             return (
               <LeftBarBlock 
                 key={i} 
                 title="" 
                 label={block.label} 
                 text={block.text} 
                 color={colorMap[block.color]} 
               />
             );
          })}
        </div>

        <div className="mt-8 p-4 border-l-4 border-amber-500 bg-amber-50">
          <p className="text-amber-700 font-bold text-sm italic">{intro.warning}</p>
        </div>
      </Page>

      {/* PAGE 3: BLOCK 1 */}
      <Page className="p-14 pt-16 text-gray-900">
        <SectionHeader title={block1.header} color={SHADOW_COLORS.RED} />
        
        <h3 className="font-bold text-lg mb-4">{block1.subHeader}</h3>
        <p className="text-sm leading-relaxed mb-6">{block1.intro}</p>

        <div className="space-y-6 mb-8">
          {block1.sections.map((sec, i) => {
             const colorMap: Record<string, string> = { RED: '#EF4444', PURPLE: '#A855F7', ORANGE: '#F97316', CYAN: '#06B6D4' };
             return (
               <LeftBarBlock 
                 key={i} 
                 title={sec.title} 
                 text={sec.text} 
                 color={colorMap[sec.color] || SHADOW_COLORS.RED} 
               />
             );
          })}
        </div>

        <div className="h-px w-full bg-red-500 mb-8"></div>

        <h3 className="font-bold text-lg mb-4">{block1.ifsTitle}</h3>
        <p className="text-sm leading-relaxed mb-6">{block1.ifsIntro}</p>

        <div className="space-y-6">
          {block1.ifsSections.map((sec, i) => {
             const colorMap: Record<string, string> = { GREEN: '#10B981', RED: '#EF4444' };
             return (
               <LeftBarBlock 
                 key={i} 
                 title={sec.title} 
                 text={sec.text} 
                 color={colorMap[sec.color]} 
               />
             );
          })}
        </div>
      </Page>

      {/* PAGE 4: BLOCK 2 */}
      <Page className="p-14 pt-16 text-gray-900">
        <SectionHeader title={block2.header} color={SHADOW_COLORS.PURPLE} />

        <h3 className="font-bold text-lg mb-4">{block2.subHeader}</h3>
        <p className="text-sm leading-relaxed mb-6">{block2.intro}</p>

        <div className="space-y-6 mb-8">
          {block2.sections.map((sec, i) => {
             const colorMap: Record<string, string> = { GREEN: '#10B981', RED: '#EF4444', PURPLE: '#A855F7' };
             return (
               <LeftBarBlock 
                 key={i} 
                 title={sec.title} 
                 text={sec.text} 
                 color={colorMap[sec.color]} 
               />
             );
          })}
        </div>

        <div className="h-px w-full bg-purple-500 mb-8"></div>

        <h3 className="font-bold text-lg mb-4">{block2.enneagramTitle}</h3>
        <p className="text-sm leading-relaxed mb-6">{block2.enneagramIntro}</p>

        <div className="space-y-6 mb-8">
          {block2.enneagramSections.map((sec, i) => {
             const colorMap: Record<string, string> = { ORANGE: '#F97316', GREEN: '#10B981' };
             return (
               <LeftBarBlock 
                 key={i} 
                 title={sec.title} 
                 text={sec.text} 
                 color={colorMap[sec.color]} 
               />
             );
          })}
        </div>

        <div className="h-px w-full bg-amber-500 mb-6"></div>
        <p className="text-amber-600 font-bold text-sm italic">{block2.footer}</p>
      </Page>

      {/* PAGE 5: BLOCK 3 */}
      <Page className="p-14 pt-16 text-gray-900">
        <SectionHeader title={block3.header} color={SHADOW_COLORS.ORANGE} />

        <h3 className="font-bold text-lg mb-4">{block3.subHeader}</h3>
        <p className="text-sm leading-relaxed mb-8">{block3.intro}</p>

        <div className="space-y-8 mb-8">
          {block3.steps.map((step, i) => (
            <div key={i} className="relative pl-4">
              <div className="flex items-start gap-4 mb-3">
                <CircleNum num={step.num} color={SHADOW_COLORS.ORANGE} />
                <h4 className="font-bold text-gray-900 mt-1">{step.title}</h4>
              </div>
              
              <div className="pl-10 space-y-4">
                <div>
                  <div className="text-cyan-600 font-bold text-xs uppercase mb-1">Действие:</div>
                  <p className="text-sm text-gray-800">{step.action}</p>
                </div>
                <div>
                  <div className="text-orange-500 font-bold text-xs uppercase mb-1">Зачем:</div>
                  <p className="text-sm text-gray-800">{step.why}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 border-l-4 border-amber-500 bg-amber-50">
          <p className="text-amber-700 font-bold text-sm italic">{block3.warning}</p>
        </div>
      </Page>

      {/* PAGE 6: BLOCK 4 */}
      <Page className="p-14 pt-16 text-gray-900">
        <SectionHeader title={block4.header} color={SHADOW_COLORS.CYAN} />

        <h3 className="font-bold text-lg mb-4">{block4.subHeader}</h3>
        <p className="text-sm leading-relaxed mb-4">{block4.intro1}</p>
        <p className="text-sm leading-relaxed mb-8">{block4.intro2}</p>

        <div className="h-px w-full bg-cyan-500 mb-8"></div>

        <h3 className="font-bold text-lg mb-4">{block4.listTitle1}</h3>
        <ul className="space-y-2 mb-8">
          {block4.list1.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="text-red-500 font-bold">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="h-px w-full bg-emerald-500 mb-8"></div>

        <h3 className="font-bold text-lg mb-4">{block4.listTitle2}</h3>
        <ul className="space-y-2 mb-12">
          {block4.list2.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="text-emerald-500 font-bold">+</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* CTA Box */}
        <div className="border border-cyan-500 rounded-xl p-8 bg-cyan-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-cyan-500"></div>
          <h3 className="text-center text-xl font-bold text-cyan-600 mb-6">{block4.ctaTitle}</h3>
          <p className="text-center text-sm text-gray-700 mb-6 max-w-lg mx-auto">{block4.ctaText}</p>
          
          <div className="text-center">
            <div className="text-amber-500 font-bold mb-1">{block4.ctaAction}</div>
            <div className="text-gray-500 text-xs mb-4">{block4.ctaSubAction}</div>
            <div className="text-cyan-600 font-bold">{block4.ctaLink}</div>
          </div>
        </div>
      </Page>

      {/* PAGE 7: CLOSING */}
      <Page className="bg-[#111827] text-white flex flex-col justify-between p-0 relative">
        <div className="pt-32 px-14 text-center">
          <h1 className="text-4xl font-bold mb-4">{closing.title}</h1>
          <h2 className="text-4xl font-bold text-amber-500 mb-12">{closing.subtitle}</h2>
          
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            {closing.text}
          </p>

          {/* Steps Cards */}
          <div className="grid grid-cols-3 gap-4 mb-16">
            {closing.steps.map((step, i) => {
               const colorMap: Record<string, string> = { ORANGE: '#F97316', PURPLE: '#A855F7', GREEN: '#10B981' };
               const bgMap: Record<string, string> = { ORANGE: 'rgba(249,115,22,0.2)', PURPLE: 'rgba(168,85,247,0.2)', GREEN: 'rgba(16,185,129,0.2)' };
               return (
                 <div key={i} className="bg-gray-800 rounded-lg p-4 pt-8 relative border border-gray-700 h-48 flex flex-col items-center justify-center">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 rounded-b-md" style={{ backgroundColor: colorMap[step.color] }}></div>
                   <div className="text-xs font-bold mb-4 text-gray-300">{step.label}</div>
                   <div className="text-sm font-bold text-white text-center whitespace-pre-line">{step.text}</div>
                 </div>
               );
            })}
          </div>

          <div className="w-full h-px bg-slate-700 mb-8"></div>

          <div className="text-cyan-500 font-bold mb-6">{cover.author.name}</div>
          
          <div className="flex justify-center gap-8 text-sm mb-8">
            {cover.author.links.map((link, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-slate-500">{link.label}</span>
                <span className="text-cyan-500">{link.url}</span>
              </div>
            ))}
          </div>

          <div className="text-slate-600 text-xs">{closing.footer}</div>
        </div>

        {/* Gold Bottom Bar */}
        <div className="h-2 w-full bg-amber-500 absolute bottom-0 left-0"></div>
      </Page>
    </div>
  );
};
