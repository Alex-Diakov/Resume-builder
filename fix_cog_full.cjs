const fs = require('fs');

if (fs.existsSync('components/SidebarCognitiveTab.tsx')) {
  let cog = fs.readFileSync('components/SidebarCognitiveTab.tsx', 'utf8');

  // Network Offline
  cog = cog.replace("Active Networking Offline", "Нет подключения к сети");
  cog = cog.replace("Offline environment detected. Relax — we've safely engaged our built-in local heuristic AI model, maintaining 100% productivity with zero downtime!", "Работаем в офлайн режиме. Используется локальная модель проверки. Резюме в безопасности!");
  
  // Warning
  cog = cog.replace("System Note:", "Внимание:");
  
  // Analyzing state
  cog = cog.replace("Evaluating reading gravity ...", "Оцениваем визуальную нагрузку...");
  cog = cog.replace("Mapping visual load, cognitive processing limits, and scanning anchors.", "Анализируем плотность текста, читаемость и точки фокусировки взгляда.");
  
  // Not yet analyzed state
  cog = cog.replace("Audit Reading Friction", "Проверка читаемости резюме (UX)");
  cog = cog.replace("Scan your layout structure, measure information density, spot heat-zones, and unlock 1-click semantic rewriting cards designed for C-level value framing.", "Оцените структуру, плотность информации и удобство чтения. Получите рекомендации по улучшению формулировок, чтобы звучать убедительнее.");
  cog = cog.replace("Perform Cognitive Scan", "Запустить UX Анализ");
  
  // Tabs (if missed)
  cog = cog.replace(/>Overview</g, ">Обзор<");
  cog = cog.replace(/>Laws</g, ">Законы UX<");
  cog = cog.replace(/>Frames</g, ">Модели<");
  
  // Score
  cog = cog.replace("Рекрутер Reading Gravity", "Легкость чтения (UX)");
  cog = cog.replace("Visual Processing Score", "Общая оценка восприятия");
  cog = cog.replace("Reading Complexity:", "Сложность текста:");
  cog = cog.replace("Density Load:", "Плотность:");
  cog = cog.replace("Estimated reading time for HR to grasp core value propositions.", "Примерное время, необходимое рекрутеру, чтобы понять вашу ценность.");
  cog = cog.replace("Friction Analysis:", "Анализ барьеров:");
  cog = cog.replace("Optimal", "Оптимально");
  cog = cog.replace("High", "Высокая");
  cog = cog.replace("Heavy", "Перегружено");
  
  // Hotspots / Diagnostics
  cog = cog.replace("Design Diagnostics", "Диагностика дизайна");
  cog = cog.replace("Identified critical bottlenecks affecting rapid scanning capabilities.", "Найдены проблемы, мешающие быстрому просмотру резюме.");
  cog = cog.replace("Perfect Structure", "Идеальная структура");
  cog = cog.replace("The visual layout is perfectly optimized for immediate executive scanning.", "Внешний вид отлично оптимизирован для быстрого чтения.");
  
  cog = cog.replace("High Friction", "Критично");
  cog = cog.replace("Aesthetic Fix", "Улучшение визуала");
  cog = cog.replace("Friction Point:", "Проблема:");
  cog = cog.replace("Psychological Foundation:", "Психологическое обоснование:");
  cog = cog.replace("Human UI Processing Law", "Законы восприятия интерфейсов");
  cog = cog.replace("Actionable Restructure Fix:", "Как исправить:");
  
  // Frames tab
  cog = cog.replace("All Statements Elevated", "Все формулировки идеальны");
  cog = cog.replace("No low-status or task-based loops detected.", "Слабых и шаблонных описаний задач не найдено.");
  cog = cog.replace("Semantic Elevation", "Улучшение смысла");
  cog = cog.replace("Job / Role Impact", "Опыт работы");
  cog = cog.replace("Junior / Subordinate Task-Description:", "До улучшения (процессный подход):");
  cog = cog.replace("C-Level Value-Driven Action Formula:", "После улучшения (ориентация на результат):");
  cog = cog.replace("Strategic Benefit:", "Ценность для бизнеса:");
  cog = cog.replace("Apply Fix", "Применить");
  
  // Laws
  cog = cog.replace("Hick's Law of Resume Scanning", "Закон Хика в резюме");
  cog = cog.replace("Miller's Rule of 7", "Кошелек Миллера (Правило 7)");
  cog = cog.replace("Von Restorff Isolation Effect", "Эффект изоляции фон Ресторфф");
  
  fs.writeFileSync('components/SidebarCognitiveTab.tsx', cog);
}

console.log('Fixed Cog strings');
