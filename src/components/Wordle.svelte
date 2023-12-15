<script lang="ts">
  import Keyboard from "./Keyboard.svelte";
  import { onMount } from "svelte";
  import Message from "./Message.svelte";
  import Overlay from "./Overlay.svelte";
  import {
    gameState,
    addCharacter,
    deleteCharacter,
    processGuess,
    GameStateStatus,
    initializeGame,
  } from "./state.svelte.ts";
  import Board from "./Board.svelte";

  const isLoading = $derived(
    (() => {
      if (gameState.gameStatus === GameStateStatus.LOADING) {
        return true;
      }
      return false;
    })()
  );
  const handleKeyPress = (event: KeyboardEvent) => {
    if (gameState.gameStatus !== GameStateStatus.PLAYING) {
      return;
    }
    if (event.key === "Backspace") {
      deleteCharacter();
      return;
    } else if (event.key === "Enter") {
      processGuess(gameState.inputText);
      return;
    } else if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
      addCharacter(event.key);
      return;
    }
  };

  onMount(() => {
    initializeGame();
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  $inspect(isLoading);
</script>

{#key isLoading}
  {#if isLoading}
    <div class="w-screen h-screen grid place-items-center">
      <div class="text-white">loading...</div>
    </div>
  {:else}
    <div class="w-screen h-screen grid place-items-center">
      <Overlay />
      <Board />
      <Keyboard
        on:submitWord={() => {
          processGuess(gameState.inputText);
        }}
        {addCharacter}
        {deleteCharacter}
      />
      {#if gameState.error}
        <Message text={gameState.error} />
      {/if}
    </div>
  {/if}
{/key}
