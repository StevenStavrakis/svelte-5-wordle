<script lang="ts">
  import { tweened } from "svelte/motion";
  import { gameState } from "./state/state.svelte";
  import { untrack } from "svelte";
  const { text } = $props<{ text: string }>();

  let display = $state(false);

  let xPos = tweened(0, {
    duration: 150,
  });

  let opacity = tweened(1, {
    delay: 1000,
  });
  $effect(() => {
    if (text.length >= 0) {
      display = true;
      xPos.set(-10).then(() => {
        xPos.set(10).then(() => {
          xPos.set(-10).then(() => {
            xPos.set(0).then(() => {
              opacity.set(0).then(() => {
                display = false;
                untrack(() => {
                  gameState.error = "";
                });
              });
            });
          });
        });
      });
    }
  });
</script>

{#if display}
  <div class="absolute left-1/2 -translate-x-1/2">
    <div
      class="p-6 bg-white text-black"
      style={`transform: translateX(${$xPos}px); opacity: ${$opacity}`}
    >
      <span>{text}</span>
    </div>
  </div>
{/if}
