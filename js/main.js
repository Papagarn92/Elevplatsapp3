import {
    setCurrentClassroom,
    setCurrentClass,
    currentClassroom,
    currentClass
} from './state.js';
import {
    loadData,
    loadStudentAttributes,
    loadSavedLayouts,
    loadLockStatus,
    loadSessionState
} from './data.js';
import {
    populateClassroomSelect,
    populateClassSelect,
    setupKeyboardNavigation,
    loadTheme
} from './ui.js';
import {
    setupEventListeners
} from './events.js';
import {
    CLASSROOM_CONFIG
} from './classroom.js';
import {
    CLASS_LISTS
} from './students.js';
import { initializeSession } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    loadTheme();

    const session = loadSessionState();
    let initialClassroom = Object.keys(CLASSROOM_CONFIG)[0];
    let initialClass = Object.keys(CLASS_LISTS)[0];

    if (session && CLASSROOM_CONFIG[session.classroom] && CLASS_LISTS[session.className]) {
        initialClassroom = session.classroom;
        initialClass = session.className;
    }

    setCurrentClassroom(initialClassroom);
    setCurrentClass(initialClass);
    populateClassroomSelect();
    populateClassSelect();
    loadLockStatus(); // Ladda låsstatus först
    loadSavedLayouts(); // Ladda sparade placeringar
    initializeSession();

    // Enhanced keyboard navigation
    setupKeyboardNavigation();

    // Setup event listeners
    setupEventListeners();
});
