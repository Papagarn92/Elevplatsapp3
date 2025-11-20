import { CLASS_LISTS } from './students.js';
import { CLASSROOM_CONFIG, getNeighbors } from './classroom.js';

// Spara placeringshistorik
export function savePlacementHistory(classroom, className, assignments) {
    const timestamp = new Date().toISOString();
    const historyKey = `placementHistory_${className.replace(/\s+/g, '_')}`;
    
    try {
        let history = JSON.parse(localStorage.getItem(historyKey)) || [];
        
        // Lägg till ny placering
        history.push({
            timestamp,
            classroom,
            assignments: { ...assignments }
        });
        
        // Begränsa historiken till senaste 100 placeringarna per klass
        if (history.length > 100) {
            history = history.slice(-100);
        }
        
        localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (e) {
        console.error('Kunde inte spara placeringshistorik:', e);
    }
}

// Hämta placeringshistorik
export function getPlacementHistory(className) {
    const historyKey = `placementHistory_${className.replace(/\s+/g, '_')}`;
    try {
        return JSON.parse(localStorage.getItem(historyKey)) || [];
    } catch (e) {
        return [];
    }
}

// Beräkna grannskapsstatistik
export function calculateNeighborStatistics(className) {
    const history = getPlacementHistory(className);
    const students = CLASS_LISTS[className] || [];
    
    // Skapa en matris för att räkna grannskapsfrekvens
    const neighborCount = {};
    
    // Initiera matrisen
    students.forEach(student1 => {
        neighborCount[student1] = {};
        students.forEach(student2 => {
            if (student1 !== student2) {
                neighborCount[student1][student2] = 0;
            }
        });
    });
    
    // Räkna grannskapsfrekvens från historiken
    history.forEach(placement => {
        const { classroom, assignments } = placement;
        const config = CLASSROOM_CONFIG[classroom];
        
        if (!config) return;
        
        // Använd dynamiskt antal platser för Sal 302
        let maxSeats = config.max_seats;
        if (config.dynamic_seats && classroom === "Sal 302") {
            const currentStudentList = CLASS_LISTS[className] || [];
            maxSeats = currentStudentList.length === 25 ? 25 : 24;
        }
        
        // För varje plats, hitta grannar
        Object.entries(assignments).forEach(([seatId, student]) => {
            const neighbors = getNeighbors(parseInt(seatId), config, maxSeats);
            
            neighbors.forEach(neighborSeatId => {
                const neighborStudent = assignments[neighborSeatId];
                if (neighborStudent && neighborCount[student] && neighborCount[student][neighborStudent] !== undefined) {
                    neighborCount[student][neighborStudent]++;
                }
            });
        });
    });
    
    return neighborCount;
}

// Hitta elever som aldrig suttit bredvid varandra
export function findNeverNeighbors(className) {
    const neighborCount = calculateNeighborStatistics(className);
    const neverNeighbors = [];
    
    Object.entries(neighborCount).forEach(([student1, neighbors]) => {
        Object.entries(neighbors).forEach(([student2, count]) => {
            if (count === 0 && student1 < student2) { // student1 < student2 för att undvika dubbletter
                neverNeighbors.push([student1, student2]);
            }
        });
    });
    
    return neverNeighbors;
}

// Beräkna genomsnittligt antal gånger elever sitter bredvid samma person
export function calculateAverageNeighborFrequency(className) {
    const neighborCount = calculateNeighborStatistics(className);
    let totalCount = 0;
    let pairCount = 0;
    
    Object.values(neighborCount).forEach(neighbors => {
        Object.values(neighbors).forEach(count => {
            totalCount += count;
            pairCount++;
        });
    });
    
    return pairCount > 0 ? (totalCount / pairCount).toFixed(2) : 0;
}

// Hämta mest frekventa grannar för en elev
export function getMostFrequentNeighbors(className, studentName, limit = 5) {
    const neighborCount = calculateNeighborStatistics(className);
    
    if (!neighborCount[studentName]) return [];
    
    const neighbors = Object.entries(neighborCount[studentName])
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([neighbor, count]) => ({ neighbor, count }));
    
    return neighbors;
}

// Hämta minst frekventa grannar för en elev
export function getLeastFrequentNeighbors(className, studentName, limit = 5) {
    const neighborCount = calculateNeighborStatistics(className);
    
    if (!neighborCount[studentName]) return [];
    
    const neighbors = Object.entries(neighborCount[studentName])
        .sort((a, b) => a[1] - b[1])
        .slice(0, limit)
        .map(([neighbor, count]) => ({ neighbor, count }));
    
    return neighbors;
}

// Rensa historik för en klass
export function clearPlacementHistory(className) {
    const historyKey = `placementHistory_${className.replace(/\s+/g, '_')}`;
    localStorage.removeItem(historyKey);
}

// Exportera statistik som JSON
export function exportStatistics(className) {
    const history = getPlacementHistory(className);
    const neighborCount = calculateNeighborStatistics(className);
    const neverNeighbors = findNeverNeighbors(className);
    const averageFrequency = calculateAverageNeighborFrequency(className);
    
    const exportData = {
        className,
        exportDate: new Date().toISOString(),
        totalPlacements: history.length,
        averageNeighborFrequency: averageFrequency,
        neighborStatistics: neighborCount,
        neverNeighbors: neverNeighbors,
        placementHistory: history,
        version: "1.0"
    };
    
    return exportData;
}
