const fs = require('fs');

if (fs.existsSync('components/SidebarCognitiveTab.tsx')) {
  let cog = fs.readFileSync('components/SidebarCognitiveTab.tsx', 'utf8');

  cog = cog.replace("According to professional eye-tracking researches, recruiters scan resumes under an", "Согласно исследованиям (ай-трекинг), рекрутеры просматривают резюме по");
  cog = cog.replace("in about 6 seconds, locking gaze only on prominent anchors.", "примерно за 6 секунд, фиксируя взгляд только на ключевых якорях.");
  cog = cog.replace("If these hotspots exhibit low-status terms, use the", "Если в этих зонах используются слабые формулировки, перейдите во вкладку");
  cog = cog.replace("to automatically upgrade passive experience elements into systemic value statements.", "чтобы автоматически улучшить их и показать вашу ценность.");
  cog = cog.replace("Active Anchor Focus", "Фокус на якорях");

  fs.writeFileSync('components/SidebarCognitiveTab.tsx', cog);
}

console.log('Fixed Cog string fragments');
