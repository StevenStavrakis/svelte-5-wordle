<script lang="ts">
  import type { LetterGuess } from "./wordleStore";
  const { guessedLetters, addCharacter, deleteCharacter } = $props<{
    guessedLetters: Set<LetterGuess>;
    addCharacter: (char: string) => void;
    deleteCharacter: () => void;
  }>();
  let charMap = $derived((() => {
    const guesses = Array.from(guessedLetters);
    const charMap: { [key: string]: string } = {};
    for (const guess of guesses) {
      charMap[guess.letter] = guess.status;
    }
    return charMap;
  })())

  $inspect({charMap});
</script>

<div class="keyboard flex flex-col gap-2">
  {#each ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as letterRow}
    <div class="flex gap-2 justify-center">
      {#each letterRow.split("") as letter}
      {@const status = charMap[letter]}
      {@const disabled = status === "WRONG"}
        <button
          class="bg-gray-500 text-white p-4 rounded-md min-w-[50px] uppercase"
          disabled={disabled}
          class:opacity-40={disabled}
          class:bg-green-500={status === "CORRECT"}
          class:bg-yellow-500={status === "INCLUDED"}
            on:click={(event) => {
                (event.target as HTMLElement).blur();
                addCharacter(letter);
                }}
        >
          {letter}
        </button>
      {/each}
    </div>
  {/each}
</div>
