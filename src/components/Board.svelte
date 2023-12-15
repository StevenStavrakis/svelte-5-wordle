<script lang="ts">
  import Letter from "./Letter.svelte";
  import InputRow from "./InputRow.svelte";
  import { gameState } from "./state.svelte";
</script>

<div class="text-white mb-12">
  <div class="text-center mb-12">
    <h1 class="text-6xl font-bold">Wordle</h1>
    <p>Guess the word!</p>
  </div>
  <div class="flex flex-col gap-4">
    {#each gameState.guesses as guess}
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
    {#if gameState.guessesLeft > 0}
      <InputRow />
      {#each [...Array(gameState.guessesLeft - 1)] as empty}
        <div class="flex gap-2 justify-center">
          {#each [...Array(5)] as emptyLetter}
            <Letter current={false} letter={null} status={null} />
          {/each}
        </div>
      {/each}
    {/if}
  </div>
</div>
