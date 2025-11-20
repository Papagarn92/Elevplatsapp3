import { CLASS_LISTS } from './students.js';
import {
    getPlacementHistory,
    calculateNeighborStatistics,
    findNeverNeighbors,
    calculateAverageNeighborFrequency,
    clearPlacementHistory,
    exportStatistics
} from './statistics.js';

// Admin lösenordshantering
const ADMIN_PASSWORD_KEY = 'adminPassword';

function getAdminPassword() {
    return localStorage.getItem(ADMIN_PASSWORD_KEY);
}

function setAdminPassword(password) {
    localStorage.setItem(ADMIN_PASSWORD_KEY, password);
}

function checkPassword(password) {
    const storedPassword = getAdminPassword();
    if (!storedPassword) {
        // Första gången - sätt lösenordet
        setAdminPassword(password);
        return true;
    }
    return password === storedPassword;
}

// DOM-element
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const classSelectAdmin = document.getElementById('classSelectAdmin');
const logoutBtn = document.getElementById('logoutBtn');
const exportStatsBtn = document.getElementById('exportStatsBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsSection = document.getElementById('settingsSection');
const savePasswordBtn = document.getElementById('savePasswordBtn');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
const newPasswordInput = document.getElementById('newPasswordInput');
const confirmPasswordInput = document.getElementById('confirmPasswordInput');
const passwordMessage = document.getElementById('passwordMessage');

// Statistik-element
const totalPlacements = document.getElementById('totalPlacements');
const avgFrequency = document.getElementById('avgFrequency');
const neverNeighborsCount = document.getElementById('neverNeighborsCount');
const heatmapGrid = document.getElementById('heatmapGrid');
const statsTableBody = document.getElementById('statsTableBody');
const neverNeighborsList = document.getElementById('neverNeighborsList');
const historyTableBody = document.getElementById('historyTableBody');

let currentClass = '';

// Login-hantering
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = passwordInput.value;
    
    if (checkPassword(password)) {
        loginScreen.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        loginError.classList.add('hidden');
        passwordInput.value = '';
        populateClassSelect();
    } else {
        loginError.classList.remove('hidden');
        passwordInput.value = '';
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    adminDashboard.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    settingsSection.classList.add('hidden');
});

// Settings
settingsBtn.addEventListener('click', () => {
    settingsSection.classList.toggle('hidden');
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';
    passwordMessage.classList.add('hidden');
});

cancelSettingsBtn.addEventListener('click', () => {
    settingsSection.classList.add('hidden');
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';
    passwordMessage.classList.add('hidden');
});

savePasswordBtn.addEventListener('click', () => {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (!newPassword || newPassword.length < 4) {
        passwordMessage.textContent = 'Lösenordet måste vara minst 4 tecken långt!';
        passwordMessage.style.color = 'var(--danger)';
        passwordMessage.classList.remove('hidden');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        passwordMessage.textContent = 'Lösenorden matchar inte!';
        passwordMessage.style.color = 'var(--danger)';
        passwordMessage.classList.remove('hidden');
        return;
    }
    
    setAdminPassword(newPassword);
    passwordMessage.textContent = 'Lösenord uppdaterat!';
    passwordMessage.style.color = 'var(--success)';
    passwordMessage.classList.remove('hidden');
    
    setTimeout(() => {
        settingsSection.classList.add('hidden');
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
        passwordMessage.classList.add('hidden');
    }, 2000);
});

// Populera klassval
function populateClassSelect() {
    classSelectAdmin.innerHTML = '<option value="">Välj klass</option>';
    Object.keys(CLASS_LISTS).sort().forEach(className => {
        const option = document.createElement('option');
        option.value = className;
        option.textContent = className;
        classSelectAdmin.appendChild(option);
    });
}

// Uppdatera statistik när klass väljs
classSelectAdmin.addEventListener('change', () => {
    currentClass = classSelectAdmin.value;
    if (currentClass) {
        updateStatistics();
    }
});

// Uppdatera all statistik
function updateStatistics() {
    if (!currentClass) return;
    
    const history = getPlacementHistory(currentClass);
    const neighborStats = calculateNeighborStatistics(currentClass);
    const neverNeighbors = findNeverNeighbors(currentClass);
    const avgFreq = calculateAverageNeighborFrequency(currentClass);
    
    // Uppdatera översiktskort
    totalPlacements.textContent = history.length;
    avgFrequency.textContent = avgFreq;
    neverNeighborsCount.textContent = neverNeighbors.length;
    
    // Uppdatera heatmap
    renderHeatmap(neighborStats);
    
    // Uppdatera tabell
    renderStatsTable(neighborStats);
    
    // Uppdatera "aldrig grannar"-lista
    renderNeverNeighbors(neverNeighbors);
    
    // Uppdatera historik
    renderHistory(history);
}

// Rendera heatmap
function renderHeatmap(neighborStats) {
    const students = CLASS_LISTS[currentClass] || [];
    if (students.length === 0) {
        heatmapGrid.innerHTML = '<p>Ingen data tillgänglig</p>';
        return;
    }
    
    // Hitta max-värde för färgskalning
    let maxCount = 0;
    Object.values(neighborStats).forEach(neighbors => {
        Object.values(neighbors).forEach(count => {
            if (count > maxCount) maxCount = count;
        });
    });
    
    // Skapa grid
    const gridSize = students.length + 1;
    heatmapGrid.style.gridTemplateColumns = `repeat(${gridSize}, minmax(60px, 1fr))`;
    heatmapGrid.innerHTML = '';
    
    // Header rad
    const emptyCell = document.createElement('div');
    emptyCell.className = 'heatmap-cell heatmap-header';
    heatmapGrid.appendChild(emptyCell);
    
    students.forEach(student => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell heatmap-header';
        cell.textContent = student;
        cell.title = student;
        heatmapGrid.appendChild(cell);
    });
    
    // Data rader
    students.forEach(student1 => {
        // Rad header
        const rowHeader = document.createElement('div');
        rowHeader.className = 'heatmap-cell heatmap-row-header';
        rowHeader.textContent = student1;
        rowHeader.title = student1;
        heatmapGrid.appendChild(rowHeader);
        
        // Data celler
        students.forEach(student2 => {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            
            if (student1 === student2) {
                cell.textContent = '-';
                cell.style.background = 'var(--bg-tertiary)';
            } else {
                const count = neighborStats[student1]?.[student2] || 0;
                cell.textContent = count;
                
                // Färgskala från ljus till mörk baserat på frekvens
                const intensity = maxCount > 0 ? count / maxCount : 0;
                const hue = 120 - (intensity * 60); // Från grön (120) till gul (60)
                const saturation = 70;
                const lightness = 85 - (intensity * 35); // Från ljus till mörk
                cell.style.background = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                cell.style.color = intensity > 0.5 ? 'white' : 'var(--text-primary)';
                cell.title = `${student1} & ${student2}: ${count} gånger`;
            }
            
            heatmapGrid.appendChild(cell);
        });
    });
}

// Rendera statistiktabell
function renderStatsTable(neighborStats) {
    statsTableBody.innerHTML = '';
    
    const pairs = [];
    Object.entries(neighborStats).forEach(([student1, neighbors]) => {
        Object.entries(neighbors).forEach(([student2, count]) => {
            if (student1 < student2) { // Undvik dubbletter
                pairs.push({ student1, student2, count });
            }
        });
    });
    
    // Sortera efter antal (högst först)
    pairs.sort((a, b) => b.count - a.count);
    
    // Visa topp 50
    pairs.slice(0, 50).forEach(pair => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pair.student1}</td>
            <td>${pair.student2}</td>
            <td><strong>${pair.count}</strong></td>
        `;
        statsTableBody.appendChild(row);
    });
    
    if (pairs.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="3" style="text-align: center; color: var(--text-muted);">Ingen data tillgänglig</td>';
        statsTableBody.appendChild(row);
    }
}

// Rendera "aldrig grannar"-lista
function renderNeverNeighbors(neverNeighbors) {
    neverNeighborsList.innerHTML = '';
    
    if (neverNeighbors.length === 0) {
        neverNeighborsList.innerHTML = '<p style="color: var(--text-muted);">Alla elever har suttit bredvid varandra minst en gång!</p>';
        return;
    }
    
    neverNeighbors.forEach(([student1, student2]) => {
        const item = document.createElement('div');
        item.className = 'never-neighbor-item';
        item.textContent = `${student1} ↔ ${student2}`;
        neverNeighborsList.appendChild(item);
    });
}

// Rendera historik
function renderHistory(history) {
    historyTableBody.innerHTML = '';
    
    if (history.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="3" style="text-align: center; color: var(--text-muted);">Ingen historik tillgänglig</td>';
        historyTableBody.appendChild(row);
        return;
    }
    
    // Visa senaste 20 placeringarna
    history.slice(-20).reverse().forEach(placement => {
        const row = document.createElement('tr');
        const date = new Date(placement.timestamp);
        const formattedDate = date.toLocaleString('sv-SE');
        const studentCount = Object.keys(placement.assignments).length;
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${placement.classroom}</td>
            <td>${studentCount} elever</td>
        `;
        historyTableBody.appendChild(row);
    });
}

// Exportera statistik
exportStatsBtn.addEventListener('click', () => {
    if (!currentClass) {
        alert('Välj en klass först!');
        return;
    }
    
    const stats = exportStatistics(currentClass);
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `statistik_${currentClass}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
});

// Rensa historik
clearHistoryBtn.addEventListener('click', () => {
    if (!currentClass) {
        alert('Välj en klass först!');
        return;
    }
    
    if (confirm(`Är du säker på att du vill radera all placeringshistorik för ${currentClass}?\n\nDetta kan inte ångras!`)) {
        clearPlacementHistory(currentClass);
        updateStatistics();
        alert('Historik raderad!');
    }
});
