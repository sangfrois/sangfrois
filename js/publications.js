
// Note: This script relies on Citation.js being loaded globally via CDN.

document.addEventListener('DOMContentLoaded', () => {
    const statsContainer = document.getElementById('publication-stats');
    const listContainer = document.getElementById('publications-list');
    const bibtexPath = '../assets/pubs.bib'; // Relative path from publications.html

    if (!listContainer || !statsContainer) {
        console.error('Required HTML elements (publication-stats or publications-list) not found.');
        if (statsContainer) statsContainer.innerHTML = '<p>Error: Missing publications list container.</p>';
        if (listContainer) listContainer.innerHTML = '<p>Error: Missing statistics container.</p>';
        return;
    }

    // Ensure Citation object is available from the CDN script
    if (typeof Citation === 'undefined') {
         console.error('Citation.js library not loaded. Ensure the CDN link is correct and loads before this script.');
         statsContainer.innerHTML = '<p>Error: Citation library missing.</p>';
         listContainer.innerHTML = '<p style="text-align: center; color: red;">Error: Citation library missing.</p>';
         return;
    }
    const Cite = Citation; // Use the global Citation object

    // Fetch the BibTeX file
    fetch(bibtexPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} fetching ${bibtexPath}`);
            }
            return response.text();
        })
        .then(bibtexString => {
            if (!bibtexString) {
                throw new Error('BibTeX file is empty or could not be read.');
            }
            
            const publications = new Cite(bibtexString);
            const publicationData = publications.data;

            // --- Calculate Statistics ---
            const totalPublications = publicationData.length;
            
            // --- Render Statistics ---
            statsContainer.innerHTML = `
                <p>Total Publications: ${totalPublications}</p>
                <!-- Add more stats here if needed -->
            `;

            // --- Render Publications ---
            if (totalPublications > 0) {
                let publicationsHTML = '';
                // Sort publications by year, descending (most recent first)
                publicationData.sort((a, b) => {
                    const yearA = a.issued && a.issued['date-parts'] ? parseInt(a.issued['date-parts'][0][0], 10) : 0;
                    const yearB = b.issued && b.issued['date-parts'] ? parseInt(b.issued['date-parts'][0][0], 10) : 0;
                    return yearB - yearA; // Descending order
                });

                publicationData.forEach((pub, index) => {
                    // Extract data safely
                    const title = pub.title || 'No Title';
                    // Format authors: Handle potential variations in structure
                    let authors = 'No Authors';
                    if (pub.author && Array.isArray(pub.author)) {
                        authors = pub.author.map(a => {
                            if (a.literal) return a.literal; // Handle literal names like {Company Name}
                            return `${a.given ? a.given + ' ' : ''}${a.family || ''}`;
                        }).join(', ');
                    }
                    
                    const year = pub.issued && pub.issued['date-parts'] ? pub.issued['date-parts'][0][0] : 'No Year';
                    
                    let containerTitle = 'Unknown Source';
                    if (pub.type === 'article-journal' && pub['container-title']) {
                        containerTitle = `<i>${pub['container-title']}</i>`;
                    } else if (pub.type === 'paper-conference' && pub['container-title']) {
                         containerTitle = `In <i>${pub['container-title']}</i>`;
                    } else if (pub['event-title']) { // Fallback for conference proceedings title
                         containerTitle = `In <i>${pub['event-title']}</i>`;
                    } else if (pub.publisher) { // For books etc.
                        containerTitle = pub.publisher;
                    } else if (pub.journal) { // Fallback for journal field if container-title is missing
                         containerTitle = `<i>${pub.journal}</i>`;
                    }


                    const doi = pub.DOI ? `<a href="https://doi.org/${pub.DOI}" target="_blank" rel="noopener noreferrer">DOI:${pub.DOI}</a>` : '';
                    const url = pub.URL ? `<a href="${pub.URL}" target="_blank" rel="noopener noreferrer">Link</a>` : '';
                    
                    // Extract arXiv ID more robustly
                    let arxivLink = '';
                    if (pub.eprint && (pub.archivePrefix === 'arXiv' || (pub.journal && pub.journal.toLowerCase().includes('arxiv')))) {
                         // Use eprint field directly if available and context suggests arXiv
                         arxivLink = `<a href="https://arxiv.org/abs/${pub.eprint}" target="_blank" rel="noopener noreferrer">arXiv:${pub.eprint}</a>`;
                    } else if (pub.journal && pub.journal.match(/arxiv[: ](\d+\.\d+)/i)) {
                         // Fallback: try to extract from journal field if eprint is missing
                         const match = pub.journal.match(/arxiv[: ](\d+\.\d+)/i);
                         arxivLink = `<a href="https://arxiv.org/abs/${match[1]}" target="_blank" rel="noopener noreferrer">arXiv:${match[1]}</a>`;
                    }


                    // Build links section
                    let linksHTML = [doi, arxivLink, url].filter(Boolean).join(' | '); // Filter out empty strings and join

                    publicationsHTML += `
                        <div class="publication-entry">
                            <p class="pub-authors">${authors} (${year}).</p>
                            <p class="pub-title">${title}.</p>
                            <p class="pub-source">${containerTitle}.</p>
                            ${linksHTML ? `<p class="pub-links">${linksHTML}</p>` : ''}
                        </div>
                    `;
                });
                listContainer.innerHTML = publicationsHTML;
            } else {
                listContainer.innerHTML = '<p style="text-align: center;">No publications found in the BibTeX file.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing BibTeX:', error);
            statsContainer.innerHTML = '<p>Could not load statistics.</p>';
            listContainer.innerHTML = `<p style="text-align: center; color: red;">Error loading publications: ${error.message}. Please check the console and ensure '../assets/pubs.bib' exists and is accessible.</p>`;
        });
});
