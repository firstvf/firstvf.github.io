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

function createContactIcon(link, type) {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.style.width = "18px";
    svg.style.height = "18px";
    svg.style.flexShrink = "0";

    const path = document.createElementNS(svgNamespace, "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("d", type === "github"
        ? "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.01c-3.2.7-3.87-1.35-3.87-1.35-.53-1.34-1.28-1.7-1.28-1.7-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.03 1.75 2.7 1.24 3.36.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
        : "M21.94 3.32 18.7 20.08c-.24 1.18-.88 1.47-1.78.92l-4.9-3.61-2.36 2.27c-.26.26-.48.48-.98.48l.35-4.98 9.07-8.19c.39-.35-.09-.55-.61-.2L6.28 13.91 1.51 12.42c-1.04-.33-1.06-1.04.22-1.54L20.38 3.56c.87-.32 1.63.2 1.56-.24Z");

    svg.appendChild(path);
    link.prepend(svg);
}

function initializeContactLinks() {
    document.querySelectorAll('.contact__content a[href*="github.com"], .contact__content a[href*="t.me/"]').forEach((link) => {
        const type = link.href.includes("github.com") ? "github" : "telegram";
        link.classList.add("icon-link", `icon-link--${type}`);
        link.style.display = "inline-flex";
        link.style.alignItems = "center";
        link.style.gap = "8px";
        createContactIcon(link, type);
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
