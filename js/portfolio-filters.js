document.addEventListener('DOMContentLoaded', function() {
    const projectsData = [
        {
            id: "mechanical-meanderings",
            title: "Mechanical Meanderings",
            description: "An interactive installation exploring embodiment of metaphors and self-perception using AI analysis of speech and real-time visual blending. Exhibited at MUTEK Forum, Montréal 2024, MTL Connect 2024 and UKAI Shipwreck 2025.",
            primaryLink: { href: "https://photos.app.goo.gl/wJ11HxQotbqHF4Fr8", text: "View Video ↗" },
            image: {
                src: "../images/mechanical-meanderings.jpg",
                alt: "Mechanical Meanderings project image",
                credit: "Image credit: Ana Isabel Duque",
                storyLink: { href: "https://milieux.concordia.ca/forever-shipwreck-notes-from-ukais-milieux-exhibit/", text: "Read more about the exhibit at Milieux ↗" }
            },
            hasDetails: true,
            technologies: ["AI", "Speech Analysis", "Real-time Visuals"],
            projectType: "Interactive Installation"
        },
        {
            id: "meteomythosophy",
            title: "Meteomythosophy",
            description: "A transdisciplinary framework for immersive performances connecting neuro-computational arts, religious studies, and laboratory theater, using meteorological metaphors for consciousness. Showcased at Embodied Interventions Festival 2024. (Collaboration: Paolo Gruni, Thomas Seibel).",
            primaryLink: { href: "https://drive.google.com/file/d/190fRz0Px14MtXogU2zKSo4u3O-imztwe/view?usp=drive_link", text: "View Video ↗" },
            image: null,
            hasDetails: false,
            technologies: ["Neuro-computational Arts", "Performance Tech"],
            projectType: "Immersive Performance"
        },
        {
            id: "goofi-pipe",
            title: "Goofi-pipe",
            description: "A versatile Python library for real-time data streaming and analysis, designed for applications of neurotechnology and GenAI in arts. (Collaboration: Philipp Thölke, Antoine Bellemare-Pépin, Yann Harel).",
            primaryLink: { href: "https://github.com/PhilippThoelke/goofi-pipe", text: "View Project ↗" },
            image: null,
            hasDetails: false,
            technologies: ["Python", "Neurotechnology", "GenAI", "Data Streaming"],
            projectType: "Software Library"
        },
        {
            id: "neurokit",
            title: "NeuroKit",
            description: "A comprehensive Python toolbox for neurophysiological signal processing, offering a wide range of functionalities for analyzing physiological data.",
            primaryLink: { href: "https://neuropsychology.github.io/NeuroKit/", text: "View Project ↗" },
            image: null,
            hasDetails: false,
            technologies: ["Python", "Signal Processing", "Neurophysiology"],
            projectType: "Software Library"
        },
        {
            id: "biotuner",
            title: "Biotuner",
            description: "A toolbox for Harmonic analysis of biosignals, creating chord progressions and melodies from EEG, ECG, Plants, and Audio in real-time.",
            primaryLink: { href: "https://antoinebellemare.github.io/biotuner/", text: "View Project ↗" },
            image: null,
            hasDetails: false,
            technologies: ["Biosignals", "Harmonic Analysis", "EEG", "ECG", "Audio Processing"],
            projectType: "Software Toolbox"
        }
    ];

    const portfolioListContainer = document.getElementById('portfolio-list');
    const techFiltersContainer = document.getElementById('tech-filters-container');
    const typeFiltersContainer = document.getElementById('type-filters-container');

    let activeFilters = {
        technology: 'all',
        projectType: 'all'
    };

    function renderProjects(projectsToRender) {
        if (!portfolioListContainer) return;
        portfolioListContainer.innerHTML = ''; // Clear existing projects

        projectsToRender.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.classList.add('portfolio-item');
            projectItem.id = project.id;

            let detailsHTML = '';
            if (project.image) {
                detailsHTML += `
                    <img src="${project.image.src}" alt="${project.image.alt}" class="portfolio-image">
                    ${project.image.credit ? `<p class="image-credit">${project.image.credit}</p>` : ''}
                `;
            }
            if (project.image && project.image.storyLink) {
                 detailsHTML += `
                    <p class="story-link-container">
                        This picture of the installation was taken at the "Shipwreck" exhibit.
                        <a href="${project.image.storyLink.href}" target="_blank" rel="noopener noreferrer" class="text-link">
                            ${project.image.storyLink.text}
                        </a>
                    </p>
                 `;
            }
            
            // Note: The original "Mechanical Meanderings" had a specific text for story-link-container.
            // This generic version might need adjustment if that specific text is crucial for only one item.
            // For now, using a simpler check. If project.image.storyLink exists, we assume it's the Shipwreck one.
            // A more robust solution would be to have specific flags or content in the project data.


            projectItem.innerHTML = `
                <h3 class="portfolio-item-title">${project.title}</h3>
                <p>${project.description}</p>
                <a href="${project.primaryLink.href}" target="_blank" rel="noopener noreferrer" class="text-link">${project.primaryLink.text}</a>
                ${project.hasDetails ? `
                    <div class="portfolio-item-details" style="display: none;">
                        ${detailsHTML}
                    </div>
                    <a href="#" class="portfolio-toggle-link">View More ▾</a>
                ` : ''}
            `;
            portfolioListContainer.appendChild(projectItem);
        });
        // After rendering, re-attach event listeners for "View More" if main.js doesn't handle it for dynamic content.
        // This will be addressed in the "Adapt 'View More' Functionality" step.
    }

    function populateFilters() {
        if (!techFiltersContainer || !typeFiltersContainer) return;

        const allTechnologies = new Set();
        const allProjectTypes = new Set();

        projectsData.forEach(project => {
            project.technologies.forEach(tech => allTechnologies.add(tech));
            allProjectTypes.add(project.projectType);
        });

        allTechnologies.forEach(tech => {
            const btn = createFilterButton(tech, 'technology');
            techFiltersContainer.appendChild(btn);
        });

        allProjectTypes.forEach(type => {
            const btn = createFilterButton(type, 'projectType');
            typeFiltersContainer.appendChild(btn);
        });
    }

    function createFilterButton(filterValue, group) {
        const button = document.createElement('button');
        button.classList.add('filter-btn');
        button.dataset.filterGroup = group;
        button.dataset.filter = filterValue;
        button.textContent = filterValue;
        button.addEventListener('click', handleFilterClick);
        return button;
    }

    function handleFilterClick(event) {
        const button = event.target;
        const group = button.dataset.filterGroup;
        const filter = button.dataset.filter;

        activeFilters[group] = filter;

        // Update active class for buttons in the same group
        const container = group === 'technology' ? techFiltersContainer : typeFiltersContainer;
        container.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Also ensure the 'all' button for the other group remains if it was active
        // or manage cross-group filter states if needed (e.g. if filtering tech, what happens to type filter?)
        // For now, filters are independent within their group, and 'all' is the default.

        applyFilters();
    }
    
    function applyFilters() {
        let filteredProjects = projectsData;

        if (activeFilters.technology !== 'all') {
            filteredProjects = filteredProjects.filter(project => 
                project.technologies.includes(activeFilters.technology)
            );
        }

        if (activeFilters.projectType !== 'all') {
            filteredProjects = filteredProjects.filter(project => 
                project.projectType === activeFilters.projectType
            );
        }
        renderProjects(filteredProjects);
        // Call function to re-attach "View More" listeners here.
        // This will be defined in the "Adapt 'View More' Functionality" step.
        if (typeof window.attachPortfolioToggleListeners === 'function') {
            window.attachPortfolioToggleListeners();
        }
    }

    // Initial setup
    populateFilters();
    renderProjects(projectsData); 
    // Call function to attach "View More" listeners for initial render.
    if (typeof window.attachPortfolioToggleListeners === 'function') {
        window.attachPortfolioToggleListeners();
    }
});
