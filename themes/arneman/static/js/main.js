/**
 * Donye Wilson — Video Editor & 3D Motion Graphics Portfolio
 * Interactive Showcase & Playback Engine for All Assets
 */
document.addEventListener('DOMContentLoaded', () => {
  const playlistCards = document.querySelectorAll('.playlist-card');
  const showcaseContainer = document.getElementById('showcase-media-container');
  const badgeText = document.getElementById('active-badge-text');
  const activeTimecode = document.getElementById('active-timecode');
  const metaTitle = document.getElementById('meta-title');
  const metaRole = document.getElementById('meta-role');
  const metaClient = document.getElementById('meta-client');
  const metaDesc = document.getElementById('meta-description');
  const metaPipeline = document.getElementById('meta-pipeline');
  const metaTools = document.getElementById('meta-tools');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const btnMuteToggle = document.getElementById('btn-mute-toggle');
  const timelineFill = document.getElementById('timeline-fill');
  const timelineThumb = document.getElementById('timeline-thumb');
  const timelineBar = document.getElementById('timeline-bar');
  const playlistCountBadge = document.getElementById('playlist-count-badge');
  const totalReelsCount = document.getElementById('total-reels-count');
  let currentVideo = document.getElementById('main-showcase-video');

  // Update total counts
  if (totalReelsCount) totalReelsCount.textContent = `${playlistCards.length} ASSETS`;
  if (playlistCountBadge) playlistCountBadge.textContent = `${playlistCards.length} ENTRIES`;

  // Clicking ANY card on the right immediately switches the left showcase video/image
  playlistCards.forEach(card => {
    card.addEventListener('click', () => {
      // Highlight active card
      playlistCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Extract metadata from card
      const type = card.getAttribute('data-type');
      const src = card.getAttribute('data-src');
      const title = card.getAttribute('data-title');
      const client = card.getAttribute('data-client');
      const role = card.getAttribute('data-role');
      const desc = card.getAttribute('data-desc');
      const pipeline = card.getAttribute('data-pipeline');
      const tools = card.getAttribute('data-tools');
      const time = card.getAttribute('data-time') || '01:00';

      // Update left showcase media
      if (type === 'video') {
        showcaseContainer.innerHTML = `
          <video id="main-showcase-video" class="showcase-video" src="${src}" autoplay muted loop playsinline></video>
          <div class="showcase-video-overlay">
            <span class="active-badge-pill" id="active-badge-text">
              <span class="refraction-orb" style="width: 8px; height: 8px;"></span>
              SHOWCASE: ${title}
            </span>
            <span class="timecode-pill" id="active-timecode">00:00 / ${time}</span>
          </div>
        `;
        currentVideo = document.getElementById('main-showcase-video');
        attachVideoEvents(currentVideo);
        if (btnPlayPause) {
          btnPlayPause.style.display = 'flex';
          btnPlayPause.innerHTML = '<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"></polygon></svg>';
        }
        if (btnMuteToggle) {
          btnMuteToggle.style.display = 'inline-flex';
          btnMuteToggle.textContent = 'UNMUTE AUDIO';
        }
      } else {
        showcaseContainer.innerHTML = `
          <img class="showcase-img" src="${src}" alt="${title}" />
          <div class="showcase-video-overlay">
            <span class="active-badge-pill" id="active-badge-text">
              <span class="refraction-orb" style="width: 8px; height: 8px;"></span>
              SHOWCASE: ${title}
            </span>
            <span class="timecode-pill" id="active-timecode">LOOP / ${time}</span>
          </div>
        `;
        currentVideo = null;
        if (btnPlayPause) btnPlayPause.style.display = 'none';
        if (btnMuteToggle) btnMuteToggle.style.display = 'none';
        if (timelineFill) timelineFill.style.width = '100%';
        if (timelineThumb) timelineThumb.style.left = '100%';
      }

      // Update metadata description sheet
      if (metaTitle) metaTitle.textContent = title;
      if (metaRole) metaRole.textContent = `ROLE: ${role}`;
      if (metaClient) metaClient.textContent = client;
      if (metaDesc) metaDesc.textContent = desc;
      if (metaPipeline) metaPipeline.textContent = pipeline;
      if (metaTools) metaTools.textContent = tools;

      // Smooth scroll showcase into view on mobile
      if (window.innerWidth < 1100) {
        showcaseContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // Play/Pause and Audio Controls
  function attachVideoEvents(videoEl) {
    if (!videoEl) return;
    videoEl.addEventListener('timeupdate', () => {
      if (videoEl.duration) {
        const pct = (videoEl.currentTime / videoEl.duration) * 100;
        if (timelineFill) timelineFill.style.width = pct + '%';
        if (timelineThumb) timelineThumb.style.left = pct + '%';
        
        const curM = Math.floor(videoEl.currentTime / 60);
        const curS = Math.floor(videoEl.currentTime % 60);
        const durM = Math.floor(videoEl.duration / 60);
        const durS = Math.floor(videoEl.duration % 60);
        const timecodeEl = document.getElementById('active-timecode');
        if (timecodeEl) {
          timecodeEl.textContent = `${String(curM).padStart(2,'0')}:${String(curS).padStart(2,'0')} / ${String(durM).padStart(2,'0')}:${String(durS).padStart(2,'0')}`;
        }
      }
    });
  }

  if (currentVideo) attachVideoEvents(currentVideo);

  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
      if (!currentVideo) return;
      if (currentVideo.paused) {
        currentVideo.play();
        btnPlayPause.innerHTML = '<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"></polygon></svg>';
      } else {
        currentVideo.pause();
        btnPlayPause.innerHTML = '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
      }
    });
  }

  if (btnMuteToggle) {
    btnMuteToggle.addEventListener('click', () => {
      if (!currentVideo) return;
      currentVideo.muted = !currentVideo.muted;
      btnMuteToggle.textContent = currentVideo.muted ? 'UNMUTE AUDIO' : 'MUTE AUDIO';
    });
  }

  // Interactive timeline scrubbing
  if (timelineBar) {
    timelineBar.addEventListener('click', (e) => {
      if (!currentVideo || !currentVideo.duration) return;
      const rect = timelineBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      currentVideo.currentTime = pct * currentVideo.duration;
    });
  }

  // Filter Buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      let visibleCount = 0;
      playlistCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'grid';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (playlistCountBadge) {
        playlistCountBadge.textContent = `${visibleCount} ENTRIES`;
      }
    });
  });

  // Commission Brief Modal Handlers
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
    if (e.key === 'Escape' && briefModal) briefModal.classList.remove('open');
    if (e.code === 'Space' && e.target === document.body && btnPlayPause && currentVideo) {
      e.preventDefault();
      btnPlayPause.click();
    }
    if (e.key.toLowerCase() === 'f') {
      const frame = document.querySelector('.showcase-liquid-frame');
      if (frame) {
        if (!document.fullscreenElement) {
          frame.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
      }
    }
  });
});
