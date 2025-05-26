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
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioItems.forEach(item => {
        const title = item.querySelector('.portfolio-item-title');
        const toggleLink = item.querySelector('.portfolio-toggle-link');
        const details = item.querySelector('.portfolio-item-details');

        // Function to toggle expansion
        const toggleExpansion = () => {
            const isExpanded = item.classList.contains('expanded');
            item.classList.toggle('expanded');
            if (toggleLink) { // Check if toggleLink exists
                toggleLink.textContent = isExpanded ? 'View More ▾' : 'View Less ▴';
            }
        };

        // Event listener for the title
        if (title && details) { // Only add listener if title and details exist
            title.addEventListener('click', toggleExpansion);
        }

        // Event listener for the "View More/Less" link
        if (toggleLink && details) { // Only add listener if link and details exist
            toggleLink.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                toggleExpansion();
            });
        }
    });

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
