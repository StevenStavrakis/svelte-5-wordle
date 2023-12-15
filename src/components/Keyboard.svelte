<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {gameState} from "./state.svelte"

  const dispatch = createEventDispatcher();
  const { addCharacter, deleteCharacter } = $props<{
    addCharacter: (char: string) => void;
    deleteCharacter: () => void;
  }>();

  let charMap = $derived((() => {
    const guesses = Array.from(gameState.guessedLetters);
    const charMap: { [key: string]: string } = {};
    for (const guess of guesses) {
      charMap[guess.letter] = guess.status;
    }
    return charMap;
  })())

  $inspect({charMap});
</script>

<div class="keyboard flex flex-col gap-2">
  {#each ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as letterRow, i}
    <div class="flex gap-2 justify-center">
      {#if i === 2} 
        <button
          class="bg-gray-500 text-white p-4 rounded-md min-w-[50px] uppercase"
            on:click={(event) => {
                (event.target as HTMLElement).blur();
              dispatch("submitWord");
                }}
        >
        enter
        </button>
      {/if}
      {#each letterRow.split("") as letter}
      {@const status = charMap[letter]}
      {@const disabled = status === "WRONG"}
        <button
          class="bg-gray-500 text-white p-4 rounded-md min-w-[50px] uppercase"
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
      {#if i === 2} 
        <button
          class="bg-gray-500 text-white p-4 rounded-md min-w-[50px] uppercase"
          on:click={(event) => {
                (event.target as HTMLElement).blur();
            deleteCharacter()
          }}
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
        </svg>
        </button>
      {/if}
    </div>
  {/each}
</div>
