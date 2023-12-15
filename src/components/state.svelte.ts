export enum GameStateStatus {
    PLAYING = "PLAYING",
    WON = "WON",
    LOST = "LOST",
    SUBMITTING = "SUBMITTING",
    LOADING = "LOADING"
}
enum LetterStatus {
    CORRECT = "CORRECT",
    INCLUDED = "INCLUDED",
    WRONG = "WRONG"
}
type LetterGuess = {
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
};

const initialState: GameState = {
    targetWord: null,
    guessesLeft: 6,
    guesses: [],
    guessedLetters: new Set<LetterGuess>(),
    gameStatus: GameStateStatus.LOADING,
    inputText: "",
    error: null,
};

export let gameState = $state<GameState>(initialState);
let words = $state<string[]>()


const setupState = (words: string[]) => {
    gameState.targetWord = words[Math.floor(Math.random() * words.length)];
    gameState.guessesLeft = 6;
    gameState.guesses = [];
    gameState.gameStatus = GameStateStatus.PLAYING; // Directly setting the value
    gameState.guessedLetters = new Set();
    gameState.inputText = "";
    gameState.error = null
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

export const processGuess = async (guess: string) => {
    if (gameState.gameStatus !== GameStateStatus.PLAYING) {
        return; // Do not process if not in playing state
    }
    if (gameState.inputText.length < 5) {
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
        const guessResult = guess.split('').map((letter, index) => {
            if (letter === currentTargetWord[index]) {
                return { letter, status: LetterStatus.CORRECT };
            } else if (currentTargetWord.includes(letter)) {
                return { letter, status: LetterStatus.INCLUDED };
            }
            return { letter, status: LetterStatus.WRONG };
        });
        gameState.guesses = guessResult.length > 0 ? [...gameState.guesses, guessResult] : gameState.guesses;
        gameState.guessedLetters = new Set(gameState.guesses.flatMap(guess => guess))
        gameState.guessesLeft = gameState.guessesLeft - 1;

        gameState.inputText = ""

        // Check for win/lose conditions
        const isWin = guessResult.every(l => l.status === LetterStatus.CORRECT);
        gameState.gameStatus = isWin ? GameStateStatus.WON : gameState.guessesLeft <= 0 ? GameStateStatus.LOST : GameStateStatus.PLAYING;
    }
};


export const addCharacter = (character: string) => {
    if (gameState.inputText.length >= 5) {
        return;
    }
    gameState.inputText += character;
};

export const deleteCharacter = () => {
    gameState.inputText = gameState.inputText.slice(0, -1);
};