<script lang="ts">
  import Wordle from "./Wordle.svelte";
  import { getRandomWord } from "./wordleStore";
</script>

{#await getRandomWord() then word}
  <Wordle word={word} />
{:catch error}
  <p>{error}</p>
{/await}
