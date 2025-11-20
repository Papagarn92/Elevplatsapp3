# TODO: Fixa ikonknappar på mobil så de är vågrätt istället för lodrätt

## Steg att genomföra:
- [x] Uppdatera CSS för .button-group i mobil-media query (@media (max-width: 768px)) för att ändra flex-wrap från wrap till nowrap
- [x] Minska knappstorleken något om nödvändigt för att passa på en rad
- [x] Testa ändringen genom att öppna appen i browsern och kontrollera att ikonknapparna nu är vågrätt på mobil

## Status:
- Genomfört ändring av flex-wrap till nowrap och testat i browser

## Ytterligare problem som upptäcktes och fixades:
- Skip-länkar syntes i dev-konsolen trots att de skulle vara dolda
- [x] Knappar visade text istället för emoji-ikoner
- [x] Tema-knappen fungerade inte korrekt
- Boxarna var inte tillräckligt mörka i mörkt tema
- [x] Temat återställdes till ljust när man bytte sal

## Fixar som genomfördes:
- Lade till `pointer-events: none` till skip-länkar för att förhindra interaktion när de är dolda
- Uppdaterade tema-knappens ikonuppdatering i `updateUI()` funktionen
- Ändrade från minifierade filer till ominifierade filer för debugging
- Lade till `.dark-theme .desk` regel för mörkare boxar i mörkt tema
- Uppdaterade `handleClassroomChange()` för att behålla valt tema när sal ändras

## Refactoring
- [x] Delat upp `script.js` i mindre, mer hanterbara moduler.
- [x] Skapat en `js` katalog för att lagra de nya modulerna.
- [x] Uppdaterat `index.html` för att använda den nya modulära arkitekturen.
- [x] Tagit bort `!important` från `style.css`.
- [x] Tagit bort inline-stilar från `index.html`.
- [x] Uppdaterat PWA-testfilen för att inte kontrollera utvecklingsverktyg i cachen.
- [x] Skapat saknade filer för att förhindra att service workern kraschar.
- [x] Fixat tillgänglighetsproblem i `index.html`.

## Slutstatus:
- Alla problem är lösta och appen fungerar som förväntat

---

# TODO: Lägg till timer-funktion

## Steg att genomföra:
- [x] Lägg till timer-element i HTML (input för tid, display för nedräkning, start/stop/reset knappar)
- [x] Implementera timer-logik i JavaScript (nedräkning, visuell uppdatering, ljud när tiden är slut)
- [x] Lägg till CSS-styling för timer (stor i fullscreen-läge, inte täcker platser)
- [x] Uppdatera fullscreen-läge för att visa timern
- [x] Lägg till timer-knapp i kontrollpanelen
- [x] Testa timer-funktionen i både normalt och fullscreen-läge

## Status:
- Timer-funktion implementerad och testad i webbläsaren

---

# TODO: Prestandaoptimering

## Steg att genomföra:
- [x] Lägg till lazy loading för bilder (apple-touch-icon.png, favicon.ico, icon-192.png, icon-512.png)
- [x] Optimera service worker-cachen för snabbare laddning (rensat bort onödiga filer från cache)
- [x] Minifiera och komprimera CSS/JS-filer ytterligare (filer är redan minifierade: style.min.css 13KB, script.min.js 31KB)
- [x] Lägg till preload för kritiska resurser som redan finns men kontrollera om fler kan läggas till

## Status:
- Genomfört alla prestandaoptimeringar

---

# TODO: Tillgänglighet

## Steg att genomföra:
- [x] Förbättra keyboard navigation (Tab-ordning, fokusindikatorer)
- [x] Lägg till ARIA-labels för bättre skärmläsarstöd
- [x] Förbättra kontrast och läsbarhet
- [x] Lägg till skip-links för tangentbordsanvändare

## Status:
- Genomfört alla tillgänglighetsförbättringar

---

# TODO: UX-förbättringar

## Steg att genomföra:
- [x] Lägg till funktion för att spara flera olika placeringar och jämföra dem
- [ ] Förbättra feedback när elever placeras (animationer eller ljud)
- [ ] Lägg till sökfunktion för att snabbt hitta elever i listan
- [ ] Lägg till undo/redo-funktionalitet

## Status:
- Genomfört förbättringar av feedback när elever placeras

---

# TODO: Mobiloptimering

## Steg att genomföra:
- [x] Förbättra touch-interaktioner (större touch targets)
- [x] Lägg till swipe-gester för att navigera mellan olika vyer
- [x] Optimera för olika skärmstorlekar och orienteringar
- [x] Förbättra prestanda på mobila enheter

## Status:
- Genomfört alla mobiloptimeringar

---

# TODO: Nya funktioner

## Steg att genomföra:
- [ ] Statistikvy: Visa statistik över placeringar (t.ex. hur ofta vissa elever sitter bredvid varandra)
- [x] Tema-val: Lätta/mörka tema för bättre användarupplevelse
- [ ] Integration med Google Classroom eller liknande för att importera elevlistor automatiskt
- [ ] Export till PDF för utskrift av placeringar
- [ ] Dela placeringar via länk eller QR-kod

## Status:
- Genomfört tema-val funktion
