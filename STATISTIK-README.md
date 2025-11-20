# Statistikfunktioner - Admin Panel

## Översikt
Admin-panelen ger dig detaljerad statistik över elevplaceringar och hur ofta elever sitter bredvid varandra.

## Åtkomst
Öppna `admin.html` i din webbläsare. URL:en är separat från huvudappen för säkerhet.

**Första gången:**
1. Öppna `admin.html`
2. Ange ett nytt lösenord (minst 4 tecken)
3. Lösenordet sparas lokalt i din webbläsare

**Efterföljande gånger:**
1. Öppna `admin.html`
2. Ange ditt lösenord
3. Klicka "Logga in"

## Funktioner

### 📊 Översiktsstatistik
Visar tre huvudmått:
- **Totalt antal placeringar**: Hur många gånger elever har placerats
- **Genomsnittlig grannfrekvens**: Genomsnittligt antal gånger elevpar sitter bredvid varandra
- **Elever som aldrig suttit bredvid**: Antal elevpar som aldrig varit grannar

### 🔥 Grannfrekvens Heatmap
En visuell matris som visar:
- Varje elev på både X- och Y-axeln
- Färgkodade celler baserat på hur ofta två elever suttit bredvid varandra
- Ljusare färg = färre gånger tillsammans
- Mörkare färg = fler gånger tillsammans
- Hovra över en cell för att se exakt antal

### 📋 Detaljerad statistik (Tabell)
En sorterad tabell som visar:
- Topp 50 elevpar som suttit bredvid varandra mest
- Sorterad med högsta frekvensen först
- Visar exakt antal gånger för varje par

### ❌ Elever som aldrig suttit bredvid varandra
En lista över alla elevpar som aldrig varit grannar i någon placering.

### 📅 Placeringshistorik
Visar de senaste 20 placeringarna med:
- Datum och tid
- Vilket klassrum
- Antal elever som placerades

## Kontroller

### Klassval
Välj vilken klass du vill se statistik för. Statistiken uppdateras automatiskt.

### 📥 Exportera
Exporterar all statistik för vald klass som en JSON-fil, inklusive:
- Placeringshistorik
- Grannfrekvensdata
- Sammanfattande statistik

### 🗑️ Rensa historik
Raderar all placeringshistorik för vald klass. **Varning: Detta kan inte ångras!**

### ⚙️ Inställningar
Öppnar inställningspanelen där du kan:
- Ändra admin-lösenord
- Bekräfta nytt lösenord
- Spara ändringar

### 🚪 Logga ut
Loggar ut från admin-panelen och återgår till login-skärmen.

## Hur statistiken samlas in

### Automatisk loggning
Varje gång du klickar på "Placera elever" i huvudappen:
1. Placeringen sparas med tidsstämpel
2. Klassrum och elevplaceringar loggas
3. Data sparas i webbläsarens LocalStorage

### Grannberäkning
Systemet beräknar automatiskt vilka elever som sitter bredvid varandra baserat på:
- Klassrumslayout (Sal 302, NO Salen, Sal 305, Sal 315)
- Platsnummer och position
- Grannar definieras som elever som sitter direkt intill (vänster/höger/fram/bakom)

### Datalagring
- All data sparas lokalt i din webbläsare
- Ingen data skickas till externa servrar
- Historiken begränsas till senaste 100 placeringarna per klass
- Du kan när som helst rensa historiken

## Säkerhet

### Lösenordsskydd
- Admin-panelen kräver lösenord för åtkomst
- Lösenordet sparas lokalt (inte i molnet)
- Du kan ändra lösenordet när som helst via Inställningar

### Separat URL
- Admin-sidan är helt separat från huvudappen
- Endast du som känner till URL:en kan komma åt den
- Dela inte URL:en med obehöriga

## Tips för användning

### Bästa praxis
1. **Regelbunden export**: Exportera statistik regelbundet som backup
2. **Rensa gamla data**: Rensa historik för klasser som inte längre är aktiva
3. **Analysera mönster**: Använd heatmap för att identifiera elever som ofta sitter tillsammans
4. **Balansera placeringar**: Använd "aldrig grannar"-listan för att säkerställa variation

### Tolkning av data
- **Hög grannfrekvens**: Elever som ofta sitter tillsammans (kan vara bra eller dåligt beroende på syfte)
- **Låg grannfrekvens**: Elever som sällan sitter tillsammans (bra för variation)
- **Aldrig grannar**: Elever som aldrig suttit bredvid varandra (överväg att placera dem tillsammans)

## Felsökning

### Ingen data visas
- Kontrollera att du har valt en klass
- Kontrollera att du har gjort placeringar i huvudappen
- Placeringar måste göras EFTER att statistikfunktionen implementerades

### Lösenord fungerar inte
- Kontrollera att du använder rätt lösenord
- Om du glömt lösenordet, öppna webbläsarens utvecklarverktyg (F12)
- Gå till Application/Storage → Local Storage
- Ta bort nyckeln `adminPassword`
- Ladda om sidan och skapa ett nytt lösenord

### Statistiken verkar felaktig
- Kontrollera att klassrumslayouten är korrekt konfigurerad
- Rensa historiken och börja om med nya placeringar
- Exportera data och granska JSON-filen för fel

## Teknisk information

### Filer
- `admin.html` - Admin-panelens HTML
- `js/admin.js` - Admin-panelens JavaScript
- `js/statistics.js` - Statistikberäkningar och datahantering

### LocalStorage-nycklar
- `adminPassword` - Admin-lösenord
- `placementHistory_[KLASSNAMN]` - Placeringshistorik per klass
- `elevPlatser_[SAL]_[KLASS]` - Aktuella placeringar
- `studentAttributes_[KLASS]` - Elevattribut

### Dataformat
Placeringshistorik sparas som:
```json
[
  {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "classroom": "Sal 302",
    "assignments": {
      "1": "Ahmed",
      "2": "Elliott",
      ...
    }
  }
]
```

## Support
Om du stöter på problem eller har frågor, kontakta systemadministratören.
