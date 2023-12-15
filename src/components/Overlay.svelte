<script lang="ts">
  import { fade } from "svelte/transition";

  const { gameStatus, targetWord, reset } = $props<{
    gameStatus: "playing" | "won" | "lost";
    targetWord: string;
    reset: () => void;
  }>();

  const dynamicClasses = $derived(
    (() => {
      if (gameStatus === "won") {
        return "bg-green-600/80";
      }
      if (gameStatus === "lost") {
        return "bg-red-600/80 text-white";
      }
      return "";
    })()
  );

  let localTarget = $state();

  $effect(() => {
    if (gameStatus !== "playing") {
        localTarget = targetWord
    }
  })
</script>

{#if gameStatus !== "playing"}
  <div
    transition:fade={{ delay: 0, duration: 200 }}
    class="absolute w-full h-full flex items-center justify-center {dynamicClasses} z-10"
  >
    {#if gameStatus === "won"}
      <div class="justify-center text-center flex flex-col">
        <h2 class="text-4xl text-white font-bold">You win!</h2>
        <span>the word was:</span>
        <span class="text-2xl block">{localTarget}</span>
        <button
          class="px-4 py-2 bg-white text-black rounded-full"
          on:click={reset}>Play Again</button
        >
      </div>
    {/if}
    {#if gameStatus === "lost"}
      <div class="text-center">
        <h2 class="text-5xl font-bold mb-2">You lose!</h2>
        <p class="">The word was:</p>
        <p class="text-3xl mb-2">{localTarget}</p>
        <button
          class="px-4 py-2 bg-white text-red-800 rounded-full"
          on:click={reset}>Play Again</button
        >
      </div>
    {/if}
  </div>
{/if}
