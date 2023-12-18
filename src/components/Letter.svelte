<script lang="ts">
  import { animationFinished } from "./state/state.svelte";
  import { tweened } from "svelte/motion";
  const { letter, status, current, index } = $props<{
    letter: string | null;
    status: "CORRECT" | "INCLUDED" | "WRONG" | null;
    current: boolean;
    index?: number;
  }>();

  let isSubmitted = $state(false);

  const statusClass = $derived(
    (() => {
      if (!isSubmitted) {
        return "bg-gray-500";
      }
      switch (status) {
        case "CORRECT":
          return "bg-green-600";
        case "INCLUDED":
          return "bg-yellow-600";
        case "WRONG":
          return "bg-red-600";
        default:
          return "bg-gray-500";
      }
    })()
  );

  let scale = tweened(1, {
    duration: 75,
  });

  let xRot = tweened(0, {
    duration: 100,
  });

  $effect(() => {
    if (!letter) return;
    if (!current) return;

    scale.set(1.15).then(() => {
      scale.set(1);
    });
  });

  $effect(() => {
    if (!letter) return;
    if (index === null || index === undefined) return;
    setTimeout(() => {
      xRot.set(90).then(() => {
        isSubmitted = true;
        xRot.set(0).then(() => {
          animationFinished();
        });
      });
    }, index * 200);
  });
</script>

<div class="w-16 h-16" style:transform="scale({$scale}) rotateX({$xRot}deg)">
  {#if letter === null}
    <div
      class="aspect-square rounded-md w-full h-full flex items-center justify-center bg-gray-600/50"
    ></div>
  {:else}
    <div
      class={`aspect-square rounded-md w-full h-full flex items-center justify-center ${statusClass}`}
    >
      {letter}
    </div>
  {/if}
</div>
