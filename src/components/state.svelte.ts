enum GameStateStatus {
    PLAYING = "PLAYING",
    WON = "WON",
    LOST = "LOST",
    SUBMITTING = "SUBMITTING",
    LOADING = "LOADING"
}
type GameState = {
    targetWord: string | null;
    guessedLetters: Set<string>;
    guessesLeft: number;
    guesses: LetterGuess[][];
    state: GameStateStatus;
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

export let targetWord = $state<string | null>(null);
export let guessedLetters = $state<Set<string>>(new Set<string>())
export let guessesLeft = $state<number>(5)
export let guesses = $state<LetterGuess[][]>([])
export let gameStatus = $state<GameStateStatus>(GameStateStatus.LOADING)


export const initializeGame = async () => {
    try {
        gameStatus = GameStateStatus.LOADING; // Directly setting the value
        const words = await getWords();
        targetWord = words[Math.floor(Math.random() * words.length)];
        guessedLetters = new Set<string>();
        guessesLeft = 6;
        guesses = [];
        gameStatus = GameStateStatus.PLAYING; // Directly setting the value
    } catch (error) {
        console.error('Error initializing game:', error);
        gameStatus = GameStateStatus.LOST; // or a new state like ERROR
    }
};

export const processGuess = (guess: string) => {
    if (gameStatus !== GameStateStatus.PLAYING) {
        return; // Do not process if not in playing state
    }

    gameStatus = GameStateStatus.SUBMITTING; // Directly setting the value
    const currentTargetWord = targetWord;

    if (currentTargetWord) {
        const guessResult = guess.split('').map((letter, index) => {
            if (letter === currentTargetWord[index]) {
                return { letter, status: LetterStatus.CORRECT };
            } else if (currentTargetWord.includes(letter)) {
                return { letter, status: LetterStatus.INCLUDED };
            }
            return { letter, status: LetterStatus.WRONG };
        });

        guessedLetters = new Set(guessedLetters.add(guess));
        guesses = guessResult.length > 0 ? [...guesses, guessResult] : guesses;
        guessesLeft = guessesLeft - 1;

        // Check for win/lose conditions
        const isWin = guessResult.every(l => l.status === LetterStatus.CORRECT);
        gameStatus = isWin ? GameStateStatus.WON : guessesLeft <= 0 ? GameStateStatus.LOST : GameStateStatus.PLAYING;
    }
};

