<script>
  import { focus } from "../actions";
  import { getScrollbarWidth } from "../util.js";

  let searchTerm = $state("");

  let style = $state("");
  $effect(() => {
    let dx = getScrollbarWidth();
    style = `right: ${dx}px`;
  });

  $effect(() => {
    console.log("searchTerm:", searchTerm);
  });
</script>

<div
  class="fixed top-[34px] z-10 pl-2 py-0.5 bg-white flex border text-xs border-gray-400 rounded"
  {style}
>
  <input type="text" bind:value={searchTerm} class="w-[24ch]" use:focus />
  <button>n</button>
  <button>p</button>
</div>

<style>
  input {
    @apply border-none outline-none;
  }
  button {
    @apply px-[6px] py-[2px];
    @apply hover:bg-gray-200;
  }
</style>
