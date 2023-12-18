export enum GameStateStatus {
    PLAYING = "PLAYING",
    WON = "WON",
    LOST = "LOST",
    SUBMITTING = "SUBMITTING",
    SUBMITTED = "SUBMITTED",
    LOADING = "LOADING"
}
enum LetterStatus {
    CORRECT = "CORRECT",
    INCLUDED = "INCLUDED",
    WRONG = "WRONG"
}
export type LetterGuess = {
    letter: string;
    status: LetterStatus;
}

const getWords = async (): Promise<string[]> => {
    const response = await fetch("/words.json");

    const data = await response.json();
    return data.default;
};

type GameState = {
    targetWord: string | null;
    guessesLeft: number;
    guesses: LetterGuess[][];
    guessedLetters: Set<LetterGuess>;
    gameStatus: GameStateStatus;
    inputText: string;
    error: string | null;
    finishedAnimations: number;
};

const initialState: GameState = {
    targetWord: null,
    guessesLeft: 6,
    guesses: [],
    guessedLetters: new Set<LetterGuess>(),
    gameStatus: GameStateStatus.LOADING,
    inputText: "",
    error: null,
    finishedAnimations: 0
};

export let gameState = $state<GameState>(initialState);
let words = $state<string[]>()


const setupState = (words: string[]) => {
    gameState.targetWord = words[Math.floor(Math.random() * words.length)];
    gameState.guessesLeft = 6;
    gameState.guesses = [];
    gameState.guessedLetters = new Set();
    gameState.inputText = "";
    gameState.error = null
    gameState.gameStatus = GameStateStatus.PLAYING; // Directly setting the value
}

export const initializeGame = async () => {
    try {
        gameState.gameStatus = GameStateStatus.LOADING; // Directly setting the value
        words = await getWords();
        setupState(words)
    } catch (error) {
        console.error('Error initializing game:', error);
        gameState.gameStatus = GameStateStatus.LOST; // or a new state like ERROR
    }
};

export const resetGame = () => {
    gameState.gameStatus = GameStateStatus.LOADING
    if (!words) {
        initializeGame()
        return;
    }
    setupState(words)
}

export const processGuess = () => {
    const guess = gameState.inputText;
    if (gameState.gameStatus !== GameStateStatus.PLAYING) {
        return; // Do not process if not in playing state
    }
    if (guess.length < 5) {
        gameState.error = "Must be 5 characters";
        return
    }

    if (!words?.includes(gameState.inputText)) {
        gameState.error = "Invalid word"
        return
    }

    gameState.gameStatus = GameStateStatus.SUBMITTING; // Directly setting the value
    const currentTargetWord = gameState.targetWord;

    if (currentTargetWord) {
        const charmap = new Map()
        currentTargetWord.split("").forEach(char => {
            if (charmap.has(char)) {
                charmap.set(char, charmap.get(char) + 1)
                return
            }
            charmap.set(char, 1)
        })
        const guessResult = guess.split('').map((letter, index) => {
            if (letter === currentTargetWord[index] && charmap.get(letter) >= 1) {
                charmap.set(letter, charmap.get(letter) - 1)
                return { letter, status: LetterStatus.CORRECT };
            } else if (currentTargetWord.includes(letter) && charmap.get(letter) >= 1) {
                charmap.set(letter, charmap.get(letter) - 1)
                return { letter, status: LetterStatus.INCLUDED };
            }
            return { letter, status: LetterStatus.WRONG };
        });
        gameState.guesses = guessResult.length > 0 ? [...gameState.guesses, guessResult] : gameState.guesses;
        gameState.guessesLeft = gameState.guessesLeft - 1;

        gameState.inputText = ""

    }
};

export const checkWin = () => {
    const lastGuess = gameState.guesses[gameState.guesses.length - 1];
    gameState.guessedLetters = new Set(gameState.guesses.flatMap(guess => guess))
    // Check for win/lose conditions
    if (lastGuess) {
        const isWin = lastGuess.every(l => l.status === LetterStatus.CORRECT);
        gameState.gameStatus = isWin ? GameStateStatus.WON : gameState.guessesLeft <= 0 ? GameStateStatus.LOST : GameStateStatus.PLAYING;
    }
}



export const addCharacter = (character: string) => {
    if (gameState.inputText.length >= 5) {
        return;
    }
    gameState.inputText += character;
};

export const deleteCharacter = () => {
    gameState.inputText = gameState.inputText.slice(0, -1);
};

export const animationFinished = () => {
    gameState.finishedAnimations++;
    if (gameState.finishedAnimations >= 5) {
        gameState.gameStatus = GameStateStatus.SUBMITTED;
        gameState.finishedAnimations = 0
    }
};