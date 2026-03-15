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

const instagramCarousel = document.getElementById('instagramCarousel');
const instagramPrev = document.getElementById('instagramPrev');
const instagramNext = document.getElementById('instagramNext');

if (instagramCarousel && instagramPrev && instagramNext) {
  const getScrollAmount = () => {
    const firstPost = instagramCarousel.querySelector('.instagram-post');
    if (!firstPost) return 300;
    return firstPost.offsetWidth + 2;
  };

  instagramPrev.addEventListener('click', () => {
    instagramCarousel.scrollBy({
      left: -getScrollAmount(),
      behavior: 'smooth'
    });
  });

  instagramNext.addEventListener('click', () => {
    instagramCarousel.scrollBy({
      left: getScrollAmount(),
      behavior: 'smooth'
    });
  });
}

const teamCarousel = document.getElementById('teamCarousel');
const teamPrev = document.getElementById('teamPrev');
const teamNext = document.getElementById('teamNext');

if (teamCarousel && teamPrev && teamNext) {
  const getTeamScrollAmount = () => {
    const firstCard = teamCarousel.querySelector('.team-card');
    if (!firstCard) return 320;
    return firstCard.offsetWidth + 18;
  };

  teamPrev.addEventListener('click', () => {
    teamCarousel.scrollBy({
      left: -getTeamScrollAmount(),
      behavior: 'smooth'
    });
  });

  teamNext.addEventListener('click', () => {
    teamCarousel.scrollBy({
      left: getTeamScrollAmount(),
      behavior: 'smooth'
    });
  });
}
