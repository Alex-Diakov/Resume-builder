const fs = require('fs');

function replaceInFile(filePath, replacements) {
    if (!fs.existsSync(filePath)) {
        console.log("File not found: " + filePath);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    fs.writeFileSync(filePath, content);
}

// SidebarFormTab.tsx
replaceInFile('components/SidebarFormTab.tsx', [
    ["Контакты и Личные данные", "Personal Details"],
    ["О себе (Профиль)", "Professional Summary"],
    ["Опыт работы", "Work Experience"],
    ["Проекты", "Projects & Innovations"],
    ["Навыки и Технологии", "Skills & Competencies"],
    ["Образование", "Education"],
    ["Внешний вид и Отступы", "Layout & Formatting"],
    ["<Label>Имя и Фамилия</Label>", "<Label>Full Name</Label>"],
    ["<Label>Желаемая должность</Label>", "<Label>Professional Title</Label>"],
    ["<Label>Email</Label>", "<Label>Email Address</Label>"],
    ["<Label>Город проживания</Label>", "<Label>Location / City</Label>"],
    ["<Label>Сайт или Портфолио (ссылка)</Label>", "<Label>Portfolio URL</Label>"],
    ["<Label>Профиль LinkedIn</Label>", "<Label>LinkedIn URL</Label>"],
    ["<Label>Должность</Label>", "<Label>Role / Title</Label>"],
    ["<Label>Компания</Label>", "<Label>Company</Label>"],
    ["<Label>Период работы (например, Янв 2021 - Настоящее время)</Label>", "<Label>Duration (e.g., Jan 2021 - Present)</Label>"],
    ["<Label>Тип занятости (Офис, Удаленка)</Label>", "<Label>Employment Type</Label>"],
    ["<Label>Название достижения</Label>", "<Label>Achievement Title</Label>"],
    ["<Label>Описание (цифры будут выделены жирным)</Label>", "<Label>Outcome Description (numbers are auto-bolded)</Label>"],
    ["<Label>Название проекта</Label>", "<Label>Project Name</Label>"],
    ["<Label>Ваша роль</Label>", "<Label>Your Role</Label>"],
    ["<Label>Краткое описание</Label>", "<Label>Brief Description</Label>"],
    ["<Label>Категория (например, Frontend, Базы данных)</Label>", "<Label>Category (e.g., Frontend, Backend)</Label>"],
    ["<Label>Навыки (через запятую)</Label>", "<Label>Skills (comma-separated)</Label>"],
    ["<Label>Степень или Специальность</Label>", "<Label>Degree / Certification</Label>"],
    ["<Label>Учебное заведение</Label>", "<Label>Institution Name</Label>"],
    ["<Label>Год окончания</Label>", "<Label>Graduation Year</Label>"],
    ["Добавить абзац", "Add Paragraph"],
    ["Добавить достижение", "Add Highlight"],
    ["Добавить место работы", "Add Experience"],
    ["Добавить деталь проекта", "Add Detail"],
    ["Добавить проект", "Add Project"],
    ["Добавить категорию навыков", "Add Skill Category"],
    ["Добавить образование", "Add Education"],
    ["Подогнать под 2 стр", "Auto-Fit 2 Pages"],
    ["Удалить фото", "Delete Photo"],
    ["Выбрать фото", "Select Image"],
    [">Авто-настройка<", ">Auto-Formatting<"],
    ["Автоматически подобрать отступы, чтобы резюме красиво поместилось ровно на 2 страницы", "Automatically adjust spacing so the content flows beautifully into exactly 2 pages"],
    [">Плотность текста<", ">Content Density<"],
    ["Отступы сверху/снизу", "Top/Bottom Padding"],
    ["Отступы слева/справа", "Left/Right Padding"],
    [">Блоки<", ">Section Spacing<"],
    [">Внутри блоков<", ">Item Spacing<"],
    [">Показывать границы страниц А4<", ">Show A4 Page Guides<"],
    ["Масштаб заполнения контентом", "Content density scale"],
    [">Ключевые достижения:<", ">Key Achievements:<"],
    [">Детали проекта:<", ">Project Details:<"]
]);

// SidebarAtsTab.tsx
replaceInFile('components/SidebarAtsTab.tsx', [
    ["Ключевые слова и Требования", "Target Keywords & Roles"],
    ["Вставьте описание вакансии или список ключевых навыков для проверки резюме (через запятую).", "Paste the job description or specific keywords you want to target."],
    ["Например: React, TypeScript, Управление командой...", "E.g., React, TypeScript, Leadership..."],
    ["Анализ...", "Analyzing..."],
    ["Проверить совместимость (ATS)", "Run ATS Scan"],
    ["Совпадение", "Match Score"],
    ["Отсутствуют в резюме", "Missing Keywords"],
    ["Найдены в резюме", "Matched Keywords"]
]);

// SidebarJsonTab.tsx
replaceInFile('components/SidebarJsonTab.tsx', [
    ["Продвинутая настройка (JSON)", "Advanced JSON Editor"],
    ["Редактируйте структуру данных резюме напрямую.", "Edit the underlying resume data structure directly."],
    ["Вставить JSON из буфера обмена", "Paste JSON from clipboard"],
    ["Вставлено!", "Pasted!"],
    ["Вставить", "Paste"],
    ["Скопировать JSON", "Copy JSON"],
    ["Скопировано", "Copied!"],
    ["Копировать", "Copy"],
    ["Вставьте ваш JSON сюда...", "Paste your JSON here..."],
    ["Ошибка синтаксиса:", "Syntax Error:"]
]);

// Toolbar.tsx
replaceInFile('components/Toolbar.tsx', [
    ["Скрыть редактор", "Hide Editor"],
    ["Открыть редактор", "Open Editor"],
    ["Скачать PDF", "Download PDF"],
    ["Создание PDF...", "Generating PDF..."],
    ["Загрузить JSON профиль", "Load JSON Profile"],
    ["Оптимизация изображений", "Compress Images"],
    ["Сжимает фото, чтобы размер PDF был меньше 1 МБ для прохождения ATS-систем.", "Compress profile photo to guarantee the PDF stays under 1MB for ATS."]
]);

// SidebarCognitiveTab.tsx
replaceInFile('components/SidebarCognitiveTab.tsx', [
    [">Обзор<", ">Overview<"],
    [">Законы UX<", ">UX Laws<"],
    [">Модели<", ">Models<"],
    ["Нет подключения к сети", "Offline Mode Active"],
    ["Работаем в офлайн режиме. Используется локальная модель проверки. Резюме в безопасности!", "Offline environment detected. Using local heuristic AI model. Productivity maintained!"],
    ["Внимание:", "System Note:"],
    ["Оцениваем визуальную нагрузку...", "Evaluating visual load..."],
    ["Анализируем плотность текста, читаемость и точки фокусировки взгляда.", "Mapping text density, readability, and focal points."],
    ["Проверка читаемости резюме (UX)", "Resume UX Audit"],
    ["Оцените структуру, плотность информации и удобство чтения. Получите рекомендации по улучшению формулировок, чтобы звучать убедительнее.", "Scan layout structure, measure density, and get AI recommendations to sound more executive."],
    ["Запустить UX Анализ", "Run UX Audit"],
    ["Легкость чтения (UX)", "Readability Score (UX)"],
    ["Общая оценка восприятия", "Visual Processing Score"],
    ["Сложность текста:", "Reading Complexity:"],
    ["Плотность:", "Content Density:"],
    ["Примерное время, необходимое рекрутеру, чтобы понять вашу ценность.", "Estimated time for HR to grasp core value."],
    ["Анализ барьеров:", "Friction Analysis:"],
    ["Оптимально", "Optimal"],
    ["Высокая", "High"],
    ["Перегружено", "Heavy"],
    ["Диагностика дизайна", "Design Diagnostics"],
    ["Найдены проблемы, мешающие быстрому просмотру резюме.", "Identified bottlenecks affecting rapid scanning."],
    ["Идеальная структура", "Perfect Structure"],
    ["Внешний вид отлично оптимизирован для быстрого чтения.", "Layout is perfectly optimized for scanning."],
    ["Критично", "Critical"],
    ["Улучшение визуала", "Aesthetic Fix"],
    ["Проблема:", "Friction Point:"],
    ["Психологическое обоснование:", "Psychological Basis:"],
    ["Законы восприятия интерфейсов", "Human UI Processing Laws"],
    ["Как исправить:", "Actionable Fix:"],
    ["Все формулировки идеальны", "All Statements Elevated"],
    ["Слабых и шаблонных описаний задач не найдено.", "No low-status or task-based loops detected."],
    ["Улучшение смысла", "Semantic Elevation"],
    ["Опыт работы", "Job / Role Impact"],
    ["До улучшения (процессный подход):", "Before (Task-based):"],
    ["После улучшения (ориентация на результат):", "After (Value-driven):"],
    ["Ценность для бизнеса:", "Business Value:"],
    ["Применить", "Apply Fix"],
    ["Закон Хика в резюме", "Hick's Law of Resume Scanning"],
    ["Кошелек Миллера (Правило 7)", "Miller's Rule of 7"],
    ["Эффект изоляции фон Ресторфф", "Von Restorff Isolation Effect"],
    ["Согласно исследованиям (ай-трекинг), рекрутеры просматривают резюме по", "According to eye-tracking research, recruiters scan resumes in an"],
    ["примерно за 6 секунд, фиксируя взгляд только на ключевых якорях.", "in about 6 seconds, locking gaze only on prominent anchors."],
    ["Если в этих зонах используются слабые формулировки, перейдите во вкладку", "If these hotspots exhibit low-status terms, use the"],
    ["чтобы автоматически улучшить их и показать вашу ценность.", "tab to automatically upgrade passive statements."],
    ["Фокус на якорях", "Active Anchor Focus"]
]);

// SidebarEditor.tsx
replaceInFile('components/SidebarEditor.tsx', [
    ["<span>Редактор</span>", "<span>Form</span>"],
    ["<span>Оценка UX</span>", "<span>Cognitive</span>"],
    ["<span>ATS Сканер</span>", "<span>ATS</span>"]
]);

// utils/pageAllocator.ts
replaceInFile('utils/pageAllocator.ts', [
    ["title: 'Опыт работы'", "title: 'Experience'"],
    ["title: 'Проекты'", "title: 'Product Ventures & Innovation'"]
]);

// components/ResumePaper.tsx
replaceInFile('components/ResumePaper.tsx', [
    ["title=\"Навыки\"", "title=\"Core Competencies\""],
    ["title=\"Образование\"", "title=\"Education\""],
    ["Нет данных", "No Data Loaded"]
]);

console.log('Reverted to English');
