import {
    currentClass,
    studentAttributes,
    assignments,
    savedLayouts,
    isLocked,
    lockCode,
    failedUnlockAttempts,
    lockoutUntil,
    lockoutLevel,
    setAssignments,
    setCurrentLayoutName,
    setSavedLayouts,
    setStudentAttributes,
    setIsLocked,
    setLockCode,
    setFailedUnlockAttempts,
    setLockoutUntil,
    setLockoutLevel,
    currentClassroom
} from './state.js';
import { renderDesks, updateUI, sortSelect, importFileInput } from './ui.js';

const STORAGE_KEY_PREFIX = 'elevPlatser_';

export function getStorageKey(currentClassroom, currentClass) {
    return `${STORAGE_KEY_PREFIX}${currentClassroom.replace(/\s+/g, '_')}_${currentClass.replace(/\s+/g, '_')}`;
}

export function saveData(currentClassroom, currentClass, data) {
    try {
        localStorage.setItem(getStorageKey(currentClassroom, currentClass), JSON.stringify(data));
    } catch (e) {
        console.error("Kunde inte spara", e);
    }
}

export function loadData(currentClassroom, currentClass) {
    try {
        const stored = localStorage.getItem(getStorageKey(currentClassroom, currentClass));
        return stored ? JSON.parse(stored) : {
            assignments: {},
            studentAttributes: {}
        };
    } catch (e) {
        return {
            assignments: {},
            studentAttributes: {}
        };
    }
}

export function loadStudentAttributes(currentClass) {
    try {
        const key = `studentAttributes_${currentClass.replace(/\s+/g, '_')}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        return {};
    }
}

export function saveStudentAttributes(currentClass, studentAttributes) {
    try {
        const key = `studentAttributes_${currentClass.replace(/\s+/g, '_')}`;
        localStorage.setItem(key, JSON.stringify(studentAttributes));
    } catch (e) {
        console.error("Kunde inte spara elevattribut", e);
    }
}

export function exportStudentData() {
    // Samla all elevdata för den aktuella klassen
    const exportData = {
        className: currentClass,
        exportDate: new Date().toISOString(),
        students: studentAttributes,
        version: "1.0"
    };

    // Skapa en blob med JSON-data
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {
        type: 'application/json'
    });

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

export function importStudentData() {
    importFileInput.click();
}

export function handleFileImport(event) {
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
                setStudentAttributes(importData.students);
                saveStudentAttributes(currentClass, studentAttributes);

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

export function saveCurrentLayout() {
    const layoutName = prompt('Ange ett namn för denna placering:');
    if (!layoutName || layoutName.trim() === '') return;

    const layoutKey = `${currentClassroom}_${currentClass}`;
    if (!savedLayouts[layoutKey]) {
        savedLayouts[layoutKey] = {};
    }

    savedLayouts[layoutKey][layoutName.trim()] = {
        assignments: { ...assignments
        },
        timestamp: new Date().toISOString(),
        sortMethod: sortSelect.value
    };

    // Spara till localStorage
    try {
        localStorage.setItem('savedLayouts', JSON.stringify(savedLayouts));
        alert(`Placering "${layoutName.trim()}" har sparats!`);
    } catch (e) {
        alert('Kunde inte spara placeringen. Försök igen.');
    }
}

export function loadSavedLayout() {
    const layoutKey = `${currentClassroom}_${currentClass}`;
    const availableLayouts = savedLayouts[layoutKey];

    if (!availableLayouts || Object.keys(availableLayouts).length === 0) {
        alert('Inga sparade placeringar finns för denna sal och klass.');
        return;
    }

    const layoutNames = Object.keys(availableLayouts);
    const selectedLayout = prompt(`Välj en placering att ladda:\n\n${layoutNames.join('\n')}`);

    if (!selectedLayout || !availableLayouts[selectedLayout]) return;

    const layoutData = availableLayouts[selectedLayout];

    // Bekräfta överskrivning
    if (Object.keys(assignments).length > 0 && !confirm('Detta kommer att skriva över nuvarande placering. Fortsätta?')) {
        return;
    }

    // Ladda placeringen
    setAssignments({ ...layoutData.assignments
    });
    setCurrentLayoutName(selectedLayout);

    // Uppdatera sorteringsmetod om den finns sparad
    if (layoutData.sortMethod) {
        sortSelect.value = layoutData.sortMethod;
    }

    saveData({
        assignments
    });
    renderDesks();
    updateUI();

    alert(`Placering "${selectedLayout}" har laddats!`);
}

export function loadSavedLayouts() {
    try {
        const stored = localStorage.getItem('savedLayouts');
        if (stored) {
            setSavedLayouts(JSON.parse(stored));
        }
    } catch (e) {
        setSavedLayouts({});
    }
}

export function loadLockStatus() {
    try {
        const lockData = localStorage.getItem(`lock_${getStorageKey(currentClassroom, currentClass)}`);
        if (lockData) {
            const parsed = JSON.parse(lockData);
            setIsLocked(parsed.isLocked || false);
            setLockCode(parsed.lockCode || null);
            setFailedUnlockAttempts(parsed.failedAttempts || 0); // Ladda tidigare försök
            setLockoutUntil(parsed.lockoutUntil || null); // Ladda utlåsningsstatus
            setLockoutLevel(parsed.lockoutLevel || 0); // Ladda utlåsningsnivå

            // Kolla om utlåsning har gått ut
            if (lockoutUntil && Date.now() > lockoutUntil) {
                setLockoutUntil(null);
                setLockoutLevel(0);
                setFailedUnlockAttempts(0);
                // Uppdatera sparad data
                const updatedLockData = {
                    isLocked: isLocked,
                    lockCode: lockCode,
                    failedAttempts: failedUnlockAttempts,
                    lockoutUntil: lockoutUntil,
                    lockoutLevel: lockoutLevel
                };
                localStorage.setItem(`lock_${getStorageKey(currentClassroom, currentClass)}`, JSON.stringify(updatedLockData));
            }
        } else {
            setIsLocked(false);
            setLockCode(null);
            setFailedUnlockAttempts(0);
            setLockoutUntil(null);
            setLockoutLevel(0);
        }
    } catch (e) {
        setIsLocked(false);
        setLockCode(null);
        setFailedUnlockAttempts(0);
        setLockoutUntil(null);
        setLockoutLevel(0);
    }
}