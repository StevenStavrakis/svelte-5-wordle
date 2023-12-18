<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    GameStateStatus,
    gameState,
    initializeGame,
  } from "./state/state.svelte.ts";

  const outcome = $derived((() => {
      if (gameState.gameStatus === GameStateStatus.WON) {
        return "won";
      }
      if (gameState.gameStatus === GameStateStatus.LOST) {
        return "lost";
      }
  })())

  const dynamicClasses = $derived(
    (() => {
      if (outcome === "won") {
        return "bg-green-600/80";
      }
      if (outcome === "lost") {
        return "bg-red-600/80 text-white";
      }
      return "";
    })()
  );

  const target = gameState.targetWord;
</script>
{#snippet content({outcome, word})}
    <div class="justify-center text-center flex flex-col">
      <h2 class="text-4xl font-bold mb-12">You {outcome}!</h2>
      <span>the word was:</span>
      <span class="text-4xl block mb-12">{word}</span>
      <button
        class="px-4 py-2 bg-white text-black rounded-full"
        onclick={initializeGame}>Play Again</button
      >
    </div>
{/snippet}

<div
  in:fade={{ delay: 100, duration: 300 }}
  out:fade={{ delay: 0, duration: 200 }}
  class="absolute w-full h-full flex items-center justify-center text-white {dynamicClasses} z-10"
>
{@render content({
  outcome,
  word: target
})}
</div>
