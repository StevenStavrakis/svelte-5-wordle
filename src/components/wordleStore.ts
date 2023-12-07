import { writable } from "svelte/store";

type WordleStore = {
    targetWord: string;
    guessedLetters: Set<string>;
    guessesLeft: number;
    guesses: LetterGuess[][];
    status: "playing" | "won" | "lost";
}

export type LetterGuess = {
    letter: string;
    status: "CORRECT" | "INCLUDED" | "WRONG";
}

export const getRandomWord = async (): Promise<string> => {
    const response = await fetch("https://random-word-api.vercel.app/api?words=1&length=5");
    const data = await response.json();
    return data[0];
}

export const wordleStore = writable<WordleStore>({
    targetWord: "adept",
    guessedLetters: new Set(),
    guessesLeft: 6,
    guesses: [],
    status: "playing",
})

const createGameStore = () => {
    const { subscribe, set, update } = writable<WordleStore>({
        targetWord: "adept",
        guessedLetters: new Set(),
        guessesLeft: 6,
        guesses: [],
        status: "playing",
    })

    return {

    }
}
