const translations = {
    en: {
        "nav.projects": "Projects",
        "nav.contact": "Contact",
        "hero.eyebrow": "Unity Developer",
        "hero.description": "Unity developer focused on gameplay programming, game systems and production-ready game development.",
        "hero.projects": "View projects",
        "projects.eyebrow": "Selected work",
        "projects.title": "Projects",
        "projects.description": "A selection of games and prototypes developed with Unity.",
        "project.179.description": "A major project from my commercial Unity development experience.",
        "project.merge.description": "Zombie shooter with weapon progression through a merge mechanic.",
        "other.eyebrow": "More work",
        "other.title": "Other Projects"
    },
    ru: {
        "nav.projects": "Проекты",
        "nav.contact": "Контакты",
        "hero.eyebrow": "Unity-разработчик",
        "hero.description": "Unity-разработчик, специализирующийся на gameplay programming, игровых системах и production-ready разработке.",
        "hero.projects": "Проекты",
        "projects.eyebrow": "Избранные работы",
        "projects.title": "Проекты",
        "projects.description": "Подборка игр и прототипов, разработанных на Unity.",
        "project.179.description": "Крупный коммерческий проект из моего опыта Unity-разработки.",
        "project.merge.description": "Зомби-шутер с развитием оружия через механику merge.",
        "other.eyebrow": "Другие работы",
        "other.title": "Другие проекты"
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
        const value = dictionary[element.dataset.i18n];
        if (value !== undefined) {
            element.textContent = value;
        }
    });

    document.querySelectorAll(".language-button").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.language === language);
    });

    localStorage.setItem(languageStorageKey, language);
}

function initializeLanguageSwitcher() {
    applyLanguage(getInitialLanguage());

    document.querySelectorAll(".language-button").forEach((button) => {
        button.addEventListener("click", () => {
            applyLanguage(button.dataset.language);
        });
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
