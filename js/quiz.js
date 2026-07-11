/* =============================================================
   QUIZ.JS — Interaktive Quiz-Logik
   HfG Ulm E-Learning
   
   Verwendung im HTML:
   
   <div class="quiz" data-quiz>
     <div class="quiz__counter">Frage <span data-current>1</span> / <span data-total>5</span></div>
     <div class="quiz__question">Welches Produkt...?</div>
     <div class="quiz__options">
       <div class="quiz__option" data-option data-correct="false">
         <span class="quiz__radio"></span>
         <span class="quiz__option-text">Braun T3</span>
       </div>
       <div class="quiz__option" data-option data-correct="true">
         <span class="quiz__radio"></span>
         <span class="quiz__option-text">Ulmer Hocker</span>
       </div>
       ...
     </div>
     <div class="quiz__feedback" data-feedback></div>
     <div class="quiz__footer">
       <button class="btn btn--black btn--pill btn--md" data-next-btn>Nächste Frage</button>
     </div>
   </div>
   
   Für mehrere Fragen: Mehrere <div class="quiz" data-quiz> Blöcke
   auf der Seite platzieren, oder data-quiz-set für mehrstufige
   Quizzes (siehe unten).
   ============================================================= */

document.addEventListener('DOMContentLoaded', function () {

  // Alle Quiz-Instanzen auf der Seite initialisieren
  const quizzes = document.querySelectorAll('[data-quiz]');

  quizzes.forEach(function (quiz) {
    initQuiz(quiz);
  });


  function initQuiz(quizEl) {
    const options     = quizEl.querySelectorAll('[data-option]');
    const feedback    = quizEl.querySelector('[data-feedback]');
    const nextBtn     = quizEl.querySelector('[data-next-btn]');
    let answered      = false;
    let selectedOption = null;

    // Antwort auswählen
    options.forEach(function (option) {
      option.addEventListener('click', function () {
        // Nur einmal beantwortbar
        if (answered) return;

        // Vorherige Auswahl entfernen
        options.forEach(function (o) {
          o.classList.remove('is-selected');
        });

        // Aktuelle Auswahl markieren
        option.classList.add('is-selected');
        selectedOption = option;
      });
    });

    // "Nächste Frage" → Auflösen
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (!selectedOption || answered) return;
        answered = true;
        revealAnswer();
      });
    }

    function revealAnswer() {
      const isCorrect = selectedOption.dataset.correct === 'true';

      // Alle Optionen auflösen
      options.forEach(function (o) {
        if (o.dataset.correct === 'true') {
          o.classList.add('is-correct');
        } else if (o === selectedOption && !isCorrect) {
          o.classList.add('is-wrong');
        }
        // Klick deaktivieren
        o.style.pointerEvents = 'none';
      });

      // Feedback anzeigen
      if (feedback) {
        feedback.classList.add('is-visible');
        if (isCorrect) {
          feedback.classList.add('quiz__feedback--correct');
          feedback.textContent = '✓ Richtig!';
        } else {
          feedback.classList.add('quiz__feedback--wrong');
          feedback.textContent = '✗ Leider falsch.';
        }
      }

      // Button-Text ändern
      if (nextBtn) {
        nextBtn.textContent = isCorrect ? 'Weiter →' : 'Trotzdem weiter →';
      }
    }
  }


  // ----------------------------------------------------------
  // MEHRSTUFIGES QUIZ (data-quiz-set)
  // Für eine Abfolge von Fragen auf einer Seite.
  //
  // HTML-Struktur:
  // <div data-quiz-set>
  //   <div data-quiz-step>... (Frage 1) ...</div>
  //   <div data-quiz-step>... (Frage 2) ...</div>
  //   ...
  // </div>
  // ----------------------------------------------------------

  const quizSets = document.querySelectorAll('[data-quiz-set]');

  quizSets.forEach(function (set) {
    const steps     = Array.from(set.querySelectorAll('[data-quiz-step]'));
    const totalEl   = set.querySelectorAll('[data-total]');
    let currentStep = 0;

    // Gesamt-Anzahl setzen
    totalEl.forEach(function (el) { el.textContent = steps.length; });

    // Alle Steps außer dem ersten ausblenden
    steps.forEach(function (step, i) {
      step.style.display = i === 0 ? 'flex' : 'none';
      step.style.flexDirection = 'column';
      step.style.gap = 'var(--space-md)';

      // Schritt-Nummer
      const currentEl = step.querySelector('[data-current]');
      if (currentEl) currentEl.textContent = i + 1;

      // Weiter-Button
      const nextBtn = step.querySelector('[data-next-btn]');
      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          // Nächsten Step anzeigen (falls vorhanden)
          const answered = !!step.querySelector('.is-correct, .is-wrong');
          if (!answered) return; // Erst beantworten

          if (currentStep < steps.length - 1) {
            steps[currentStep].style.display = 'none';
            currentStep++;
            steps[currentStep].style.display = 'flex';
          } else {
            // Quiz beendet — letzten Step mit Abschluss-Meldung
            step.innerHTML = '<p class="h3" style="text-align:center; padding: var(--space-md);">Quiz abgeschlossen!</p>';
          }
        });
      }
    });

    // Jeden Step als Quiz initialisieren
    steps.forEach(function (step) {
      initQuiz(step);
    });
  });

});
