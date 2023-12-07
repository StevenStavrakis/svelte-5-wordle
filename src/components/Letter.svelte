<script lang="ts">
  export let letter: string | null;
  export let status: "CORRECT" | "INCLUDED" | "WRONG" | null;

  $: statusClass = (() => {
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
  })();
</script>

<div class="w-16 h-16"> 
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
