// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // --- Active Navigation Link Highlighting ---
    const navLinks = document.querySelectorAll('nav ul li a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'; // Get current page filename

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();

        // Handle the root case (index.html)
        if (currentPage === 'index.html' && (linkPage === 'index.html' || linkPage === '')) {
             link.classList.add('active-nav');
        }
        // Handle other pages
        else if (linkPage === currentPage) {
            link.classList.add('active-nav');
        } else {
            link.classList.remove('active-nav'); // Ensure others are not active
        }
    });

    // --- Portfolio Item Expansion ---
    window.attachPortfolioToggleListeners = function() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        portfolioItems.forEach(item => {
            // Check if listeners are already attached to prevent duplicates if called multiple times on same static items
            // A simple way is to add a marker, or ensure the logic is idempotent.
            // For this specific case, re-querying and attaching is generally fine for limited items,
            // but for many items, a marker like item.dataset.listenersAttached = 'true' would be better.
            // Given dynamic rendering, this is less of an issue for portfolio.html as items are new.
            // Let's proceed without a marker for now to keep it simpler, assuming items are new on re-render.

            const title = item.querySelector('.portfolio-item-title');
            const toggleLink = item.querySelector('.portfolio-toggle-link');
            const details = item.querySelector('.portfolio-item-details');

            // Function to toggle expansion
            const toggleExpansion = () => {
                // Ensure details div exists before trying to access its style
                if (details) {
                    const isExpanded = item.classList.contains('expanded');
                    item.classList.toggle('expanded');
                    if (details) { // Check again, though it should be defined if we got here
                        details.style.display = isExpanded ? 'none' : 'block'; // Explicitly manage display
                    }
                }
                if (toggleLink) {
                    toggleLink.textContent = item.classList.contains('expanded') ? 'View Less ▴' : 'View More ▾';
                }
            };
            
            // Ensure title and details exist before adding click listener to title
            if (title && details) {
                // Prevent adding multiple listeners to the same title if function is called again
                // This is a simple guard, more robust solutions might involve removing old listeners.
                if (!title.dataset.listenerAttached) {
                    title.addEventListener('click', toggleExpansion);
                    title.dataset.listenerAttached = 'true';
                }
            }

            // Ensure toggleLink and details exist before adding click listener to toggleLink
            if (toggleLink && details) {
                 if (!toggleLink.dataset.listenerAttached) {
                    toggleLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        toggleExpansion();
                    });
                    toggleLink.dataset.listenerAttached = 'true';
                }
            }
        });
    };
    
    window.attachPortfolioToggleListeners(); // Initial call for any static items (if any)

    // --- Smooth Scroll Behavior (Optional, if using anchor links) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if the link is just '#' (e.g., placeholder)
            if (this.getAttribute('href') === '#') {
                return; // Do nothing for placeholder links
            }
            // Check if the target element exists
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                e.preventDefault(); // Prevent default jump only if target exists
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            // If target doesn't exist, let the browser handle it (might be a link to another page)
        });
    });

}); // End DOMContentLoaded
