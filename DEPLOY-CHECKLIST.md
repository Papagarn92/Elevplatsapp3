# Deploy Checklist för GitHub Pages

## ✅ Filer som BEHÖVS (ska pushas):

### Huvudfiler:
- ✅ index.html (huvudapp)
- ✅ admin.html (statistik-panel)
- ✅ style.css (styling)
- ✅ manifest.json (PWA manifest)
- ✅ service-worker.js (PWA service worker)
- ✅ sw-register.js (service worker registrering)

### JavaScript-moduler (js/):
- ✅ js/main.js (entry point)
- ✅ js/app.js (huvudlogik)
- ✅ js/classroom.js (klassrumskonfiguration)
- ✅ js/data.js (datahantering)
- ✅ js/events.js (event handlers)
- ✅ js/placement.js (placeringslogik)
- ✅ js/state.js (state management)
- ✅ js/students.js (elevlistor)
- ✅ js/ui.js (UI-funktioner)
- ✅ js/statistics.js (statistikberäkningar)
- ✅ js/admin.js (admin-panel logik)

### Ikoner & Assets:
- ✅ favicon.ico
- ✅ icon-192.png
- ✅ icon-512.png
- ✅ apple-touch-icon.png

### Dokumentation:
- ✅ TODO.md (projekthistorik)
- ✅ STATISTIK-README.md (statistikguide)
- ✅ UMAMI-GUIDE.md (analytics guide)
- ✅ PWA-README.md (PWA-info, valfritt)
- ✅ QUICK-START.md (snabbstart, valfritt)

### Git-filer:
- ✅ .gitattributes
- ✅ .gitignore (ny fil)

## ❌ Filer som INTE behövs (ignoreras av .gitignore):

- ❌ script.js (gammal monolitisk fil, ersatt av moduler)
- ❌ generate-icons.html (endast för utveckling)
- ❌ test-pwa.html (endast för testning)

## 🔍 Verifiering innan deploy:

### 1. Kontrollera att alla filer är uppdaterade:
```bash
git status
```

### 2. Testa lokalt:
- Öppna index.html i webbläsare
- Testa placera elever
- Testa byta sal och klass
- Testa tema-byte
- Öppna admin.html och logga in
- Verifiera att statistik visas

### 3. Kontrollera Umami Analytics:
- ✅ Tracking-kod tillagd i index.html
- ✅ Tracking-kod tillagd i admin.html
- ✅ Domän korrekt: papagarn92.github.io

### 4. Kontrollera service worker:
- ✅ Alla filer i urlsToCache finns
- ✅ Inga referenser till borttagna filer

## 🚀 Deploy-kommandon:

```bash
# 1. Lägg till alla filer
git add .

# 2. Commit med beskrivande meddelande
git commit -m "Add statistics, Umami Analytics, fix modules, and clean up"

# 3. Pusha till GitHub
git push origin main
```

## 📊 Efter deploy:

1. Vänta 2-5 minuter på GitHub Pages att uppdatera
2. Besök: https://papagarn92.github.io/Elevplatsapp3
3. Testa alla funktioner
4. Kontrollera Umami dashboard för besöksstatistik
5. Testa admin-panel: https://papagarn92.github.io/Elevplatsapp3/admin.html

## ⚠️ Vanliga problem:

### Problem: 404 på GitHub Pages
- Lösning: Kontrollera att repository settings har GitHub Pages aktiverat
- Kontrollera att rätt branch är vald (main)

### Problem: Service Worker cachar gamla filer
- Lösning: Öppna DevTools → Application → Clear storage → Clear site data
- Eller: Öppna i inkognito-läge

### Problem: Umami visar ingen data
- Lösning: Kontrollera att tracking-koden är korrekt
- Kontrollera att website ID matchar i Umami dashboard
- Vänta några minuter - data kan ta tid att visas

### Problem: Admin-panel visar ingen statistik
- Lösning: Gör några placeringar i huvudappen först
- Kontrollera att rätt klass är vald i admin-panelen
- Kontrollera browser console för fel

## ✨ Allt klart!

När du har pushat och verifierat att allt fungerar på GitHub Pages, är din app redo för produktion!
