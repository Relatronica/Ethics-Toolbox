/**
 * AI Ethics Toolkit - Main Application Logic
 * Handles drawer functionality, theme toggling, and basic app interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const drawer = document.getElementById('drawer');
    const drawerToggle = document.getElementById('drawer-toggle');
    const drawerClose = document.getElementById('drawer-close');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const chapterCards = document.getElementById('chapter-cards');
    const currentChapterTitle = document.getElementById('current-chapter');
    const visualizationInfo = document.getElementById('visualization-info');
    const mainContent = document.querySelector('.main-content');
    
    // State
    let activeChapter = null;
    
    // Initialize the application
    initApp();
    
    /**
     * Initialize the application
     */
    function initApp() {
        setupEventListeners();
        initTheme();
        loadChapters();
        showWelcomeScreen();
    }
    
    /**
     * Display welcome screen for first-time users
     */
    function showWelcomeScreen() {
        // Check if user has visited before
        const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
        
        if (!hasVisitedBefore) {
            // Create welcome overlay
            const welcomeOverlay = document.createElement('div');
            welcomeOverlay.className = 'welcome-overlay';
            welcomeOverlay.innerHTML = `
                <div class="welcome-content">
                <h2>Benvenuto nel Toolkit sull’Etica dell’Intelligenza Artificiale</h2>
                <p>Non è solo un insieme di concetti, ma un invito a esplorare con mente aperta e spirito critico un tema che plasma il nostro futuro: l’etica dell’intelligenza artificiale. Qui si intrecciano responsabilità, visioni speculative e dilemmi concreti, per capire non solo cosa può fare l’IA, ma cosa dovrebbe fare.

Questo toolkit nasce dalla sinergia tra Relatronica, progetto del ricercatore del CERN Giuseppe Aceto, esperto di etica dell’IA e speculative design, e Bacan, unendo rigore scientifico, creatività e innovazione.

Attraverso visualizzazioni interattive ti guideremo nei territori complessi e affascinanti dove tecnologia e umanità si incontrano, si scontrano e si riscrivono.</p>
                
                <button id="welcome-close" class="primary-button">Inizia</button>
                </div>  
            `;
            
            document.body.appendChild(welcomeOverlay);
            
            // Add animation class after a small delay to trigger animation
            setTimeout(() => {
                welcomeOverlay.classList.add('visible');
            }, 100);
            
            // Close welcome screen
            document.getElementById('welcome-close').addEventListener('click', () => {
                welcomeOverlay.classList.remove('visible');
                
                // After animation completes, remove the element
                setTimeout(() => {
                    welcomeOverlay.remove();
                    localStorage.setItem('hasVisitedBefore', 'true');
                }, 500);
            });
        }
    }
    
    /**
     * Set up event listeners for interactive elements
     */
    function setupEventListeners() {
        // Drawer toggle on mobile
        drawerToggle.addEventListener('click', () => {
            toggleDrawer();
        });
        
        // Drawer close on mobile
        drawerClose.addEventListener('click', closeDrawer);
        
        // Theme toggle
        themeToggleBtn.addEventListener('click', toggleTheme);
        
        // Close drawer when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const isDrawerOpen = drawer.classList.contains('open');
            const isClickInsideDrawer = drawer.contains(e.target);
            const isClickOnToggle = drawerToggle.contains(e.target);
            
            if (isDrawerOpen && !isClickInsideDrawer && !isClickOnToggle && window.innerWidth <= 768) {
                closeDrawer();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', handleResize);
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Close drawer with Escape key
            if (e.key === 'Escape' && drawer.classList.contains('open')) {
                closeDrawer();
            }
        });
        
        // Handle touch events for mobile
        if ('ontouchstart' in window) {
            setupTouchEvents();
        }
    }
    
    /**
     * Set up touch events for mobile interaction
     */
    function setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Detect swipe right to open drawer
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        // Handle swipe gesture
        function handleSwipe() {
            const swipeThreshold = 100; // Minimum distance for swipe
            
            // Swipe right to open drawer
            if (touchEndX - touchStartX > swipeThreshold && !drawer.classList.contains('open')) {
                openDrawer();
            }
            
            // Swipe left to close drawer
            if (touchStartX - touchEndX > swipeThreshold && drawer.classList.contains('open')) {
                closeDrawer();
            }
        }
    }
    
    /**
     * Toggle drawer open/close state with animation
     */
    function toggleDrawer() {
        if (drawer.classList.contains('open')) {
            closeDrawer();
        } else {
            openDrawer();
        }
    }
    
    /**
     * Open the drawer with animation
     */
    function openDrawer() {
        // Remove any existing animation classes
        drawer.classList.remove('drawer-slide-out');
        
        // Add open class and animation
        drawer.classList.add('open', 'drawer-slide-in');
        
        // Add overlay when drawer is open on mobile
        if (window.innerWidth <= 768) {
            const overlay = document.createElement('div');
            overlay.className = 'drawer-overlay';
            overlay.id = 'drawer-overlay';
            document.body.appendChild(overlay);
            
            // Fade in the overlay
            setTimeout(() => {
                overlay.classList.add('visible');
            }, 10);
            
            // Close drawer when clicking on overlay
            overlay.addEventListener('click', () => {
                closeDrawer();
            });
        }
    }
    
    /**
     * Close the drawer with animation
     */
    function closeDrawer() {
        // Add closing animation
        drawer.classList.add('drawer-slide-out');
        drawer.classList.remove('drawer-slide-in');
        
        // Remove open class after animation completes
        setTimeout(() => {
            drawer.classList.remove('open', 'drawer-slide-out');
        }, 300);
        
        removeDrawerOverlay();
    }
    
    /**
     * Remove the drawer overlay with animation
     */
    function removeDrawerOverlay() {
        const overlay = document.getElementById('drawer-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
            
            // Remove overlay after fade out animation completes
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }
    
    /**
     * Initialize theme based on user preference or system setting
     */
    function initTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark-mode');
        } else if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark-mode');
        } else {
            // If no saved preference, check system preference
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDarkMode) {
                document.documentElement.classList.add('dark-mode');
            }
        }
        
        // Update theme toggle button icon
        updateThemeToggleIcon();
    }
    
    /**
     * Toggle between light and dark themes with animation
     */
  function toggleTheme() {
    document.documentElement.classList.add('theme-transition');

    const isDarkMode = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    const icon = themeToggleBtn.querySelector('i.fa-moon, i.fa-sun');
    icon.classList.add('rotate-out');

    setTimeout(() => {
        updateThemeToggleIcon();
        icon.classList.remove('rotate-out');
        icon.classList.add('rotate-in');

        setTimeout(() => {
            icon.classList.remove('rotate-in');
            document.documentElement.classList.remove('theme-transition');
        }, 300);
    }, 150);
}

    
    /**
     * Update the theme toggle icon based on current theme
     */
    function updateThemeToggleIcon() {
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        themeToggleBtn.setAttribute('aria-label', isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
    }
    
    /**
     * Handle window resize events
     */
    function handleResize() {
        // Close drawer on window resize if in mobile view
        if (window.innerWidth <= 768) {
            closeDrawer();
        }
        
        // Update visualization if active
        if (activeChapter) {
            // Trigger visualization resize handler in visualization.js
            if (window.handleVisualizationResize) {
                window.handleVisualizationResize();
            }
        }
    }
    
    /**
     * Load chapters from JSON file
     */
    function loadChapters() {
        fetch('data/chapters.json')
            .then(response => response.json())
            .then(data => {
                createChapterCards(data.chapters);
            })
            .catch(error => {
                console.error('Error loading chapters:', error);
            });
    }
    
/**
 * Create chapter cards from data with staggered animation
 * @param {Array} chapters - Array of chapter objects
 */


function createChapterCards(chapters) {
    chapterCards.innerHTML = '';

    const fragment = document.createDocumentFragment();

    chapters.forEach((chapter, index) => {
        const card = document.createElement('div');
        card.className = 'chapter-card fade-in-up';
        card.dataset.id = chapter.id;
        card.style.animationDelay = `${index * 0.1}s`;

        // Icon container
        const icon = document.createElement('i');
        icon.className = (chapter.icon || 'fa-solid fa-book') + ' chapter-icon';

        // Title
        const title = document.createElement('h3');
        title.textContent = chapter.title;

        // Description
        const description = document.createElement('p');
        description.textContent = chapter.intro;

        card.append(icon, title, description,);

        card.addEventListener('click', () => {
            selectChapter(chapter);
            card.classList.add('pulse');
            setTimeout(() => card.classList.remove('pulse'), 600);
        });

        card.addEventListener('pointerenter', () => card.classList.add('hover-effect'));
        card.addEventListener('pointerleave', () => card.classList.remove('hover-effect'));

        fragment.appendChild(card);
    });

    chapterCards.appendChild(fragment);
}




    /**
     * Select a chapter and update the visualization
     * @param {Object} chapter - The selected chapter object
     */
    function selectChapter(chapter) {
        // Store active chapter
        activeChapter = chapter;
        
        // Update UI to show selected chapter with animation
        currentChapterTitle.classList.add('fade-out');
        
        setTimeout(() => {
            currentChapterTitle.textContent = chapter.title;
            currentChapterTitle.classList.remove('fade-out');
            currentChapterTitle.classList.add('title-update');
            
            setTimeout(() => {
                currentChapterTitle.classList.remove('title-update');
            }, 500);
        }, 300);
        
        // Update visualization info with fade animation
        visualizationInfo.classList.add('fade-out');
        
            setTimeout(() => {
        visualizationInfo.innerHTML = `
            <div class="visualization-content">
                <div class="visualization-image-container">
                    ${chapter.image ? `<img src="${chapter.image}" alt="${chapter.title} image" class="visualization-image" />` : ''}
                </div>
                <div class="visualization-text">
                    <h3>${chapter.title}</h3>
                    <p>${chapter.description}</p>
                </div>
            </div>
        `;
        visualizationInfo.classList.remove('fade-out');
        visualizationInfo.classList.add('fade-in');

        setTimeout(() => {
            visualizationInfo.classList.remove('fade-in');
        }, 500);
    }, 300);


        // Funzione ricorsiva per appiattire concepts + subconcepts
        function flattenConcepts(concepts) {
        let allConcepts = [];

        concepts.forEach(concept => {
        allConcepts.push(concept);
        if (concept.subconcepts && concept.subconcepts.length > 0) {
            allConcepts = allConcepts.concat(flattenConcepts(concept.subconcepts));
        }
        });

    return allConcepts;
}
        
        // Update visualization with animation
        if (window.updateVisualization) {
            const allConcepts = flattenConcepts(chapter.concepts);
             window.updateVisualization(allConcepts);
        }
        
        // Update active state on cards with animation
        document.querySelectorAll('.chapter-card').forEach(card => {
            if (card.dataset.id === chapter.id) {
                if (!card.classList.contains('active')) {
                    card.classList.add('active', 'card-activate');
                    setTimeout(() => {
                        card.classList.remove('card-activate');
                    }, 500);
                }
            } else {
                card.classList.remove('active');
            }
        });
        
        // Close drawer on mobile after selection with animation
        if (window.innerWidth <= 768) {
            closeDrawer();
        }
    }
});