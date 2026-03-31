// ============================================
// Coach4U — Resource Fetching & Rendering
// ============================================

const STORAGE_BUCKET = 'resources';
const SIGNED_URL_EXPIRY = 3600; // 1 hour in seconds

// Section configuration: defines the 4 client-facing sections
const SECTIONS = [
  {
    id: 'relationships',
    title: 'Relationships',
    icon: '💛',
    storagePath: 'relationships',
  },
  {
    id: 'business',
    title: 'Business',
    icon: '💼',
    storagePath: 'business',
  },
  {
    id: 'leadership',
    title: 'Leadership',
    icon: '🧭',
    storagePath: 'leadership',
  },
  {
    id: 'strengths',
    title: 'Strengths',
    icon: '💪',
    storagePath: 'strengths',
  },
];

/**
 * Clean a filename for display.
 * "my-great-document.pdf" → "My Great Document"
 */
function cleanFileName(name) {
  return name
    .replace(/\.[^.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ')   // Replace hyphens/underscores with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Title case
}

/**
 * Get a file type badge class based on extension.
 */
function getFileType(name) {
  const ext = name.split('.').pop().toLowerCase();
  const types = {
    html: { label: 'VIEW', badgeClass: 'badge-html', viewable: true },
    pdf: { label: 'PDF', badgeClass: 'badge-pdf' },
    doc: { label: 'DOC', badgeClass: 'badge-doc' },
    docx: { label: 'DOCX', badgeClass: 'badge-doc' },
    xls: { label: 'XLS', badgeClass: 'badge-xls' },
    xlsx: { label: 'XLSX', badgeClass: 'badge-xls' },
    ppt: { label: 'PPT', badgeClass: 'badge-doc' },
    pptx: { label: 'PPTX', badgeClass: 'badge-doc' },
    png: { label: 'PNG', badgeClass: 'badge-img' },
    jpg: { label: 'JPG', badgeClass: 'badge-img' },
    jpeg: { label: 'JPEG', badgeClass: 'badge-img' },
  };
  return types[ext] || { label: ext.toUpperCase(), badgeClass: 'badge-default' };
}

/**
 * Fetch files from a Supabase Storage folder.
 */
async function fetchFiles(folderPath) {
  const { data, error } = await window.supabaseClient.storage
    .from(STORAGE_BUCKET)
    .list(folderPath, {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' },
    });

  if (error) {
    console.error(`Error fetching ${folderPath}:`, error.message);
    return [];
  }

  // Filter out folders (they have null metadata) and hidden files
  return (data || []).filter(
    (file) => file.metadata && !file.name.startsWith('.')
  );
}

/**
 * Get a signed download URL for a file.
 */
async function getSignedUrl(filePath) {
  const { data, error } = await window.supabaseClient.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(filePath, SIGNED_URL_EXPIRY);

  if (error) {
    console.error('Signed URL error:', error.message);
    return null;
  }

  return data.signedUrl;
}

/**
 * Create a document card DOM element.
 */
function createDocumentCard(file, folderPath) {
  const fileType = getFileType(file.name);
  const displayName = cleanFileName(file.name);
  const filePath = `${folderPath}/${file.name}`;

  const isViewable = fileType.viewable || false;
  const actionLabel = isViewable ? 'View' : 'Download';
  const btnClass = isViewable ? 'btn-primary' : 'btn-secondary';

  const card = document.createElement('article');
  card.className = 'card document-card';
  card.innerHTML = `
    <div class="doc-icon" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${isViewable
          ? '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>'
          : '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>'
        }
      </svg>
    </div>
    <div class="doc-info">
      <div class="doc-name" title="${displayName}">${displayName}</div>
      <span class="badge ${fileType.badgeClass}">${fileType.label}</span>
    </div>
    <div class="doc-download">
      <button class="btn ${btnClass} btn-sm" aria-label="${actionLabel} ${displayName}" data-path="${filePath}">
        ${actionLabel}
      </button>
    </div>
  `;

  const actionBtn = card.querySelector('button');
  actionBtn.addEventListener('click', async () => {
    actionBtn.disabled = true;
    actionBtn.textContent = '...';
    const url = await getSignedUrl(filePath);
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Unable to generate link. Please try again.');
    }
    actionBtn.disabled = false;
    actionBtn.textContent = actionLabel;
  });

  return card;
}

/**
 * Render a section with its documents.
 */
async function renderSection(section, container) {
  const sectionEl = document.createElement('section');
  sectionEl.id = section.id;
  sectionEl.setAttribute('aria-labelledby', `heading-${section.id}`);

  // Section header
  const header = document.createElement('div');
  header.className = 'section-header';
  header.innerHTML = `
    <span class="section-icon" aria-hidden="true">${section.icon}</span>
    <h2 id="heading-${section.id}">${section.title}</h2>
  `;
  sectionEl.appendChild(header);

  // Loading state
  const loadingEl = document.createElement('div');
  loadingEl.className = 'loading';
  loadingEl.innerHTML = '<div class="spinner"></div><span>Loading resources...</span>';
  sectionEl.appendChild(loadingEl);

  container.appendChild(sectionEl);

  // Fetch and render documents
  const files = await fetchFiles(section.storagePath);
  loadingEl.remove();

  if (files.length === 0) {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'empty-state';
    emptyEl.innerHTML = `
      <div class="empty-state-icon" aria-hidden="true">📂</div>
      <p>No resources available yet</p>
      <small>Check back soon — new materials are added regularly.</small>
    `;
    sectionEl.appendChild(emptyEl);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'document-grid';
  files.forEach((file) => {
    grid.appendChild(createDocumentCard(file, section.storagePath));
  });
  sectionEl.appendChild(grid);
}

/**
 * Initialize the portal: render all sections.
 */
async function initPortal() {
  const container = document.getElementById('resources-container');
  if (!container) return;

  for (const section of SECTIONS) {
    await renderSection(section, container);
  }
}
