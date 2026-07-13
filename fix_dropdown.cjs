const fs = require('fs');
let content = fs.readFileSync('components/Toolbar.tsx', 'utf8');

// 1. Change "border-b border-ds-border/50" to "border-b border-[#312e39]/50"
content = content.replace('border-b border-ds-border/50', 'border-b border-[#312e39]/50');

// 2. Change text-xs to text-[10px] on "Export Settings"
content = content.replace('text-xs uppercase tracking-wider text-ds-text-high font-display">Export Settings', 'text-[10px] uppercase tracking-wider text-ds-text-high font-display">Export Settings');

// 3. Change rounded-lg to rounded-xl on toggle container
content = content.replace('group mb-3 p-2 rounded-lg hover:bg-ds-hover transition-colors -mx-2', 'group mb-3 p-2 rounded-xl hover:bg-ds-hover transition-colors -mx-2');

// 4. Update the toggle button itself
const oldToggle = `<div className={\`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300 \${compressPdf ? 'bg-ds-primary shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'bg-ds-border'}\`}>
                      <span className={\`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ease-in-out \${compressPdf ? 'translate-x-4.5' : 'translate-x-1'}\`} />
                    </div>`;
const newToggle = `<button
                      type="button"
                      className={\`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-0 \${
                        compressPdf ? 'bg-ds-primary shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'bg-[#49454f]'
                      }\`}
                    >
                      <span className={\`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ease-in-out \${
                        compressPdf ? 'translate-x-3.5' : 'translate-x-0'
                      }\`} />
                    </button>`;
content = content.replace(oldToggle, newToggle);

// 5. Update border-t border-ds-border/40 to border-t border-[#312e39]/50
content = content.replace('border-t border-ds-border/40 space-y-4', 'border-t border-[#312e39]/50 space-y-4');

// 6. Update Estimated Size container
const oldFooter = `<div className="mt-4 pt-3 border-t border-ds-border/50 bg-ds-active/60 rounded-xl p-3 flex flex-col gap-2 shadow-inner">`;
const newFooter = `<div className="mt-4 border border-[#312e39]/50 bg-[#1c1b21]/60 rounded-xl p-3.5 flex flex-col gap-2 shadow-inner">`;
content = content.replace(oldFooter, newFooter);

fs.writeFileSync('components/Toolbar.tsx', content);
console.log('Fixed dropdown');
