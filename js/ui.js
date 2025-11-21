import {
    CLASSROOM_CONFIG,
    getSal302Seats
} from './classroom.js';
import {
    CLASS_LISTS
} from './students.js';
import {
    assignments,
    blockedSeats,
    toggleBlockedSeat,
    studentAttributes,
    sensitiveInfoVisible,
    isLocked,
    currentClassroom,
    currentClass,
    setStudentAttributes,
    setCurrentClassroom,
    setCurrentClass,
    setSensitiveInfoVisible
} from './state.js';
import {
    loadData,
    loadStudentAttributes,
    saveStudentAttributes,
    saveData
} from './data.js';
import {
    initializeSession
} from './app.js';

export const classroomSelect = document.getElementById('classroomSelect');
export const classSelect = document.getElementById('classSelect');
export const drawButton = document.getElementById('drawButton');
export const resetButton = document.getElementById('resetButton');
export const classroomLayout = document.getElementById('classroom-layout');
export const nameContainer = document.getElementById('name-container');
export const sortSelect = document.getElementById('sortSelect');
export const editStudentsButton = document.getElementById('editStudentsButton');
export const editStudentsModal = document.getElementById('editStudentsModal');
export const saveStudentsButton = document.getElementById('saveStudentsButton');
export const closeEditButton = document.getElementById('closeEditButton');
export const studentsList = document.getElementById('studentsList');
export const toggleInfoButton = document.getElementById('toggleInfoButton');
export const fullscreenButton = document.getElementById('fullscreenButton');
export const exportButton = document.getElementById('exportButton');
export const importButton = document.getElementById('importButton');
export const importFileInput = document.getElementById('importFileInput');
export const lockButton = document.getElementById('lockButton');
export const lockModal = document.getElementById('lockModal');
export const unlockModal = document.getElementById('unlockModal');
export const lockCodeInput = document.getElementById('lockCodeInput');
export const unlockCodeInput = document.getElementById('unlockCodeInput');
export const lockConfirmButton = document.getElementById('lockConfirmButton');
export const lockCancelButton = document.getElementById('lockCancelButton');
export const unlockConfirmButton = document.getElementById('unlockConfirmButton');
export const unlockCancelButton = document.getElementById('unlockCancelButton');
export const saveLayoutButton = document.getElementById('saveLayoutButton');
export const loadLayoutButton = document.getElementById('loadLayoutButton');
export const themeButton = document.getElementById('themeButton');

export function loadTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

export function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

export function populateClassroomSelect() {
    classroomSelect.innerHTML = '';
    for (const name in CLASSROOM_CONFIG) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        classroomSelect.appendChild(option);
    }
}
export function populateClassSelect() {
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
        setCurrentClass(availableClasses[0]);
        classSelect.value = currentClass;
    } else {
        // No classes fit - this shouldn't happen but handle gracefully
        setCurrentClass('');
        classSelect.innerHTML = '<option value="">Inga klasser passar</option>';
    }
}

export function renderDesks() {
    classroomLayout.innerHTML = '';
    const config = CLASSROOM_CONFIG[currentClassroom];

    // Använd dynamiskt antal platser för Sal 302
    let max = config.max_seats;
    if (config.dynamic_seats && currentClassroom === "Sal 302") {
        max = getSal302Seats(currentClass);
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

        // Hantera blockerade platser
        const isBlocked = blockedSeats.has(deskInfo.id);
        if (isBlocked) {
            desk.classList.add('blocked-seat');
        }

        // Lägg till klickhanterare för att toggla blockering
        desk.addEventListener('click', () => {
            if (!isLocked) { // Tillåt bara ändringar om inte låst
                toggleBlockedSeat(deskInfo.id);

                // Spara ändringar direkt så att blockeringar minns vid omladdning
                saveData(currentClassroom, currentClass, {
                    assignments: assignments,
                    blockedSeats: Array.from(blockedSeats)
                });

                // Vi renderar om för att visa ändringen
                renderDesks();
            }
        });

        const assignment = assignments[deskInfo.id];
        // Visa eleven endast om platsen inte är blockerad ELLER om vi vill visa att eleven sitter på en nu blockerad plats
        // För tydlighetens skull: Om blockerad, visa "Blockerad" text eller liknande, men CSS fixar färgen.
        // Om det finns en assignment men platsen är blockerad, visar vi assignment ändå?
        // Användarens önskemål: "bänken ... blir då röda istället".
        // Om vi visar assignment på röd bakgrund ser det ut som en felaktig placering.

        if (typeof assignment === 'string' && !isBlocked) {
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

            // Lägg till en visuell indikation om den är blockerad
            if (isBlocked) {
                desk.innerHTML = `🚫<br><span style="font-size: 0.8em">Blockerad</span>`;
                desk.style.cursor = 'pointer';
                desk.title = "Klicka för att avblockera";
            } else {
                desk.style.cursor = 'pointer';
                desk.title = "Klicka för att blockera denna plats";
            }
        }

        if (deskInfo.row) desk.style.gridRow = deskInfo.row;
        if (deskInfo.col) desk.style.gridColumn = `${deskInfo.col} / span ${deskInfo.span || 1}`;
        if (deskInfo.gridColumnStart) desk.style.gridColumnStart = deskInfo.gridColumnStart;
        if (deskInfo.gridRowStart) desk.style.gridRowStart = deskInfo.gridRowStart;
        classroomLayout.appendChild(desk);
    };

    if (config.layout_map) { // För salar med layout_map (NO Salen, Sal 305)
        // Rita alla platser från layouten
        config.layout_map.forEach(renderDesk);
    } else { // För Sal 302
        let rowCounter = (config.whiteboard_position && config.whiteboard_position.row === 1) ? 2 : 1;
        let columnCounter = 1;
        for (let i = 0; i < max; i++) {
            let deskNumber = i + 1;
            const seats_per_side = config.columns_per_row / 2;
            let gridColumnStart = (columnCounter <= seats_per_side) ? columnCounter : columnCounter + 1;
            renderDesk({
                id: deskNumber,
                gridRowStart: rowCounter,
                gridColumnStart: gridColumnStart
            });
            columnCounter++;
            if (columnCounter > config.columns_per_row) {
                columnCounter = 1;
                rowCounter++;
            }
        }
    }
}

export function updateUI() {
    const config = CLASSROOM_CONFIG[currentClassroom];
    const assignedCount = Object.keys(assignments).length;
    const currentStudentList = CLASS_LISTS[currentClass] || [];

    // Använd dynamiskt antal platser för Sal 302
    let maxSeats = config.max_seats;
    if (config.dynamic_seats && currentClassroom === "Sal 302") {
        maxSeats = getSal302Seats(currentClass);
    }

    drawButton.textContent = "Placera Alla Elever";
    drawButton.disabled = assignedCount >= currentStudentList.length || assignedCount >= maxSeats;

    if (drawButton.disabled) {
        drawButton.textContent = "Alla Placerade (Återställ)";
    }

    // Uppdatera låsknappen och känslig info
    if (isLocked) {
        lockButton.innerHTML = '<span aria-hidden="true">🔓</span>';
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
        lockButton.innerHTML = '<span aria-hidden="true">🔒</span>';
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

export function showConfirmModal(message, onConfirm) {
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

export function openEditStudentsModal() {
    const currentStudentList = CLASS_LISTS[currentClass] || [];
    studentsList.innerHTML = '';

    currentStudentList.forEach(studentName => {
        const attrs = studentAttributes[studentName] || {
            performance: '',
            behavior: '',
            notes: ''
        };

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

export function saveStudentAttributesFromModal() {
    const inputs = studentsList.querySelectorAll('select, input');

    inputs.forEach(input => {
        const studentName = input.dataset.student;
        const attr = input.dataset.attr;
        const value = input.value;

        if (!studentAttributes[studentName]) {
            studentAttributes[studentName] = {
                performance: '',
                behavior: '',
                attendance: '',
                notes: ''
            };
        }

        studentAttributes[studentName][attr] = value;
    });

    saveStudentAttributes(currentClass, studentAttributes);
    editStudentsModal.classList.add('hidden');
    renderDesks();
}

export function closeEditStudentsModal() {
    editStudentsModal.classList.add('hidden');
}

export function toggleSensitiveInfo() {
    setSensitiveInfoVisible(!sensitiveInfoVisible);
    const container = document.querySelector('.container');

    if (sensitiveInfoVisible) {
        container.classList.remove('hide-sensitive-info');
        toggleInfoButton.innerHTML = '<span aria-hidden="true">👁️</span>';
        toggleInfoButton.title = 'Dölj känslig information';
    } else {
        container.classList.add('hide-sensitive-info');
        toggleInfoButton.innerHTML = '<span aria-hidden="true">🙈</span>';
        toggleInfoButton.title = 'Visa känslig information';
    }
}

export function toggleFullscreen() {
    const container = document.querySelector('.container');
    const body = document.body;
    const classroomLayout = document.getElementById('classroom-layout');

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            container.classList.add('fullscreen-mode');
            body.classList.add('fullscreen-active');
            fullscreenButton.innerHTML = '<span aria-hidden="true">⛶</span>';

            // Move timer to classroom layout for proper positioning
            const timerDisplay = document.getElementById('timerDisplay');
            if (timerDisplay && !timerDisplay.classList.contains('hidden')) {
                classroomLayout.appendChild(timerDisplay);
            }
        }).catch(err => {
            console.error('Kunde inte aktivera fullscreen:', err);
        });
    } else {
        document.exitFullscreen().then(() => {
            container.classList.remove('fullscreen-mode');
            body.classList.remove('fullscreen-active');
            fullscreenButton.innerHTML = '<span aria-hidden="true">⛶</span>';

            // Move timer back to body
            const timerDisplay = document.getElementById('timerDisplay');
            if (timerDisplay && timerDisplay.parentElement === classroomLayout) {
                document.body.appendChild(timerDisplay);
            }
        });
    }
}

export function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

export function setupKeyboardNavigation() {
    // Tab order management - ensure logical tab order
    const focusableElements = [
        '#classroomSelect',
        '#classSelect',
        '#sortSelect',
        '#editStudentsButton',
        '#drawButton',
        '#resetButton',
        '#lockButton',
        '#exportButton',
        '#importButton',
        '#toggleInfoButton',
        '#fullscreenButton'
    ];
}
