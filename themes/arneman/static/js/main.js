/**
 * Donye Wilson — Video Editor & 3D Motion Graphics Portfolio
 * Rowan-Inspired Liquid Glass Experience, Category Filtering & Dynamic Scroll-Blur Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const rows = document.querySelectorAll('.rowan-work-row');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const activeFilterSubtext = document.getElementById('active-filter-subtext');
  const bgVideo = document.querySelector('.bg-video-element');
  const bgOverlay = document.querySelector('.bg-video-overlay');

  // ==========================================================================
  // DYNAMIC SCROLL-BLUR & PROGRESSIVE CINEMATIC DEPTH OF FIELD
  // Smoothly increases blur on scroll to maximize typography legibility
  // ==========================================================================
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const blurThreshold = 550; // Pixels until full frosted cinema blur
        const progress = Math.min(scrollY / blurThreshold, 1);

        if (bgVideo) {
          const blurAmount = (progress * 24).toFixed(1); // 0px -> 24px blur
          const brightness = (138 - (progress * 30)).toFixed(0); // 138% -> 108%
          bgVideo.style.filter = `contrast(112%) brightness(${brightness}%) saturate(155%) blur(${blurAmount}px)`;
        }

        if (bgOverlay) {
          // Gently increase dark optical shield as you enter content
          bgOverlay.style.backgroundColor = `rgba(11, 14, 23, ${(progress * 0.45).toFixed(2)})`;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Row Expand / Collapse Toggle on Click
  rows.forEach(row => {
    const summaryBar = row.querySelector('.row-summary-bar');
    if (!summaryBar) return;

    summaryBar.addEventListener('click', () => {
      const isExpanded = row.classList.contains('expanded');
      
      // Close other rows for clean single-focus playback
      rows.forEach(r => {
        r.classList.remove('expanded');
        const v = r.querySelector('video');
        if (v && v !== row.querySelector('video')) {
          v.pause();
        }
      });

      if (!isExpanded) {
        row.classList.add('expanded');
        const video = row.querySelector('video');
        if (video) {
          video.play().catch(() => {});
        }
      }
    });
  });

  // Top Category Tabs Filtering Logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      let visibleCount = 0;
      let firstExpanded = false;

      rows.forEach(row => {
        const cat = row.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          row.style.display = 'block';
          visibleCount++;
          if (!firstExpanded) {
            row.classList.add('expanded');
            firstExpanded = true;
            const v = row.querySelector('video');
            if (v) v.play().catch(() => {});
          } else {
            row.classList.remove('expanded');
          }
        } else {
          row.style.display = 'none';
          row.classList.remove('expanded');
          const v = row.querySelector('video');
          if (v) v.pause();
        }
      });

      if (activeFilterSubtext) {
        const title = btn.textContent.trim();
        activeFilterSubtext.textContent = `FILTERED: ${title} (${visibleCount} VISIBLE)`;
      }

      // Smooth scroll to works container
      const worksContainer = document.getElementById('works-stage');
      if (worksContainer) {
        worksContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Commission Brief Modal Dialog
  const briefModal = document.getElementById('brief-modal');
  const btnOpenBrief = document.getElementById('btn-open-brief');
  const btnCloseModal = document.getElementById('btn-close-modal');

  if (btnOpenBrief && briefModal) {
    btnOpenBrief.addEventListener('click', () => {
      briefModal.classList.add('open');
    });
  }
  if (btnCloseModal && briefModal) {
    btnCloseModal.addEventListener('click', () => {
      briefModal.classList.remove('open');
    });
  }
  if (briefModal) {
    briefModal.addEventListener('click', (e) => {
      if (e.target === briefModal) briefModal.classList.remove('open');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && briefModal) {
      briefModal.classList.remove('open');
    }
  });
});
