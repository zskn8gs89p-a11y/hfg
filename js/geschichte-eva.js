/* ==========================================================

   GESCHICHTE-EVA.JS

   HfG Ulm – Geschichte

========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initStoryScroll();
  initStoryIntroGuide();
  initFlipCards();
  initGapChecks();
  initOrderChecks();
  initMCChecks();
  initTFChecks();
  initFinalQuiz();

  initHistoryMC();
  initHistoryRF();
});

/* ==========================================================

   STORY SCROLL

========================================================== */

function initStoryScroll() {

  const sections = document.querySelectorAll("[data-story-scroll]");

  if (!sections.length) return;

  function update() {

    const trigger = window.innerHeight * 0.55;

    sections.forEach((section) => {

      const year = section.querySelector("[data-story-year]");

      const sticky = section.querySelector(".story-scroll__sticky");

      const steps = section.querySelectorAll(".story-step");

      if (!year || !steps.length) return;

      const sectionRect = section.getBoundingClientRect();

      const sectionActive =

        sectionRect.top < window.innerHeight * 0.75 &&

        sectionRect.bottom > window.innerHeight * 0.25;

      if (sticky && section.id !== "teil-1") {

        sticky.classList.toggle("is-active", sectionActive);

      }

      let activeIndex = 0;

      steps.forEach((step, index) => {

        const rect = step.getBoundingClientRect();

        if (rect.top <= trigger) {

          activeIndex = index;

        }

      });

      steps.forEach((step, index) => {

        step.classList.toggle("is-active", index === activeIndex);

      });

      const newYear = steps[activeIndex].dataset.year;

      if (newYear && year.textContent.trim() !== newYear) {

        year.classList.add("is-changing");

        setTimeout(() => {

          year.textContent = newYear;

          year.classList.remove("is-changing");

        }, 120);

      }

    });

  }

  window.addEventListener("scroll", update, { passive: true });

  window.addEventListener("resize", update);

  update();

}

/* ==========================================================

   INTRO GUIDE

========================================================== */

function initStoryIntroGuide() {

  const intro = document.querySelector(".story-intro-guide");

  if (!intro) return;

  const sticky = document.querySelector("#teil-1 .story-scroll__sticky");

  function updateIntroGuide() {

    const rect = intro.getBoundingClientRect();

    const shouldHide = rect.bottom < 120;

    intro.classList.toggle("is-hidden", shouldHide);

    if (sticky) {

      sticky.classList.toggle("is-active", shouldHide);

    }

  }

  window.addEventListener("scroll", updateIntroGuide, { passive: true });

  window.addEventListener("resize", updateIntroGuide);

  updateIntroGuide();

}

/* ==========================================================

   FLIP CARDS

========================================================== */

function initFlipCards() {

  document.querySelectorAll(".dsg-flip-card").forEach((card) => {

    card.addEventListener("click", () => {

      card.classList.toggle("is-flipped");

    });

  });

}

/* ==========================================================

   UNLOCK BUTTONS

========================================================== */

function unlockTarget(key) {

  const btn = document.querySelector(`[data-unlock-target="${key}"]`);

  if (!btn) return;

  btn.style.opacity = "1";

  btn.style.pointerEvents = "auto";

  btn.removeAttribute("aria-disabled");

  const href = btn.dataset.href;

  if (href) btn.setAttribute("href", href);

}

/* ==========================================================

   LÜCKENTEXT – Tippen + Drag & Drop

========================================================== */

function initGapChecks() {

  document.querySelectorAll("[data-gap-check]").forEach((wrap) => {

    const chips = wrap.querySelectorAll(".qv2-gap-chip");

    const slots = wrap.querySelectorAll(".qv2-gap-slot");

    const feedback = wrap.querySelector(".quiz__feedback");

    const checkBtn = wrap.querySelector("[data-gap-check-btn]");

    const resetBtn = wrap.querySelector("[data-gap-reset]");

    let selectedChip = null;

    chips.forEach((chip) => {

      chip.setAttribute("draggable", "true");

      chip.addEventListener("click", () => {

        if (chip.classList.contains("used")) return;

        selectedChip = chip;

        chips.forEach((c) => c.classList.remove("is-selected"));

        chip.classList.add("is-selected");

      });

      chip.addEventListener("dragstart", (e) => {

        e.dataTransfer.setData("text/plain", chip.dataset.word);

        selectedChip = chip;

      });

    });

    slots.forEach((slot) => {

      slot.addEventListener("click", () => {

        if (!selectedChip) return;

        fillSlot(slot, selectedChip);

      });

      slot.addEventListener("dragover", (e) => {

        e.preventDefault();

        slot.classList.add("over");

      });

      slot.addEventListener("dragleave", () => {

        slot.classList.remove("over");

      });

      slot.addEventListener("drop", (e) => {

        e.preventDefault();

        slot.classList.remove("over");

        if (selectedChip) {

          fillSlot(slot, selectedChip);

        }

      });

    });

    function fillSlot(slot, chip) {

      if (!chip || chip.classList.contains("used")) return;

      if (slot.dataset.filledBy) {

        const oldChip = wrap.querySelector(

          `.qv2-gap-chip[data-word="${slot.dataset.filledBy}"]`

        );

        if (oldChip) oldChip.classList.remove("used");

      }

      slot.textContent = chip.dataset.word;

      slot.dataset.filledBy = chip.dataset.word;

      chip.classList.add("used");

      chip.classList.remove("is-selected");

      selectedChip = null;

    }

    if (resetBtn) {

      resetBtn.addEventListener("click", () => {

        slots.forEach((slot) => {

          slot.innerHTML = "&nbsp;";

          delete slot.dataset.filledBy;

          slot.classList.remove("filled-correct", "filled-wrong");

        });

        chips.forEach((chip) => {

          chip.classList.remove("used", "is-selected");

        });

        if (feedback) {

          feedback.textContent = "";

          feedback.className = "quiz__feedback";

        }

        selectedChip = null;

      });

    }

    if (checkBtn) {

      checkBtn.addEventListener("click", () => {

        let correct = true;

        slots.forEach((slot) => {

          const answer = slot.dataset.answer;

          const value = slot.dataset.filledBy;

          slot.classList.remove("filled-correct", "filled-wrong");

          if (value === answer) {

            slot.classList.add("filled-correct");

          } else {

            slot.classList.add("filled-wrong");

            correct = false;

          }

        });

        if (feedback) {

          feedback.className = "quiz__feedback is-visible";

          feedback.classList.add(

            correct ? "quiz__feedback--correct" : "quiz__feedback--wrong"

          );

          feedback.textContent = correct

            ? "Richtig. Du kannst weiter zur nächsten Station."

            : "Noch nicht ganz. Prüfe die Begriffe noch einmal.";

        }

        if (correct && wrap.dataset.unlocks) {

          unlockTarget(wrap.dataset.unlocks);

        }

      });

    }

  });

}

/* ==========================================================

   REIHENFOLGE – Tippen

========================================================== */

function initOrderChecks() {

  document.querySelectorAll("[data-order-check]").forEach((wrap) => {

    const chips = wrap.querySelectorAll("[data-order-value]");

    const slots = wrap.querySelectorAll("[data-order-slot]");

    const feedback = wrap.querySelector(".quiz__feedback");

    const checkBtn = wrap.querySelector("[data-order-check-btn]");

    const resetBtn = wrap.querySelector("[data-order-reset]");

    const correctOrder = ["1951", "1953", "1955"];

    let index = 0;

    chips.forEach((chip) => {

      chip.addEventListener("click", () => {

        if (chip.classList.contains("used")) return;

        if (index >= slots.length) return;

        const slot = slots[index];

        slot.textContent = chip.textContent;

        slot.dataset.value = chip.dataset.orderValue;

        chip.classList.add("used");

        index++;

      });

    });

    if (resetBtn) {

      resetBtn.addEventListener("click", () => {

        index = 0;

        slots.forEach((slot) => {

          slot.innerHTML = "&nbsp;";

          delete slot.dataset.value;

          slot.classList.remove("filled-correct", "filled-wrong");

        });

        chips.forEach((chip) => chip.classList.remove("used"));

        if (feedback) {

          feedback.textContent = "";

          feedback.className = "quiz__feedback";

        }

      });

    }

    if (checkBtn) {

      checkBtn.addEventListener("click", () => {

        let correct = true;

        slots.forEach((slot, i) => {

          slot.classList.remove("filled-correct", "filled-wrong");

          if (slot.dataset.value === correctOrder[i]) {

            slot.classList.add("filled-correct");

          } else {

            slot.classList.add("filled-wrong");

            correct = false;

          }

        });

        if (feedback) {

          feedback.className = "quiz__feedback is-visible";

          feedback.classList.add(

            correct ? "quiz__feedback--correct" : "quiz__feedback--wrong"

          );

          feedback.textContent = correct

            ? "Richtig. 1951 Stiftung, 1953 Lehrbetrieb, 1955 Campus."

            : "Noch nicht ganz. Die Reihenfolge beginnt mit 1951.";

        }

        if (correct && wrap.dataset.unlocks) {

          unlockTarget(wrap.dataset.unlocks);

        }

      });

    }

  });

}

/* ==========================================================

   MULTIPLE CHOICE CHECKS

========================================================== */

function initMCChecks() {

  document.querySelectorAll("[data-mc-check]").forEach((wrap) => {

    const options = wrap.querySelectorAll(".quiz__option");

    const feedback = wrap.querySelector(".quiz__feedback");

    options.forEach((option) => {

      option.addEventListener("click", () => {

        if (wrap.classList.contains("is-answered")) return;

        const correct = option.dataset.correct === "true";

        wrap.classList.add("is-answered");

        options.forEach((opt) => {

          opt.style.pointerEvents = "none";

          if (opt.dataset.correct === "true") {

            opt.classList.add("is-correct");

          }

        });

        if (!correct) {

          option.classList.add("is-wrong");

        }

        if (feedback) {

          feedback.classList.add("is-visible");

          feedback.classList.add(

            correct ? "quiz__feedback--correct" : "quiz__feedback--wrong"

          );

          if (!feedback.textContent.trim()) {

            feedback.textContent = correct

              ? "Richtig."

              : "Nicht ganz. Die richtige Antwort ist orange markiert.";

          }

        }

        if (correct && wrap.dataset.unlocks) {

          unlockTarget(wrap.dataset.unlocks);

        }

      });

    });

  });

}

/* ==========================================================

   RICHTIG / FALSCH CHECKS

========================================================== */

function initTFChecks() {

  document.querySelectorAll("[data-tf-check]").forEach((wrap) => {

    const buttons = wrap.querySelectorAll("[data-correct]");

    const feedback = wrap.querySelector(".quiz__feedback");

    buttons.forEach((btn) => {

      btn.addEventListener("click", () => {

        if (wrap.classList.contains("is-answered")) return;

        const correct = btn.dataset.correct === "true";

        wrap.classList.add("is-answered");

        buttons.forEach((b) => {

          b.disabled = true;

          if (b.dataset.correct === "true") {

            b.classList.add("is-correct");

          }

        });

        if (!correct) {

          btn.classList.add("is-wrong");

        }

        if (feedback) {

          feedback.classList.add("is-visible");

          feedback.classList.add(

            correct ? "quiz__feedback--correct" : "quiz__feedback--wrong"

          );

        }

        if (correct && wrap.dataset.unlocks) {

          unlockTarget(wrap.dataset.unlocks);

        }

      });

    });

  });

}

/* ==========================================================

   ABSCHLUSSQUIZ

========================================================== */

function initFinalQuiz() {

  const quiz = document.querySelector("[data-final-quiz]");

  if (!quiz) return;

  const items = quiz.querySelectorAll("[data-final-item]");

  const feedback = quiz.querySelector(".quiz__feedback");

  let answered = 0;

  let score = 0;

  items.forEach((item) => {

    const buttons = item.querySelectorAll("[data-correct]");

    buttons.forEach((btn) => {

      btn.addEventListener("click", () => {

        if (item.classList.contains("is-answered")) return;

        const correct = btn.dataset.correct === "true";

        item.classList.add("is-answered");

        answered++;

        if (correct) score++;

        buttons.forEach((b) => {

          b.disabled = true;

          if (b.dataset.correct === "true") {

            b.classList.add("is-correct");

          }

        });

        if (!correct) {

          btn.classList.add("is-wrong");

        }

        if (answered === items.length && feedback) {

          feedback.className = "quiz__feedback is-visible quiz__feedback--correct";

          feedback.textContent =

            "Du hast " +

            score +

            " von " +

            items.length +

            " Aussagen richtig beantwortet.";

        }

      });

    });

  });

}

function initHistoryMC() {
  const data = [
    {
      q: "Was war ein wichtiger Vorläufer der HfG Ulm?",
      opts: ["Die Volkshochschule Ulm", "Die Universität Ulm", "Das Bauhaus Dessau", "Die Kunstakademie München"],
      correct: 0,
      ex: "Die Volkshochschule Ulm war ein wichtiger Vorläufer der späteren HfG."
    },
    {
      q: "Wer brachte den Schwerpunkt Gestaltung stärker in die Idee der Hochschule ein?",
      opts: ["Tomás Maldonado", "Max Bill", "Dieter Rams", "Josef Albers"],
      correct: 1,
      ex: "Max Bill brachte Bauhaus-Erfahrung, Architektur und Gestaltungssystematik ein."
    },
    {
      q: "Wann startete der Lehrbetrieb der HfG Ulm?",
      opts: ["1945", "1951", "1953", "1968"],
      correct: 2,
      ex: "Der Lehrbetrieb startete am 3. August 1953."
    },
    {
      q: "Was wurde 1955 eröffnet?",
      opts: ["Der Campus auf dem Oberen Kuhberg", "Die Volkshochschule", "Das Bauhaus", "Die Olympischen Spiele"],
      correct: 0,
      ex: "1955 wurde der Campus auf dem Oberen Kuhberg offiziell eröffnet."
    },
    {
      q: "Was prägte das Ulmer Designverständnis?",
      opts: ["Dekoration", "Zufall", "System, Analyse und Begründung", "reine Kunst"],
      correct: 2,
      ex: "Ulm verstand Design systematisch, analytisch und begründbar."
    }
  ];

  let index = 0;
  let score = 0;
  let locked = false;

  const active = document.getElementById("hist-mc-active");
  const question = document.getElementById("hist-mc-question");
  const options = document.getElementById("hist-mc-options");
  const feedback = document.getElementById("hist-mc-feedback");
  const footer = document.getElementById("hist-mc-footer");
  const nextBtn = document.getElementById("hist-mc-next-btn");
  const current = document.getElementById("hist-mc-current");

  const result = document.getElementById("hist-mc-result");
  const scoreDisplay = document.getElementById("hist-mc-score-display");
  const resultTitle = document.getElementById("hist-mc-result-title");
  const resultText = document.getElementById("hist-mc-result-text");
  const retry = document.getElementById("hist-mc-retry");

  if (!question || !options) return;

  function render() {
    locked = false;
    const item = data[index];

    current.textContent = String(index + 1).padStart(2, "0");
    question.textContent = item.q;
    feedback.textContent = "";
    feedback.className = "quiz__feedback";
    footer.style.display = "none";
    options.innerHTML = "";

    item.opts.forEach((opt, i) => {
      const div = document.createElement("div");
      div.className = "quiz__option";
      div.innerHTML = `
        <span class="quiz__radio"></span>
        <span class="quiz__option-text">${opt}</span>
      `;
      div.addEventListener("click", () => choose(i));
      options.appendChild(div);
    });
  }

  function choose(chosen) {
    if (locked) return;
    locked = true;

    const item = data[index];
    const isCorrect = chosen === item.correct;
    if (isCorrect) score++;

    options.querySelectorAll(".quiz__option").forEach((opt, i) => {
      opt.style.pointerEvents = "none";
      if (i === item.correct) opt.classList.add("is-correct");
      else if (i === chosen) opt.classList.add("is-wrong");
    });

    feedback.textContent = (isCorrect ? "Richtig. " : "Nicht ganz. ") + item.ex;
    feedback.classList.add("is-visible");
    feedback.classList.add(isCorrect ? "quiz__feedback--correct" : "quiz__feedback--wrong");

    nextBtn.textContent = index === data.length - 1 ? "Ergebnis sehen" : "Nächste Frage";
    footer.style.display = "flex";
  }

  nextBtn.addEventListener("click", () => {
    index++;
    if (index >= data.length) showResult();
    else render();
  });

  function showResult() {
    active.style.display = "none";
    result.style.display = "block";
    scoreDisplay.textContent = score + " / " + data.length;

    resultTitle.textContent = score >= 4 ? "Sehr guter Überblick." : "Fast geschafft.";
    resultText.textContent = `Du hast ${score} von ${data.length} Fragen richtig beantwortet.`;
  }

  retry.addEventListener("click", () => {
    index = 0;
    score = 0;
    result.style.display = "none";
    active.style.display = "block";
    render();
  });

  render();
}

function initHistoryRF() {
  const data = [
    {
      q: "Die HfG Ulm verstand Design vor allem als Dekoration.",
      correct: false,
      ex: "Falsch. Design wurde als System, Methode und gesellschaftliche Verantwortung verstanden."
    },
    {
      q: "An der HfG gab es Spannungen über Kunst, Wissenschaft und Gestaltung.",
      correct: true,
      ex: "Richtig. Unterschiedliche Vorstellungen führten zu Konflikten."
    },
    {
      q: "Die HfG Ulm wurde 1968 geschlossen.",
      correct: true,
      ex: "Richtig. Die Hochschule wurde 1968 geschlossen."
    }
  ];

  let index = 0;
  let score = 0;
  let locked = false;

  const active = document.getElementById("hist-rf-active");
  const question = document.getElementById("hist-rf-question");
  const current = document.getElementById("hist-rf-current");
  const btnTrue = document.getElementById("hist-rf-btn-true");
  const btnFalse = document.getElementById("hist-rf-btn-false");
  const feedback = document.getElementById("hist-rf-feedback");
  const footer = document.getElementById("hist-rf-footer");
  const nextBtn = document.getElementById("hist-rf-next-btn");

  const result = document.getElementById("hist-rf-result");
  const scoreDisplay = document.getElementById("hist-rf-score-display");
  const resultTitle = document.getElementById("hist-rf-result-title");
  const resultText = document.getElementById("hist-rf-result-text");
  const retry = document.getElementById("hist-rf-retry");

  if (!question || !btnTrue || !btnFalse) return;

  function render() {
    locked = false;
    const item = data[index];

    current.textContent = String(index + 1).padStart(2, "0");
    question.textContent = item.q;

    feedback.textContent = "";
    feedback.className = "quiz__feedback";
    footer.style.display = "none";

    btnTrue.disabled = false;
    btnFalse.disabled = false;
    btnTrue.className = "btn btn--ghost btn--pill btn--lg qv2-tf-btn";
    btnFalse.className = "btn btn--ghost btn--pill btn--lg qv2-tf-btn";
  }

  function choose(value) {
    if (locked) return;
    locked = true;

    const item = data[index];
    const isCorrect = value === item.correct;
    if (isCorrect) score++;

    if (item.correct) {
      btnTrue.classList.add("is-correct");
      if (!isCorrect) btnFalse.classList.add("is-wrong");
    } else {
      btnFalse.classList.add("is-correct");
      if (!isCorrect) btnTrue.classList.add("is-wrong");
    }

    btnTrue.disabled = true;
    btnFalse.disabled = true;

    feedback.textContent = item.ex;
    feedback.classList.add("is-visible");
    feedback.classList.add(isCorrect ? "quiz__feedback--correct" : "quiz__feedback--wrong");

    nextBtn.textContent = index === data.length - 1 ? "Ergebnis sehen" : "Nächste Aussage";
    footer.style.display = "flex";
  }

  btnTrue.addEventListener("click", () => choose(true));
  btnFalse.addEventListener("click", () => choose(false));

  nextBtn.addEventListener("click", () => {
    index++;
    if (index >= data.length) showResult();
    else render();
  });

  function showResult() {
    active.style.display = "none";
    result.style.display = "block";
    scoreDisplay.textContent = score + " / " + data.length;

    resultTitle.textContent = score === data.length ? "Alles richtig." : "Guter Check.";
    resultText.textContent = `Du hast ${score} von ${data.length} Aussagen richtig bewertet.`;
  }

  retry.addEventListener("click", () => {
    index = 0;
    score = 0;
    result.style.display = "none";
    active.style.display = "block";
    render();
  });

  render();
}