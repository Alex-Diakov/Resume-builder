const fs = require('fs');

// ATS Tab
if (fs.existsSync('components/SidebarAtsTab.tsx')) {
  let ats = fs.readFileSync('components/SidebarAtsTab.tsx', 'utf8');
  ats = ats.replace("Target Keywords & Roles", "Ключевые слова и Требования");
  ats = ats.replace("Paste the job description or specific keywords you want to target.", "Вставьте описание вакансии или список ключевых навыков для проверки резюме (через запятую).");
  ats = ats.replace("E.g., React, Kubernetes, Product Strategy...", "Например: React, TypeScript, Управление командой...");
  ats = ats.replace("Analyzing...", "Анализ...");
  ats = ats.replace("Run Deep ATS Scan", "Проверить совместимость (ATS)");
  ats = ats.replace("Match Score", "Совпадение");
  ats = ats.replace("Missing Keywords", "Отсутствуют в резюме");
  ats = ats.replace("Matched Keywords", "Найдены в резюме");
  fs.writeFileSync('components/SidebarAtsTab.tsx', ats);
}

// JSON Tab
if (fs.existsSync('components/SidebarJsonTab.tsx')) {
  let json = fs.readFileSync('components/SidebarJsonTab.tsx', 'utf8');
  json = json.replace("Advanced JSON Configuration", "Продвинутая настройка (JSON)");
  json = json.replace("For power users: directly edit the underlying state tree.", "Редактируйте структуру данных резюме напрямую.");
  json = json.replace("Paste JSON from system clipboard", "Вставить JSON из буфера обмена");
  json = json.replace("Pasted!", "Вставлено!");
  json = json.replace("Paste", "Вставить");
  json = json.replace("Copy JSON Code", "Скопировать JSON");
  json = json.replace("Copied", "Скопировано");
  json = json.replace("Copy", "Копировать");
  json = json.replace("Paste your JSON here...", "Вставьте ваш JSON сюда...");
  json = json.replace("Syntax Error:", "Ошибка синтаксиса:");
  fs.writeFileSync('components/SidebarJsonTab.tsx', json);
}

// Toolbar
if (fs.existsSync('components/Toolbar.tsx')) {
  let tb = fs.readFileSync('components/Toolbar.tsx', 'utf8');
  tb = tb.replace("Hide Editor", "Скрыть редактор");
  tb = tb.replace("Open Editor", "Открыть редактор");
  tb = tb.replace("Generate ATS PDF", "Скачать PDF");
  tb = tb.replace("Generating PDF...", "Создание PDF...");
  tb = tb.replace("Load JSON Profile", "Загрузить JSON профиль");
  tb = tb.replace("Smart Compress Image Assets", "Оптимизация изображений");
  tb = tb.replace("Will compress profile photo to guarantee the PDF stays under 1MB for strict ATS gateways.", "Сжимает фото, чтобы размер PDF был меньше 1 МБ для прохождения ATS-систем.");
  fs.writeFileSync('components/Toolbar.tsx', tb);
}

// Cognitive Tab
if (fs.existsSync('components/SidebarCognitiveTab.tsx')) {
  let cog = fs.readFileSync('components/SidebarCognitiveTab.tsx', 'utf8');
  cog = cog.replace("Overview", "Обзор");
  cog = cog.replace("Laws", "Законы UX");
  cog = cog.replace("Frames", "Модели");
  cog = cog.replace("Cognitive Profile", "Когнитивный профиль");
  cog = cog.replace("Select a persona to analyze your resume's cognitive load.", "Выберите персону для оценки когнитивной нагрузки резюме.");
  cog = cog.replace("Analyze UX", "Проанализировать UX");
  cog = cog.replace("Analyzing...", "Анализируем...");
  
  // Try to find persona labels if they exist
  cog = cog.replace("Recruiter", "Рекрутер");
  cog = cog.replace("Hiring Manager", "Нанимающий менеджер");
  cog = cog.replace("ATS Bot", "ATS Робот");

  fs.writeFileSync('components/SidebarCognitiveTab.tsx', cog);
}

console.log('Fixed other tabs translations');
