const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menu a');

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
}

menuLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (menu.classList.contains('active')) {
      menu.classList.remove('active');
    }
  });
});

/* =========================================
   CARROSSEL INFINITO PREMIUM
========================================= */
function createInfiniteCarousel({
  trackSelector,
  itemSelector,
  prevSelector,
  nextSelector,
  gap = 0,
  interval = 2200,
  transitionDuration = 360
}) {
  const track = document.querySelector(trackSelector);
  const prevBtn = document.querySelector(prevSelector);
  const nextBtn = document.querySelector(nextSelector);

  if (!track) return;

  const originalItems = Array.from(track.querySelectorAll(itemSelector));
  if (!originalItems.length) return;

  const getVisibleCount = () => {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    if (window.innerWidth <= 1100) return 3;
    return 4;
  };

  let visibleCount = getVisibleCount();

  const clonesBefore = originalItems
    .slice(-visibleCount)
    .map((item) => item.cloneNode(true));

  const clonesAfter = originalItems
    .slice(0, visibleCount)
    .map((item) => item.cloneNode(true));

  clonesBefore.forEach((clone) => {
    clone.classList.add('clone');
    track.insertBefore(clone, track.firstChild);
  });

  clonesAfter.forEach((clone) => {
    clone.classList.add('clone');
    track.appendChild(clone);
  });

  const getItems = () => Array.from(track.querySelectorAll(itemSelector));

  const getItemWidth = () => {
    const firstItem = track.querySelector(itemSelector);
    return firstItem ? firstItem.offsetWidth + gap : 300;
  };

  let currentIndex = visibleCount;
  let itemWidth = getItemWidth();
  let isTransitioning = false;
  let autoPlay = null;
  let resumeTimeout = null;

  let isDragging = false;
  let dragStartX = 0;
  let dragStartScrollLeft = 0;
  let dragMoved = false;

  const updateActiveItem = () => {
    const items = getItems();
    items.forEach((item) => item.classList.remove('is-active'));

    const center = track.scrollLeft + track.offsetWidth / 2;
    let closestItem = null;
    let closestDistance = Infinity;

    items.forEach((item) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(center - itemCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    });

    if (closestItem) {
      closestItem.classList.add('is-active');
    }
  };

  const jumpToIndex = (index) => {
    itemWidth = getItemWidth();
    track.scrollLeft = itemWidth * index;
    updateActiveItem();
  };

  jumpToIndex(currentIndex);

  const normalizePosition = () => {
    const totalOriginal = originalItems.length;

    if (currentIndex >= totalOriginal + visibleCount) {
      currentIndex = visibleCount;
      jumpToIndex(currentIndex);
    } else if (currentIndex < visibleCount) {
      currentIndex = totalOriginal + visibleCount - 1;
      jumpToIndex(currentIndex);
    } else {
      updateActiveItem();
    }
  };

  const goToIndex = (index) => {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex = index;
    itemWidth = getItemWidth();

    track.scrollTo({
      left: itemWidth * currentIndex,
      behavior: 'smooth'
    });

    window.setTimeout(() => {
      normalizePosition();
      isTransitioning = false;
    }, transitionDuration);
  };

  const next = () => goToIndex(currentIndex + 1);
  const prev = () => goToIndex(currentIndex - 1);

  const stopAutoPlay = () => {
    if (autoPlay) {
      clearInterval(autoPlay);
      autoPlay = null;
    }
    if (resumeTimeout) {
      clearTimeout(resumeTimeout);
      resumeTimeout = null;
    }
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlay = window.setInterval(() => {
      next();
    }, interval);
  };

  const scheduleResume = () => {
    if (resumeTimeout) clearTimeout(resumeTimeout);
    resumeTimeout = window.setTimeout(() => {
      startAutoPlay();
    }, 2500);
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoPlay();
      next();
      scheduleResume();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoPlay();
      prev();
      scheduleResume();
    });
  }

  const pointerDown = (clientX) => {
    stopAutoPlay();
    isDragging = true;
    dragMoved = false;
    dragStartX = clientX;
    dragStartScrollLeft = track.scrollLeft;
    track.classList.add('dragging');
  };

  const pointerMove = (clientX) => {
    if (!isDragging) return;

    const walk = clientX - dragStartX;
    if (Math.abs(walk) > 5) {
      dragMoved = true;
    }

    track.scrollLeft = dragStartScrollLeft - walk;
    updateActiveItem();
  };

  const pointerUp = () => {
    if (!isDragging) return;

    isDragging = false;
    track.classList.remove('dragging');

    const movedDistance = track.scrollLeft - dragStartScrollLeft;
    const threshold = itemWidth * 0.18;

    if (Math.abs(movedDistance) < threshold) {
      track.scrollTo({
        left: itemWidth * currentIndex,
        behavior: 'smooth'
      });

      window.setTimeout(() => {
        updateActiveItem();
      }, transitionDuration);

      scheduleResume();
      return;
    }

    if (movedDistance > 0) {
      next();
    } else {
      prev();
    }

    scheduleResume();
  };

  track.addEventListener('mousedown', (e) => {
    pointerDown(e.pageX);
  });

  window.addEventListener('mousemove', (e) => {
    pointerMove(e.pageX);
  });

  window.addEventListener('mouseup', () => {
    pointerUp();
  });

  track.addEventListener(
    'touchstart',
    (e) => {
      pointerDown(e.touches[0].clientX);
    },
    { passive: true }
  );

  track.addEventListener(
    'touchmove',
    (e) => {
      pointerMove(e.touches[0].clientX);
    },
    { passive: true }
  );

  track.addEventListener(
    'touchend',
    () => {
      pointerUp();
    },
    { passive: true }
  );

  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', () => {
    if (!isDragging) startAutoPlay();
  });

  track.addEventListener('scroll', () => {
    updateActiveItem();
  });

  const clickableItems = track.querySelectorAll('a, article');
  clickableItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });

  window.addEventListener('resize', () => {
    visibleCount = getVisibleCount();
    itemWidth = getItemWidth();
    jumpToIndex(currentIndex);
  });

  updateActiveItem();
  startAutoPlay();
}

/* Instagram */
createInfiniteCarousel({
  trackSelector: '#instagramCarousel',
  itemSelector: '.instagram-post',
  prevSelector: '#instagramPrev',
  nextSelector: '#instagramNext',
  gap: 2,
  interval: 1400,
  transitionDuration: 320
});

/* Equipe */
createInfiniteCarousel({
  trackSelector: '#teamCarousel',
  itemSelector: '.team-card',
  prevSelector: '#teamPrev',
  nextSelector: '#teamNext',
  gap: 18,
  interval: 1500,
  transitionDuration: 340
});