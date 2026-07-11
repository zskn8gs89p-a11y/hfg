/* =============================================================
   NAVIGATION.JS — Fortschrittsbalken + aktive Navigation
   HfG Ulm E-Learning
   ============================================================= */

document.addEventListener('DOMContentLoaded', function () {

  // ----------------------------------------------------------
  // 1. FORTSCHRITTSBALKEN
  // Berechnet wie weit die Seite gescrollt wurde und
  // aktualisiert den Balken in der linken Sidebar.
  // ----------------------------------------------------------

  const progressFill   = document.querySelector('.progress-sidebar__fill');
  const progressMarker = document.querySelector('.progress-sidebar__marker');
  const progressPct    = document.querySelector('.progress-sidebar__pct');

  function updateProgress() {
    if (!progressFill) return;

    // Scrollbare Höhe = Gesamthöhe - sichtbarer Bereich
    const scrollTop    = window.scrollY || document.documentElement.scrollTop;
    const docHeight    = document.documentElement.scrollHeight;
    const winHeight    = window.innerHeight;
    const scrollable   = docHeight - winHeight;

    // Fortschritt in Prozent (0–100)
    const pct = scrollable > 0
      ? Math.min(100, Math.round((scrollTop / scrollable) * 100))
      : 0;

    // Balken aktualisieren
    progressFill.style.height = pct + '%';

    // Marker-Position folgt dem Fortschritt
    if (progressMarker) {
      progressMarker.style.top = pct + '%';
    }

    // Prozent-Text
    if (progressPct) {
      progressPct.textContent = pct + '%';
    }
  }

  // Beim Scrollen aktualisieren (passiv für bessere Performance)
  window.addEventListener('scroll', updateProgress, { passive: true });

  // Initial einmal aufrufen
  updateProgress();


  // ----------------------------------------------------------
  // 2. AKTIVER NAV-PUNKT
  // Markiert den aktuellen Seiten-Link in der Navigation.
  // Liest den Dateinamen aus der aktuellen URL.
  // ----------------------------------------------------------

  const navLinks = document.querySelectorAll('.nav-link');

  // Aktuellen Seitennamen aus URL lesen
  // z.B. "/seiten/lehre.html" → "lehre"
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop().replace('.html', '');

  navLinks.forEach(function (link) {
    // data-page Attribut am Link vergleichen
    // z.B. <a class="nav-link" data-page="lehre" href="...">
    if (link.dataset.page === currentFile) {
      link.classList.add('is-active');
    }
  });


  // ----------------------------------------------------------
  // 3. SMOOTH SCROLL (für Seiten-interne Anker-Links)
  // ----------------------------------------------------------

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
