import {
    assignments, studentAttributes, isLocked, lockCode, failedUnlockAttempts,
    lockoutUntil, lockoutLevel, MAX_UNLOCK_ATTEMPTS, LOCKOUT_DURATIONS,
    setAssignments, setIsLocked, setLockCode, setFailedUnlockAttempts,
    setLockoutUntil, setLockoutLevel, setCurrentClassroom, setCurrentClass, 
    setStudentAttributes, currentClassroom, currentClass
} from './state.js';
import { saveData, loadData, loadStudentAttributes, loadLockStatus, getStorageKey } from './data.js';
import { renderDesks, updateUI, showConfirmModal, lockModal, unlockModal, lockCodeInput, unlockCodeInput, populateClassSelect, classroomSelect, classSelect, nameContainer, classroomLayout, loadTheme, sortSelect } from './ui.js';
import { CLASS_LISTS } from './students.js';
import { CLASSROOM_CONFIG, getSal302Seats } from './classroom.js';
import { sortStudents, smartPlacement } from './placement.js';
import { savePlacementHistory } from './statistics.js';

export function assignAllAtOnce() {
    const currentStudentList = CLASS_LISTS[currentClass] || [];
    if (currentStudentList.length === 0) {
        alert("Ingen klasslista hittades.");
        return;
    }

    const config = CLASSROOM_CONFIG[currentClassroom];

    // Använd dynamiskt antal platser för Sal 302
    let maxSeats = config.max_seats;
    if (config.dynamic_seats && currentClassroom === "Sal 302") {
        maxSeats = getSal302Seats(currentClass);
    }

    // Tillåt fler platser om det behövs för att rymma alla elever
    maxSeats = Math.max(maxSeats, currentStudentList.length);

    if (Object.keys(assignments).length > 0 && !confirm('Skriva över befintlig placering?')) {
        return;
    }

    let newAssignments = {};

    let allSeats;
    if (config.layout_map) {
        allSeats = config.layout_map.map(d => d.id);
        for (let i = 1; i <= maxSeats; i++) {
            if (!allSeats.includes(i)) allSeats.push(i);
        }
        allSeats.sort((a, b) => a - b);
        allSeats = allSeats.slice(0, maxSeats);
    } else {
        allSeats = Array.from({ length: maxSeats }, (_, i) => i + 1);
    }

    // Använd smart placering om valt, annars vanlig sortering
    if (sortSelect.value === 'smart') {
        newAssignments = smartPlacement(currentStudentList, allSeats, config, maxSeats);
    } else {
        // Sortera elever baserat på vald metod
        const sortedStudents = sortStudents(currentStudentList, sortSelect.value);
        const shuffledSeats = [...allSeats].sort(() => 0.5 - Math.random());

        sortedStudents.forEach((student, index) => {
            const seat = shuffledSeats[index];
            if (seat !== undefined) {
                newAssignments[seat] = student;
            }
        });
    }
    setAssignments(newAssignments);

    saveData(currentClassroom, currentClass, { assignments: newAssignments });
    
    // Spara i placeringshistorik för statistik
    savePlacementHistory(currentClassroom, currentClass, newAssignments);
    
    renderDesks();
    updateUI();
}

export function resetSession() {
    showConfirmModal('Är du säker? Alla placeringar för denna sal och klass raderas.', () => {
        localStorage.removeItem(getStorageKey(currentClassroom, currentClass));
        setAssignments({});
        initializeSession();
    });
}

export function initializeSession() {
    const config = CLASSROOM_CONFIG[currentClassroom];
    const savedData = loadData(currentClassroom, currentClass);
    setAssignments(savedData.assignments || {});

    // Ladda elevattribut
    setStudentAttributes(loadStudentAttributes(currentClass));

    if (config.allows_names) {
        populateClassSelect();
    }

    renderDesks();
    updateUI();
}

export function toggleLock() {
    if (isLocked) {
        unlockModal.classList.remove('hidden');
    } else {
        lockModal.classList.remove('hidden');
    }
}

export function lockPlacements() {
    const code = lockCodeInput.value.trim();
    if (code.length !== 4 || !/^\d{4}$/.test(code)) {
        alert('Ange en giltig 4-siffrig kod!');
        return;
    }

    setIsLocked(true);
    setLockCode(code);
    lockModal.classList.add('hidden');
    lockCodeInput.value = '';
    updateUI();

    // Spara låsstatus
    const lockData = { isLocked: true, lockCode: code, failedAttempts: 0 };
    localStorage.setItem(`lock_${getStorageKey(currentClassroom, currentClass)}`, JSON.stringify(lockData));

    alert('Placeringar låsta! Använd koden för att låsa upp.');
}

export function unlockPlacements() {
    const code = unlockCodeInput.value.trim();

    // Kolla om bypass-kod används (case-sensitive)
    if (code === 'NooB') {
        // Bypass - stäng av låset helt
        setIsLocked(false);
        setLockCode(null);
        setFailedUnlockAttempts(0);
        setLockoutUntil(null);
        setLockoutLevel(0);
        unlockModal.classList.add('hidden');
        unlockCodeInput.value = '';
        updateUI();

        // Ta bort låsstatus helt
        localStorage.removeItem(`lock_${getStorageKey(currentClassroom, currentClass)}`);

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
        setFailedUnlockAttempts(failedUnlockAttempts + 1);

        if (failedUnlockAttempts >= MAX_UNLOCK_ATTEMPTS) {
            // Öka utlåsningsnivå
            const newLockoutLevel = Math.min(lockoutLevel + 1, LOCKOUT_DURATIONS.length - 1);
            setLockoutLevel(newLockoutLevel);
            setLockoutUntil(Date.now() + LOCKOUT_DURATIONS[newLockoutLevel]);
            setFailedUnlockAttempts(0); // Återställ försök efter utlåsning

            // Spara utlåsningsstatus
            const lockData = {
                isLocked: true,
                lockCode: lockCode,
                failedAttempts: 0,
                lockoutUntil: lockoutUntil,
                lockoutLevel: newLockoutLevel
            };
            localStorage.setItem(`lock_${getStorageKey(currentClassroom, currentClass)}`, JSON.stringify(lockData));

            const durationMinutes = LOCKOUT_DURATIONS[newLockoutLevel] / 1000 / 60;
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
    setIsLocked(false);
    setLockCode(null);
    setFailedUnlockAttempts(0); // Återställ räknaren
    setLockoutUntil(null);
    setLockoutLevel(0);
    unlockModal.classList.add('hidden');
    unlockCodeInput.value = '';
    updateUI();

    // Ta bort låsstatus
    localStorage.removeItem(`lock_${getStorageKey(currentClassroom, currentClass)}`);

    alert('Placeringar upplåsta!');
}

export function handleClassroomChange() {
    const selectedSal = classroomSelect.value;
    const config = CLASSROOM_CONFIG[selectedSal];
    if (!config) return;
    setCurrentClassroom(selectedSal);

    document.body.className = `sal-${selectedSal.replace(/\s+/g, '-')}`;
    nameContainer.style.display = config.allows_names ? 'block' : 'none';

    if (config.grid_template_columns) {
        classroomLayout.style.gridTemplateColumns = config.grid_template_columns;
    } else {
        const seats_per_side = config.columns_per_row / 2;
        classroomLayout.style.gridTemplateColumns = `repeat(${seats_per_side}, 1fr) ${config.gang_column_width} repeat(${seats_per_side}, 1fr)`;
    }
    if (config.grid_template_rows) {
        classroomLayout.style.gridTemplateRows = config.grid_template_rows;
    } else {
        classroomLayout.style.gridTemplateRows = '';
    }

    // Återställ till ljust tema när sal ändras (men behåll mörkt tema om användaren har valt det)
    loadTheme(); // Detta kommer att ladda det sparade temat istället för att återställa till ljust

    loadLockStatus(); // Ladda låsstatus när sal ändras
    initializeSession();
}

export function handleClassChange() {
    setCurrentClass(classSelect.value);
    setStudentAttributes(loadStudentAttributes(currentClass));
    initializeSession();
}
