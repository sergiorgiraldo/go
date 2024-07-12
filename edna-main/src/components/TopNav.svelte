<script>
  import { getScrollbarWidth } from "../util.js";
  import { dirtyState } from "../state.svelte.js";
  import { getModChar } from "../util.js";
  import { openCommandPalette, openNoteSelector } from "../globals.js";
  import IconCommandPalette from "./IconCommandPalette.svelte";
  import { fixUpShortcuts } from "../key-helper.js";

  /** @type {{ 
    noteName: string,
    shortcut: string,
  }} */
  let { noteName = "", shortcut = "" } = $props();

  let style = $state("");
  $effect(() => {
    let dx = getScrollbarWidth();
    style = `right: ${dx}px`;
  });
</script>

{#if !dirtyState.isDirtyFast}
  <div
    class="fixed top-0 text-sm flex items-center z-10 px-1 mt-[-1px] select-none dark:text-gray-300 border-gray-300 dark:border-gray-500 border-b border-l rounded-bl-lg bg-white dark:bg-gray-700"
    {style}
  >
    <button
      class="cursor-pointer pl-[6px] pr-[2px] py-[4px] hover:bg-gray-100 dark:hover:bg-gray-500"
      onclick={openNoteSelector}
      title={fixUpShortcuts("Open Another Note (Mod + P)")}
    >
      <span class="max-w-32 truncate">{noteName}</span> ⏷</button
    >
    {#if shortcut}
      <div
        class="text-gray-500 dark:text-gray-400 text-xs mx-0.5"
        title="This Note Quick Access Shortcut ({shortcut})"
      >
        {shortcut}
      </div>
    {/if}

    <button
      onclick={openCommandPalette}
      class="clickable-icon"
      title={fixUpShortcuts("Command Palette (Mod + Shift + P)")}
    >
      <IconCommandPalette></IconCommandPalette>
    </button>

    <a class="clickable" href="/help" title="Documentation" target="_blank">?</a
    >
  </div>
{/if}

<style>
  .clickable,
  .clickable-icon {
    @apply cursor-pointer px-[6px] py-[4px];

    &:hover {
      @apply bg-gray-100 dark:bg-gray-500;
    }
  }

  .clickable-icon {
    @apply px-[4px];
  }
</style>
