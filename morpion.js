import { question } from "readline-sync";

class Player {
    /**
     * @param {string[][]} board - game board
     * @param {string} name - player name
     * @param {string} mark - player mark (x or o)
     */
    constructor(board, name, mark) {
        this.name = name;
        this.mark = mark;
        this.board = board;
    }

    /**
     * Ask for a numeric value and return a zero-based index
     * @param {string} message
     * @returns {number}
     */
    askIndex(message) {
        while (true) {
            const value = Number(question(message));

            if (Number.isInteger(value) && value >= 1 && value <= 3) {
                return value - 1;
            }

            console.log("❌ Valeur invalide (1 à 3)");
        }
    }

    /**
     * Check if player wins
     * @returns {boolean}
     */
    hasWon() {
        const size = this.board.length;
        const mark = `|${this.mark}|`;

        // Check rows & columns
        for (let i = 0; i < size; i++) {
            const rowWin = this.board[i].every(cell => cell === mark);
            const colWin = this.board.every(row => row[i] === mark);

            if (rowWin || colWin) {
                console.log(`🎉 ${this.name} a gagné`);
                return true;
            }
        }

        // Check diagonals
        const diag1 = this.board.every((row, i) => row[i] === mark);
        const diag2 = this.board.every((row, i) => row[size - 1 - i] === mark);

        if (diag1 || diag2) {
            console.log(`🎉 ${this.name} a gagné`);
            return true;
        }

        return false;
    }

    /**
     * Display the board
     */
    displayBoard() {
        console.log(
            this.board.map(row => row.join("")).join("\n")
        );
        console.log("----------------------------");
    }

    /**
     * Player move
     */
    play() {
        while (true) {
            console.log(`Tour de ${this.name}`);

            const row = this.askIndex("Ligne (1-3): ");
            const col = this.askIndex("Colonne (1-3): ");

            if (this.board[row][col] !== "| |") {
                console.log("❌ Case déjà occupée !");
                continue;
            }

            this.board[row][col] = `|${this.mark}|`;
            this.displayBoard();
            break;
        }
    }
}

/* ================= GAME ================= */

const board = Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => "| |")
);

const playerOne = new Player(board, "Player 1", "x");
const playerTwo = new Player(board, "Player 2", "o");

playerOne.displayBoard();

while (true) {
    playerOne.play();
    if (playerOne.hasWon()) break;

    playerTwo.play();
    if (playerTwo.hasWon()) break;

    const isDraw = board.flat().every(cell => cell !== "| |");
    if (isDraw) {
        console.log("🤝 Match nul !");
        break;
    }
}
