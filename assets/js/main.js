const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const lastUpdatedElement = document.getElementById('last-updated');
if (lastUpdatedElement) {
  const rawLastModified = document.lastModified;
  const updated = new Date(rawLastModified);
  if (!Number.isNaN(updated.getTime())) {
    lastUpdatedElement.textContent = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(updated);
  } else if (rawLastModified && rawLastModified.trim()) {
    lastUpdatedElement.textContent = rawLastModified;
  } else {
    lastUpdatedElement.textContent = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date());
  }
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealItems.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function prettifyFileName(fileName) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim();
}

function isImageName(name) {
  return /\.(jpe?g|png|webp|gif|avif)$/i.test(name);
}

function inferGitHubRepo(user) {
  const host = window.location.hostname.toLowerCase();
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const pathFirstPart = pathParts[0] || '';
  const looksLikeFile = /\.[a-z0-9]+$/i.test(pathFirstPart);

  if (host.endsWith('github.io')) {
    if (pathFirstPart && !looksLikeFile) {
      return pathFirstPart;
    }
    return `${user}.github.io`;
  }

  return `${user}.github.io`;
}

async function loadRandomPhotos() {
  const grid = document.getElementById('photo-grid');
  if (!grid) {
    return;
  }

  const randomizeButton = document.getElementById('randomize-photos');
  const newestButton = document.getElementById('sort-newest');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let allImages = [];
  let activeMode = 'random';
  let currentList = [];
  let lightboxIndex = -1;

  const user = grid.dataset.githubUser || 'DhakadPankaj';
  const repo = grid.dataset.githubRepo || inferGitHubRepo(user);
  const photosPath = grid.dataset.githubPath || 'assets/photos';
  const requestedLimit = Number.parseInt(grid.dataset.photoLimit || '50', 10);
  const limit = Number.isNaN(requestedLimit) ? 50 : requestedLimit;
  const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${photosPath}`;

  function setActiveMode(mode) {
    activeMode = mode;
    if (newestButton) {
      newestButton.classList.toggle('active', mode === 'newest');
    }
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImage || !lightboxCaption) {
      return;
    }
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    lightboxImage.alt = '';
    lightboxCaption.textContent = '';
    lightboxIndex = -1;
    document.body.style.overflow = '';
  }

  function showLightbox(index) {
    if (!lightbox || !lightboxImage || !lightboxCaption) {
      return;
    }
    if (index < 0 || index >= currentList.length) {
      return;
    }

    lightboxIndex = index;
    const imageFile = currentList[index];
    const alt = prettifyFileName(imageFile.name) || 'Photo';
    lightboxImage.src = imageFile.download_url;
    lightboxImage.alt = alt;
    lightboxCaption.textContent = alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function showRelativeImage(delta) {
    if (lightboxIndex === -1 || currentList.length === 0) {
      return;
    }
    const next = (lightboxIndex + delta + currentList.length) % currentList.length;
    showLightbox(next);
  }

  function renderPhotos(images) {
    currentList = images;
    if (images.length === 0) {
      grid.innerHTML = '<p class="muted">No images found in assets/photos yet.</p>';
      return;
    }

    grid.innerHTML = images.map((file, index) => {
      const alt = prettifyFileName(file.name) || 'Photo';
      return `
        <figure class="photo-tile" data-photo-index="${index}">
          <img src="${file.download_url}" alt="${alt}" loading="lazy">
          <figcaption>${alt}</figcaption>
        </figure>
      `;
    }).join('');
  }

  function applySortMode() {
    const ordered = activeMode === 'newest'
      ? [...allImages].sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }))
      : shuffleArray(allImages);
    const selected = ordered.slice(0, Math.min(limit, ordered.length));
    renderPhotos(selected);
  }

  grid.addEventListener('click', (event) => {
    const tile = event.target.closest('.photo-tile');
    if (!tile) {
      return;
    }
    const index = Number.parseInt(tile.dataset.photoIndex || '-1', 10);
    showLightbox(index);
  });

  if (randomizeButton) {
    randomizeButton.addEventListener('click', () => {
      setActiveMode('random');
      applySortMode();
    });
  }

  if (newestButton) {
    newestButton.addEventListener('click', () => {
      setActiveMode('newest');
      applySortMode();
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => showRelativeImage(-1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => showRelativeImage(1));
  }

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (!lightbox || !lightbox.classList.contains('open')) {
      return;
    }
    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      showRelativeImage(-1);
    } else if (event.key === 'ArrowRight') {
      showRelativeImage(1);
    }
  });

  try {
    const response = await fetch(apiUrl, { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const files = await response.json();
    const images = Array.isArray(files)
      ? files.filter((file) => file.type === 'file' && isImageName(file.name))
      : [];

    allImages = images;

    if (allImages.length === 0) {
      grid.innerHTML = '<p class="muted">No images found in assets/photos yet.</p>';
      return;
    }

    setActiveMode('random');
    applySortMode();
  } catch (error) {
    grid.innerHTML = '<p class="muted">Could not load photos automatically yet. After push, refresh this page in GitHub Pages.</p>';
  }
}

loadRandomPhotos();
