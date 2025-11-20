import { CLASS_LISTS } from './students.js';

// Funktion för att få antal platser i Sal 302 baserat på klassens storlek
export function getSal302Seats(currentClass) {
    const currentStudentList = CLASS_LISTS[currentClass] || [];
    return currentStudentList.length === 25 ? 25 : 24;
}

// Hjälpfunktion för att hitta grannar till en plats
export function getNeighbors(seatId, config, maxSeats) {
    const neighbors = [];

    if (config.layout_map) {
        // För salar med layout_map (NO Salen, Sal 305)
        const seat = config.layout_map.find(s => s.id === seatId);
        if (!seat) return neighbors;

        config.layout_map.forEach(otherSeat => {
            if (otherSeat.id === seatId) return;

            // Kolla om de är grannar (samma rad eller intilliggande kolumner)
            const sameRow = otherSeat.row === seat.row;
            const adjacentCol = Math.abs(otherSeat.col - seat.col) === 1;
            const sameCol = otherSeat.col === seat.col;
            const adjacentRow = Math.abs(otherSeat.row - seat.row) === 1;

            if ((sameRow && adjacentCol) || (sameCol && adjacentRow)) {
                neighbors.push(otherSeat.id);
            }
        });
    } else {
        // För Sal 302 (grid-baserad)
        const cols = config.columns_per_row;
        const col = (seatId - 1) % cols;

        // Vänster granne
        if (col > 0 && col !== cols / 2) {
            neighbors.push(seatId - 1);
        }
        // Höger granne
        if (col < cols - 1 && col !== (cols / 2) - 1) {
            neighbors.push(seatId + 1);
        }
        // Granne framför
        if (seatId - cols > 0) {
            neighbors.push(seatId - cols);
        }
        // Granne bakom
        if (seatId + cols <= maxSeats) {
            neighbors.push(seatId + cols);
        }
    }

    return neighbors;
}


// KLASSRUMS KONFIGURATION (Med justerad Sal 305)
export const CLASSROOM_CONFIG = {
    "Sal 302": {
        max_seats: 25, // Detta kommer att överskridas dynamiskt
        columns_per_row: 8,
        gang_column_width: "100px",
        allows_names: true,
        whiteboard_position: { row: 1, col_start: 4, span: 6 },
        dynamic_seats: true // Flagga för att indikera dynamiska platser
    },
    "NO Salen": {
        max_seats: 25,
        grid_template_columns: "40px repeat(2, 1fr) 80px repeat(4, 1fr)",
        allows_names: true,
        layout_map: [
            { id: 1, row: 2, col: 2 }, { id: 2, row: 2, col: 3 },
            { id: 3, row: 2, col: 5 }, { id: 4, row: 2, col: 6 }, { id: 5, row: 2, col: 7 }, { id: 6, row: 2, col: 8 },
            { id: 7, row: 3, col: 2 }, { id: 8, row: 3, col: 3 },
            { id: 9, row: 3, col: 5 }, { id: 10, row: 3, col: 6 }, { id: 11, row: 3, col: 7 }, { id: 12, row: 3, col: 8 },
            { id: 13, row: 4, col: 2 }, { id: 14, row: 4, col: 3 },
            { id: 15, row: 4, col: 5 }, { id: 16, row: 4, col: 6 }, { id: 17, row: 4, col: 7 }, { id: 18, row: 4, col: 8 },
            { id: 19, row: 5, col: 2 }, { id: 20, row: 5, col: 3 },
            { id: 21, row: 5, col: 5 }, { id: 22, row: 5, col: 6 }, { id: 23, row: 5, col: 7 }, { id: 24, row: 5, col: 8 },
            { id: 25, row: 6, col: 5 }
        ],
        whiteboard_position: {
            row: 1,
            col_start: 2,
            span: 7
        }
    },
    // ** UPPDATERAD SAL 305 **
    "Sal 305": {
        max_seats: 30, // 15 bänkar * 2 platser
        allows_names: true,
        grid_template_columns: "repeat(2, 1fr) 50px repeat(2, 1fr) 50px repeat(2, 1fr)",
        whiteboard_position: { row: 1, col_start: 1, span: 8 },

        // Pelaren är nu på rad 3, kolumn 7 och spänner 1 plats.
        pillar_position: { row: 3, col_start: 7, span: 1 },

        // Karta över de 30 platserna, justerad
        layout_map: [
            // Rad 2 (Nu en full bänkrad)
            { id: 1, row: 2, col: 1 }, { id: 2, row: 2, col: 2 },   // Vänster
            { id: 3, row: 2, col: 4 }, { id: 4, row: 2, col: 5 },   // Mitten
            { id: 5, row: 2, col: 7 }, { id: 6, row: 2, col: 8 },   // Höger bänk 1

            // Rad 3 (Pelaren är i högra kolumnen, tar plats 9)
            { id: 7, row: 3, col: 1 }, { id: 8, row: 3, col: 2 },
            { id: 9, row: 3, col: 4 }, { id: 10, row: 3, col: 5 },
            // Plats 9 & 10 (gamla) är nu blockerade

            // Rad 4
            { id: 11, row: 4, col: 1 }, { id: 12, row: 4, col: 2 },
            { id: 13, row: 4, col: 4 }, { id: 14, row: 4, col: 5 },
            { id: 15, row: 4, col: 7 }, { id: 16, row: 4, col: 8 }, // Höger bänk 2

            // Rad 5
            { id: 17, row: 5, col: 1 }, { id: 18, row: 5, col: 2 },
            { id: 19, row: 5, col: 4 }, { id: 20, row: 5, col: 5 },
            { id: 21, row: 5, col: 7 }, { id: 22, row: 5, col: 8 }, // Höger bänk 3

            // Rad 6
            { id: 23, row: 6, col: 1 }, { id: 24, row: 6, col: 2 },
            { id: 25, row: 6, col: 4 }, { id: 26, row: 6, col: 5 },
            // Tomt till höger

            // Rad 7
            { id: 27, row: 7, col: 1 }, { id: 28, row: 7, col: 2 },
            { id: 29, row: 7, col: 4 }, { id: 30, row: 7, col: 5 }
            // Tomt till höger
        ]
    },
    // ** NY SAL 315 **
    "Sal 315": {
        max_seats: 30, // Uppdaterad till 30 platser efter borttagning av platser 3 och 4
        allows_names: true,
        grid_template_columns: "repeat(2, 1fr) 60px repeat(4, 1fr)", // 2 vänster + gap + 4 höger
        whiteboard_position: { row: 1, col_start: 1, span: 7 },

        // Karta över de 30 platserna efter borttagning av platser 3 och 4
        layout_map: [
            // Rad 2: Höger 2 platser
            { id: 1, row: 2, col: 6 }, { id: 2, row: 2, col: 7 },   // Höger (2 platser)

            // Rad 3: Höger 4 platser (platser 3 och 4 borttagna)
            { id: 3, row: 3, col: 4 }, { id: 4, row: 3, col: 5 }, { id: 5, row: 3, col: 6 }, { id: 6, row: 3, col: 7 }, // Höger (4 platser)

            // Rad 4: Vänster 2 platser, Höger 4 platser
            { id: 7, row: 4, col: 1 }, { id: 8, row: 4, col: 2 }, // Vänster
            { id: 9, row: 4, col: 4 }, { id: 10, row: 4, col: 5 }, { id: 11, row: 4, col: 6 }, { id: 12, row: 4, col: 7 }, // Höger

            // Rad 5: Vänster 2 platser, Höger 4 platser
            { id: 13, row: 5, col: 1 }, { id: 14, row: 5, col: 2 }, // Vänster
            { id: 15, row: 5, col: 4 }, { id: 16, row: 5, col: 5 }, { id: 17, row: 5, col: 6 }, { id: 18, row: 5, col: 7 }, // Höger

            // Rad 6: Vänster 2 platser, Höger 4 platser
            { id: 19, row: 6, col: 1 }, { id: 20, row: 6, col: 2 }, // Vänster
            { id: 21, row: 6, col: 4 }, { id: 22, row: 6, col: 5 }, { id: 23, row: 6, col: 6 }, { id: 24, row: 6, col: 7 }, // Höger

            // Rad 7: Vänster 2 platser, Höger 4 platser
            { id: 25, row: 7, col: 1 }, { id: 26, row: 7, col: 2 }, // Vänster
            { id: 27, row: 7, col: 4 }, { id: 28, row: 7, col: 5 }, { id: 29, row: 7, col: 6 }, { id: 30, row: 7, col: 7 }  // Höger (4 platser)
        ]
    }
};
