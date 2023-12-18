<script lang="ts">
  import Letter from "./Letter.svelte";
  import { gameState } from "./state/state.svelte";
</script>

<div id="current_row" class="flex gap-2 justify-center">
  {#each [0, 1, 2, 3, 4].map((ind) => gameState.inputText[ind]) as letter}
    <Letter current={true} letter={letter ?? null} status={null} />
  {/each}
</div>
