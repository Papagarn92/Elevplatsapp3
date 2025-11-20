# Umami Analytics Setup Guide

## Vad är Umami?
Umami är ett open-source, integritetsvänligt analytics-verktyg som är:
- ✅ GDPR-compliant (ingen cookies, ingen personlig data)
- ✅ Gratis för upp till 3 websites
- ✅ Enkelt att sätta upp
- ✅ Fungerar perfekt med GitHub Pages

## Steg-för-steg guide

### 1. Skapa Umami Cloud-konto
1. Gå till https://cloud.umami.is
2. Klicka på "Sign up" (eller "Get started")
3. Skapa ett konto med din e-post
4. Bekräfta din e-post

### 2. Lägg till din website
1. Logga in på Umami Cloud
2. Klicka på "Add website" eller "+"
3. Fyll i:
   - **Name**: Elevplatsapp3 (eller valfritt namn)
   - **Domain**: `papagarn92.github.io` (VIKTIGT: Använd INTE `/Elevplatsapp3` - bara domänen!)
   - **Timezone**: Europe/Stockholm (eller din tidszon)
4. Klicka "Save"

**OBS:** Umami spårar automatiskt alla sidor under domänen, så även om din app ligger på `papagarn92.github.io/Elevplatsapp3` ska du bara ange `papagarn92.github.io` som domän.

### 3. Hämta tracking-kod
1. Efter att du lagt till websiten, klicka på den
2. Klicka på "Settings" eller "Edit"
3. Scrolla ner till "Tracking code"
4. Du kommer se något liknande:
```html
<script async src="https://cloud.umami.is/script.js" 
        data-website-id="12345678-1234-1234-1234-123456789abc">
</script>
```

### 4. Uppdatera din kod
1. Öppna `index.html` i din editor
2. Hitta kommentaren som börjar med `<!-- Umami Analytics -->`
3. Ersätt `YOUR-SCRIPT-URL` med din script URL (t.ex. `https://cloud.umami.is/script.js`)
4. Ersätt `YOUR-WEBSITE-ID` med ditt website ID (UUID:n)
5. Ta bort kommentarerna `<!--` och `-->` runt script-taggen

**Före:**
```html
<!-- 
<script async src="YOUR-SCRIPT-URL" data-website-id="YOUR-WEBSITE-ID"></script>
-->
```

**Efter:**
```html
<script async src="https://cloud.umami.is/script.js" 
        data-website-id="12345678-1234-1234-1234-123456789abc">
</script>
```

6. Gör samma sak i `admin.html`

### 5. Pusha till GitHub
1. Spara ändringarna
2. Commit och pusha till GitHub:
```bash
git add index.html admin.html
git commit -m "Add Umami Analytics tracking"
git push origin main
```

### 6. Verifiera att det fungerar
1. Vänta några minuter tills GitHub Pages uppdateras
2. Besök din GitHub Pages-sida: https://papagarn92.github.io/Elevplatsapp3
3. Gå tillbaka till Umami Cloud dashboard
4. Du borde se din första besökare inom några sekunder!

## Vad spåras?

Umami spårar:
- ✅ Antal besökare (unika och totalt)
- ✅ Sidvisningar
- ✅ Vilka sidor som besöks
- ✅ Referrers (varifrån besökare kommer)
- ✅ Enhetstyp (desktop, mobil, tablet)
- ✅ Webbläsare och OS
- ✅ Land (baserat på IP, men IP:n sparas inte)

Umami spårar INTE:
- ❌ Personlig information
- ❌ IP-adresser
- ❌ Cookies
- ❌ Fingerprinting
- ❌ Användaridentitet

## Visa statistik

### I Umami Dashboard:
1. Logga in på https://cloud.umami.is
2. Klicka på din website
3. Se realtidsstatistik och historik

### Funktioner i Umami:
- **Realtime**: Se besökare i realtid
- **Pages**: Vilka sidor som besöks mest
- **Referrers**: Varifrån besökare kommer
- **Devices**: Desktop vs mobil
- **Countries**: Geografisk fördelning
- **Events**: Spåra specifika händelser (avancerat)

## Custom Events (Valfritt)

Om du vill spåra specifika händelser (t.ex. när någon placerar elever), kan du lägga till:

```javascript
// I js/app.js, efter en lyckad placering:
if (window.umami) {
    umami.track('placera-elever', { 
        classroom: currentClassroom,
        class: currentClass 
    });
}
```

Detta är helt valfritt och kräver ingen extra konfiguration.

## Felsökning

### Ingen data visas i Umami
1. Kontrollera att du tagit bort kommentarerna runt script-taggen
2. Kontrollera att website ID:t är korrekt
3. Öppna webbläsarens utvecklarverktyg (F12) → Network
4. Ladda om sidan och sök efter "script.js" - den ska laddas utan fel
5. Vänta några minuter - det kan ta lite tid innan data visas

### Script laddas inte
1. Kontrollera att script URL:en är korrekt
2. Kontrollera att du har internet-anslutning
3. Vissa ad-blockers kan blockera analytics - testa att stänga av dem

### Besökare räknas inte
1. Kontrollera att website ID:t matchar det i Umami
2. Kontrollera att domänen är korrekt inställd i Umami
3. Testa i inkognito-läge för att undvika cache-problem

## Alternativ till Umami Cloud

Om du vill ha mer kontroll kan du självhosta Umami:
1. Kräver en server (t.ex. DigitalOcean, Heroku, Vercel)
2. Gratis och open source
3. Mer tekniskt krävande
4. Guide: https://umami.is/docs/install

## Support

- **Umami Dokumentation**: https://umami.is/docs
- **Umami GitHub**: https://github.com/umami-software/umami
- **Umami Discord**: https://discord.gg/4dz4zcXYrQ

## Kostnad

- **Umami Cloud Free**: 
  - 3 websites
  - 10,000 events/månad
  - 1 år datalagring
  - Perfekt för din app!

- **Umami Cloud Pro** (om du behöver mer):
  - $9/månad
  - 10 websites
  - 100,000 events/månad
  - 5 år datalagring

För din elevplatsapp räcker Free-planen mer än väl!
