const translations = {
    en: {
        "nav.stack": "Tech Stack",
        "nav.projects": "Projects",
        "nav.other": "More Projects",
        "nav.contact": "Contact",
        "stack.eyebrow": "Technical stack",
        "stack.game": "Game Development",
        "stack.architecture": "Architecture & Tools",
        "stack.services": "Services & SDKs",
        "projects.eyebrow": "Projects",
        "other.eyebrow": "More Projects",
        "contact.eyebrow": "Contact"
    },
    ru: {
        "nav.stack": "Технологии",
        "nav.projects": "Проекты",
        "nav.other": "Ещё проекты",
        "nav.contact": "Контакты",
        "stack.eyebrow": "Технологический стек",
        "stack.game": "Разработка игр",
        "stack.architecture": "Архитектура и инструменты",
        "stack.services": "Сервисы и SDK",
        "projects.eyebrow": "Проекты",
        "other.eyebrow": "Ещё проекты",
        "contact.eyebrow": "Контакты"
    }
};

const languageStorageKey = "portfolio-language";
const defaultLanguage = "en";
const projectInfoPath = "projects_info.txt";

const projectImages = {
    "146_sbr": ["cover.webp", "gameplay-01.webp", "gameplay-02.webp"],
    "148_bbp": ["cover.webp", "gameplay-01.webp", "gameplay-02.webp", "gameplay-03.webp"],
    "154_ppc": ["cover.webp", "gameplay-01.webp", "gameplay-02.webp", "gameplay-03.webp"],
    "171_plp": ["cover.webp", "gameplay-01.webp", "gameplay-02.webp", "gameplay-03.webp"],
    "176_ccm": ["cover.webp", "gameplay-01.webp"],
    "187_bt": ["cover.webp", "gameplay-01.webp", "gameplay-02.webp", "gameplay-03.webp"],
    "199_cda": ["cover.webp", "gameplay-01.webp", "gameplay-02.webp", "gameplay-03.webp"],
    "202_nt": ["cover.webp", "gameplay-01.webp", "gameplay-02.webp", "gameplay-03.webp", "gameplay-04.webp", "gameplay-05.webp"],
    "209_ctsg": ["cover.webp", "gameplay-01.webp", "gameplay-02.webp", "gameplay-03.webp", "gameplay-04.webp"],
    "211_cms": ["cover.webp", "gameplay-01.webp", "gameplay-02.webp", "gameplay-03.webp", "gameplay-04.webp"],
    "amay": ["cover.webp", "gameplay-01.webp"],
    "avi": ["cover.webp", "gameplay-01.webp"],
    "cave_dungeon": ["cover.webp", "gameplay-01.webp", "gameplay-02.webp", "gameplay-03.webp", "gameplay-04.webp", "gameplay-05.webp"],
    "colored_tower": ["cover.webp", "gameplay-01.webp"],
    "footman": ["cover.webp", "gameplay-01.webp", "gameplay-02.webp"],
    "ltd": ["cover.webp", "gameplay-01.webp", "gameplay-02.webp"],
    "rich_run": ["cover.webp", "gameplay-01.webp", "gameplay-02.webp"]
};

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
    document.querySelectorAll(".language-button").forEach((button) => {
        button.addEventListener("click", () => applyLanguage(button.dataset.language));
    });

    applyLanguage(getInitialLanguage());
}

function createProjectLink(type, url) {
    const link = document.createElement("a");
    link.className = `icon-link icon-link--${type}`;
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", type === "github" ? "GitHub" : "YouTube");
    link.textContent = type === "github" ? "GitHub" : "YouTube";
    return link;
}

async function initializeProjectLinks() {
    try {
        const response = await fetch(projectInfoPath, { cache: "no-cache" });
        if (!response.ok) {
            return;
        }

        const projectInfo = await response.text();
        const projects = parseProjectInfo(projectInfo);

        document.querySelectorAll(".project-card[data-project]").forEach((card) => {
            const project = projects.get(card.dataset.project);
            if (!project) {
                return;
            }

            const youtubeLink = card.querySelector('a[href*="youtu.be"], a[href*="youtube.com"]');
            const linksContainer = getOrCreateLinksContainer(card, youtubeLink);

            if (project.youtube && youtubeLink) {
                youtubeLink.href = project.youtube;
                youtubeLink.classList.add("icon-link--youtube");
                youtubeLink.classList.add("icon-link");
                youtubeLink.textContent = "YouTube";
                youtubeLink.setAttribute("aria-label", "YouTube");
            }

            if (project.git && !linksContainer.querySelector('a[href*="github.com"]')) {
                linksContainer.insertBefore(createProjectLink("github", project.git), linksContainer.firstChild);
            }
        });
    } catch (error) {
        console.warn("Failed to load project links.", error);
    }
}

function parseProjectInfo(content) {
    const projects = new Map();
    const blocks = content.trim().split(/\n\s*\n/);

    blocks.forEach((block) => {
        const lines = block.split("\n");
        const name = lines[0]?.trim();
        if (!name) {
            return;
        }

        const youtube = lines.find((line) => line.startsWith("youtube:"))?.slice("youtube:".length).trim() ?? "";
        const git = lines.find((line) => line.startsWith("git:"))?.slice("git:".length).trim() ?? "";
        projects.set(name, { youtube, git });
    });

    return projects;
}

function getOrCreateLinksContainer(card, youtubeLink) {
    const existingContainer = card.querySelector(".project-card__links");
    if (existingContainer) {
        return existingContainer;
    }

    const container = document.createElement("div");
    container.className = "project-card__links";

    const content = card.querySelector(".project-card__content");
    if (!content) {
        return container;
    }

    if (youtubeLink) {
        container.appendChild(youtubeLink);
    }

    content.appendChild(container);
    return container;
}

function initializeContactLinks() {
    document.querySelectorAll('.contact__content a[href*="github.com"], .contact__content a[href*="t.me/"]').forEach((link) => {
        const type = link.href.includes("github.com") ? "github" : "telegram";
        link.classList.add("icon-link", `icon-link--${type}`);
    });
}

function initializeGalleries() {
    document.querySelectorAll(".project-card[data-project]").forEach((card) => {
        const image = card.querySelector(".project-card__image");
        const previousButton = card.querySelector(".gallery-button--previous");
        const nextButton = card.querySelector(".gallery-button--next");
        const counter = card.querySelector(".gallery-counter");
        const projectName = card.dataset.project;
        const imageNames = projectImages[projectName] ?? card.dataset.images.split(",");
        let currentIndex = 0;
        let transitionToken = 0;

        function updateCounter() {
            counter.textContent = `${currentIndex + 1} / ${imageNames.length}`;
        }

        function showImage(index) {
            currentIndex = (index + imageNames.length) % imageNames.length;
            const imagePath = `assets/projects/${projectName}/${imageNames[currentIndex]}`;
            const token = ++transitionToken;

            image.classList.add("is-changing");
            updateCounter();

            window.setTimeout(() => {
                if (token !== transitionToken) {
                    return;
                }

                image.onload = () => image.classList.remove("is-changing");
                image.onerror = () => image.classList.remove("is-changing");
                image.src = imagePath;
            }, 160);
        }

        updateCounter();

        if (imageNames.length > 1 && previousButton && nextButton) {
            previousButton.addEventListener("click", (event) => {
                event.stopPropagation();
                showImage(currentIndex - 1);
            });
            nextButton.addEventListener("click", (event) => {
                event.stopPropagation();
                showImage(currentIndex + 1);
            });
        } else {
            previousButton?.remove();
            nextButton?.remove();
        }
    });
}

function initializeExpandableProjects() {
    document.querySelectorAll(".project-card--compact").forEach((card) => {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-expanded", "false");

        function toggleExpanded() {
            const shouldExpand = !card.classList.contains("is-expanded");

            document.querySelectorAll(".project-card--compact.is-expanded").forEach((expandedCard) => {
                expandedCard.classList.remove("is-expanded");
                expandedCard.setAttribute("aria-expanded", "false");
            });

            if (shouldExpand) {
                card.classList.add("is-expanded");
                card.setAttribute("aria-expanded", "true");
            }
        }

        card.addEventListener("click", (event) => {
            if (event.target.closest("a, button")) {
                return;
            }

            toggleExpanded();
        });

        card.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            event.preventDefault();
            toggleExpanded();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initializeLanguageSwitcher();
    initializeGalleries();
    initializeProjectLinks();
    initializeContactLinks();
    initializeExpandableProjects();
});
