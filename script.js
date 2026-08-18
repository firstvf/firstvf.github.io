const translations = {
    en: {
        "nav.projects": "Projects",
        "nav.stack": "Tech Stack",
        "nav.about": "About",
        "nav.contact": "Contact",
        "hero.eyebrow": "Unity Developer",
        "hero.description": "Unity developer focused on gameplay programming, game systems and production-ready game development.",
        "hero.projects": "View projects",
        "projects.eyebrow": "Selected work",
        "projects.title": "Featured Projects",
        "projects.description": "Six projects selected to show the breadth of my Unity development experience.",
        "project.main": "Main Project",
        "project.featured": "Featured",
        "project.shooter": "Shooter",
        "project.179.description": "A major project from my commercial Unity development experience.",
        "project.merge.description": "Zombie shooter with weapon progression through a merge mechanic.",
        "stack.eyebrow": "Technical stack",
        "stack.title": "Tools & Technologies",
        "stack.description": "Technologies and services I have worked with across my Unity projects.",
        "stack.game": "Game Development",
        "stack.architecture": "Architecture & Tools",
        "stack.services": "Services & SDKs",
        "other.eyebrow": "More work",
        "other.title": "Other Projects",
        "about.eyebrow": "About",
        "about.title": "Unity Developer",
        "about.p1": "I develop games with Unity and C#, focusing on gameplay mechanics, game systems and maintainable architecture.",
        "about.p2": "My experience spans commercial and personal projects across shooter, strategy, puzzle, arcade and casual game development.",
        "contact.eyebrow": "Contact",
        "contact.title": "Let's build something interesting."
    },
    ru: {
        "nav.projects": "Проекты",
        "nav.stack": "Технологии",
        "nav.about": "Обо мне",
        "nav.contact": "Контакты",
        "hero.eyebrow": "Unity-разработчик",
        "hero.description": "Unity-разработчик, специализирующийся на gameplay programming, игровых системах и production-ready разработке.",
        "hero.projects": "Проекты",
        "projects.eyebrow": "Избранные работы",
        "projects.title": "Проекты",
        "projects.description": "Подборка проектов, демонстрирующих мой опыт разработки на Unity.",
        "project.main": "Основной проект",
        "project.featured": "Избранное",
        "project.shooter": "Шутер",
        "project.179.description": "Крупный коммерческий проект из моего опыта Unity-разработки.",
        "project.merge.description": "Зомби-шутер с развитием оружия через механику merge.",
        "stack.eyebrow": "Технологический стек",
        "stack.title": "Инструменты и технологии",
        "stack.description": "Технологии и сервисы, с которыми я работал в Unity-проектах.",
        "stack.game": "Разработка игр",
        "stack.architecture": "Архитектура и инструменты",
        "stack.services": "Сервисы и SDK",
        "other.eyebrow": "Другие работы",
        "other.title": "Другие проекты",
        "about.eyebrow": "Обо мне",
        "about.title": "Unity-разработчик",
        "about.p1": "Разрабатываю игры на Unity и C#, специализируясь на игровых механиках, системах и поддерживаемой архитектуре.",
        "about.p2": "Работал над коммерческими и личными проектами в жанрах shooter, strategy, puzzle, arcade и casual.",
        "contact.eyebrow": "Контакты",
        "contact.title": "Давайте создадим что-нибудь интересное."
    }
};

const languageStorageKey = "portfolio-language";
const defaultLanguage = "en";

function getInitialLanguage() {
    const savedLanguage = localStorage.getItem(languageStorageKey);
    return savedLanguage === "ru" || savedLanguage === "en" ? savedLanguage : defaultLanguage;
}

function applyLanguage(language) {
    const dictionary = translations[language];
    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;
        const value = dictionary[key];
        if (value !== undefined) {
            element.textContent = value;
        }
    });

    const languageButton = document.querySelector(".language-switcher");
    if (languageButton) {
        languageButton.textContent = language === "en" ? "RU" : "EN";
        languageButton.setAttribute("aria-label", language === "en" ? "Switch to Russian" : "Switch to English");
    }

    localStorage.setItem(languageStorageKey, language);
}

function initializeLanguageSwitcher() {
    let language = getInitialLanguage();
    applyLanguage(language);

    document.querySelector(".language-switcher")?.addEventListener("click", () => {
        language = language === "en" ? "ru" : "en";
        applyLanguage(language);
    });
}

function initializeGalleries() {
    document.querySelectorAll(".project-card[data-images]").forEach((card) => {
        const image = card.querySelector(".project-card__image");
        const previousButton = card.querySelector(".gallery-button--previous");
        const nextButton = card.querySelector(".gallery-button--next");
        const counter = card.querySelector(".gallery-counter");
        const projectName = card.dataset.project;
        const imageNames = card.dataset.images.split(",");
        let currentIndex = 0;

        function showImage(index) {
            currentIndex = (index + imageNames.length) % imageNames.length;
            image.style.opacity = "0";

            window.setTimeout(() => {
                image.src = `assets/projects/${projectName}/${imageNames[currentIndex]}`;
                image.onload = () => {
                    image.style.opacity = "1";
                };
            }, 100);

            counter.textContent = `${currentIndex + 1} / ${imageNames.length}`;
        }

        previousButton.addEventListener("click", () => showImage(currentIndex - 1));
        nextButton.addEventListener("click", () => showImage(currentIndex + 1));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initializeLanguageSwitcher();
    initializeGalleries();
});
