# HfG Ulm — E-Learning · Projektdokumentation

## Ordnerstruktur

```
hfg-elearning/
index.html                   Weiterleitung zu start.html (nicht anfassen)
    css/
        tokens.css               Farben, Schriften, Abstände (GEMEINSAM)
        typography.css           Schrift-Stile (GEMEINSAM)
        layout.css               Raster, Nav, Sidebar (GEMEINSAM)
        components.css           Buttons, Cards, Quiz etc. (GEMEINSAM)
        seiten/                  Seiten-spezifische CSS (INDIVIDUELL)
        start-[name].css
        geschichte-[name].css
        lehre-[name].css
        design-[name].css
        erbe-[name].css
    js/
    navigation.js            Fortschrittsbalken (GEMEINSAM)
    quiz.js                  Quiz-Logik (GEMEINSAM)
    hotspot.js               Aufklapp-Bilder (GEMEINSAM)

    assets/
        fonts/                   Schriftdateien
        images/                  Alle Bilder
    seiten/
    _vorlage.html            Kopiervorlage 
    start.html
    geschichte.html
    lehre.html
    design.html
    erbe.html
```

---

## Regeln für die Zusammenarbeit

### 1. Jede Person arbeitet nur an ihrer eigenen Seite

Jede Person ist verantwortlich für genau eine Datei in `seiten/`:


### 2. Die gemeinsamen Dateien sind tabu

Die folgenden Dateien dürfen **nicht eigenständig verändert werden**:

```
css/tokens.css
css/typography.css
css/layout.css
css/components.css
js/navigation.js
js/quiz.js
js/hotspot.js
seiten/_vorlage.html
index.html
```

Diese Dateien betreffen **alle Seiten gleichzeitig**. Eine unabgesprochene Änderung kann das Design aller anderen Seiten kaputtmachen.

---

### 3. Änderungen an gemeinsamen Dateien müssen abgesprochen werden

Falls jemand merkt, dass eine gemeinsame Datei angepasst werden muss (z.B. eine neue Komponente fehlt, ein Abstand stimmt nicht überall), gilt:

1. **Zuerst in der Gruppe kommunizieren** — kurze Nachricht an alle
2. **Gemeinsam entscheiden** ob und wie die Änderung gemacht wird
3. **Eine Person** führt die Änderung durch, alle anderen werden informiert

Keine Änderung an gemeinsamen Dateien ohne Absprache — egal wie klein sie erscheint.

---

### 4. Seiten-spezifische Styles in eigene CSS-Datei auslagern

Wenn für die eigene Seite zusätzliche Styles benötigt werden die noch nicht in den gemeinsamen CSS-Dateien definiert sind, kommen diese in eine **eigene CSS-Datei** unter `css/seiten/`.

**Benennung:** `[seitenname]-[vorname].css`

Beispiele:
```
css/seiten/geschichte-eva.css
```

Diese Datei wird dann **nur in der eigenen HTML-Seite** eingebunden, direkt nach den gemeinsamen CSS-Links:

```html
<!-- Gemeinsame CSS — nicht ändern -->
<link rel="stylesheet" href="../css/tokens.css">
<link rel="stylesheet" href="../css/typography.css">
<link rel="stylesheet" href="../css/layout.css">
<link rel="stylesheet" href="../css/components.css">

<!-- Eigene CSS — nur auf dieser Seite -->
<link rel="stylesheet" href="../css/seiten/geschichte-eva.css">
```

**Wichtig:** In der eigenen CSS-Datei immer die Variablen aus `tokens.css` verwenden — keine fixen Werte wie `#FF7B00` oder `40px` direkt hinschreiben, sondern `var(--color-orange)` bzw. `var(--sq-4)`.

---

### 5. Bilder und Assets

Alle Bilder kommen in `assets/images/`. Um Konflikte zu vermeiden bitte Bilder mit dem Seitennamen als Präfix benennen:

```
assets/images/lehre-grundkurs.jpg
assets/images/design-braun-t3.jpg
assets/images/geschichte-gruendung.jpg
```

---

## Kurzreferenz: Die wichtigsten Variablen

### Abstände (Red-Square-System)
```css
var(--sq-1)   /* 210px — große Sektionsabstände */
var(--sq-2)   /* 110px — zwischen Blöcken, nach H1 */
var(--sq-3)   /*  55px — zwischen Elementen, nach H2 */
var(--sq-4)   /*  40px — interne Abstände, nach H3 */
var(--sq-5)   /*  28px — kleine Lücken */
var(--sq-6)   /*  14px — Micro-Abstände */
```

### Farben
```css
var(--color-orange)   /* #FF7B00 — Akzentfarbe */
var(--color-black)    /* #1A0A00 — Fast-Schwarz */
var(--color-white)    /* #FFFFFF */
var(--color-text)     /* #1A0A00 — Standardtextfarbe */
```

### Schriftgrößen
```css
var(--fs-h1)      /* 130px — Hero-Titel */
var(--fs-h2)      /*  48px — Abschnittstitel */
var(--fs-h3)      /*  30px — Untertitel */
var(--fs-body)    /*  18px — Fließtext */
var(--fs-detail)  /*  13px — Labels, Caps */
```

### Spalten (Grid)
```html
<!-- Breite ohne festen Start -->
<div class="col-6">

<!-- Breite mit festem Start (Start + Breite = Ende) -->
<div class="col-start-3-end-9">
```
