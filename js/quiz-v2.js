/* =============================================================
   QUIZ-V2.JS — Interaktive Übungen
   HfG Ulm E-Learning

   Module:
   1. Multiple Choice (5 Fragen, Score + Ergebnis)
   2. Richtig / Falsch (5 Aussagen, Score + Ergebnis)
   3. Memory (4 Paare, 8 Karten, Flip-Animation)
   4. Lückentext (Drag & Drop, 3 Lücken)
   ============================================================= */

document.addEventListener('DOMContentLoaded', function () {


  // ============================================================
  // 1. MULTIPLE CHOICE
  // ============================================================

  var mcData = [
    {
      q: 'Welches Produkt besteht aus vier Holzteilen und einem Rundstab?',
      opts: ['Braun T 3', 'Ulmer Hocker', 'Teekanne T2', 'Regalsystem 606'],
      correct: 1,
      ex: 'Der Ulmer Hocker zeigt mit wenigen Teilen gleich mehrere Funktionen: Sitz, Beistelltisch, Tablett.'
    },
    {
      q: 'Welches Produkt steht besonders für „System statt Einzelstück"?',
      opts: ['Regalsystem 606', 'SK 4 Radio', 'Olympia-Piktogramme', 'Teekanne T2'],
      correct: 0,
      ex: 'Das Regalsystem 606 ist modular, kombinierbar und wächst mit dem Raum oder dem Leben mit.'
    },
    {
      q: 'Warum passt das SK 4 Radio so gut zur Ulmer Haltung?',
      opts: [
        'Weil Technik versteckt wird',
        'Weil Transparenz und Ordnung sichtbar werden',
        'Weil es möglichst verziert ist',
        'Weil es nur als Dekoration dient'
      ],
      correct: 1,
      ex: 'Beim SK 4 wird Technik nicht versteckt. Die klare Ordnung macht das Produkt verständlich.'
    },
    {
      q: 'Welches Objekt steht für visuelle Sprache ohne Worte?',
      opts: ['Braun T 3', 'Ulmer Hocker', 'Olympia-Piktogramme', 'Regalsystem 606'],
      correct: 2,
      ex: 'Aichers Piktogramme funktionieren als Zeichensystem: verständlich, reduziert und international lesbar.'
    },
    {
      q: 'Was macht die Teekanne T2 zum guten Produkt?',
      opts: [
        'Ornament und Mode',
        'Griff, Ausguss und Volumen sind präzise geordnet',
        'Möglichst komplizierte Bedienung',
        'Ein einzelner auffälliger Effekt'
      ],
      correct: 1,
      ex: 'Bei der Teekanne T2 wird Alltag präzise gedacht: Die Form folgt dem Gebrauch.'
    }
  ];

  var mcIdx    = 0;
  var mcScore  = 0;
  var mcLocked = false;

  var mcQuestion      = document.getElementById('mc-question');
  var mcOptions       = document.getElementById('mc-options');
  var mcFeedback      = document.getElementById('mc-feedback');
  var mcFooter        = document.getElementById('mc-footer');
  var mcNextBtn       = document.getElementById('mc-next-btn');
  var mcCurrentEl     = document.getElementById('mc-current');
  var mcActiveEl      = document.getElementById('mc-active');
  var mcResultEl      = document.getElementById('mc-result');
  var mcScoreDisplay  = document.getElementById('mc-score-display');
  var mcResultTitle   = document.getElementById('mc-result-title');
  var mcResultText    = document.getElementById('mc-result-text');
  var mcRetryBtn      = document.getElementById('mc-retry');

  function mcRender() {
    if (!mcQuestion) return;
    var item = mcData[mcIdx];
    mcLocked = false;

    mcCurrentEl.textContent = String(mcIdx + 1).padStart(2, '0');

    mcQuestion.textContent = item.q;

    mcFeedback.textContent = '';
    mcFeedback.className = 'quiz__feedback';

    mcFooter.style.display = 'none';

    mcOptions.innerHTML = '';
    item.opts.forEach(function (opt, i) {
      var div = document.createElement('div');
      div.className = 'quiz__option';
      div.innerHTML =
        '<span class="quiz__radio"></span>' +
        '<span class="quiz__option-text">' + opt + '</span>';
      div.addEventListener('click', function () { mcChoose(i); });
      mcOptions.appendChild(div);
    });
  }

  function mcChoose(chosen) {
    if (mcLocked) return;
    mcLocked = true;

    var item = mcData[mcIdx];
    var correct = chosen === item.correct;
    if (correct) mcScore++;

    var allOpts = mcOptions.querySelectorAll('.quiz__option');
    allOpts.forEach(function (opt, i) {
      opt.style.pointerEvents = 'none';
      if (i === item.correct) {
        opt.classList.add('is-correct');
      } else if (i === chosen && !correct) {
        opt.classList.add('is-wrong');
      }
    });

    mcFeedback.textContent = (correct ? 'Richtig. ' : 'Nicht ganz. ') + item.ex;
    mcFeedback.classList.add('is-visible');
    mcFeedback.classList.add(correct ? 'quiz__feedback--correct' : 'quiz__feedback--wrong');

    mcNextBtn.textContent = (mcIdx === mcData.length - 1) ? 'Ergebnis sehen' : 'Nächste Frage';
    mcFooter.style.display = 'flex';
  }

  if (mcNextBtn) {
    mcNextBtn.addEventListener('click', function () {
      mcIdx++;
      if (mcIdx >= mcData.length) {
        mcShowResult();
      } else {
        mcRender();
      }
    });
  }

  function mcShowResult() {
    mcActiveEl.style.display = 'none';
    mcResultEl.style.display = 'block';
    mcScoreDisplay.textContent = mcScore + ' / ' + mcData.length;

    if (mcScore === mcData.length) {
      mcResultTitle.textContent = 'Perfekt. Du erkennst die Produkte.';
      mcResultText.textContent  = 'Alle fünf Fragen richtig. Du kannst die Objekte und ihre Designargumente sicher zuordnen.';
    } else if (mcScore >= 3) {
      mcResultTitle.textContent = 'Guter Produktblick.';
      mcResultText.textContent  = mcScore + ' von 5 richtig. Die wichtigsten Designargumente sitzen schon.';
    } else {
      mcResultTitle.textContent = 'Nochmal zu den Produkten.';
      mcResultText.textContent  = mcScore + ' von 5 richtig. Schau dir die Objektstrecke nochmal an: Hocker, Regal, Radio, Teekanne und Piktogramme.';
    }
  }

  if (mcRetryBtn) {
    mcRetryBtn.addEventListener('click', function () {
      mcIdx = 0;
      mcScore = 0;
      mcResultEl.style.display = 'none';
      mcActiveEl.style.display = 'block';
      mcRender();
    });
  }

  mcRender();


  // ============================================================
  // 2. RICHTIG / FALSCH
  // ============================================================

  var rfData = [
    {
      q: 'Der Ulmer Hocker kann auch als Beistelltisch und Tablett genutzt werden.',
      correct: true,
      ex: 'Richtig. Der Hocker vereint Sitz, Beistelltisch und Tablett in einem einzigen Objekt — das ist das Ulmer Argument.'
    },
    {
      q: 'Das SK 4 Radio versteckt seine Technik hinter einer verzierten Oberfläche.',
      correct: false,
      ex: 'Falsch. Beim SK 4 wird Technik sichtbar gemacht, nicht versteckt — das ist das Ulmer Argument.'
    },
    {
      q: 'Aichers Piktogramme für die Olympia 1972 sind ohne Worte international lesbar.',
      correct: true,
      ex: 'Richtig. Das Zeichensystem funktioniert reduziert und international.'
    },
    {
      q: 'Das Regalsystem 606 wurde für genau einen festen Raum entworfen.',
      correct: false,
      ex: 'Falsch. Das Regalsystem ist modular und wächst mit dem Raum und den Bedürfnissen mit.'
    },
    {
      q: 'Die Form beim Ulmer Design folgt dem Gebrauch.',
      correct: true,
      ex: 'Richtig. „Form follows function" ist das Kernargument des Ulmer Ansatzes.'
    }
  ];

  var rfIdx    = 0;
  var rfScore  = 0;
  var rfLocked = false;

  var rfQuestion  = document.getElementById('rf-question');
  var rfCurrentEl = document.getElementById('rf-current');
  var rfBtnTrue   = document.getElementById('rf-btn-true');
  var rfBtnFalse  = document.getElementById('rf-btn-false');
  var rfFeedback  = document.getElementById('rf-feedback');
  var rfFooter    = document.getElementById('rf-footer');
  var rfNextBtn   = document.getElementById('rf-next-btn');
  var rfActiveEl  = document.getElementById('rf-active');
  var rfResultEl      = document.getElementById('rf-result');
  var rfScoreDisplay  = document.getElementById('rf-score-display');
  var rfResultTitle   = document.getElementById('rf-result-title');
  var rfResultText    = document.getElementById('rf-result-text');
  var rfRetryBtn      = document.getElementById('rf-retry');

  function rfRender() {
    if (!rfQuestion) return;
    var item = rfData[rfIdx];
    rfLocked = false;

    rfCurrentEl.textContent = String(rfIdx + 1).padStart(2, '0');

    rfQuestion.textContent = item.q;

    rfFeedback.textContent = '';
    rfFeedback.className = 'quiz__feedback';

    rfFooter.style.display = 'none';

    rfBtnTrue.className  = 'btn btn--ghost btn--pill btn--lg qv2-tf-btn';
    rfBtnFalse.className = 'btn btn--ghost btn--pill btn--lg qv2-tf-btn';
    rfBtnTrue.disabled   = false;
    rfBtnFalse.disabled  = false;
  }

  function rfChoose(chosen) {
    if (rfLocked) return;
    rfLocked = true;

    var item = rfData[rfIdx];
    var correct = (chosen === item.correct);
    if (correct) rfScore++;

    if (item.correct === true) {
      rfBtnTrue.classList.add('is-correct');
      if (!correct) rfBtnFalse.classList.add('is-wrong');
    } else {
      rfBtnFalse.classList.add('is-correct');
      if (!correct) rfBtnTrue.classList.add('is-wrong');
    }

    rfBtnTrue.disabled  = true;
    rfBtnFalse.disabled = true;

    rfFeedback.textContent = item.ex;
    rfFeedback.classList.add('is-visible');
    rfFeedback.classList.add(correct ? 'quiz__feedback--correct' : 'quiz__feedback--wrong');

    rfNextBtn.textContent = (rfIdx === rfData.length - 1) ? 'Ergebnis sehen' : 'Nächste Aussage';
    rfFooter.style.display = 'flex';
  }

  if (rfBtnTrue)  rfBtnTrue.addEventListener('click',  function () { rfChoose(true);  });
  if (rfBtnFalse) rfBtnFalse.addEventListener('click', function () { rfChoose(false); });

  if (rfNextBtn) {
    rfNextBtn.addEventListener('click', function () {
      rfIdx++;
      if (rfIdx >= rfData.length) {
        rfShowResult();
      } else {
        rfRender();
      }
    });
  }

  function rfShowResult() {
    rfActiveEl.style.display = 'none';
    rfResultEl.style.display = 'block';
    rfScoreDisplay.textContent = rfScore + ' / ' + rfData.length;

    if (rfScore === rfData.length) {
      rfResultTitle.textContent = 'Perfekt. Alle Aussagen richtig bewertet.';
      rfResultText.textContent  = 'Du kennst die wesentlichen Designargumente der HfG Ulm.';
    } else if (rfScore >= 3) {
      rfResultTitle.textContent = 'Guter Überblick.';
      rfResultText.textContent  = rfScore + ' von 5 Aussagen richtig. Die wesentlichen Argumente sitzen schon.';
    } else {
      rfResultTitle.textContent = 'Nochmal zu den Aussagen.';
      rfResultText.textContent  = rfScore + ' von 5 richtig. Lies nochmal nach — Form, Funktion, System.';
    }
  }

  if (rfRetryBtn) {
    rfRetryBtn.addEventListener('click', function () {
      rfIdx = 0;
      rfScore = 0;
      rfResultEl.style.display = 'none';
      rfActiveEl.style.display = 'block';
      rfRender();
    });
  }

  rfRender();


  // ============================================================
  // 3. MEMORY
  // ============================================================

  var memPairs = [
    {
      id: 'p1',
      a: { kicker: 'Gestalter', label: 'Max Bill',     image: '../assets/images/HfG-Grundlehre-Tomás-Maldonado-in-der-Grundlehre-Foto-Ernst-Hahn-HfG-Archiv-480x342.jpg' },
      b: { kicker: 'Produkt',   label: 'Ulmer Hocker', image: '../assets/images/products/ulmer-hocker.png' }
    },
    {
      id: 'p2',
      a: { kicker: 'Gestalter', label: 'Dieter Rams',  image: '../assets/images/HfG-Grundlehre-Tomás-Maldonado-in-der-Grundlehre-Foto-Ernst-Hahn-HfG-Archiv-480x342.jpg' },
      b: { kicker: 'Produkt',   label: 'Braun T 3',    image: '../assets/images/products/braun-t3.png' }
    },
    {
      id: 'p3',
      a: { kicker: 'Gestalter', label: 'Hans Gugelot', image: '../assets/images/HfG-Grundlehre-Tomás-Maldonado-in-der-Grundlehre-Foto-Ernst-Hahn-HfG-Archiv-480x342.jpg' },
      b: { kicker: 'Produkt',   label: 'SK 4 Radio',   image: '../assets/images/products/sk4-radio.png' }
    },
    {
      id: 'p4',
      a: { kicker: 'Gestalter', label: 'Otl Aicher',   image: '../assets/images/otl_aicher.jpg' },
      b: { kicker: 'Produkt',   label: 'Olympia 1972', image: '../assets/images/products/olympia-1972.png' }
    }
  ];

  var memBoard       = document.getElementById('mem-board');
  var memMovesEl     = document.getElementById('mem-moves');
  var memFoundEl     = document.getElementById('mem-found');
  var memCompleteEl  = document.getElementById('mem-complete');
  var memComplTxt    = document.getElementById('mem-complete-text');
  var memResetBtn    = document.getElementById('mem-reset');
  var memResetBtn2   = document.getElementById('mem-reset-2');
  var memState       = { first: null, lock: false, moves: 0, found: 0 };

  function memShuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var memFrontHTML =
    '<div class="qv2-mem-mark" aria-hidden="true">' +
    '<span>H</span><span>F</span><span>G</span>' +
    '<span>U</span><span>L</span><span>M</span>' +
    '</div>';

  function memRender() {
    if (!memBoard) return;
    memBoard.innerHTML = '';
    memBoard.classList.remove('is-complete');
    memState = { first: null, lock: false, moves: 0, found: 0 };
    if (memMovesEl)    memMovesEl.textContent    = '0';
    if (memFoundEl)    memFoundEl.textContent    = '0';
    if (memCompleteEl) memCompleteEl.style.display = 'none';

    var cards = [];
    memPairs.forEach(function (p) {
      cards.push({ pair: p.id, kicker: p.a.kicker, label: p.a.label, image: p.a.image });
      cards.push({ pair: p.id, kicker: p.b.kicker, label: p.b.label, image: p.b.image });
    });

    memShuffle(cards).forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qv2-mem-card';
      btn.dataset.pair = c.pair;
      btn.setAttribute('aria-label', 'Karte aufdecken');
      var imgContent = c.image
        ? '<img class="qv2-mem-img-real" src="' + c.image + '" alt="' + c.label + '">'
        : '<div class="qv2-mem-img" aria-hidden="true"></div>';
      btn.innerHTML =
        '<div class="qv2-mem-face qv2-mem-front">' + memFrontHTML + '</div>' +
        '<div class="qv2-mem-face qv2-mem-back">' +
          imgContent +
          '<span class="qv2-mem-kicker">' + c.kicker + '</span>' +
          '<span class="qv2-mem-label">' + c.label + '</span>' +
        '</div>';
      btn.addEventListener('click', function () { memClick(btn); });
      memBoard.appendChild(btn);
    });
  }

  function memClick(card) {
    if (memState.lock) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    card.setAttribute('aria-label', card.querySelector('.qv2-mem-label').textContent);

    if (!memState.first) {
      memState.first = card;
      return;
    }

    memState.moves++;
    if (memMovesEl) memMovesEl.textContent = memState.moves;
    memState.lock = true;

    var a = memState.first;
    var b = card;

    if (a.dataset.pair === b.dataset.pair) {
      setTimeout(function () {
        a.classList.add('matched');
        b.classList.add('matched');
        memState.found++;
        if (memFoundEl) memFoundEl.textContent = memState.found;
        memState.first = null;
        memState.lock  = false;
        if (memState.found === memPairs.length) {
          memBoard.classList.add('is-complete');
          if (memCompleteEl) {
            if (memComplTxt) memComplTxt.textContent = memState.moves + ' Züge. Du kennst die Paare.';
            memCompleteEl.style.display = 'flex';
          }
        }
      }, 300);
    } else {
      a.classList.add('mismatch');
      b.classList.add('mismatch');
      setTimeout(function () {
        a.classList.remove('flipped', 'mismatch');
        b.classList.remove('flipped', 'mismatch');
        a.setAttribute('aria-label', 'Karte aufdecken');
        b.setAttribute('aria-label', 'Karte aufdecken');
        memState.first = null;
        memState.lock  = false;
      }, 900);
    }
  }

  if (memResetBtn)  memResetBtn.addEventListener('click', memRender);
  if (memResetBtn2) memResetBtn2.addEventListener('click', memRender);
  memRender();


  // ============================================================
  // 4. LÜCKENTEXT (Drag & Drop)
  // ============================================================

  var gapSlots    = document.querySelectorAll('.qv2-gap-slot[data-answer]');
  var gapChips    = document.querySelectorAll('.qv2-gap-chip[draggable]');
  var gapFeedback = document.getElementById('gap-feedback');
  var gapCheckBtn = document.getElementById('gap-check');
  var gapResetBtn = document.getElementById('gap-reset');
  var gapDragging = null;

  gapChips.forEach(function (chip) {
    chip.addEventListener('dragstart', function (e) {
      gapDragging = chip;
      e.dataTransfer.setData('text/plain', chip.dataset.word);
      chip.style.opacity = '0.5';
    });
    chip.addEventListener('dragend', function () {
      chip.style.opacity = '';
      gapDragging = null;
    });
  });

  gapSlots.forEach(function (slot) {
    slot.addEventListener('dragover', function (e) {
      e.preventDefault();
      slot.classList.add('over');
    });
    slot.addEventListener('dragleave', function () {
      slot.classList.remove('over');
    });
    slot.addEventListener('drop', function (e) {
      e.preventDefault();
      slot.classList.remove('over');

      var word = e.dataTransfer.getData('text/plain');

      // Altes Wort aus diesem Slot zurück in die Bank
      if (slot.dataset.current) {
        var prev = Array.from(gapChips).find(function (c) {
          return c.dataset.word === slot.dataset.current;
        });
        if (prev) prev.classList.remove('used');
      }

      slot.textContent = word;
      slot.dataset.current = word;
      slot.classList.remove('filled-correct', 'filled-wrong');

      if (gapDragging) gapDragging.classList.add('used');

      if (gapFeedback) {
        gapFeedback.textContent = '';
        gapFeedback.className = 'quiz__feedback';
      }
    });
  });

  if (gapCheckBtn) {
    gapCheckBtn.addEventListener('click', function () {
      var allCorrect = true;

      gapSlots.forEach(function (slot) {
        var filled = slot.dataset.current || '';
        slot.classList.remove('filled-correct', 'filled-wrong');
        if (filled === slot.dataset.answer) {
          slot.classList.add('filled-correct');
        } else {
          slot.classList.add('filled-wrong');
          allCorrect = false;
        }
      });

      if (gapFeedback) {
        gapFeedback.classList.add('is-visible');
        if (allCorrect) {
          gapFeedback.classList.add('quiz__feedback--correct');
          gapFeedback.classList.add('qv2-gap-success');
          gapFeedback.classList.remove('quiz__feedback--wrong');
          gapFeedback.textContent = 'Alle Lücken richtig ausgefüllt.';
        } else {
          gapFeedback.classList.add('quiz__feedback--wrong');
          gapFeedback.classList.remove('quiz__feedback--correct');
          gapFeedback.classList.remove('qv2-gap-success');
          gapFeedback.textContent = 'X Nicht alle Lücken stimmen — überprüf deine Antworten.';
        }
      }
    });
  }

  if (gapResetBtn) {
    gapResetBtn.addEventListener('click', function () {
      gapSlots.forEach(function (slot) {
        slot.innerHTML = '&nbsp;';
        delete slot.dataset.current;
        slot.classList.remove('filled-correct', 'filled-wrong');
      });
      gapChips.forEach(function (chip) {
        chip.classList.remove('used');
      });
      if (gapFeedback) {
        gapFeedback.textContent = '';
        gapFeedback.className = 'quiz__feedback';
      }
    });
  }


  // ============================================================
  // 5. PRODUKT-EXPLORER
  // ============================================================

  var explItems = [
    {
      id: 'hocker',
      label: 'Ulmer\nHocker',
      title: 'Ulmer Hocker',
      desc: 'Mit nur vier Holzteilen und einem Rundstab vereint der Hocker drei Funktionen in einem Objekt: Sitz, Beistelltisch und Tablett. Das Ulmer Argument in seiner reinsten Form.',
      year: '1954',
      author: 'Max Bill · Hans Gugelot',
      image: '../assets/images/products/ulmer-hocker.png',
      alt: 'Ulmer Hocker aus hellem Holz mit rundem Querstab'
    },
    {
      id: 'braun',
      label: 'Braun T 3',
      title: 'Braun T 3',
      desc: 'Das Taschenradio von Dieter Rams macht Funktion sichtbar — minimale Form, maximale Ordnung. Kein Ornament, das nicht zugleich Information wäre.',
      year: '1958',
      author: 'Dieter Rams',
      image: '../assets/images/products/braun-t3.png',
      alt: 'Kompaktes Braun T 3 Taschenradio in Cremeweiß'
    },
    {
      id: 'sk4',
      label: 'SK 4\nRadio',
      title: 'SK 4 Radio',
      desc: 'Hans Gugelots SK 4 zeigt Technik, statt sie zu verbergen. Die transparente Abdeckung aus Plexiglas macht den Mechanismus selbst zur Gestaltung.',
      year: '1956',
      author: 'Hans Gugelot · Dieter Rams',
      image: '../assets/images/products/sk4-radio.png',
      alt: 'SK 4 Radio mit heller Front und transparenter Abdeckung'
    },
    {
      id: 'regal',
      label: 'Regal-\nsystem 606',
      title: 'Regalsystem 606',
      desc: 'Modular, kombinierbar, wachsend — das Regalsystem 606 denkt nicht in Einzelstücken, sondern in Systemen. Es passt sich an Raum und Leben an.',
      year: '1960',
      author: 'Dieter Rams',
      image: '../assets/images/products/regalsystem-606.png',
      alt: 'Modulares weißes Regalsystem 606 an einer hellen Wand'
    },
    {
      id: 'teekanne',
      label: 'Tee-\nkanne T2',
      title: 'Teekanne T2',
      desc: 'Bei der Teekanne T2 ist Alltag präzise gedacht. Griff, Ausguss und Volumen — alles ist geordnet, nichts ist zufällig. Form follows function.',
      year: '1956',
      author: 'Hans Roericht',
      image: '../assets/images/products/teekanne-t2.png',
      alt: 'Minimalistische weiße Teekanne T2 mit klarer Form'
    },
    {
      id: 'olympia',
      label: 'Olympia\n1972',
      title: 'Olympia-Piktogramme 1972',
      desc: 'Otl Aichers Bildzeichen funktionieren ohne Worte — reduziert, universell, präzise. Ein Zeichensystem, das Sprach- und Ländergrenzen überwindet.',
      year: '1972',
      author: 'Otl Aicher',
      image: '../assets/images/products/olympia-1972.png',
      alt: 'Geometrische Sportpiktogramme der Olympischen Spiele 1972 auf Blau'
    }
  ];

  var explMap   = document.getElementById('expl-map');
  var explPanel = document.getElementById('expl-panel');

  if (explMap && explPanel) {
    var MAP_W  = 560;
    var MAP_H  = 600;
    var CX     = MAP_W / 2;
    var CY     = MAP_H / 2;
    // Horizontal weiter auffächern: Die äußeren Kreise schließen links und
    // rechts bündig mit der 560-px-Karte ab; oben und unten bleiben sie auf
    // derselben Höhe wie das benachbarte Panel.
    var RADIUS_X = 254;
    var RADIUS_Y = 235;
    var N      = explItems.length;

    // Verbindungslinien zwischen Marke und Produkten
    var eSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    eSvg.setAttribute('class', 'qv2-expl-svg');
    eSvg.setAttribute('viewBox', '0 0 ' + MAP_W + ' ' + MAP_H);
    explMap.appendChild(eSvg);

    // Mittel-Knoten
    var eCenterBtn = document.createElement('button');
    eCenterBtn.type = 'button';
    eCenterBtn.className = 'qv2-expl-node qv2-expl-node--center is-active';
    eCenterBtn.style.left = (CX / MAP_W * 100) + '%';
    eCenterBtn.style.top  = (CY / MAP_H * 100) + '%';
    eCenterBtn.innerHTML  =
      '<div class="qv2-expl-mark" aria-hidden="true">' +
      '<span>H</span><span>F</span><span>G</span>' +
      '<span>U</span><span>L</span><span>M</span>' +
      '</div>';
    eCenterBtn.setAttribute('aria-label', 'HfG Ulm — Übersicht');
    explMap.appendChild(eCenterBtn);

    // Äußere Knoten
    var eOuterBtns = [];
    var eLines = [];
    explItems.forEach(function (item, i) {
      var angle = (i * (360 / N) - 90) * (Math.PI / 180);
      var nx = Math.round(CX + RADIUS_X * Math.cos(angle));
      var ny = Math.round(CY + RADIUS_Y * Math.sin(angle));

      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', CX); line.setAttribute('y1', CY);
      line.setAttribute('x2', nx); line.setAttribute('y2', ny);
      line.setAttribute('class', 'qv2-expl-line');
      eSvg.appendChild(line);
      eLines.push(line);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qv2-expl-node qv2-expl-node--outer';
      btn.style.left = (nx / MAP_W * 100) + '%';
      btn.style.top  = (ny / MAP_H * 100) + '%';
      btn.innerHTML  =
        '<span class="qv2-expl-node__index">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="qv2-expl-node__label">' + item.label.replace('\n', '<br>') + '</span>';
      btn.setAttribute('aria-label', item.title);
      explMap.appendChild(btn);
      eOuterBtns.push(btn);

      btn.addEventListener('click', function () { explSelect(item, btn, i); });
    });

    function explReset() {
      eOuterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      eLines.forEach(function (line) { line.classList.remove('is-active'); });
      eCenterBtn.classList.add('is-active');

      explPanel.innerHTML =
        '<div class="qv2-expl-hero">' +
          '<figure class="qv2-expl-hero-fig">' +
            '<img src="../assets/images/HfG-Grundlehre-Tomás-Maldonado-in-der-Grundlehre-Foto-Ernst-Hahn-HfG-Archiv-480x342.jpg" alt="HfG Ulm Grundlehre">' +
          '</figure>' +
          '<div class="qv2-expl-hero-info">' +
            '<span class="label label--orange">Produkte erkunden</span>' +
            '<h3>Objekt auswählen</h3>' +
            '<p class="body-text">Wähle einen der sechs Kreise aus und entdecke den Entwurf, seine Idee und seinen gestalterischen Kontext.</p>' +
          '</div>' +
        '</div>';
    }

    function explSelect(item, btn, index) {
      eOuterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      eLines.forEach(function (line) { line.classList.remove('is-active'); });
      eCenterBtn.classList.remove('is-active');
      btn.classList.add('is-active');

      explPanel.innerHTML =
        '<div class="qv2-expl-reveal">' +
          '<figure class="qv2-expl-reveal__image">' +
            '<img src="' + item.image + '" alt="' + item.alt + '">' +
            '<figcaption>Objekt ' + String(index + 1).padStart(2, '0') + ' · HfG Ulm</figcaption>' +
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
  }


  // ============================================================
  // 6. EIN TAG AN DER HFG
  // ============================================================

  var dayTabs         = Array.from(document.querySelectorAll('.qv2-day-tab'));
  var dayImage        = document.getElementById('qv2-day-image');
  var dayHotspots     = Array.from(document.querySelectorAll('[data-qv2-day-hotspot]'));
  var dayPopupLabel   = document.getElementById('qv2-day-popup-label');
  var dayPopupTitle   = document.getElementById('qv2-day-popup-title');
  var dayPopupBody    = document.getElementById('qv2-day-popup-body');
  var dayLabel        = document.getElementById('qv2-day-label');
  var daySummaryTitle = document.getElementById('qv2-day-summary-title');
  var daySummaryBody  = document.getElementById('qv2-day-summary-body');
  var daySummarySwapTimer;
  var daySummaryHideTimer;

  var dayData = {
    morning: {
      label: 'Morgens',
      title: 'Unterricht',
      body: 'Der Tag begann meist mit Unterricht. In diesem Bild findet gerade der Grundkurs statt — eine Pflichtveranstaltung für alle Studierenden der HfG Ulm.',
      popupLabel: 'Dozent:innen',
      popupTitle: 'Tomás Maldonado',
      popupBody: 'In diesem Grundkurs gibt Maldonado den Studierenden Hilfestellung.'
    },
    midday: {
      label: 'Mittags',
      title: 'Gemeinsam arbeiten',
      body: 'Zwischen den Veranstaltungen wurde in Gruppen weitergearbeitet. Die offene Raumstruktur der HfG förderte spontanen Austausch und Kollaboration.',
      popupLabel: 'Studierende',
      popupTitle: 'Praktische Arbeit',
      popupBody: 'Viele Aufgaben entstanden im Team — Diskussion und gegenseitige Kritik gehörten fest zum Ulmer Modell.'
    },
    evening: {
      label: 'Abends',
      title: 'Entwürfe diskutieren',
      body: 'Am Abend wurden die Ergebnisse des Tages präsentiert und kritisch bewertet. Kritik war keine Ablehnung, sondern Methode — Teil des gestalterischen Denkens.',
      popupLabel: 'Lehrmethode',
      popupTitle: 'Kritik als Werkzeug',
      popupBody: 'An der HfG wurde Kritik konstruktiv eingesetzt — jede Entwurfsentscheidung musste begründbar sein.'
    }
  };

  // Das Bild startet morgens; der Hotspot hat deshalb bereits sinnvollen Inhalt,
  // auch bevor eine Tageszeit ausgewählt wurde.
  if (dayPopupLabel) dayPopupLabel.textContent = dayData.morning.popupLabel;
  if (dayPopupTitle) dayPopupTitle.textContent = dayData.morning.popupTitle;
  if (dayPopupBody)  dayPopupBody.textContent  = dayData.morning.popupBody;

  function selectDay(dayName) {
    var data = dayData[dayName];
    if (!data) return;

    dayTabs.forEach(function (tab) {
      var active = tab.dataset.day === dayName;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    // Karte unter den aktiven Tab gleiten lassen
    var dayOrder = ['morning', 'midday', 'evening'];
    var tabIndex = dayOrder.indexOf(dayName);
    var summary = document.querySelector('.qv2-day-summary');

    function updateSummaryText() {
      if (dayLabel)        dayLabel.textContent        = data.label;
      if (daySummaryTitle) daySummaryTitle.textContent = data.title;
      if (daySummaryBody)  daySummaryBody.textContent  = data.body;
    }

    if (summary) {
      window.clearTimeout(daySummarySwapTimer);
      window.clearTimeout(daySummaryHideTimer);

      // Slide-Position aktualisieren
      summary.classList.remove('qv2-day-summary--pos-0', 'qv2-day-summary--pos-1', 'qv2-day-summary--pos-2');
      if (tabIndex >= 0) summary.classList.add('qv2-day-summary--pos-' + tabIndex);

      var isHidden = summary.style.display === 'none';
      if (isHidden) {
        updateSummaryText();
        summary.style.display = 'block';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            summary.style.opacity = '1';
          });
        });
      } else {
        summary.style.opacity = '0';
        daySummarySwapTimer = window.setTimeout(function () {
          updateSummaryText();
          summary.style.opacity = '1';
        }, 280);
      }
    }

    // Popup-Inhalt still aktualisieren — Öffnen/Schließen nur per Hotspot-Klick
    if (dayPopupLabel) dayPopupLabel.textContent = data.popupLabel;
    if (dayPopupTitle) dayPopupTitle.textContent = data.popupTitle;
    if (dayPopupBody)  dayPopupBody.textContent  = data.popupBody;
  }

  if (dayTabs.length) {
    dayTabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        if (tab.classList.contains('is-active')) {
          // Erneut geklickt → abwählen
          tab.classList.remove('is-active');
          tab.setAttribute('aria-selected', 'false');
          var summary = document.querySelector('.qv2-day-summary');
          if (summary) {
            window.clearTimeout(daySummarySwapTimer);
            window.clearTimeout(daySummaryHideTimer);
            summary.style.opacity = '0';
            daySummaryHideTimer = window.setTimeout(function () {
              summary.style.display = 'none';
            }, 440);
          }
        } else {
          selectDay(tab.dataset.day);
        }
      });

      tab.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        var direction = event.key === 'ArrowRight' ? 1 : -1;
        var nextIndex = (index + direction + dayTabs.length) % dayTabs.length;
        dayTabs[nextIndex].focus();
        selectDay(dayTabs[nextIndex].dataset.day);
      });
    });
  }

  function setHotspotState(trigger, popup, open) {
    var wasVisible = popup.classList.contains('is-visible');

    if (open) {
      window.clearTimeout(trigger.qv2ClosingTimer);
      trigger.classList.remove('is-closing');
    } else if (wasVisible) {
      trigger.classList.add('is-closing');
      window.clearTimeout(trigger.qv2ClosingTimer);
      trigger.qv2ClosingTimer = window.setTimeout(function () {
        trigger.classList.remove('is-closing');
      }, 320);
    }

    trigger.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    popup.classList.toggle('is-visible', open);
    trigger.setAttribute('aria-label', open ? 'Information schließen' : trigger.dataset.closedLabel);
  }

  function closeAllDayHotspots() {
    dayHotspots.forEach(function (trigger) {
      var popup = document.getElementById(trigger.dataset.qv2DayHotspot);
      if (popup) setHotspotState(trigger, popup, false);
    });
  }

  dayHotspots.forEach(function (trigger) {
    var popup = document.getElementById(trigger.dataset.qv2DayHotspot);
    if (!popup) return;

    trigger.dataset.closedLabel = trigger.getAttribute('aria-label') || 'Information öffnen';

    trigger.addEventListener('click', function (event) {
      event.stopPropagation();
      var shouldOpen = !trigger.classList.contains('is-open');
      closeAllDayHotspots();
      if (shouldOpen) setHotspotState(trigger, popup, true);
    });

    popup.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  });

  var dayStage = document.getElementById('qv2-day-stage');
  if (dayStage) {
    dayStage.addEventListener('click', closeAllDayHotspots);
  }


  // ============================================================
  // 7. STYLEGUIDE: SPRECHBLASE + MASKOTTCHEN
  // Wird per JavaScript angehängt, damit quiz-v2.html unverändert bleibt.
  // ============================================================

  var guideHost = document.querySelector('.main-content');

  if (guideHost && !document.getElementById('qv2-guide-styleguide')) {
    var guideStyleguide = document.createElement('section');
    guideStyleguide.className = 'section section--sm section-inner qv2-guide-styleguide';
    guideStyleguide.id = 'qv2-guide-styleguide';
    guideStyleguide.setAttribute('aria-labelledby', 'qv2-guide-styleguide-title');

    guideStyleguide.innerHTML =
      '<div class="qv2-section-head qv2-guide-styleguide__head">' +
        '<span class="label label--orange">Styleguide</span>' +
        '<div>' +
          '<h2 id="qv2-guide-styleguide-title">Guide-Komponente</h2>' +
          '<p class="qv2-expl-intro">Sprechblase und Maskottchen in drei festen Größen.</p>' +
        '</div>' +
      '</div>' +
      '<div class="qv2-guide-scale">' +
        '<article class="qv2-guide-scale__item">' +
          '<div class="qv2-guide-scale__meta">' +
            '<span class="label label--orange">S</span>' +
            '<strong>Klein</strong>' +
            '<span>60 px</span>' +
          '</div>' +
          '<div class="qv2-guide-demo qv2-guide-demo--sm">' +
            '<div class="qv2-guide-bubble">' +
              '<span class="qv2-guide-kicker">Tipp</span>' +
              '<p>Lies die Frage in Ruhe.</p>' +
            '</div>' +
            '<div class="qv2-guide-figure"><img src="../assets/svg/Figur_winken.svg" alt="HfG-Maskottchen"></div>' +
          '</div>' +
        '</article>' +
        '<article class="qv2-guide-scale__item">' +
          '<div class="qv2-guide-scale__meta">' +
            '<span class="label label--orange">M</span>' +
            '<strong>Mittel</strong>' +
            '<span>84 px</span>' +
          '</div>' +
          '<div class="qv2-guide-demo qv2-guide-demo--md">' +
            '<div class="qv2-guide-bubble">' +
              '<span class="qv2-guide-kicker">Dein Guide</span>' +
              '<p>Gut gemacht! Du hast das Prinzip erkannt.</p>' +
            '</div>' +
            '<div class="qv2-guide-figure"><img src="../assets/svg/Figur_winken.svg" alt="HfG-Maskottchen"></div>' +
          '</div>' +
        '</article>' +
        '<article class="qv2-guide-scale__item">' +
          '<div class="qv2-guide-scale__meta">' +
            '<span class="label label--orange">L</span>' +
            '<strong>Groß</strong>' +
            '<span>120 px</span>' +
          '</div>' +
          '<div class="qv2-guide-demo qv2-guide-demo--lg">' +
            '<div class="qv2-guide-bubble">' +
              '<span class="qv2-guide-kicker">Schon gewusst?</span>' +
              '<p>Das Maskottchen begleitet dich durch die Übungen und gibt dir kurze Hinweise.</p>' +
            '</div>' +
            '<div class="qv2-guide-figure"><img src="../assets/svg/Figur_winken.svg" alt="HfG-Maskottchen"></div>' +
          '</div>' +
        '</article>' +
      '</div>' +
      '<div class="qv2-section-head qv2-guide-styleguide__head qv2-guide-styleguide__head--second">' +
        '<span class="label label--orange">Styleguide</span>' +
        '<div>' +
          '<h2>Guide-Komponente, gespiegelt</h2>' +
          '<p class="qv2-expl-intro">Dieselben drei Größen mit Maskottchen links und rechtsbündigem Text.</p>' +
        '</div>' +
      '</div>' +
      '<div class="qv2-guide-scale">' +
        '<article class="qv2-guide-scale__item">' +
          '<div class="qv2-guide-scale__meta">' +
            '<span class="label label--orange">S</span>' +
            '<strong>Klein</strong>' +
            '<span>60 px</span>' +
          '</div>' +
          '<div class="qv2-guide-demo qv2-guide-demo--sm qv2-guide-demo--left">' +
            '<div class="qv2-guide-figure"><img src="../assets/svg/Figur_winken.svg" alt="HfG-Maskottchen"></div>' +
            '<div class="qv2-guide-bubble">' +
              '<span class="qv2-guide-kicker">Tipp</span>' +
              '<p>Lies die Frage in Ruhe.</p>' +
            '</div>' +
          '</div>' +
        '</article>' +
        '<article class="qv2-guide-scale__item">' +
          '<div class="qv2-guide-scale__meta">' +
            '<span class="label label--orange">M</span>' +
            '<strong>Mittel</strong>' +
            '<span>84 px</span>' +
          '</div>' +
          '<div class="qv2-guide-demo qv2-guide-demo--md qv2-guide-demo--left">' +
            '<div class="qv2-guide-figure"><img src="../assets/svg/Figur_winken.svg" alt="HfG-Maskottchen"></div>' +
            '<div class="qv2-guide-bubble">' +
              '<span class="qv2-guide-kicker">Dein Guide</span>' +
              '<p>Gut gemacht! Du hast das Prinzip erkannt.</p>' +
            '</div>' +
          '</div>' +
        '</article>' +
        '<article class="qv2-guide-scale__item">' +
          '<div class="qv2-guide-scale__meta">' +
            '<span class="label label--orange">L</span>' +
            '<strong>Groß</strong>' +
            '<span>120 px</span>' +
          '</div>' +
          '<div class="qv2-guide-demo qv2-guide-demo--lg qv2-guide-demo--left">' +
            '<div class="qv2-guide-figure"><img src="../assets/svg/Figur_winken.svg" alt="HfG-Maskottchen"></div>' +
            '<div class="qv2-guide-bubble">' +
              '<span class="qv2-guide-kicker">Schon gewusst?</span>' +
              '<p>Das Maskottchen begleitet dich durch die Übungen und gibt dir kurze Hinweise.</p>' +
            '</div>' +
          '</div>' +
        '</article>' +
      '</div>';

    guideHost.appendChild(guideStyleguide);
  }

});
