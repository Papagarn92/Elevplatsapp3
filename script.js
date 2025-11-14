// Nyckeln vi använder i LocalStorage. Sparar per sal OCH klass.
const STORAGE_KEY_PREFIX = 'elevPlatser_';

// -------------------------------------------------------------------
// KLASSLISTOR
// -------------------------------------------------------------------
const STUDENT_LIST_IT24A = [
    "Ahmed", "Elliott", "Yunes", "Emil", "Charlie", "Hadi", "Mahmad",
    "Oliver", "Mihajlo", "Elias", "Mohammed", "Alexander", "Liam",
    "Safa", "Nemat", "Hugo", "Konrad", "Michael", "Ksawery", "Rana", "Ludvig"
];
const STUDENT_LIST_EE25A = [
    "Omar", "Ahmed", "Fardeen", "Hakim", "Yousef", "Anton", "Mihnea",
    "Max-Kellian", "Erik", "Wiggo", "Reda", "Max H", "Vincent K", "Benjamin K",
    "Marin L", "Liam", "Saade", "Matin N", "Rumle", "Benjamin P", "Vincent R G",
    "Ramman", "Ayush", "Marcel"
];
const STUDENT_LIST_EE25B = [
    "Kareem", "Yousif", "Mohamad", "Muhammad", "Subhan", "Farhan", "Elliott",
    "Sebastian", "Ari", "Denislav", "Zoya", "Seyhmuz", "Moschos", "Simon",
    "Lionel", "Måns", "Leon", "David", "Adin", "Filip", "Metin", "Olle",
    "Engjull", "Dominic", "Emil"
];
const STUDENT_LIST_TE24 = [
    "Hamza", "Ludvig", "Julian", "Kamil", "Taha", "Melvin", "Emma",
    "Sebastian", "Almin", "Mani", "Knut", "Jibril", "Mojtaba", "Otto",
    "Kevin", "Jonathan", "Odai", "Lavin", "Stefan"
];

const STUDENT_LIST_IT23A = [
    "Annas", "Dominic And", "Dominic Art", "Sebastian", "Endrit",
    "Liam B", "Filip", "Yosef", "Leonardo", "Malcolm", "Elijah",
    "Tamim", "Eliot", "Edwin", "Jacob", "Liam M", "Milo",
    "Benjamin", "Mohamed", "Armando", "Sixten"
];

const STUDENT_LIST_IT23B = [
    "Adam A", "Abdlrahman", "Milton", "Mark", "André",
    "Nicholas", "Anton", "Mahan", "Lana", "Leo",
    "Estelle", "Hampus", "Isak", "Adam N", "Ibrahim",
    "Nader", "Gabriel", "Mohammad", "Hugo", "Danoa",
    "Emil", "Oscar", "Fardowso", "Vincent"
];

const STUDENT_LIST_IT24B = [
    "Emilio", "Vincent", "Can", "Emrah", "Erand",
    "Enis", "William", "Milton", "Tor", "Oskar",
    "Oscar", "Devlin", "Philip", "Isaac", "Danyal",
    "Mohsen", "Christian", "David", "Nathaniel", "Andi", "Muhammed"
];

const STUDENT_LIST_TE23 = [
    "Salman", "Ali", "Muaaz", "Felix", "Kamel", "Benjamin", "Aarez", "Mohsin", "Kían", "Ludwig", "Husnain", "Josef", "William", "Enes", "Batoul", "Mustafa", "Kevin", "Victoria", "Artur", "Zakaria", "Danylo", "Abderrahmane", "Zahid", "Rizky", "Sanad", "Tindra", "Troels", "Jan"
];

const STUDENT_LIST_TE25 = [
    "Jacob", "Aous", "Hassan", "Elliot", "Lina", "Sumalia", "Liam", "Tariq", "Valeriia", "Washington", "Holger", "Yousef", "Lukas", "Kilian", "Linus", "Alfred", "Mohammed", "Mhamd", "Mohammad", "Edin", "Mutlu", "Ackilles", "Zain", "Mikkel", "Muneer", "Timaf", "Leopold"
];

// Samlar alla klasslistor
const CLASS_LISTS = {
    "IT24A": STUDENT_LIST_IT24A,
    "EE25A": STUDENT_LIST_EE25A,
    "EE25B": STUDENT_LIST_EE25B,
    "TE24": STUDENT_LIST_TE24,
    "IT23A": STUDENT_LIST_IT23A,
    "IT23B": STUDENT_LIST_IT23B,
    "IT24B": STUDENT_LIST_IT24B,
    "TE23": STUDENT_LIST_TE23,
    "TE25": STUDENT_LIST_TE25
};
// -------------------------------------------------------------------

// Funktion för att få antal platser i Sal 302 baserat på klassens storlek
function getSal302Seats() {
    const currentStudentList = CLASS_LISTS[currentClass] || [];
    return currentStudentList.length === 25 ? 25 : 24;
}

// KLASSRUMS KONFIGURATION (Med justerad Sal 305)
const CLASSROOM_CONFIG = {
    "Sal 302": {
        max_seats: 25, // Detta kommer att överskridas dynamiskt
        columns_per_row: 8,
        gang_column_width: "100px",
        allows_names: true,
        whiteboard_position: { row: 1, col_start: 4, span: 6 },
        dynamic_seats: true // Flagga för att indikera dynamiska platser
    },
    "NO Salen": {
        max_seats: 25,
        grid_template_columns: "40px repeat(2, 1fr) 80px repeat(4, 1fr)",
        allows_names: true,
        layout_map: [
            { id: 1, row: 2, col: 2 }, { id: 2, row: 2, col: 3 },
            { id: 3, row: 2, col: 5 }, { id: 4, row: 2, col: 6 }, { id: 5, row: 2, col: 7 }, { id: 6, row: 2, col: 8 },
            { id: 7, row: 3, col: 2 }, { id: 8, row: 3, col: 3 },
            { id: 9, row: 3, col: 5 }, { id: 10, row: 3, col: 6 }, { id: 11, row: 3, col: 7 }, { id: 12, row: 3, col: 8 },
            { id: 13, row: 4, col: 2 }, { id: 14, row: 4, col: 3 },
            { id: 15, row: 4, col: 5 }, { id: 16, row: 4, col: 6 }, { id: 17, row: 4, col: 7 }, { id: 18, row: 4, col: 8 },
            { id: 19, row: 5, col: 2 }, { id: 20, row: 5, col: 3 },
            { id: 21, row: 5, col: 5 }, { id: 22, row: 5, col: 6 }, { id: 23, row: 5, col: 7 }, { id: 24, row: 5, col: 8 },
            { id: 25, row: 6, col: 5 }
        ],
        whiteboard_position: {
            row: 1,
            col_start: 2,
            span: 7
        }
    },
    // ** UPPDATERAD SAL 305 **
    "Sal 305": {
        max_seats: 30, // 15 bänkar * 2 platser
        allows_names: true,
        grid_template_columns: "repeat(2, 1fr) 50px repeat(2, 1fr) 50px repeat(2, 1fr)",
        whiteboard_position: { row: 1, col_start: 1, span: 8 },

        // Pelaren är nu på rad 3, kolumn 7 och spänner 1 plats.
        pillar_position: { row: 3, col_start: 7, span: 1 },

        // Karta över de 30 platserna, justerad
        layout_map: [
            // Rad 2 (Nu en full bänkrad)
            { id: 1, row: 2, col: 1 }, { id: 2, row: 2, col: 2 },   // Vänster
            { id: 3, row: 2, col: 4 }, { id: 4, row: 2, col: 5 },   // Mitten
            { id: 5, row: 2, col: 7 }, { id: 6, row: 2, col: 8 },   // Höger bänk 1

            // Rad 3 (Pelaren är i högra kolumnen, tar plats 9)
            { id: 7, row: 3, col: 1 }, { id: 8, row: 3, col: 2 },
            { id: 9, row: 3, col: 4 }, { id: 10, row: 3, col: 5 },
            // Plats 9 & 10 (gamla) är nu blockerade

            // Rad 4
            { id: 11, row: 4, col: 1 }, { id: 12, row: 4, col: 2 },
            { id: 13, row: 4, col: 4 }, { id: 14, row: 4, col: 5 },
            { id: 15, row: 4, col: 7 }, { id: 16, row: 4, col: 8 }, // Höger bänk 2

            // Rad 5
            { id: 17, row: 5, col: 1 }, { id: 18, row: 5, col: 2 },
            { id: 19, row: 5, col: 4 }, { id: 20, row: 5, col: 5 },
            { id: 21, row: 5, col: 7 }, { id: 22, row: 5, col: 8 }, // Höger bänk 3

            // Rad 6
            { id: 23, row: 6, col: 1 }, { id: 24, row: 6, col: 2 },
            { id: 25, row: 6, col: 4 }, { id: 26, row: 6, col: 5 },
            // Tomt till höger

            // Rad 7
            { id: 27, row: 7, col: 1 }, { id: 28, row: 7, col: 2 },
            { id: 29, row: 7, col: 4 }, { id: 30, row: 7, col: 5 }
            // Tomt till höger
        ]
    },
    // ** NY SAL 315 **
    "Sal 315": {
        max_seats: 30, // Uppdaterad till 30 platser efter borttagning av platser 3 och 4
        allows_names: true,
        grid_template_columns: "repeat(2, 1fr) 60px repeat(4, 1fr)", // 2 vänster + gap + 4 höger
        whiteboard_position: { row: 1, col_start: 1, span: 7 },

        // Karta över de 30 platserna efter borttagning av platser 3 och 4
        layout_map: [
            // Rad 2: Höger 2 platser
            { id: 1, row: 2, col: 6 }, { id: 2, row: 2, col: 7 },   // Höger (2 platser)

            // Rad 3: Höger 4 platser (platser 3 och 4 borttagna)
            { id: 3, row: 3, col: 4 }, { id: 4, row: 3, col: 5 }, { id: 5, row: 3, col: 6 }, { id: 6, row: 3, col: 7 }, // Höger (4 platser)

            // Rad 4: Vänster 2 platser, Höger 4 platser
            { id: 7, row: 4, col: 1 }, { id: 8, row: 4, col: 2 }, // Vänster
            { id: 9, row: 4, col: 4 }, { id: 10, row: 4, col: 5 }, { id: 11, row: 4, col: 6 }, { id: 12, row: 4, col: 7 }, // Höger

            // Rad 5: Vänster 2 platser, Höger 4 platser
            { id: 13, row: 5, col: 1 }, { id: 14, row: 5, col: 2 }, // Vänster
            { id: 15, row: 5, col: 4 }, { id: 16, row: 5, col: 5 }, { id: 17, row: 5, col: 6 }, { id: 18, row: 5, col: 7 }, // Höger

            // Rad 6: Vänster 2 platser, Höger 4 platser
            { id: 19, row: 6, col: 1 }, { id: 20, row: 6, col: 2 }, // Vänster
            { id: 21, row: 6, col: 4 }, { id: 22, row: 6, col: 5 }, { id: 23, row: 6, col: 6 }, { id: 24, row: 6, col: 7 }, // Höger

            // Rad 7: Vänster 2 platser, Höger 4 platser
            { id: 25, row: 7, col: 1 }, { id: 26, row: 7, col: 2 }, // Vänster
            { id: 27, row: 7, col: 4 }, { id: 28, row: 7, col: 5 }, { id: 29, row: 7, col: 6 }, { id: 30, row: 7, col: 7 }  // Höger (4 platser)
        ]
    }
};

// Globala variabler
let currentClassroom = Object.keys(CLASSROOM_CONFIG)[0];
let currentClass = Object.keys(CLASS_LISTS)[0];
let assignments = {};
let studentAttributes = {}; // Lagrar attribut för varje elev
let sensitiveInfoVisible = true; // Om känslig info ska visas
let isLocked = false; // Om placeringarna är låsta
let lockCode = null; // Låskoden
let failedUnlockAttempts = 0; // Antal fel försök att låsa upp
let lockoutUntil = null; // Timestamp när utlåsning upphör
let lockoutLevel = 0; // Nivå av utlåsning (0=ingen, 1=5min, 2=10min, 3+=30min)
const MAX_UNLOCK_ATTEMPTS = 3; // Maximum antal fel försök innan timeout
const LOCKOUT_DURATIONS = [0, 5 * 60 * 1000, 10 * 60 * 1000, 30 * 60 * 1000]; // Millisekunder för varje nivå

// Hämta DOM-element
const classroomSelect = document.getElementById('classroomSelect');
const classSelect = document.getElementById('classSelect');
const drawButton = document.getElementById('drawButton');
const resetButton = document.getElementById('resetButton');
const classroomLayout = document.getElementById('classroom-layout');
const nameContainer = document.getElementById('name-container');
const sortSelect = document.getElementById('sortSelect');
const editStudentsButton = document.getElementById('editStudentsButton');
const editStudentsModal = document.getElementById('editStudentsModal');
const saveStudentsButton = document.getElementById('saveStudentsButton');
const closeEditButton = document.getElementById('closeEditButton');
const studentsList = document.getElementById('studentsList');
const toggleInfoButton = document.getElementById('toggleInfoButton');
const fullscreenButton = document.getElementById('fullscreenButton');
const exportButton = document.getElementById('exportButton');
const importButton = document.getElementById('importButton');
const importFileInput = document.getElementById('importFileInput');
const lockButton = document.getElementById('lockButton');
const lockModal = document.getElementById('lockModal');
const unlockModal = document.getElementById('unlockModal');
const lockCodeInput = document.getElementById('lockCodeInput');
const unlockCodeInput = document.getElementById('unlockCodeInput');
const lockConfirmButton = document.getElementById('lockConfirmButton');
const lockCancelButton = document.getElementById('lockCancelButton');
const unlockConfirmButton = document.getElementById('unlockConfirmButton');
const unlockCancelButton = document.getElementById('unlockCancelButton');

// --- DATAHANTERING ---
function getStorageKey() {
    return `${STORAGE_KEY_PREFIX}${currentClassroom.replace(/\s+/g, '_')}_${currentClass.replace(/\s+/g, '_')}`;
}

function saveData(data) {
    try {
        localStorage.setItem(getStorageKey(), JSON.stringify(data));
    } catch (e) {
        console.error("Kunde inte spara", e);
    }
}

function loadData() {
    try {
        const stored = localStorage.getItem(getStorageKey());
        return stored ? JSON.parse(stored) : { assignments: {}, studentAttributes: {} };
    } catch (e) {
        return { assignments: {}, studentAttributes: {} };
    }
}

function loadStudentAttributes() {
    try {
        const key = `studentAttributes_${currentClass.replace(/\s+/g, '_')}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        return {};
    }
}

function saveStudentAttributes() {
    try {
        const key = `studentAttributes_${currentClass.replace(/\s+/g, '_')}`;
        localStorage.setItem(key, JSON.stringify(studentAttributes));
    } catch (e) {
        console.error("Kunde inte spara elevattribut", e);
    }
}

// --- UI-FUNKTIONER ---
function populateClassroomSelect() {
    classroomSelect.innerHTML = '';
    for (const name in CLASSROOM_CONFIG) { const option = document.createElement('option'); option.value = name; option.textContent = name; classroomSelect.appendChild(option); }
}
function populateClassSelect() {
    classSelect.innerHTML = '';
    const config = CLASSROOM_CONFIG[currentClassroom];
    const maxSeats = config ? config.max_seats : 25; // Default fallback

    const sortedClassNames = Object.keys(CLASS_LISTS).sort();
    sortedClassNames.forEach(name => {
        const studentCount = CLASS_LISTS[name].length;
        if (studentCount <= maxSeats) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            classSelect.appendChild(option);
        }
    });

    // If current class is not available in the filtered list, select the first available
    const availableClasses = Array.from(classSelect.options).map(opt => opt.value);
    if (availableClasses.includes(currentClass)) {
        classSelect.value = currentClass;
    } else if (availableClasses.length > 0) {
        currentClass = availableClasses[0];
        classSelect.value = currentClass;
    } else {
        // No classes fit - this shouldn't happen but handle gracefully
        currentClass = '';
        classSelect.innerHTML = '<option value="">Inga klasser passar</option>';
    }
}

function renderDesks() {
    classroomLayout.innerHTML = '';
    const config = CLASSROOM_CONFIG[currentClassroom];

    // Använd dynamiskt antal platser för Sal 302
    let max = config.max_seats;
    if (config.dynamic_seats && currentClassroom === "Sal 302") {
        max = getSal302Seats();
    }

    // Tillåt fler platser om det behövs för att rymma alla elever
    const currentStudentList = CLASS_LISTS[currentClass] || [];
    max = Math.max(max, currentStudentList.length);

    // 1. Rita Whiteboard
    const whiteboard = document.createElement('div');
    whiteboard.id = 'whiteboard';
    whiteboard.textContent = 'WHITEBOARD';
    if (config.whiteboard_position) {
        const pos = config.whiteboard_position;
        whiteboard.style.gridRowStart = pos.row;
        whiteboard.style.gridColumnStart = pos.col_start;
        whiteboard.style.gridColumnEnd = 'span ' + pos.span;
    } else {
        whiteboard.style.gridRowStart = 1;
        whiteboard.style.gridColumnStart = 1;
        whiteboard.style.gridColumnEnd = 'span ' + ((config.columns_per_row || 4) / 2);
    }
    classroomLayout.appendChild(whiteboard);

    // 2. Rita Pelare
    if (config.pillar_position) {
        const pillar = document.createElement('div');
        pillar.className = 'pillar';
        pillar.textContent = 'PELARE';
        const pos = config.pillar_position;
        pillar.style.gridRowStart = pos.row;
        pillar.style.gridColumnStart = pos.col_start;
        pillar.style.gridColumnEnd = 'span ' + pos.span;
        classroomLayout.appendChild(pillar);
    }

    // 3. Rita Bänkar
    const renderDesk = (deskInfo) => {
        const desk = document.createElement('div');
        desk.className = 'desk';
        desk.id = `desk-${deskInfo.id}`;

        const assignment = assignments[deskInfo.id];
        if (typeof assignment === 'string') {
            const nameDiv = document.createElement('div');
            nameDiv.textContent = assignment;
            desk.appendChild(nameDiv);

            // Visa attribut
            const attrs = studentAttributes[assignment];
            if (attrs) {
                const attrDiv = document.createElement('div');
                attrDiv.className = 'desk-attributes';

                if (attrs.performance) {
                    const badge = document.createElement('span');
                    badge.className = `attribute-badge performance-${attrs.performance}`;
                    const perfText = attrs.performance === 'high' ? 'H' : attrs.performance === 'medium' ? 'M' : 'L';
                    badge.textContent = `📊${perfText}`;
                    badge.title = `Prestation: ${attrs.performance === 'high' ? 'Hög' : attrs.performance === 'medium' ? 'Medel' : 'Låg'}`;
                    attrDiv.appendChild(badge);
                }

                if (attrs.behavior) {
                    const badge = document.createElement('span');
                    badge.className = `attribute-badge behavior-${attrs.behavior}`;
                    const behaviorIcon = attrs.behavior === 'calm' ? '😌' : attrs.behavior === 'normal' ? '😐' : '😤';
                    badge.textContent = behaviorIcon;
                    badge.title = `Beteende: ${attrs.behavior === 'calm' ? 'Lugn' : attrs.behavior === 'normal' ? 'Normal' : 'Rastlös'}`;
                    attrDiv.appendChild(badge);
                }

                if (attrs.notes) {
                    const badge = document.createElement('span');
                    badge.className = 'attribute-badge';
                    badge.textContent = '📝';
                    badge.title = attrs.notes;
                    attrDiv.appendChild(badge);
                }

                desk.appendChild(attrDiv);
            }

            desk.classList.add('drawn');
        } else {
            desk.textContent = `Plats ${deskInfo.id}`;
        }

        if (deskInfo.row) desk.style.gridRow = deskInfo.row;
        if (deskInfo.col) desk.style.gridColumn = `${deskInfo.col} / span ${deskInfo.span || 1}`;
        if (deskInfo.gridColumnStart) desk.style.gridColumnStart = deskInfo.gridColumnStart;
        if (deskInfo.gridRowStart) desk.style.gridRowStart = deskInfo.gridRowStart;
        classroomLayout.appendChild(desk);
    };

    if (config.layout_map) { // För NO Salen, Sal 305 och Sal 315
        // Rita alla platser från layouten
        config.layout_map.forEach(renderDesk);
    } else { // För Sal 302
        let rowCounter = (config.whiteboard_position && config.whiteboard_position.row === 1) ? 2 : 1;
        let columnCounter = 1;
        for (let i = 0; i < max; i++) {
            let deskNumber = i + 1;
            const seats_per_side = config.columns_per_row / 2;
            let gridColumnStart = (columnCounter <= seats_per_side) ? columnCounter : columnCounter + 1;
            renderDesk({ id: deskNumber, gridRowStart: rowCounter, gridColumnStart: gridColumnStart });
            columnCounter++;
            if (columnCounter > config.columns_per_row) { columnCounter = 1; rowCounter++; }
        }
    }
}

function updateUI() {
    const config = CLASSROOM_CONFIG[currentClassroom];
    const assignedCount = Object.keys(assignments).length;
    const currentStudentList = CLASS_LISTS[currentClass] || [];

    // Använd dynamiskt antal platser för Sal 302
    let maxSeats = config.max_seats;
    if (config.dynamic_seats && currentClassroom === "Sal 302") {
        maxSeats = getSal302Seats();
    }

    drawButton.textContent = "Placera Alla Elever";
    drawButton.disabled = assignedCount >= currentStudentList.length || assignedCount >= maxSeats;

    if (drawButton.disabled) {
        drawButton.textContent = "Alla Placerade (Återställ)";
    }

    // Uppdatera låsknappen och känslig info
    if (isLocked) {
        lockButton.textContent = '🔓';
        lockButton.title = 'Lås upp placeringar';
        // Inaktivera alla andra knappar när låst
        drawButton.disabled = true;
        resetButton.disabled = true;
        editStudentsButton.disabled = true;
        classroomSelect.disabled = true;
        classSelect.disabled = true;
        sortSelect.disabled = true;
        exportButton.disabled = true;
        importButton.disabled = true;
        toggleInfoButton.disabled = true;
        // Automatiskt dölj känslig information när låst
        if (sensitiveInfoVisible) {
            toggleSensitiveInfo();
        }
    } else {
        lockButton.textContent = '🔒';
        lockButton.title = 'Lås placeringar';
        // Återaktivera knappar när upplåst
        drawButton.disabled = assignedCount >= currentStudentList.length || assignedCount >= maxSeats;
        resetButton.disabled = false;
        editStudentsButton.disabled = false;
        classroomSelect.disabled = false;
        classSelect.disabled = false;
        sortSelect.disabled = false;
        exportButton.disabled = false;
        importButton.disabled = false;
        toggleInfoButton.disabled = false;
    }
}

// --- HUVUDFUNKTIONER ---
function initializeSession() {
    const config = CLASSROOM_CONFIG[currentClassroom];
    const savedData = loadData();
    assignments = savedData.assignments || {};

    // Ladda elevattribut
    studentAttributes = loadStudentAttributes();

    if (config.allows_names) {
        populateClassSelect();
    }

    renderDesks();
    updateUI();
}

function handleClassroomChange() {
    const selectedSal = classroomSelect.value;
    const config = CLASSROOM_CONFIG[selectedSal];
    if (!config) return;
    currentClassroom = selectedSal;

    document.body.className = `sal-${selectedSal.replace(/\s+/g, '-')}`;
    nameContainer.style.display = config.allows_names ? 'block' : 'none';

    if (config.grid_template_columns) { classroomLayout.style.gridTemplateColumns = config.grid_template_columns; }
    else { const seats_per_side = config.columns_per_row / 2; classroomLayout.style.gridTemplateColumns = `repeat(${seats_per_side}, 1fr) ${config.gang_column_width} repeat(${seats_per_side}, 1fr)`; }
    if (config.grid_template_rows) { classroomLayout.style.gridTemplateRows = config.grid_template_rows; }
    else { classroomLayout.style.gridTemplateRows = ''; }

    loadLockStatus(); // Ladda låsstatus när sal ändras
    initializeSession();
}

function handleClassChange() {
    currentClass = classSelect.value;
    studentAttributes = loadStudentAttributes();
    initializeSession();
}

// Hjälpfunktion för att hitta grannar till en plats
function getNeighbors(seatId, config, maxSeats) {
    const neighbors = [];

    if (config.layout_map) {
        // För salar med layout_map (NO Salen, Sal 305)
        const seat = config.layout_map.find(s => s.id === seatId);
        if (!seat) return neighbors;

        config.layout_map.forEach(otherSeat => {
            if (otherSeat.id === seatId) return;

            // Kolla om de är grannar (samma rad eller intilliggande kolumner)
            const sameRow = otherSeat.row === seat.row;
            const adjacentCol = Math.abs(otherSeat.col - seat.col) === 1;
            const sameCol = otherSeat.col === seat.col;
            const adjacentRow = Math.abs(otherSeat.row - seat.row) === 1;

            if ((sameRow && adjacentCol) || (sameCol && adjacentRow)) {
                neighbors.push(otherSeat.id);
            }
        });
    } else {
        // För Sal 302 (grid-baserad)
        const cols = config.columns_per_row;
        const col = (seatId - 1) % cols;

        // Vänster granne
        if (col > 0 && col !== cols / 2) {
            neighbors.push(seatId - 1);
        }
        // Höger granne
        if (col < cols - 1 && col !== (cols / 2) - 1) {
            neighbors.push(seatId + 1);
        }
        // Granne framför
        if (seatId - cols > 0) {
            neighbors.push(seatId - cols);
        }
        // Granne bakom
        if (seatId + cols <= maxSeats) {
            neighbors.push(seatId + cols);
        }
    }

    return neighbors;
}

function sortStudents(students) {
    const sortMethod = sortSelect.value;

    switch(sortMethod) {
        case 'alphabetical':
            return [...students].sort((a, b) => a.localeCompare(b));

        case 'performance':
            return [...students].sort((a, b) => {
                const perfOrder = { 'high': 0, 'medium': 1, 'low': 2, '': 3 };
                const perfA = studentAttributes[a]?.performance || '';
                const perfB = studentAttributes[b]?.performance || '';
                return perfOrder[perfA] - perfOrder[perfB];
            });

        case 'behavior':
            return [...students].sort((a, b) => {
                const behaviorOrder = { 'calm': 0, 'normal': 1, 'disruptive': 2, '': 3 };
                const behaviorA = studentAttributes[a]?.behavior || '';
                const behaviorB = studentAttributes[b]?.behavior || '';
                return behaviorOrder[behaviorA] - behaviorOrder[behaviorB];
            });

        case 'attendance':
            return [...students].sort((a, b) => {
                const attendanceOrder = { 'high': 0, 'medium': 1, 'low': 2, '': 3 };
                const attendanceA = studentAttributes[a]?.attendance || '';
                const attendanceB = studentAttributes[b]?.attendance || '';
                return attendanceOrder[attendanceA] - attendanceOrder[attendanceB];
            });

        case 'random':
        default:
            return [...students].sort(() => 0.5 - Math.random());
    }
}

function smartPlacement(students, allSeats, config, maxSeats) {
    // Kategorisera elever
    const disruptive = students.filter(s => studentAttributes[s]?.behavior === 'disruptive');
    const calm = students.filter(s => studentAttributes[s]?.behavior === 'calm');
    const highPerformers = students.filter(s => studentAttributes[s]?.performance === 'high');

    // Blanda platserna
    const shuffledSeats = [...allSeats].sort(() => 0.5 - Math.random());
    const tempAssignments = {};
    const usedSeats = new Set();

    // Steg 1: Placera störiga elever först på platser där de kan omges av lugna
    disruptive.forEach(student => {
        let bestSeat = null;
        let bestScore = -1;

        for (const seat of shuffledSeats) {
            if (usedSeats.has(seat)) continue;

            const neighbors = getNeighbors(seat, config, maxSeats);
            let score = 0;
            let hasDisruptiveNeighbor = false;

            // Kolla om någon granne redan är störig
            neighbors.forEach(neighborSeat => {
                const neighborStudent = tempAssignments[neighborSeat];
                if (neighborStudent && studentAttributes[neighborStudent]?.behavior === 'disruptive') {
                    hasDisruptiveNeighbor = true;
                }
            });

            // Skippa platser där det redan finns en störig granne
            if (hasDisruptiveNeighbor) continue;

            // Ge poäng baserat på hur många lediga platser runt omkring (fler = bättre)
            score = neighbors.filter(n => !usedSeats.has(n)).length;

            if (score > bestScore) {
                bestScore = score;
                bestSeat = seat;
            }
        }

        if (bestSeat) {
            tempAssignments[bestSeat] = student;
            usedSeats.add(bestSeat);
        }
    });

    // Steg 2: Placera lugna och högpresterande elever bredvid störiga
    const calmAndHigh = [...new Set([...calm, ...highPerformers])];
    const remainingCalm = calmAndHigh.filter(s => !Object.values(tempAssignments).includes(s));

    remainingCalm.forEach(student => {
        let bestSeat = null;
        let bestScore = -1;

        for (const seat of shuffledSeats) {
            if (usedSeats.has(seat)) continue;

            const neighbors = getNeighbors(seat, config, maxSeats);
            let score = 0;

            // Ge högre poäng om platsen är bredvid en störig elev
            neighbors.forEach(neighborSeat => {
                const neighborStudent = tempAssignments[neighborSeat];
                if (neighborStudent && studentAttributes[neighborStudent]?.behavior === 'disruptive') {
                    score += 10;
                }
            });

            if (score > bestScore || (score === bestScore && Math.random() > 0.5)) {
                bestScore = score;
                bestSeat = seat;
            }
        }

        if (bestSeat) {
            tempAssignments[bestSeat] = student;
            usedSeats.add(bestSeat);
        }
    });

    // Steg 3: Placera resterande elever slumpmässigt
    const remaining = students.filter(s => !Object.values(tempAssignments).includes(s));
    const remainingSeats = shuffledSeats.filter(s => !usedSeats.has(s));

    remaining.forEach((student, index) => {
        if (remainingSeats[index]) {
            tempAssignments[remainingSeats[index]] = student;
        }
    });

    return tempAssignments;
}

function assignAllAtOnce() {
    const currentStudentList = CLASS_LISTS[currentClass] || [];
    if (currentStudentList.length === 0) {
        alert("Ingen klasslista hittades.");
        return;
    }

    const config = CLASSROOM_CONFIG[currentClassroom];

    // Använd dynamiskt antal platser för Sal 302
    let maxSeats = config.max_seats;
    if (config.dynamic_seats && currentClassroom === "Sal 302") {
        maxSeats = getSal302Seats();
    }

    // Tillåt fler platser om det behövs för att rymma alla elever
    maxSeats = Math.max(maxSeats, currentStudentList.length);

    if (Object.keys(assignments).length > 0 && !confirm('Skriva över befintlig placering?')) {
        return;
    }

    assignments = {};

    let allSeats;
    if (config.layout_map) {
        allSeats = config.layout_map.map(d => d.id);
        for (let i = 1; i <= maxSeats; i++) {
            if(!allSeats.includes(i)) allSeats.push(i);
        }
        allSeats.sort((a, b) => a - b);
        allSeats = allSeats.slice(0, maxSeats);
    } else {
        allSeats = Array.from({ length: maxSeats }, (_, i) => i + 1);
    }

    // Använd smart placering om valt, annars vanlig sortering
    if (sortSelect.value === 'smart') {
        assignments = smartPlacement(currentStudentList, allSeats, config, maxSeats);
    } else {
        // Sortera elever baserat på vald metod
        const sortedStudents = sortStudents(currentStudentList);
        const shuffledSeats = [...allSeats].sort(() => 0.5 - Math.random());

        sortedStudents.forEach((student, index) => {
            const seat = shuffledSeats[index];
            if (seat !== undefined) {
                assignments[seat] = student;
            }
        });
    }

    saveData({ assignments });
    renderDesks();
    updateUI();
}

function resetSession() {
    showConfirmModal('Är du säker? Alla placeringar för denna sal och klass raderas.', () => {
        localStorage.removeItem(getStorageKey());
        assignments = {};
        initializeSession();
    });
}

function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');

    confirmMessage.textContent = message;
    modal.classList.remove('hidden');

    const handleConfirm = () => {
        modal.classList.add('hidden');
        confirmYes.removeEventListener('click', handleConfirm);
        confirmNo.removeEventListener('click', handleCancel);
        onConfirm();
    };

    const handleCancel = () => {
        modal.classList.add('hidden');
        confirmYes.removeEventListener('click', handleConfirm);
        confirmNo.removeEventListener('click', handleCancel);
    };

    confirmYes.addEventListener('click', handleConfirm);
    confirmNo.addEventListener('click', handleCancel);
}

function openEditStudentsModal() {
    const currentStudentList = CLASS_LISTS[currentClass] || [];
    studentsList.innerHTML = '';

    currentStudentList.forEach(studentName => {
        const attrs = studentAttributes[studentName] || { performance: '', behavior: '', notes: '' };

        const row = document.createElement('div');
        row.className = 'student-row';

        row.innerHTML = `
            <div>
                <label>Namn</label>
                <div class="student-name">${studentName}</div>
            </div>
            <div>
                <label>Prestation</label>
                <select data-student="${studentName}" data-attr="performance">
                    <option value="">-</option>
                    <option value="high" ${attrs.performance === 'high' ? 'selected' : ''}>Hög</option>
                    <option value="medium" ${attrs.performance === 'medium' ? 'selected' : ''}>Medel</option>
                    <option value="low" ${attrs.performance === 'low' ? 'selected' : ''}>Låg</option>
                </select>
            </div>
            <div>
                <label>Beteende</label>
                <select data-student="${studentName}" data-attr="behavior">
                    <option value="">-</option>
                    <option value="calm" ${attrs.behavior === 'calm' ? 'selected' : ''}>Lugn</option>
                    <option value="normal" ${attrs.behavior === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="disruptive" ${attrs.behavior === 'disruptive' ? 'selected' : ''}>Rastlös</option>
                </select>
            </div>
            <div>
                <label>Närvaro</label>
                <select data-student="${studentName}" data-attr="attendance">
                    <option value="">-</option>
                    <option value="high" ${attrs.attendance === 'high' ? 'selected' : ''}>Hög</option>
                    <option value="medium" ${attrs.attendance === 'medium' ? 'selected' : ''}>Mellan</option>
                    <option value="low" ${attrs.attendance === 'low' ? 'selected' : ''}>Låg</option>
                </select>
            </div>
            <div>
                <label>Anteckningar</label>
                <input type="text" data-student="${studentName}" data-attr="notes"
                       value="${attrs.notes || ''}" placeholder="T.ex. glasögon">
            </div>
        `;

        studentsList.appendChild(row);
    });

    editStudentsModal.classList.remove('hidden');
}

function saveStudentAttributesFromModal() {
    const inputs = studentsList.querySelectorAll('select, input');

    inputs.forEach(input => {
        const studentName = input.dataset.student;
        const attr = input.dataset.attr;
        const value = input.value;

        if (!studentAttributes[studentName]) {
            studentAttributes[studentName] = { performance: '', behavior: '', attendance: '', notes: '' };
        }

        studentAttributes[studentName][attr] = value;
    });

    saveStudentAttributes();
    editStudentsModal.classList.add('hidden');
    renderDesks();
}

function closeEditStudentsModal() {
    editStudentsModal.classList.add('hidden');
}

function toggleSensitiveInfo() {
    sensitiveInfoVisible = !sensitiveInfoVisible;
    const container = document.querySelector('.container');

    if (sensitiveInfoVisible) {
        container.classList.remove('hide-sensitive-info');
        toggleInfoButton.textContent = '👁️';
        toggleInfoButton.title = 'Dölj känslig information';
    } else {
        container.classList.add('hide-sensitive-info');
        toggleInfoButton.textContent = '🙈';
        toggleInfoButton.title = 'Visa känslig information';
    }
}

function toggleFullscreen() {
    const container = document.querySelector('.container');

    if (!document.fullscreenElement) {
        container.requestFullscreen().then(() => {
            container.classList.add('fullscreen-mode');
            fullscreenButton.textContent = '⛶';
        }).catch(err => {
            console.error('Kunde inte aktivera fullscreen:', err);
        });
    } else {
        document.exitFullscreen().then(() => {
            container.classList.remove('fullscreen-mode');
            fullscreenButton.textContent = '⛶';
        });
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Shift + F för fullscreen
    if (e.shiftKey && e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// Lyssna på fullscreen-ändringar
document.addEventListener('fullscreenchange', () => {
    const container = document.querySelector('.container');
    if (!document.fullscreenElement) {
        container.classList.remove('fullscreen-mode');
    }
});

function exportStudentData() {
    // Samla all elevdata för den aktuella klassen
    const exportData = {
        className: currentClass,
        exportDate: new Date().toISOString(),
        students: studentAttributes,
        version: "1.0"
    };

    // Skapa en blob med JSON-data
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    // Skapa en nedladdningslänk
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `elevdata_${currentClass}_${new Date().toISOString().split('T')[0]}.json`;

    // Trigga nedladdning
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`Elevdata för ${currentClass} har exporterats!`);
}

function importStudentData() {
    importFileInput.click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importData = JSON.parse(e.target.result);

            // Validera data
            if (!importData.students || !importData.className) {
                alert('Ogiltig fil! Filen verkar inte innehålla korrekt elevdata.');
                return;
            }

            // Fråga om användaren vill skriva över befintlig data
            const confirmMsg = `Vill du importera elevdata för ${importData.className}?\n\nExporterad: ${new Date(importData.exportDate).toLocaleString('sv-SE')}\n\nDetta kommer att skriva över befintlig data för denna klass.`;

            if (confirm(confirmMsg)) {
                // Spara den importerade datan
                studentAttributes = importData.students;
                saveStudentAttributes();

                // Om den importerade klassen matchar nuvarande klass, uppdatera vyn
                if (importData.className === currentClass) {
                    renderDesks();
                }

                alert('Elevdata har importerats!');
            }
        } catch (error) {
            alert('Fel vid import: Kunde inte läsa filen. Kontrollera att det är en giltig JSON-fil.');
            console.error('Import error:', error);
        }
    };

    reader.readAsText(file);

    // Återställ input så samma fil kan väljas igen
    event.target.value = '';
}

// --- LÅSFUNKTIONER ---
function toggleLock() {
    if (isLocked) {
        unlockModal.classList.remove('hidden');
    } else {
        lockModal.classList.remove('hidden');
    }
}

function lockPlacements() {
    const code = lockCodeInput.value.trim();
    if (code.length !== 4 || !/^\d{4}$/.test(code)) {
        alert('Ange en giltig 4-siffrig kod!');
        return;
    }

    isLocked = true;
    lockCode = code;
    lockModal.classList.add('hidden');
    lockCodeInput.value = '';
    updateUI();

    // Spara låsstatus
    const lockData = { isLocked: true, lockCode: code, failedAttempts: 0 };
    localStorage.setItem(`lock_${getStorageKey()}`, JSON.stringify(lockData));

    alert('Placeringar låsta! Använd koden för att låsa upp.');
}

function unlockPlacements() {
    const code = unlockCodeInput.value.trim();

    // Kolla om bypass-kod används (case-sensitive)
    if (code === 'NooB') {
        // Bypass - stäng av låset helt
        isLocked = false;
        lockCode = null;
        failedUnlockAttempts = 0;
        lockoutUntil = null;
        lockoutLevel = 0;
        unlockModal.classList.add('hidden');
        unlockCodeInput.value = '';
        updateUI();

        // Ta bort låsstatus helt
        localStorage.removeItem(`lock_${getStorageKey()}`);

        alert('Bypass aktiverad! Låset är nu avstängt.');
        return;
    }

    // Kolla om användaren är utlåst
    if (lockoutUntil && Date.now() < lockoutUntil) {
        const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 1000 / 60);
        alert(`Du är utlåst! Försök igen om ${remainingTime} minuter.`);
        unlockCodeInput.value = '';
        return;
    }

    // Admin-kod tas bort - bypass-koden "NooB" fungerar som admin-kod

    // Normal upplåsning
    if (code !== lockCode) {
        failedUnlockAttempts++;

        if (failedUnlockAttempts >= MAX_UNLOCK_ATTEMPTS) {
            // Öka utlåsningsnivå
            lockoutLevel = Math.min(lockoutLevel + 1, LOCKOUT_DURATIONS.length - 1);
            lockoutUntil = Date.now() + LOCKOUT_DURATIONS[lockoutLevel];
            failedUnlockAttempts = 0; // Återställ försök efter utlåsning

            // Spara utlåsningsstatus
            const lockData = {
                isLocked: true,
                lockCode: lockCode,
                failedAttempts: failedUnlockAttempts,
                lockoutUntil: lockoutUntil,
                lockoutLevel: lockoutLevel
            };
            localStorage.setItem(`lock_${getStorageKey()}`, JSON.stringify(lockData));

            const durationMinutes = LOCKOUT_DURATIONS[lockoutLevel] / 1000 / 60;
            alert(`För många fel försök! Du är utlåst i ${durationMinutes} minuter.`);
            unlockModal.classList.add('hidden');
            unlockCodeInput.value = '';
            return;
        }

        alert(`Fel kod! ${MAX_UNLOCK_ATTEMPTS - failedUnlockAttempts} försök kvar.`);
        unlockCodeInput.value = '';
        return;
    }

    // Lyckad upplåsning
    isLocked = false;
    lockCode = null;
    failedUnlockAttempts = 0; // Återställ räknaren
    lockoutUntil = null;
    lockoutLevel = 0;
    unlockModal.classList.add('hidden');
    unlockCodeInput.value = '';
    updateUI();

    // Ta bort låsstatus
    localStorage.removeItem(`lock_${getStorageKey()}`);

    alert('Placeringar upplåsta!');
}

function loadLockStatus() {
    try {
        const lockData = localStorage.getItem(`lock_${getStorageKey()}`);
        if (lockData) {
            const parsed = JSON.parse(lockData);
            isLocked = parsed.isLocked || false;
            lockCode = parsed.lockCode || null;
            failedUnlockAttempts = parsed.failedAttempts || 0; // Ladda tidigare försök
            lockoutUntil = parsed.lockoutUntil || null; // Ladda utlåsningsstatus
            lockoutLevel = parsed.lockoutLevel || 0; // Ladda utlåsningsnivå

            // Kolla om utlåsning har gått ut
            if (lockoutUntil && Date.now() > lockoutUntil) {
                lockoutUntil = null;
                lockoutLevel = 0;
                failedUnlockAttempts = 0;
                // Uppdatera sparad data
                const updatedLockData = {
                    isLocked: isLocked,
                    lockCode: lockCode,
                    failedAttempts: failedUnlockAttempts,
                    lockoutUntil: lockoutUntil,
                    lockoutLevel: lockoutLevel
                };
                localStorage.setItem(`lock_${getStorageKey()}`, JSON.stringify(updatedLockData));
            }
        } else {
            isLocked = false;
            lockCode = null;
            failedUnlockAttempts = 0;
            lockoutUntil = null;
            lockoutLevel = 0;
        }
    } catch (e) {
        isLocked = false;
        lockCode = null;
        failedUnlockAttempts = 0;
        lockoutUntil = null;
        lockoutLevel = 0;
    }
}

// --- BFCACHE (Back/Forward Cache) SUPPORT ---
// Hantera bfcache restoration för bättre prestanda
window.addEventListener('pageshow', (event) => {
    // Om sidan kommer från bfcache (persisted = true)
    if (event.persisted) {
        console.log('Sidan återställd från bfcache');

        // Återinitiera nödvändiga komponenter som kan ha gått förlorade
        loadLockStatus();
        updateUI();

        // Återaktivera service worker om den har gått offline
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                if (registrations.length === 0) {
                    // Registrera service worker igen om den saknas
                    import('./sw-register.js');
                }
            });
        }

        // Återställ eventuella modaler som kan ha lämnats öppna
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.classList.add('hidden'));
    }
});

// Förbered för bfcache genom att rensa upp innan sidan cachas
window.addEventListener('pagehide', (event) => {
    // Om sidan kommer att cachas (persisted = true)
    if (event.persisted) {
        console.log('Sidan förbereds för bfcache');

        // Stäng eventuella öppna modaler för att undvika problem vid återställning
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.classList.add('hidden'));
    }
});

// --- EVENTLYSSNARE OCH START ---
drawButton.addEventListener('click', assignAllAtOnce);
resetButton.addEventListener('click', resetSession);
classroomSelect.addEventListener('change', handleClassroomChange);
classSelect.addEventListener('change', handleClassChange);
editStudentsButton.addEventListener('click', openEditStudentsModal);
saveStudentsButton.addEventListener('click', saveStudentAttributesFromModal);
closeEditButton.addEventListener('click', closeEditStudentsModal);
toggleInfoButton.addEventListener('click', toggleSensitiveInfo);
fullscreenButton.addEventListener('click', toggleFullscreen);
exportButton.addEventListener('click', exportStudentData);
importButton.addEventListener('click', importStudentData);
importFileInput.addEventListener('change', handleFileImport);

// Låsrelaterade eventlyssnare
lockButton.addEventListener('click', toggleLock);
lockConfirmButton.addEventListener('click', lockPlacements);
lockCancelButton.addEventListener('click', () => lockModal.classList.add('hidden'));
unlockConfirmButton.addEventListener('click', unlockPlacements);
unlockCancelButton.addEventListener('click', () => unlockModal.classList.add('hidden'));

document.addEventListener('DOMContentLoaded', () => {
    populateClassroomSelect();
    populateClassSelect();
    loadLockStatus(); // Ladda låsstatus först
    handleClassroomChange();

    // Lägg till Enter-tangent stöd för låskoder
    lockCodeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            lockConfirmButton.click();
        } else if (e.key === 'Escape') {
            lockModal.classList.add('hidden');
        }
    });

    unlockCodeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            unlockConfirmButton.click();
        } else if (e.key === 'Escape') {
            unlockModal.classList.add('hidden');
        }
    });

    // Global Escape-tangent stöd för lås-modaler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!lockModal.classList.contains('hidden')) {
                lockModal.classList.add('hidden');
            } else if (!unlockModal.classList.contains('hidden')) {
                unlockModal.classList.add('hidden');
            }
        }
    });
});

