/**
 * ADP College BCA Department - Interactive Website Script
 * Provides continuous video playback, custom controls, milestone jump markers,
 * animated stat counters, photo lightbox, and responsive navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearSpan = document.querySelector('.footer-copyright');
  if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = `© ${currentYear} ADP College BCA Department. All rights reserved.`;
  }

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // 3. Hero Video Sound Toggle & Continuous Playback Ensurance
  const heroVideo = document.getElementById('heroVideo');
  const heroSoundToggle = document.getElementById('heroSoundToggle');

  function ensureAutoplay(videoEl) {
    if (!videoEl) return;
    videoEl.muted = true;
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback: Autoplay prevented, listen for first user interaction
        const startPlay = () => {
          videoEl.play();
          window.removeEventListener('click', startPlay);
          window.removeEventListener('touchstart', startPlay);
          window.removeEventListener('scroll', startPlay);
        };
        window.addEventListener('click', startPlay);
        window.addEventListener('touchstart', startPlay);
        window.addEventListener('scroll', startPlay);
      });
    }
  }

  if (heroVideo) {
    ensureAutoplay(heroVideo);

    if (heroSoundToggle) {
      heroSoundToggle.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        const icon = heroSoundToggle.querySelector('i');
        if (icon) {
          if (heroVideo.muted) {
            icon.className = 'fa-solid fa-volume-xmark';
          } else {
            icon.className = 'fa-solid fa-volume-high';
          }
        }
      });
    }
  }

  // 4. Main Highlights Video Player & Custom Controls
  const mainVideo = document.getElementById('mainVideo');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const restartBtn = document.getElementById('restartBtn');
  const muteToggleBtn = document.getElementById('muteToggleBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const progressBar = document.getElementById('progressBar');
  const progressContainer = document.getElementById('progressContainer');
  const timeDisplay = document.getElementById('timeDisplay');
  const playStateIndicator = document.getElementById('playStateIndicator');
  const markerChips = document.querySelectorAll('.marker-chip');

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function showPlayIndicator(isPlay) {
    if (!playStateIndicator) return;
    const icon = playStateIndicator.querySelector('i');
    if (icon) {
      icon.className = isPlay ? 'fa-solid fa-play' : 'fa-solid fa-pause';
    }
    playStateIndicator.classList.add('active');
    setTimeout(() => {
      playStateIndicator.classList.remove('active');
    }, 450);
  }

  if (mainVideo) {
    ensureAutoplay(mainVideo);

    // Toggle Play/Pause
    function togglePlay() {
      if (mainVideo.paused || mainVideo.ended) {
        mainVideo.play();
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        showPlayIndicator(true);
      } else {
        mainVideo.pause();
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        showPlayIndicator(false);
      }
    }

    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', togglePlay);
    }

    mainVideo.addEventListener('click', togglePlay);

    // Restart Video
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        mainVideo.currentTime = 0;
        mainVideo.play();
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      });
    }

    // Toggle Mute / Sound
    if (muteToggleBtn) {
      muteToggleBtn.addEventListener('click', () => {
        mainVideo.muted = !mainVideo.muted;
        if (mainVideo.muted) {
          muteToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        } else {
          muteToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        }
      });
    }

    // Progress Bar & Time Update
    mainVideo.addEventListener('timeupdate', () => {
      const current = mainVideo.currentTime;
      const duration = mainVideo.duration || 34;
      const percent = (current / duration) * 100;

      if (progressBar) {
        progressBar.style.width = `${percent}%`;
      }

      if (timeDisplay) {
        timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
      }

      // Update active milestone marker based on current timestamp
      markerChips.forEach((chip) => {
        const markerTime = parseFloat(chip.getAttribute('data-time'));
        const nextChip = chip.nextElementSibling;
        const nextTime = nextChip ? parseFloat(nextChip.getAttribute('data-time')) : duration + 1;

        if (current >= markerTime && current < nextTime) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    });

    // Seeking via Progress Bar Click
    if (progressContainer) {
      progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const duration = mainVideo.duration || 34;
        mainVideo.currentTime = (clickX / width) * duration;
      });
    }

    // Fullscreen Toggle
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          if (mainVideo.requestFullscreen) {
            mainVideo.requestFullscreen();
          } else if (mainVideo.webkitRequestFullscreen) {
            mainVideo.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      });
    }

    // Milestone Jump Marker Buttons
    markerChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const targetTime = parseFloat(chip.getAttribute('data-time'));
        if (!isNaN(targetTime)) {
          mainVideo.currentTime = targetTime;
          mainVideo.play();
          if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
      });
    });
  }

  // 5. Animated Number Statistics Counter
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function runCounters() {
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = Math.max(20, Math.floor(1500 / target));

      const updateCount = () => {
        const increment = Math.ceil(target / 40);
        count += increment;
        if (count >= target) {
          stat.textContent = `${target}${suffix}`;
        } else {
          stat.textContent = `${count}${suffix}`;
          setTimeout(updateCount, speed);
        }
      };

      updateCount();
    });
  }

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            runCounters();
          }
        });
      },
      { threshold: 0.25 }
    );

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }
  } else {
    runCounters();
  }

  // 6. Photo Gallery Lightbox Modal
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  const galleryData = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.caption');
    if (img) {
      galleryData.push({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || 'BCA Batch Photo',
        caption: caption ? caption.textContent.trim() : 'ADP College BCA Batch'
      });
    }

    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    if (index < 0 || index >= galleryData.length) return;
    currentGalleryIndex = index;
    const item = galleryData[currentGalleryIndex];

    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = item.caption;
    }
    if (lightboxModal) {
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function showPrevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    openLightbox(currentGalleryIndex);
  }

  function showNextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    openLightbox(currentGalleryIndex);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    }
  });

  // 7. Scroll to Top Button
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 320) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
