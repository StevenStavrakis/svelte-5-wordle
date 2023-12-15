<script lang="ts">
  import Letter from "./Letter.svelte";
  import type { LetterGuess } from "./wordleStore";

  const { guess } = $props<{
    guess: LetterGuess[];
  }>();
</script>

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
