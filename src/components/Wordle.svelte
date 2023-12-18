<script lang="ts">
  import Keyboard from "./Keyboard.svelte";
  import Message from "./Message.svelte";
  import Overlay from "./Overlay.svelte";
  import {
    gameState,
    handleKeyPress,
    GameStateStatus,
    initializeGame,
    checkWin,
  } from "./state/state.svelte.ts";
  import Board from "./Board.svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  // on first load this will render twice because of the #key, but I don't think it's an issue

  const isLoading = $derived(
    (() => {
      return gameState.gameStatus === GameStateStatus.LOADING;
    })()
  );

  $effect(() => {
    if (gameState.gameStatus === GameStateStatus.SUBMITTED) {
      checkWin();
    }
  });

  onMount(() => {
    initializeGame();
  });
</script>

<svelte:window onkeydown={handleKeyPress} />
{#if isLoading}
  <div
    out:fade
    class="w-screen absolute z-10 h-screen grid place-items-center bg-[#13151a]"
  >
    <div class="text-white">loading...</div>
  </div>
{/if}
<div class="w-screen h-screen grid place-items-center">
  <Board />
  <Keyboard />
  {#if gameState.gameStatus === GameStateStatus.WON || gameState.gameStatus === GameStateStatus.LOST}
    <Overlay />
  {/if}
  {#if gameState.error}
    <Message text={gameState.error} />
  {/if}
</div>
