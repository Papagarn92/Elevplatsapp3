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
    loadLockStatus
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
    setCurrentClassroom(Object.keys(CLASSROOM_CONFIG)[0]);
    setCurrentClass(Object.keys(CLASS_LISTS)[0]);
    populateClassroomSelect();
    populateClassSelect();
    loadLockStatus(); // Ladda låsstatus först
    loadSavedLayouts(); // Ladda sparade placeringar
    initializeSession();

    // Enhanced keyboard navigation
    setupKeyboardNavigation();

    // Ladda tema
    loadTheme();

    // Setup event listeners
    setupEventListeners();
});
