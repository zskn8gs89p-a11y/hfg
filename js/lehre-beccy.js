const lightbox = document.getElementById("image-lightbox");
const lightboxImg = document.getElementById("lightbox-image");

document.addEventListener("click", function (e) {

    const img = e.target.closest(".zoom-image");

    if (!img) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");

});

lightbox.addEventListener("click", function (e) {

    if (
        e.target === lightbox ||
        e.target.classList.contains("lightbox-close")
    ) {
        lightbox.classList.remove("open");
    }

});


document.addEventListener('DOMContentLoaded', function () {

  var explMap = document.getElementById('expl-map');
  var explPanel = document.getElementById('expl-panel');

  if (!explMap || !explPanel) return;

  explMap.innerHTML = '';
  explPanel.innerHTML = '';

  var explItems = [
    {
      id: 'farbe',
      label: 'Form\n& Farbe',
      title: 'Form und Farbe',
      desc: 'In der Grundlehre untersuchten Studierende, wie Formen, Farben und Flächen wirken. Es ging um Wahrnehmung, Ordnung und Beziehungen.',
      image: '../assets/images/lehre/grundlehre1.jpeg',
      alt: 'Archivmaterial zu Form und Farbe'
    },
    {
      id: 'zeichnen',
      label: 'Frei-\nzeichnen',
      title: 'Freihandzeichnen',
      desc: 'Zeichnen war ein Mittel, um genau zu beobachten, Raum zu verstehen und Formen bewusst aufzubauen.',
      image: '../assets/images/lehre/unterricht.webp',
      alt: 'Archivmaterial zu Freihandzeichnen'
    },
    {
      id: 'psychologie',
      label: 'Psycho-\nlogie',
      title: 'Psychologie',
      desc: 'Psychologie half zu verstehen, wie Menschen wahrnehmen, handeln und auf Gestaltung reagieren.',
      image: '../assets/images/lehre/unterricht3.webp',
      alt: 'Archivmaterial zu Psychologie'
    },
    {
      id: 'soziologie',
      label: 'Sozio-\nlogie',
      title: 'Soziologie',
      desc: 'Soziologie verband Gestaltung mit Gesellschaft, Alltag und sozialen Zusammenhängen.',
      image: '../assets/images/lehre/unterricht2.webp',
      alt: 'Archivmaterial zu Soziologie'
    },
    {
      id: 'politik',
      label: 'Politische\nWiss.',
      title: 'Politische Wissenschaften',
      desc: 'Politik und Zeitgeschichte gehörten zur Ausbildung, weil Gestaltung als gesellschaftliche Verantwortung verstanden wurde.',
      image: '../assets/images/lehre/unterricht5.webp',
      alt: 'Archivmaterial zu politischen Wissenschaften'
    },
    {
      id: 'struktur',
      label: 'Struktur-\ntheorie',
      title: 'Strukturtheorie',
      desc: 'Strukturtheorie zeigte, dass Gestaltung aus Regeln, Beziehungen und Systemen bestehen kann.',
      image: '../assets/images/lehre/grundlehre6.jpeg',
      alt: 'Archivmaterial zu Strukturtheorie'
    }
  ];

  var MAP_W = 560;
  var MAP_H = 600;
  var CX = MAP_W / 2;
  var CY = MAP_H / 2;
  var RADIUS_X = 254;
  var RADIUS_Y = 235;
  var N = explItems.length;

  var eSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  eSvg.setAttribute('class', 'qv2-expl-svg');
  eSvg.setAttribute('viewBox', '0 0 ' + MAP_W + ' ' + MAP_H);
  explMap.appendChild(eSvg);

  var eCenterBtn = document.createElement('button');
  eCenterBtn.type = 'button';
  eCenterBtn.className = 'qv2-expl-node qv2-expl-node--center is-active';
  eCenterBtn.style.left = (CX / MAP_W * 100) + '%';
  eCenterBtn.style.top = (CY / MAP_H * 100) + '%';
  eCenterBtn.innerHTML =
    '<div class="qv2-expl-mark" aria-hidden="true">' +
      '<span>G</span><span>R</span><span>U</span>' +
      '<span>N</span><span>D</span><span>E</span>' +
    '</div>';
  eCenterBtn.setAttribute('aria-label', 'Grundlehre Übersicht');
  explMap.appendChild(eCenterBtn);

  var eOuterBtns = [];
  var eLines = [];

  explItems.forEach(function (item, i) {
    var angle = (i * (360 / N) - 90) * (Math.PI / 180);
    var nx = Math.round(CX + RADIUS_X * Math.cos(angle));
    var ny = Math.round(CY + RADIUS_Y * Math.sin(angle));

    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', CX);
    line.setAttribute('y1', CY);
    line.setAttribute('x2', nx);
    line.setAttribute('y2', ny);
    line.setAttribute('class', 'qv2-expl-line');
    eSvg.appendChild(line);
    eLines.push(line);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'qv2-expl-node qv2-expl-node--outer';
    btn.style.left = (nx / MAP_W * 100) + '%';
    btn.style.top = (ny / MAP_H * 100) + '%';
    btn.innerHTML =
      '<span class="qv2-expl-node__index">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<span class="qv2-expl-node__label">' + item.label.replace('\n', '<br>') + '</span>';

    btn.setAttribute('aria-label', item.title);
    explMap.appendChild(btn);
    eOuterBtns.push(btn);

    btn.addEventListener('click', function () {
      explSelect(item, btn, i);
    });
  });

  function explReset() {
    eOuterBtns.forEach(function (b) {
      b.classList.remove('is-active');
    });

    eLines.forEach(function (line) {
      line.classList.remove('is-active');
    });

    eCenterBtn.classList.add('is-active');

    explPanel.innerHTML =
      '<div class="qv2-expl-hero">' +
        '<figure class="qv2-expl-hero-fig">' +
          '<img class="zoom-image" src="../assets/images/lehre/unterricht4.webp" alt="Grundlehre an der HfG Ulm">' +
        '</figure>' +
        '<div class="qv2-expl-hero-info">' +
          '<span class="label label--orange">Grundlehre</span>' +
          '<h3>Fach auswählen</h3>' +
          '<p class="body-text">Tippe auf einen Kreis und entdecke, welche Grundlagen alle Studierenden an der HfG durchliefen.</p>' +
        '</div>' +
      '</div>';
  }

  function explSelect(item, btn, index) {
    eOuterBtns.forEach(function (b) {
      b.classList.remove('is-active');
    });

    eLines.forEach(function (line) {
      line.classList.remove('is-active');
    });

    eCenterBtn.classList.remove('is-active');
    btn.classList.add('is-active');

    if (eLines[index]) {
      eLines[index].classList.add('is-active');
    }

    explPanel.innerHTML =
      '<div class="qv2-expl-reveal">' +
        '<figure class="qv2-expl-reveal__image">' +
          '<img class="zoom-image" src="' + item.image + '" alt="' + item.alt + '">' +
          '<figcaption>Grundlehre · HfG Ulm</figcaption>' +
        '</figure>' +
        '<div class="qv2-expl-reveal__body">' +
          '<span class="label label--orange">Ausgewählt</span>' +
          '<h3>' + item.title + '</h3>' +
          '<p class="body-text">' + item.desc + '</p>' +
        '</div>' +
      '</div>';
  }

  eCenterBtn.addEventListener('click', explReset);
  explReset();

});

// ============================================================
// FLIP CARDS (Ulmer Modell)
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll(".history-flip-card").forEach(function(card){

    card.addEventListener("click", function(){

      // nur diese Karte drehen
      card.classList.toggle("is-flipped");

    });

  });

});


// ============================================================
// ABSCHLUSSQUIZ LEHRE
// HTML/CSS- und Verhaltensprinzip aus quiz-v2
// Eigene IDs verhindern Konflikte mit quiz-v2.js
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  var quizSection = document.getElementById("lehre-quiz");

  if (!quizSection) {
    return;
  }

  var lehreMcData = [
    {
      q: "Was geschah, bevor dein Studium an der HfG beginnen konnte?",
      opts: [
        "Du musstest dich bewerben und das Aufnahmeverfahren durchlaufen",
        "Du musstest bereits ein fertiges Produkt entworfen haben",
        "Du begannst sofort mit der Diplomarbeit",
        "Es gab keine Voraussetzungen"
      ],
      correct: 0,
      ex: "Vor dem Studium standen Bewerbung und Aufnahme. Anschließend begann zunächst eine Probezeit."
    },
    {
      q: "Womit begannen alle Studierenden unabhängig von ihrem späteren Schwerpunkt?",
      opts: [
        "Mit einem Industriepraktikum",
        "Mit der gemeinsamen Grundlehre",
        "Mit der Diplomprüfung",
        "Mit einem frei gewählten Hauptkurs"
      ],
      correct: 1,
      ex: "Alle Studierenden durchliefen zunächst die gemeinsame Grundlehre."
    },
    {
      q: "Was folgte auf die gemeinsame Grundlehre?",
      opts: [
        "Die Spezialisierung in einem Hauptkurs",
        "Das Ende des Studiums",
        "Ein verpflichtender Hochschulwechsel",
        "Ausschließlich theoretischer Unterricht"
      ],
      correct: 0,
      ex: "Nach der Grundlehre entschieden sich die Studierenden für einen fachlichen Schwerpunkt."
    },
    {
      q: "Was kennzeichnete das Ulmer Modell?",
      opts: [
        "Gestaltung ausschließlich nach persönlichem Geschmack",
        "Dekoration ohne funktionale Begründung",
        "Die Verbindung von Gestaltung, Wissenschaft, Technik und Gesellschaft",
        "Die vollständige Trennung von Theorie und Praxis"
      ],
      correct: 2,
      ex: "Das Ulmer Modell verband Gestaltung mit Analyse, Wissenschaft, Technik und gesellschaftlicher Verantwortung."
    },
    {
      q: "Womit wurde das Studium nach vier Jahren abgeschlossen?",
      opts: [
        "Mit einer Aufnahmeprüfung",
        "Mit der Wiederholung der Grundlehre",
        "Mit einem Diplom",
        "Mit einem einzigen Werkstattkurs"
      ],
      correct: 2,
      ex: "Nach vier Studienjahren stand am Ende der erfolgreiche Abschluss mit dem Diplom."
    }
  ];

  var mcIndex = 0;
  var mcScore = 0;
  var mcLocked = false;

  var mcCurrent = document.getElementById("lehre-mc-current");
  var mcTotal = document.getElementById("lehre-mc-total");
  var mcQuestion = document.getElementById("lehre-mc-question");
  var mcOptions = document.getElementById("lehre-mc-options");
  var mcFeedback = document.getElementById("lehre-mc-feedback");
  var mcFooter = document.getElementById("lehre-mc-footer");
  var mcNextButton = document.getElementById("lehre-mc-next-btn");

  var mcActive = document.getElementById("lehre-mc-active");
  var mcResult = document.getElementById("lehre-mc-result");
  var mcScoreDisplay = document.getElementById("lehre-mc-score-display");
  var mcResultTitle = document.getElementById("lehre-mc-result-title");
  var mcResultText = document.getElementById("lehre-mc-result-text");
  var mcRetryButton = document.getElementById("lehre-mc-retry");

  if (
    !mcCurrent ||
    !mcTotal ||
    !mcQuestion ||
    !mcOptions ||
    !mcFeedback ||
    !mcFooter ||
    !mcNextButton ||
    !mcActive ||
    !mcResult
  ) {
    console.error("Das Lehre-Quiz konnte nicht initialisiert werden.");
    return;
  }

  mcTotal.textContent = String(lehreMcData.length).padStart(2, "0");

  function renderLehreQuestion() {
    var item = lehreMcData[mcIndex];

    mcLocked = false;

    mcCurrent.textContent = String(mcIndex + 1).padStart(2, "0");
    mcQuestion.textContent = item.q;

    mcOptions.innerHTML = "";

    mcFeedback.textContent = "";
    mcFeedback.className = "quiz__feedback";

    mcFooter.style.display = "none";

    item.opts.forEach(function (optionText, optionIndex) {
      var option = document.createElement("div");

      option.className = "quiz__option";
      option.setAttribute("role", "button");
      option.setAttribute("tabindex", "0");

      option.innerHTML =
        '<span class="quiz__radio"></span>' +
        '<span class="quiz__option-text">' +
        optionText +
        "</span>";

      option.addEventListener("click", function () {
        chooseLehreAnswer(optionIndex);
      });

      option.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          chooseLehreAnswer(optionIndex);
        }
      });

      mcOptions.appendChild(option);
    });
  }

  function chooseLehreAnswer(chosenIndex) {
    if (mcLocked) {
      return;
    }

    mcLocked = true;

    var item = lehreMcData[mcIndex];
    var isCorrect = chosenIndex === item.correct;

    if (isCorrect) {
      mcScore += 1;
    }

    var optionElements = mcOptions.querySelectorAll(".quiz__option");

    optionElements.forEach(function (option, optionIndex) {
      option.style.pointerEvents = "none";
      option.setAttribute("tabindex", "-1");

      if (optionIndex === item.correct) {
        option.classList.add("is-correct");
      } else if (optionIndex === chosenIndex) {
        option.classList.add("is-wrong");
      }
    });

    mcFeedback.textContent =
      (isCorrect ? "Richtig. " : "Nicht ganz. ") + item.ex;

    mcFeedback.classList.add("is-visible");
    mcFeedback.classList.add(
      isCorrect
        ? "quiz__feedback--correct"
        : "quiz__feedback--wrong"
    );

    mcNextButton.textContent =
      mcIndex === lehreMcData.length - 1
        ? "Ergebnis sehen"
        : "Nächste Frage";

    mcFooter.style.display = "flex";
  }

  function showLehreResult() {
    mcActive.style.display = "none";
    mcResult.style.display = "block";

    mcScoreDisplay.textContent =
      mcScore + " / " + lehreMcData.length;

    if (mcScore === lehreMcData.length) {
      mcResultTitle.textContent =
        "Perfekt. Du kennst den Weg durch das Studium.";

      mcResultText.textContent =
        "Von der Bewerbung über Grundlehre und Spezialisierung bis zum Diplom sitzt alles.";
    } else if (mcScore >= 3) {
      mcResultTitle.textContent =
        "Guter Überblick.";

      mcResultText.textContent =
        mcScore +
        " von " +
        lehreMcData.length +
        " Fragen richtig. Die wichtigsten Stationen hast du verstanden.";
    } else {
      mcResultTitle.textContent =
        "Schau dir die Stationen noch einmal an.";

      mcResultText.textContent =
        mcScore +
        " von " +
        lehreMcData.length +
        " Fragen richtig. Besonders Grundlehre, Ulmer Modell und Diplom sind wichtig.";
    }
  }

  mcNextButton.addEventListener("click", function () {
    mcIndex += 1;

    if (mcIndex >= lehreMcData.length) {
      showLehreResult();
    } else {
      renderLehreQuestion();
    }
  });

  if (mcRetryButton) {
    mcRetryButton.addEventListener("click", function () {
      mcIndex = 0;
      mcScore = 0;
      mcLocked = false;

      mcResult.style.display = "none";
      mcActive.style.display = "block";

      renderLehreQuestion();
    });
  }

  renderLehreQuestion();
});

// ============================================================
// LEHRE — SORTIERÜBUNG HAUPTKURSE
// Grundlage: Sortierkomponente aus design.html
// Mit Tipp-Fallback für iPad
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  var sortSection = document.getElementById("lehre-sortierung");

  if (!sortSection) {
    return;
  }

  var sortBank = document.getElementById("lehre-sort-bank");
  var sortSlots = Array.from(
    sortSection.querySelectorAll(".lehre-sort-slot")
  );
  var sortChips = Array.from(
    sortSection.querySelectorAll(".lehre-sort-chip")
  );

  var sortFeedback = document.getElementById("lehre-sort-feedback");
  var sortCheckButton = document.getElementById("lehre-sort-check");
  var sortResetButton = document.getElementById("lehre-sort-reset");

  if (
    !sortBank ||
    !sortFeedback ||
    !sortCheckButton ||
    !sortResetButton ||
    sortSlots.length === 0 ||
    sortChips.length === 0
  ) {
    console.error("Die Lehre-Sortierübung konnte nicht initialisiert werden.");
    return;
  }

  /*
   * Enthält während des Ziehens:
   * {
   *   id: String,
   *   label: String,
   *   sourceSlot: HTMLElement|null
   * }
   */
  var dragPayload = null;

  /*
   * Für das iPad:
   * Erst Begriff antippen, danach Zielfeld antippen.
   */
  var selectedChip = null;

  function findChip(id) {
    return sortChips.find(function (chip) {
      return chip.dataset.id === id;
    });
  }

  function getChipLabel(id) {
    var chip = findChip(id);
    return chip ? chip.textContent.trim() : "";
  }

  function clearFeedback() {
    sortFeedback.textContent = "";
    sortFeedback.className = "quiz__feedback";
  }

  function clearSelectedChip() {
    sortChips.forEach(function (chip) {
      chip.classList.remove("is-selected");
    });

    selectedChip = null;
  }

  function setChipUsed(id, isUsed) {
    var chip = findChip(id);

    if (!chip) {
      return;
    }

    chip.classList.toggle("used", isUsed);
    chip.classList.remove("is-selected");
  }

  function renderEmptySlot(slot) {
    var position = String(slot.dataset.pos).padStart(2, "0");
    var title = slot.dataset.title;

    slot.innerHTML =
      '<span class="lehre-sort-slot__number">' +
        position +
      "</span>" +
      '<strong class="lehre-sort-slot__title">' +
        title +
      "</strong>" +
      '<span class="lehre-sort-slot__placeholder">' +
        "hier ablegen" +
      "</span>";

    delete slot.dataset.current;

    slot.draggable = false;

    slot.classList.remove(
      "is-filled",
      "filled-correct",
      "filled-wrong",
      "over"
    );
  }

  function renderFilledSlot(slot, id, label) {
    var position = String(slot.dataset.pos).padStart(2, "0");
    var title = slot.dataset.title;

    slot.innerHTML =
      '<span class="lehre-sort-slot__number">' +
        position +
      "</span>" +
      '<strong class="lehre-sort-slot__title">' +
        title +
      "</strong>" +
      '<span class="lehre-sort-slot__value">' +
        label +
      "</span>";

    slot.dataset.current = id;
    slot.draggable = true;

    slot.classList.add("is-filled");

    slot.classList.remove(
      "filled-correct",
      "filled-wrong",
      "over"
    );
  }

  function placeItemInSlot(targetSlot, payload) {
    if (!payload || !targetSlot) {
      return;
    }

    var existingId = targetSlot.dataset.current;

    /*
     * Liegt im Zielfeld bereits ein anderer Begriff,
     * wird dieser wieder freigegeben.
     */
    if (existingId && existingId !== payload.id) {
      setChipUsed(existingId, false);
    }

    /*
     * Wird ein Begriff von einem anderen Slot verschoben,
     * wird der Ausgangsslot geleert.
     */
    if (
      payload.sourceSlot &&
      payload.sourceSlot !== targetSlot
    ) {
      renderEmptySlot(payload.sourceSlot);
    }

    renderFilledSlot(
      targetSlot,
      payload.id,
      payload.label
    );

    setChipUsed(payload.id, true);

    clearSelectedChip();
    clearFeedback();
  }

  // ----------------------------------------------------------
  // Chips: Drag & Drop und Tippen
  // ----------------------------------------------------------

  sortChips.forEach(function (chip) {
    chip.addEventListener("dragstart", function (event) {
      if (chip.classList.contains("used")) {
        event.preventDefault();
        return;
      }

      dragPayload = {
        id: chip.dataset.id,
        label: chip.textContent.trim(),
        sourceSlot: null
      };

      event.dataTransfer.setData(
        "text/plain",
        chip.dataset.id
      );

      event.dataTransfer.effectAllowed = "move";
      chip.style.opacity = "0.5";
    });

    chip.addEventListener("dragend", function () {
      chip.style.opacity = "";
      dragPayload = null;
    });

    chip.addEventListener("click", function () {
      if (chip.classList.contains("used")) {
        return;
      }

      var wasSelected = chip.classList.contains("is-selected");

      clearSelectedChip();

      if (!wasSelected) {
        chip.classList.add("is-selected");
        selectedChip = chip;
      }
    });
  });

  // ----------------------------------------------------------
  // Slots
  // ----------------------------------------------------------

  sortSlots.forEach(function (slot) {
    slot.addEventListener("dragstart", function (event) {
      if (!slot.dataset.current) {
        event.preventDefault();
        return;
      }

      var id = slot.dataset.current;

      dragPayload = {
        id: id,
        label: getChipLabel(id),
        sourceSlot: slot
      };

      event.dataTransfer.setData("text/plain", id);
      event.dataTransfer.effectAllowed = "move";

      slot.style.opacity = "0.5";
    });

    slot.addEventListener("dragend", function () {
      slot.style.opacity = "";
      dragPayload = null;
    });

    slot.addEventListener("dragover", function (event) {
      event.preventDefault();
      slot.classList.add("over");

      event.dataTransfer.dropEffect = "move";
    });

    slot.addEventListener("dragleave", function () {
      slot.classList.remove("over");
    });

    slot.addEventListener("drop", function (event) {
      event.preventDefault();
      slot.classList.remove("over");

      if (!dragPayload) {
        return;
      }

      if (dragPayload.sourceSlot === slot) {
        return;
      }

      placeItemInSlot(slot, dragPayload);
      dragPayload = null;
    });

    /*
     * Tipp-Fallback:
     * ausgewählten Chip in diesen Slot legen.
     *
     * Ist kein Chip ausgewählt, wird ein gefüllter Slot durch
     * Antippen wieder geleert.
     */
    slot.addEventListener("click", function () {
      if (selectedChip) {
        placeItemInSlot(slot, {
          id: selectedChip.dataset.id,
          label: selectedChip.textContent.trim(),
          sourceSlot: null
        });

        return;
      }

      if (slot.dataset.current) {
        var currentId = slot.dataset.current;

        renderEmptySlot(slot);
        setChipUsed(currentId, false);
        clearFeedback();
      }
    });

    slot.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      slot.click();
    });
  });

  // ----------------------------------------------------------
  // Begriff aus einem Slot zurück in die Bank ziehen
  // ----------------------------------------------------------

  sortBank.addEventListener("dragover", function (event) {
    if (dragPayload && dragPayload.sourceSlot) {
      event.preventDefault();
    }
  });

  sortBank.addEventListener("drop", function (event) {
    event.preventDefault();

    if (!dragPayload || !dragPayload.sourceSlot) {
      return;
    }

    renderEmptySlot(dragPayload.sourceSlot);
    setChipUsed(dragPayload.id, false);

    dragPayload = null;
    clearFeedback();
  });

  // ----------------------------------------------------------
  // Prüfen
  // ----------------------------------------------------------

  sortCheckButton.addEventListener("click", function () {
    var allFilled = true;
    var allCorrect = true;

    sortSlots.forEach(function (slot) {
      slot.classList.remove(
        "filled-correct",
        "filled-wrong"
      );

      var current = slot.dataset.current || "";
      var answer = slot.dataset.answer;

      if (!current) {
        allFilled = false;
        allCorrect = false;
        return;
      }

      if (current === answer) {
        slot.classList.add("filled-correct");
      } else {
        slot.classList.add("filled-wrong");
        allCorrect = false;
      }
    });

    sortFeedback.className = "quiz__feedback is-visible";

    if (!allFilled) {
      sortFeedback.textContent =
        "Noch nicht ganz: Ordne zuerst allen fünf Hauptkursen eine Beschreibung zu.";

      sortFeedback.classList.add(
        "quiz__feedback--wrong"
      );

      return;
    }

    if (allCorrect) {
      sortFeedback.textContent =
        "Richtig. Du kannst die fünf Hauptkurse ihren Arbeitsfeldern zuordnen.";

      sortFeedback.classList.add(
        "quiz__feedback--correct"
      );
    } else {
      sortFeedback.textContent =
        "Nicht ganz. Einige Beschreibungen gehören noch zu einem anderen Hauptkurs.";

      sortFeedback.classList.add(
        "quiz__feedback--wrong"
      );
    }
  });

  // ----------------------------------------------------------
  // Zurücksetzen
  // ----------------------------------------------------------

  sortResetButton.addEventListener("click", function () {
    sortSlots.forEach(function (slot) {
      renderEmptySlot(slot);
    });

    sortChips.forEach(function (chip) {
      chip.classList.remove(
        "used",
        "is-selected"
      );

      chip.style.opacity = "";
    });

    dragPayload = null;
    selectedChip = null;

    clearFeedback();
  });

  /*
   * Einheitlichen Ausgangszustand herstellen.
   */
  sortSlots.forEach(function (slot) {
    renderEmptySlot(slot);
  });
});

