import bibtexparser
import os
import re
from bibtexparser.bparser import BibTexParser
from bibtexparser.customization import homogenize_latex_encoding, latex_to_unicode

# --- Configuration ---
BIB_FILE_PATH = 'assets/pubs.bib'
HTML_TEMPLATE_PATH = 'pages/publications.html'
HTML_OUTPUT_PATH = 'pages/publications.html' # Overwrite the template file

STATS_PLACEHOLDER_START = '<!-- STATS_PLACEHOLDER -->'
STATS_PLACEHOLDER_END = '<!-- STATS_PLACEHOLDER -->'
PUBS_PLACEHOLDER_START = '<!-- PUBLICATIONS_LIST_PLACEHOLDER -->'
PUBS_PLACEHOLDER_END = '<!-- PUBLICATIONS_LIST_PLACEHOLDER -->'

# --- Helper Functions ---
def format_authors(authors_list):
    """Formats a list of author dictionaries into a string."""
    if not authors_list:
        return "N/A"
    
    formatted_authors = []
    for author_str in authors_list: # bibtexparser returns list of strings
        parts = author_str.split(',')
        if len(parts) == 2:
            last = parts[0].strip()
            first = parts[1].strip()
            # Handle potential braces around names
            last = last.replace('{', '').replace('}', '')
            first = first.replace('{', '').replace('}', '')
            formatted_authors.append(f"{first} {last}")
        else:
             # Handle single names or different formats, removing braces
            formatted_authors.append(author_str.replace('{', '').replace('}', '').strip())
            
    return ", ".join(formatted_authors)

def get_entry_year(entry):
    """Safely extracts the year from a BibTeX entry."""
    return int(entry.get('year', '0'))

def create_link(url, text):
    """Creates an HTML anchor tag."""
    return f'<a href="{url}" target="_blank" rel="noopener noreferrer">{text}</a>'

def format_entry_html(entry):
    """Formats a single BibTeX entry into an HTML block."""
    authors = format_authors(entry.get('author', '').split(' and ')) # Split authors string
    title = entry.get('title', 'N/A').replace('{', '').replace('}', '') # Remove braces from title
    year = entry.get('year', 'N/A')
    
    # Determine source (journal, booktitle, etc.)
    source = ""
    if 'journal' in entry:
        source = f"<i>{entry['journal'].replace('{', '').replace('}', '')}</i>"
    elif 'booktitle' in entry:
         source = f"In <i>{entry['booktitle'].replace('{', '').replace('}', '')}</i>"
    elif 'publisher' in entry:
        source = entry['publisher'].replace('{', '').replace('}', '')
    else:
        source = "N/A"

    # Create links
    links = []
    if 'doi' in entry:
        links.append(create_link(f"https://doi.org/{entry['doi']}", f"DOI:{entry['doi']}"))
    if 'eprint' in entry and 'archiveprefix' in entry and entry['archiveprefix'].lower() == 'arxiv':
         links.append(create_link(f"https://arxiv.org/abs/{entry['eprint']}", f"arXiv:{entry['eprint']}"))
    elif 'eprint' in entry and 'journal' in entry and 'arxiv' in entry['journal'].lower(): # Fallback if archiveprefix missing
         links.append(create_link(f"https://arxiv.org/abs/{entry['eprint']}", f"arXiv:{entry['eprint']}"))
    if 'url' in entry:
        # Only add general URL if no specific identifier (DOI/arXiv) is present
        if not any(l for l in links if 'DOI:' in l or 'arXiv:' in l):
             links.append(create_link(entry['url'], "Link"))
             
    links_html = " | ".join(links)

    # Assemble HTML block
    html = f"""
                <div class="publication-entry">
                    <p class="pub-authors">{authors} ({year}).</p>
                    <p class="pub-title">{title}.</p>
                    <p class="pub-source">{source}.</p>
                    {f'<p class="pub-links">{links_html}</p>' if links_html else ''}
                </div>"""
    return html

# --- Main Script Logic ---
try:
    # Read BibTeX file
    with open(BIB_FILE_PATH, 'r', encoding='utf-8') as bibfile:
        # Use a parser that handles LaTeX conversion
        parser = BibTexParser(common_strings=True)
        parser.customization = homogenize_latex_encoding # Example customization
        parser.customization = latex_to_unicode # Example customization
        bib_database = bibtexparser.load(bibfile, parser=parser)

    # Calculate stats
    total_publications = len(bib_database.entries)
    stats_html = f"<p>Total Publications: {total_publications}</p>" # Simple count for now

    # Sort entries by year (descending)
    sorted_entries = sorted(bib_database.entries, key=get_entry_year, reverse=True)

    # Format entries into HTML
    publications_html = "\n".join([format_entry_html(entry) for entry in sorted_entries])
    if not publications_html:
        publications_html = '<p style="text-align: center;">No publications found.</p>'


    # Read HTML template
    with open(HTML_TEMPLATE_PATH, 'r', encoding='utf-8') as infile:
        template_content = infile.read()

    # Inject stats
    # Use regex for robust replacement between placeholders
    stats_pattern = re.compile(f"{re.escape(STATS_PLACEHOLDER_START)}.*?{re.escape(STATS_PLACEHOLDER_END)}", re.DOTALL)
    new_content = re.sub(stats_pattern, f"{STATS_PLACEHOLDER_START}\n{stats_html}\n                {STATS_PLACEHOLDER_END}", template_content, count=1)

    # Inject publications list
    pubs_pattern = re.compile(f"{re.escape(PUBS_PLACEHOLDER_START)}.*?{re.escape(PUBS_PLACEHOLDER_END)}", re.DOTALL)
    final_content = re.sub(pubs_pattern, f"{PUBS_PLACEHOLDER_START}\n{publications_html}\n                {PUBS_PLACEHOLDER_END}", new_content, count=1)


    # Write the final HTML
    with open(HTML_OUTPUT_PATH, 'w', encoding='utf-8') as outfile:
        outfile.write(final_content)

    print(f"Successfully updated '{HTML_OUTPUT_PATH}' with {total_publications} publications.")

except FileNotFoundError:
    print(f"Error: File not found. Ensure '{BIB_FILE_PATH}' and '{HTML_TEMPLATE_PATH}' exist.")
except Exception as e:
    print(f"An error occurred: {e}")
