<script lang="ts">
  import Letter from "./Letter.svelte";
  import Keyboard from "./Keyboard.svelte";
  import { tweened } from "svelte/motion";
  import { onMount } from "svelte";
  import Message from "./Message.svelte";

  type WordleStore = {
    targetWord: string;
    guessedLetters: Set<LetterGuess>;
    guessesLeft: number;
    guesses: LetterGuess[][];
    status: "playing" | "won" | "lost";
  };

  type LetterGuess = {
    letter: string;
    status: "CORRECT" | "INCLUDED" | "WRONG";
  };

  let opacity = tweened(0, {
    delay: 300,
  });

  const getWords = async (): Promise<string[]> => {
    const response = await fetch("/words.json");

    const data = await response.json();
    return data.default;
  };

  const loadWordsIntoState = async () => {
    words = await getWords();
  };

  const setup = async () => {
    await loadWordsIntoState();
    wordleStore.targetWord = "stare";
    opacity.set(1);
  };

  let words = $state<string[]>([]);

  const getRandomWord = (words: string[]): string => {
    return words[Math.floor(Math.random() * words.length)];
  };

  let wordleStore = $state<WordleStore>({
    targetWord: "",
    guessedLetters: new Set(),
    guessesLeft: 5,
    guesses: [],
    status: "playing",
  });

  let inputText = $state("");

  const addCharacter = (character: string) => {
    if (inputText.length >= 5) {
      return;
    }
    inputText += character;
  };

  const deleteCharacter = () => {
    inputText = inputText.slice(0, -1);
  };

  let error = $state("");

  $effect(() => {
    inputText;
    error = "";
  });

  const countLetters = (word: string) => {
    const letters: Record<string, number> = {};

    for (const letter of word) {
      letters[letter] = (letters[letter] || 0) + 1;
    }

    return letters;
  };

  const reset = () => {
    inputText = "";
    wordleStore = {
      targetWord: getRandomWord(words),
      guesses: [],
      guessesLeft: 5,
      status: "playing",
      guessedLetters: new Set(),
    };
  };

  const submitWord = (word: string) => {
    if (wordleStore.status !== "playing") {
      return;
    }
    if (word.length !== 5) {
      error = "Word must be 5 letters long";
      return;
    }
    if (words.indexOf(word) === -1) {
      error = "Word not found in dictionary";
      return;
    }
    const letters = word.split("");
    const targetLetters = wordleStore.targetWord.split("");
    if (letters.length !== targetLetters.length) {
      error = "Word must be the same length as the target word";
      return;
    }

    inputText = "";

    const targetCount = countLetters(wordleStore.targetWord);

    const correctLetters = letters.map((letter, index) => {
      let status = null;
      if (letter === targetLetters[index]) {
        targetCount[letter] -= 1;
        status = "CORRECT";
      }
      return {
        letter,
        status,
      };
    });

    const toDisplay = correctLetters.map((letter) => {
      if (letter.status === "CORRECT") {
        return letter as LetterGuess;
      }
      if (targetCount[letter.letter] > 0) {
        targetCount[letter.letter] -= 1;
        return {
          letter: letter.letter,
          status: "INCLUDED",
        } as LetterGuess;
      }
      return {
        letter: letter.letter,
        status: "WRONG",
      } as LetterGuess;
    });

    wordleStore.guessesLeft -= 1;
    wordleStore.guesses = [...wordleStore.guesses, toDisplay];
    wordleStore.guessedLetters = new Set([
      ...wordleStore.guessedLetters,
      ...toDisplay,
    ]);
    if (word === wordleStore.targetWord) {
      wordleStore.status = "won";
      return;
    }

    if (wordleStore.guessesLeft === 0) {
      wordleStore.status = "lost";
      return;
    }

    inputText = "";
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (wordleStore.status !== "playing") {
      return;
    }
    if (event.key === "Backspace") {
      deleteCharacter();
      return;
    } else if (event.key === "Enter") {
      submitWord(inputText);
      return;
    } else if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
      addCharacter(event.key);
      return;
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });
</script>

{#await setup()}
  <div class="w-screen h-screen grid place-items-center">
    <div class="text-white">loading...</div>
  </div>
{:then}
  <div
    class="w-screen h-screen grid place-items-center"
    style={`opacity: ${$opacity}`}
  >
    {#if wordleStore.status === "won"}
      <div
        class="absolute w-full h-full flex items-center justify-center bg-green-600/80"
      >
        <div>
          <h2 class="text-4xl text-white font-bold">You win!</h2>
          <span>the word was:</span>
          <span class="text-2xl">{wordleStore.targetWord}</span>
        </div>
      </div>
    {/if}
    {#if wordleStore.status === "lost"}
      <div
        class="absolute w-full h-full flex items-center justify-center bg-red-600/80 text-white"
      >
        <div class="text-center">
          <h2 class="text-5xl font-bold mb-2">You lose!</h2>
          <p class="">The word was:</p>
          <p class="text-3xl mb-2">{wordleStore.targetWord}</p>
          <button
            class="px-4 py-2 bg-white text-red-800 rounded-full"
            on:click={reset}>Play Again</button
          >
        </div>
      </div>
    {/if}
    <div>
      <div class="text-white mb-12">
        <div class="text-center mb-12">
          <h1 class="text-6xl font-bold">Wordle</h1>
          <p>Guess the word!</p>
        </div>
        <div class="flex flex-col gap-4">
          {#each wordleStore.guesses as guess}
            <div class="flex gap-2 justify-center">
              {#each guess as letter, i}
                <Letter
                  index={i}
                  current={false}
                  letter={letter.letter}
                  status={letter.status}
                />
              {/each}
            </div>
          {/each}
          {#if wordleStore.guessesLeft > 0}
            <div id="current_row" class="flex gap-2 justify-center">
              {#each [0, 1, 2, 3, 4].map((ind) => inputText[ind]) as letter}
                <Letter
                  current={true}
                  letter={letter ?? null}
                  status={null}
                />
              {/each}
            </div>
            {#each [...Array(wordleStore.guessesLeft - 1)] as empty}
              <div class="flex gap-2 justify-center">
                {#each [...Array(5)] as emptyLetter}
                  <Letter current={false} letter={null} status={null} />
                {/each}
              </div>
            {/each}
          {/if}
        </div>
      </div>
      <Keyboard
        on:submitWord={() => {
          submitWord(inputText);
        }}
        guessedLetters={wordleStore.guessedLetters}
        {addCharacter}
        {deleteCharacter}
      />
    </div>
    {#if error}
      <Message text={error} />
    {/if}
  </div>
{/await}
