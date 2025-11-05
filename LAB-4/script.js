// Basic slideshow: autoplay + manual controls
document.addEventListener('DOMContentLoaded', function() {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const playPauseBtn = document.getElementById('playPause');

  let index = 0;
  let playing = true;
  const intervalTime = 4000;
  let timer = null;

  function showSlide(i) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    index = (i + slides.length) % slides.length;
    slides[index].classList.add('active');
    dots[index].classList.add('active');
  }

  function next() { showSlide(index + 1); }
  function prev() { showSlide(index - 1); }

  function start() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, intervalTime);
    playPauseBtn.textContent = '⏸';
    playing = true;
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    playPauseBtn.textContent = '▶';
    playing = false;
  }

  // wire buttons
  nextBtn.addEventListener('click', () => { next(); if (playing) start(); });
  prevBtn.addEventListener('click', () => { prev(); if (playing) start(); });
  playPauseBtn.addEventListener('click', () => { playing ? stop() : start(); });

  dots.forEach((d, i) => d.addEventListener('click', () => { showSlide(i); if (playing) start(); }));

  // keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === ' ') { e.preventDefault(); playing ? stop() : start(); }
  });

  showSlide(0);
  start();

  // Mobile menu toggle (small screens)
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') navLinks.style.display = 'none';
      else navLinks.style.display = 'flex';
    });
  }
});
