<script>
  import {
    getLatestNoteNames,
    isSystemNoteName,
    kScratchNoteName,
    sanitizeNoteName,
  } from "../notes";
  import { findMatchingItems, getAltChar, isAltNumEvent, len } from "../util";
  import { focus } from "../actions";
  import ListBox2 from "./ListBox2.svelte";
  import { reassignNoteShortcut, toggleNoteStarred } from "../metadata";
  import { buildItems } from "./NoteSelector.svelte";
  import IconStar from "./IconStar.svelte";

  /** @type {{
    openNote: (name: string) => void,
    createNote: (name: string) => void,
    deleteNote: (name: string) => void,
    switchToCommandPalette: () => void,
}}*/
  let { openNote, createNote, deleteNote, switchToCommandPalette } = $props();

  let noteNames = getLatestNoteNames();
  let items = $state(buildItems(noteNames));
  let filter = $state("");
  let altChar = getAltChar();

  let sanitizedFilter = $derived.by(() => {
    return sanitizeNoteName(filter);
  });

  let itemsFiltered = $derived.by(() => {
    // we split the search term by space, the name of the note
    // must match all parts
    if (sanitizedFilter.startsWith(">")) {
      switchToCommandPalette();
      return [];
    }
    return findMatchingItems(items, sanitizedFilter, "nameLC");
  });

  /** @type {Item} */
  let selectedItem = $state(null);
  let selectedName = $state("");
  let canOpenSelected = $state(false);
  let canCreate = $state(false);
  let canCreateWithEnter = $state(false);
  let canDeleteSelected = $state(false);
  let showDelete = $state(false);

  let itemsCountMsg = $derived.by(() => {
    // $state(`${noteCount} notes`);
    let n = len(itemsFiltered);
    if (n === 0) {
      return ""; // don't obscure user entering new, long note name
    }
    let nItems = len(items);
    if (n === nItems) {
      return `${nItems} notes`;
    }
    return `${n} of ${nItems} notes`;
  });

  function selectionChanged(item, idx) {
    // console.log("selectionChanged:", item, idx);
    selectedItem = item;
    selectedName = item ? selectedItem.name : "";
    canOpenSelected = !!selectedItem;

    // TODO: use lowerCase name?
    let name = sanitizeNoteName(filter);
    canCreate = len(name) > 0;
    for (let i of itemsFiltered) {
      if (i.name === name) {
        canCreate = false;
        break;
      }
    }

    canCreateWithEnter = !canOpenSelected;
    // if there are no matches for the filter, we can create with just Enter
    // otherwise we need Ctrl + Enter
    if (name.length === 0) {
      canCreateWithEnter = false;
    }

    canDeleteSelected = false;
    if (item && canOpenSelected) {
      if (item.name !== kScratchNoteName && !isSystemNoteName(item.name)) {
        // can't delete scratch note or system notes
        canDeleteSelected = true;
      }
    }

    showDelete = canOpenSelected;
  }

  /** @typedef {import("./NoteSelector.svelte").Item} Item */

  /**
   * @param {Item} note
   * @returns {string}
   */
  function isSysNote(note) {
    return isSystemNoteName(note.name) ? "italic" : "";
  }

  /**
   * @param {KeyboardEvent} ev
   * @returns {boolean}
   */
  function isCtrlDelete(ev) {
    return (ev.key === "Delete" || ev.key === "Backspace") && ev.ctrlKey;
  }

  /**
   * @param {Item} note
   * @returns {string}
   */
  function noteShortcut(note) {
    if (note.altShortcut) {
      console.log("noteShortctu:", note);
      return `${altChar} + ${note.altShortcut}`;
    }
    return "";
  }

  /**
   * @param {KeyboardEvent} ev
   */
  function onKeydown(ev) {
    // console.log("onKeyDown:", event);
    let altN = isAltNumEvent(ev);
    if (altN !== null) {
      ev.preventDefault();
      let note = selectedItem;
      if (note) {
        reassignNoteShortcut(note.name, altN).then(() => {
          let noteNames = getLatestNoteNames();
          items = buildItems(noteNames);
        });
        return;
      }
    }
    let key = ev.key;

    if (key === "s" && ev.altKey && selectedItem) {
      toggleStarred(selectedItem);
      ev.preventDefault();
      return;
    }

    if (key === "Enter") {
      ev.preventDefault();
      let name = sanitizedFilter;
      if (canCreateWithEnter) {
        emitCreateNote(name);
        return;
      }
      if (ev.ctrlKey && canCreate) {
        emitCreateNote(sanitizedFilter);
        return;
      }
      if (selectedItem) {
        emitOpenNote(selectedItem);
      }
    } else if (isCtrlDelete(ev)) {
      ev.preventDefault();
      if (!canDeleteSelected) {
        return;
      }
      if (selectedItem) {
        emitDeleteNote(selectedItem.name);
      }
      return;
    }

    // console.log("listbox:", listbox);
    let allowLeftRight = filter === "" || isCursorAtEnd(input);
    listbox.onkeydown(ev, allowLeftRight);
  }

  function isCursorAtEnd(input) {
    const cursorPosition = input.selectionStart;
    const inputLength = input.value.length;
    return cursorPosition === inputLength;
  }

  /**
   * @param {Item} item
   */
  function emitOpenNote(item) {
    // console.log("emitOpenNote", item);
    openNote(item.name);
  }

  function emitCreateNote(name) {
    // log("create note", name);
    createNote(name);
  }

  /**
   * @param {string} name
   */
  function emitDeleteNote(name) {
    // console.log("deleteNote", name);
    deleteNote(name);
  }

  /**
   * @param {Item} item
   */
  async function toggleStarred(item) {
    // there's a noticeable UI lag when we do the obvious:
    // item.isStarred = toggleNoteStarred(item.name);
    // because we wait until metadata file is saved
    // this version makes an optimistic change to reflect in UI
    // and, just to be extra sure, reflects the state after saving
    item.isStarred = !item.isStarred;
    toggleNoteStarred(item.name).then((isStarred) => {
      // not really necessary, should be in-sync
      item.isStarred = isStarred;
    });
    input.focus();
  }

  let input;
  let listbox;
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<form
  onkeydown={onKeydown}
  tabindex="-1"
  class="selector z-20 absolute center-x-with-translate top-[2rem] flex flex-col max-h-[90vh] w-[95vw] p-2"
>
  <div>
    <input
      bind:this={input}
      bind:value={filter}
      use:focus
      type="text"
      class="py-1 px-2 bg-white w-full mb-2 rounded-sm"
    />
    <div class="absolute right-[1rem] top-[0.75rem] italic text-gray-400">
      {itemsCountMsg}
    </div>
  </div>
  <ListBox2
    bind:this={listbox}
    items={itemsFiltered}
    {selectionChanged}
    onclick={(item) => emitOpenNote(item)}
  >
    {#snippet renderItem(item)}
      {#if item.isStarred}
        <IconStar class="inline-block mt-[-3px]" fill="yellow"></IconStar>
      {/if}
      {item.name}
      <span class="ml-0.5 text-xs text-gray-400 whitespace-nowrap"
        >{noteShortcut(item)}</span
      >
    {/snippet}
  </ListBox2>
  <div
    class="flex flex-row items-baseline justify-between mt-2 text-gray-700 text-xs max-w-full dark:text-white dark:text-opacity-50 bg-gray-100 rounded-lg py-1 px-2"
  >
    {#if canOpenSelected}
      <div class="flex items-baseline">
        <div class="kbd">Enter</div>
        <div class="ml-2 mr-2">open</div>
      </div>
      <div class="text-gray-400">&bull;</div>
    {/if}

    {#if canCreate}
      <div class="flex items-baseline">
        {#if canCreateWithEnter}
          <div class="kbd">Enter</div>
        {/if}
        {#if canCreate && !canCreateWithEnter}
          <div class="kbd">Ctrl + Enter</div>
        {/if}
        {#if canCreate}
          <div class="ml-2">
            create <span class="font-bold truncate">
              {filter}
            </span>
          </div>
        {/if}
      </div>
      {#if !canCreateWithEnter}
        <div class="text-gray-400">&bull;</div>
      {/if}
    {/if}

    {#if showDelete}
      <div class="flex items-baseline">
        <div class="kbd">Ctrl + Delete</div>
        {#if canDeleteSelected}
          <div class="ml-2 red">delete</div>
        {:else}
          <div class="ml-2 red">
            can't delete <span class="font-bold truncate">{selectedName}</span>
          </div>
        {/if}
      </div>
    {/if}

    {#if canOpenSelected}
      <div class="text-gray-400">&bull;</div>
      <div class="flex items-baseline">
        <div class="kbd">{altChar} 1...9</div>
        <div class="ml-2">assign quick access shortcut</div>
      </div>

      <div class="text-gray-400">&bull;</div>
      <div class="flex items-baseline">
        <div class="kbd">{altChar} + S</div>
        <div class="ml-2">toggle favorite</div>
      </div>
    {/if}

    <div class="text-gray-400">&bull;</div>
    <div class="flex items-baseline">
      <div class="kbd">Esc</div>
      <div class="ml-2">dismiss</div>
    </div>
  </div>
</form>
