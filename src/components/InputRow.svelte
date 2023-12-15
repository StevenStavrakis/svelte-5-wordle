<script lang="ts">
  import Letter from "./Letter.svelte";

  const { inputText } = $props<{
    inputText: string
  }>();
</script>

<div id="current_row" class="flex gap-2 justify-center">
  {#each [0, 1, 2, 3, 4].map((ind) => inputText[ind]) as letter}
    <Letter current={true} letter={letter ?? null} status={null} />
  {/each}
</div>
