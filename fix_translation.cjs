const fs = require('fs');

let content = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

// Accordion titles
content = content.replace("Personal Coordinates", "Контакты и Личные данные");
content = content.replace("Professional Summary", "О себе (Профиль)");
content = content.replace("Work Experience", "Опыт работы");
content = content.replace("Projects & Innovation", "Проекты");
content = content.replace("Core Competencies (Skills)", "Навыки и Технологии");
content = content.replace("Academic Credentials", "Образование");
content = content.replace("Grid Alignment & Tuning", "Внешний вид и Отступы");

// Labels
content = content.replace(/<Label>Full Name<\/Label>/g, "<Label>Имя и Фамилия</Label>");
content = content.replace(/<Label>Professional Title<\/Label>/g, "<Label>Желаемая должность</Label>");
content = content.replace(/<Label>Email Coordinates<\/Label>/g, "<Label>Email</Label>");
content = content.replace(/<Label>Location \/ Residence<\/Label>/g, "<Label>Город проживания</Label>");
content = content.replace(/<Label>Portfolio \(Website\)<\/Label>/g, "<Label>Сайт или Портфолио (ссылка)</Label>");
content = content.replace(/<Label>LinkedIn URL<\/Label>/g, "<Label>Профиль LinkedIn</Label>");

content = content.replace(/<Label>Role<\/Label>/g, "<Label>Должность</Label>");
content = content.replace(/<Label>Company<\/Label>/g, "<Label>Компания</Label>");
content = content.replace(/<Label>Duration<\/Label>/g, "<Label>Период работы (например, Янв 2021 - Настоящее время)</Label>");
content = content.replace(/<Label>Employment Type<\/Label>/g, "<Label>Тип занятости (Офис, Удаленка)</Label>");

content = content.replace(/<Label>Highlight Title \(e.g., Conversion API\)<\/Label>/g, "<Label>Название достижения</Label>");
content = content.replace(/<Label>Outcome description \(numeric highlights are automatically bolded\)<\/Label>/g, "<Label>Описание (цифры будут выделены жирным)</Label>");

content = content.replace(/<Label>Venture Name<\/Label>/g, "<Label>Название проекта</Label>");
content = content.replace(/<Label>Leadership Role<\/Label>/g, "<Label>Ваша роль</Label>");
content = content.replace(/<Label>Brief Executive Description<\/Label>/g, "<Label>Краткое описание</Label>");

content = content.replace(/<Label>Sector Category<\/Label>/g, "<Label>Категория (например, Frontend, Базы данных)</Label>");
content = content.replace(/<Label>Skill Keywords \(comma-separated\)<\/Label>/g, "<Label>Навыки (через запятую)</Label>");

content = content.replace(/<Label>Certification \/ Degree<\/Label>/g, "<Label>Степень или Специальность</Label>");
content = content.replace(/<Label>Institution Name<\/Label>/g, "<Label>Учебное заведение</Label>");
content = content.replace(/<Label>Graduation Year<\/Label>/g, "<Label>Год окончания</Label>");

// Buttons Add
content = content.replace(/Add Paragraph/g, "Добавить абзац");
content = content.replace(/Add Metric Highlight/g, "Добавить достижение");
content = content.replace(/Add Experience Node/g, "Добавить место работы");
content = content.replace(/Add Detail Metric/g, "Добавить деталь проекта");
content = content.replace(/Add Project Node/g, "Добавить проект");
content = content.replace(/Add Skill Category/g, "Добавить категорию навыков");
content = content.replace(/Add Academic Node/g, "Добавить образование");
content = content.replace(/Auto-Fit 2 Pages/g, "Подогнать под 2 стр");
content = content.replace(/Delete Photo/g, "Удалить фото");
content = content.replace(/Select Image File/g, "Выбрать фото");

// Formatting section texts
content = content.replace(/>Auto-Formatting</g, ">Авто-настройка<");
content = content.replace(/Adjust spacing variables automatically so the content flows beautifully under exactly 2 pages/g, "Автоматически подобрать отступы, чтобы резюме красиво поместилось ровно на 2 страницы");
content = content.replace(/>Select density preset</g, ">Плотность текста<");
content = content.replace(/Padding Top\/Bottom/g, "Отступы сверху/снизу");
content = content.replace(/Padding Left\/Right/g, "Отступы слева/справа");
content = content.replace(/>Sections</g, ">Блоки<");
content = content.replace(/>Blocks Space</g, ">Внутри блоков<");
content = content.replace(/>Show A4 Page Dividers</g, ">Показывать границы страниц А4<");
content = content.replace(/Current content density height scale/g, "Масштаб заполнения контентом");
content = content.replace(/>Quantified Achievements:</g, ">Ключевые достижения:<");
content = content.replace(/>Key Metrics & Scope:</g, ">Детали проекта:<");

fs.writeFileSync('components/SidebarFormTab.tsx', content);
console.log('Fixed translations');
