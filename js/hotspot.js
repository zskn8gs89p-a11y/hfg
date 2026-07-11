/* =============================================================
   HOTSPOT.JS — Aufklappbare Inhalte auf Bildern
   HfG Ulm E-Learning
   
   Verwendung im HTML:
   
   <div class="hotspot-container" style="height: 500px;">
     <img src="..." alt="...">
     
     <button class="hotspot-trigger"
             style="top: 65%; left: 30%"
             data-hotspot-trigger="hs-1"
             aria-expanded="false">
       <span class="hotspot-trigger__icon"></span>
     </button>
     
     <div class="hotspot-popup"
          id="hs-1"
          style="top: 40%; left: 38%">
       <span class="hotspot-popup__label">Dozent:innen</span>
       <div class="hotspot-popup__title">Tomás Maldonado</div>
       <p class="hotspot-popup__body">In diesem Grundkurs gibt Maldonado den Studierenden Hilfestellung.</p>
     </div>
   </div>
   ============================================================= */

document.addEventListener('DOMContentLoaded', function () {

  // Alle Hotspot-Trigger initialisieren
  const triggers = document.querySelectorAll('[data-hotspot-trigger]');

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();

      const popupId = trigger.dataset.hotspotTrigger;
      const popup   = document.getElementById(popupId);
      if (!popup) return;

      const isOpen = trigger.classList.contains('is-open');

      // Alle anderen Popups in diesem Container schließen
      const container = trigger.closest('.hotspot-container');
      if (container) {
        container.querySelectorAll('.hotspot-trigger.is-open').forEach(function (t) {
          t.classList.remove('is-open');
          t.setAttribute('aria-expanded', 'false');
        });
        container.querySelectorAll('.hotspot-popup.is-visible').forEach(function (p) {
          p.classList.remove('is-visible');
        });
      }

      // Dieses Popup umschalten
      if (!isOpen) {
        trigger.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        popup.classList.add('is-visible');
      }
    });
  });

  // Klick außerhalb schließt alle Popups
  document.addEventListener('click', function () {
    document.querySelectorAll('.hotspot-popup.is-visible').forEach(function (p) {
      p.classList.remove('is-visible');
    });
    document.querySelectorAll('.hotspot-trigger.is-open').forEach(function (t) {
      t.classList.remove('is-open');
      t.setAttribute('aria-expanded', 'false');
    });
  });

  // Scrollytelling: Panels ein-/ausblenden basierend auf Scroll-Position
  initScrollytelling();

});


// ----------------------------------------------------------
// SCROLLYTELLING
// Welcher Text-Step gerade sichtbar ist, bestimmt welches
// visuelle Panel rechts angezeigt wird.
//
// HTML-Struktur:
// <div class="scrolly">
//   <div class="scrolly__text">
//     <div class="scrolly__step" data-step="0"> ... </div>
//     <div class="scrolly__step" data-step="1"> ... </div>
//   </div>
//   <div class="scrolly__visual">
//     <div class="scrolly__panel is-active" data-panel="0"> ... </div>
//     <div class="scrolly__panel" data-panel="1"> ... </div>
//   </div>
// </div>
// ----------------------------------------------------------

function initScrollytelling() {
  const scrollyBlocks = document.querySelectorAll('.scrolly');
  if (scrollyBlocks.length === 0) return;

  // IntersectionObserver: Sobald ein Text-Step zu 50% sichtbar ist,
  // wird das zugehörige Panel aktiviert.
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const step      = entry.target;
      const stepIndex = step.dataset.step;
      const scrolly   = step.closest('.scrolly');
      if (!scrolly) return;

      // Alle Steps deaktivieren
      scrolly.querySelectorAll('.scrolly__step').forEach(function (s) {
        s.classList.remove('is-active');
      });

      // Alle Panels deaktivieren
      scrolly.querySelectorAll('.scrolly__panel').forEach(function (p) {
        p.classList.remove('is-active');
      });

      // Aktuellen Step aktivieren
      step.classList.add('is-active');

      // Passendes Panel aktivieren
      const panel = scrolly.querySelector('[data-panel="' + stepIndex + '"]');
      if (panel) panel.classList.add('is-active');
    });
  }, {
    threshold: 0.5,   // Step muss zu 50% sichtbar sein
    rootMargin: '-10% 0px -10% 0px'
  });

  // Alle Steps beobachten
  document.querySelectorAll('.scrolly__step').forEach(function (step) {
    observer.observe(step);
  });
}
