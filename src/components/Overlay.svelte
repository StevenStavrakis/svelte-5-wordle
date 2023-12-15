<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    GameStateStatus,
    gameState,
    initializeGame,
  } from "./state.svelte.ts";

  const dynamicClasses = $derived(
    (() => {
      if (gameState.gameStatus === GameStateStatus.WON) {
        return "bg-green-600/80";
      }
      if (gameState.gameStatus === GameStateStatus.LOST) {
        return "bg-red-600/80 text-white";
      }
      return "";
    })()
  );

  let localTarget = $state();

  $effect(() => {
    if (gameState.gameStatus !== GameStateStatus.PLAYING) {
      localTarget = gameState.targetWord;
    }
  });
</script>

{#if gameState.gameStatus !== GameStateStatus.PLAYING}
  <div
    in:fade={{ delay: 3000, duration: 200 }}
    out:fade={{ delay: 0, duration: 200 }}
    class="absolute w-full h-full flex items-center justify-center {dynamicClasses} z-10"
  >
    {#if gameState.gameStatus === GameStateStatus.WON}
      <div class="justify-center text-center flex flex-col">
        <h2 class="text-4xl text-white font-bold">You win!</h2>
        <span>the word was:</span>
        <span class="text-2xl block">{localTarget}</span>
        <button
          class="px-4 py-2 bg-white text-black rounded-full"
          onclick={initializeGame}>Play Again</button
        >
      </div>
    {/if}
    {#if gameState.gameStatus === GameStateStatus.LOST}
      <div class="text-center">
        <h2 class="text-5xl font-bold mb-2">You lose!</h2>
        <p class="">The word was:</p>
        <p class="text-3xl mb-2">{localTarget}</p>
        <button
          class="px-4 py-2 bg-white text-red-800 rounded-full"
          onclick={initializeGame}>Play Again</button
        >
      </div>
    {/if}
  </div>
{/if}
