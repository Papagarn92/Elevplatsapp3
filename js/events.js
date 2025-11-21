import {
    classroomSelect, classSelect, drawButton, resetButton, editStudentsButton,
    saveStudentsButton, closeEditButton, toggleInfoButton, fullscreenButton,
    exportButton, importButton, importFileInput, lockButton, lockConfirmButton,
    lockCancelButton, unlockConfirmButton, unlockCancelButton,
    saveLayoutButton, loadLayoutButton, lockCodeInput, unlockCodeInput, openEditStudentsModal,
    saveStudentAttributesFromModal, closeEditStudentsModal, toggleSensitiveInfo,
    toggleFullscreen, announceToScreenReader, lockModal, unlockModal,
    renderDesks, updateUI, themeButton, toggleTheme
} from './ui.js';
import {
    assignAllAtOnce, resetSession, toggleLock, lockPlacements, unlockPlacements, handleClassroomChange, handleClassChange
} from './app.js';
import {
    exportStudentData, importStudentData, handleFileImport, saveCurrentLayout, loadSavedLayout, loadLockStatus
} from './data.js';
import { assignments, currentClassroom, currentClass } from './state.js';
import { CLASSROOM_CONFIG } from './classroom.js';

export function setupEventListeners() {
    // --- Event Listeners with Accessibility Announcements ---

    const handleDrawWithAnnouncement = () => {
        assignAllAtOnce();
        // Use a short timeout to allow the state to update before announcing
        setTimeout(() => {
            const assignedCount = Object.keys(assignments).length;
            announceToScreenReader(`${assignedCount} elever har placerats.`);
        }, 100);
    };

    const handleClassroomChangeWithAnnouncement = () => {
        handleClassroomChange();
        setTimeout(() => {
            announceToScreenReader(`Klassrum ändrat till ${currentClassroom}.`);
        }, 100);
    };

    const handleClassChangeWithAnnouncement = () => {
        handleClassChange();
        setTimeout(() => {
            announceToScreenReader(`Klass ändrad till ${currentClass}.`);
        }, 100);
    };

    classroomSelect.addEventListener('change', handleClassroomChangeWithAnnouncement);
    classSelect.addEventListener('change', handleClassChangeWithAnnouncement);
    drawButton.addEventListener('click', handleDrawWithAnnouncement);

    // --- Other Event Listeners ---
    resetButton.addEventListener('click', resetSession);
    editStudentsButton.addEventListener('click', openEditStudentsModal);
    saveStudentsButton.addEventListener('click', saveStudentAttributesFromModal);
    closeEditButton.addEventListener('click', closeEditStudentsModal);
    toggleInfoButton.addEventListener('click', toggleSensitiveInfo);
    fullscreenButton.addEventListener('click', toggleFullscreen);
    exportButton.addEventListener('click', exportStudentData);
    importButton.addEventListener('click', importStudentData);
    importFileInput.addEventListener('change', handleFileImport);
    lockButton.addEventListener('click', toggleLock);
    lockConfirmButton.addEventListener('click', lockPlacements);
    lockCancelButton.addEventListener('click', () => lockModal.classList.add('hidden'));
    unlockConfirmButton.addEventListener('click', unlockPlacements);
    unlockCancelButton.addEventListener('click', () => unlockModal.classList.add('hidden'));
    saveLayoutButton.addEventListener('click', saveCurrentLayout);
    loadLayoutButton.addEventListener('click', loadSavedLayout);
    themeButton.addEventListener('click', toggleTheme);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Shift + F för fullscreen
        if (e.shiftKey && e.key === 'F') {
            e.preventDefault();
            toggleFullscreen();
        }

        // Ctrl/Cmd + Enter to place students
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!drawButton.disabled) {
                drawButton.click();
            }
        }

        // Ctrl/Cmd + R to reset (with confirmation)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            if (!resetButton.disabled) {
                resetButton.click();
            }
        }

        // Ctrl/Cmd + E to edit students
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            if (!editStudentsButton.disabled) {
                editStudentsButton.click();
            }
        }

        // Ctrl/Cmd + S to export
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (!exportButton.disabled) {
                exportButton.click();
            }
        }
    });

    // Touch gesture handling for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const minSwipeDistance = 50;

        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - navigate to previous classroom
                const currentIndex = Object.keys(CLASSROOM_CONFIG).indexOf(currentClassroom);
                if (currentIndex > 0) {
                    const prevClassroom = Object.keys(CLASSROOM_CONFIG)[currentIndex - 1];
                    classroomSelect.value = prevClassroom;
                    handleClassroomChange();
                }
            } else {
                // Swipe left - navigate to next classroom
                const currentIndex = Object.keys(CLASSROOM_CONFIG).indexOf(currentClassroom);
                if (currentIndex < Object.keys(CLASSROOM_CONFIG).length - 1) {
                    const nextClassroom = Object.keys(CLASSROOM_CONFIG)[currentIndex + 1];
                    classroomSelect.value = nextClassroom;
                    handleClassroomChange();
                }
            }
        }
    }

    // Lyssna på fullscreen-ändringar
    document.addEventListener('fullscreenchange', () => {
        const container = document.querySelector('.container');
        const body = document.body;
        const timerDisplay = document.getElementById('timerDisplay');

        if (!document.fullscreenElement) {
            container.classList.remove('fullscreen-mode');
            body.classList.remove('fullscreen-active');

            // Move timer back to body when exiting fullscreen
            if (timerDisplay && timerDisplay.parentElement !== document.body) {
                document.body.appendChild(timerDisplay);
            }
        }
    });

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

    // --- MOBILPRESTANDA OPTIMERINGAR ---
    // Implementera passive event listeners för bättre scroll-prestanda
    const passiveOptions = { passive: true };

    // Optimera event listeners för bättre prestanda på mobila enheter
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, passiveOptions);

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, passiveOptions);

    // Debounce funktion för att optimera resize-händelser
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimera för orientation changes
    let resizeTimeout;
    window.addEventListener('orientationchange', () => {
        // Fördröj uppdatering tills orienteringen är klar
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Uppdatera layout efter orienteringsändring
            renderDesks();
            updateUI();
        }, 100);
    }, passiveOptions);

    // Optimera för viewport changes
    const debouncedResize = debounce(() => {
        // Endast uppdatera om det verkligen behövs
        if (window.innerWidth < 768) {
            renderDesks();
            updateUI();
        }
    }, 250);

    window.addEventListener('resize', debouncedResize, passiveOptions);
}
