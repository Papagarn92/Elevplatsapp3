export let currentClassroom = '';
export let currentClass = '';
export let assignments = {};
export let blockedSeats = new Set();
export let studentAttributes = {};
export let sensitiveInfoVisible = true;
export let isLocked = false;
export let lockCode = null;
export let failedUnlockAttempts = 0;
export let lockoutUntil = null;
export let lockoutLevel = 0;
export const MAX_UNLOCK_ATTEMPTS = 3;
export const LOCKOUT_DURATIONS = [0, 5 * 60 * 1000, 10 * 60 * 1000, 30 * 60 * 1000];
export let savedLayouts = {};
export let currentLayoutName = null;

export function setCurrentClassroom(value) {
    currentClassroom = value;
}

export function setCurrentClass(value) {
    currentClass = value;
}

export function setAssignments(value) {
    assignments = value;
}

export function setBlockedSeats(value) {
    // Convert array to Set if necessary (e.g. when loading from JSON)
    if (Array.isArray(value)) {
        blockedSeats = new Set(value);
    } else {
        blockedSeats = value;
    }
}

export function toggleBlockedSeat(seatId) {
    if (blockedSeats.has(seatId)) {
        blockedSeats.delete(seatId);
        return false; // Not blocked anymore
    } else {
        blockedSeats.add(seatId);
        return true; // Blocked
    }
}

export function setStudentAttributes(value) {
    studentAttributes = value;
}

export function setSensitiveInfoVisible(value) {
    sensitiveInfoVisible = value;
}

export function setIsLocked(value) {
    isLocked = value;
}

export function setLockCode(value) {
    lockCode = value;
}

export function setFailedUnlockAttempts(value) {
    failedUnlockAttempts = value;
}

export function setLockoutUntil(value) {
    lockoutUntil = value;
}

export function setLockoutLevel(value) {
    lockoutLevel = value;
}

export function setSavedLayouts(value) {
    savedLayouts = value;
}

export function setCurrentLayoutName(value) {
    currentLayoutName = value;
}
