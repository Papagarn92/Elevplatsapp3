import { studentAttributes } from './state.js';
import { getNeighbors } from './classroom.js';
import { sortSelect } from './ui.js';

export function sortStudents(students, sortMethod) {
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

export function smartPlacement(students, allSeats, config, maxSeats) {
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
