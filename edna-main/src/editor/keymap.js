import {
  addNewBlockAfterCurrent,
  addNewBlockAfterLast,
  addNewBlockBeforeCurrent,
  addNewBlockBeforeFirst,
  gotoNextBlock,
  gotoNextParagraph,
  gotoPreviousBlock,
  gotoPreviousParagraph,
  insertNewBlockAtCursor,
  moveLineDown,
  moveLineUp,
  newCursorAbove,
  newCursorBelow,
  selectAll,
  selectNextBlock,
  selectNextParagraph,
  selectPreviousBlock,
  selectPreviousParagraph,
} from "./block/commands.js";
import { copyCommand, cutCommand, pasteCommand } from "./copy-paste.js";
import {
  createScratchNote,
  openBlockSelector,
  openCommandPalette,
  smartRun,
  openHistorySelector,
  openLanguageSelector,
  openNoteSelector,
  openFunctionSelector,
} from "../globals.js";
import { formatBlockContent } from "./block/format-code.js";
import { indentLess, indentMore, redo } from "@codemirror/commands";

import { deleteLine } from "./block/delete-line.js";
import { keymap } from "@codemirror/view";
import { platform } from "../util.js";

export function keymapFromSpec(specs) {
  return keymap.of(
    specs.map((spec) => {
      if (spec.run) {
        if ("preventDefault" in spec) {
          return spec;
        } else {
          return { ...spec, preventDefault: true };
        }
      } else {
        const [key, run] = spec;
        return {
          key,
          run,
          preventDefault: true,
        };
      }
    }),
  );
}

/**
 * @param {import("./editor.js").EdnaEditor} editor
 */
export function ednaKeymap(editor) {
  let spec = [
    ["Mod-c", copyCommand(editor)],
    ["Mod-v", pasteCommand],
    ["Mod-x", cutCommand(editor)],
    ["Tab", indentMore],
    ["Shift-Tab", indentLess],
    ["Alt-n", createScratchNote],
    ["Alt-Shift-Enter", addNewBlockBeforeFirst],
    ["Mod-Shift-Enter", addNewBlockAfterLast],
    ["Alt-Enter", addNewBlockBeforeCurrent],
    ["Mod-Enter", addNewBlockAfterCurrent],
    ["Mod-Alt-Enter", insertNewBlockAtCursor],
    ["Mod-a", selectAll],
    ["Alt-ArrowUp", moveLineUp],
    ["Alt-ArrowDown", moveLineDown],
    ["Mod-l", openLanguageSelector],
    ["Mod-e", smartRun],
    [
      "Alt-Shift-r",
      () => {
        openFunctionSelector(false);
      },
    ],
    ["Mod-b", openBlockSelector],
    ["Mod-k", openNoteSelector],
    ["Alt-0", openNoteSelector],
    ["Mod-o", openNoteSelector],
    ["Mod-p", openNoteSelector],
    ["Mod-Shift-p", openCommandPalette],
    ["Mod-Shift-k", openCommandPalette],
    ["Mod-Shift-o", openCommandPalette],
    ["Mod-h", openHistorySelector],
    ["Alt-Shift-f", formatBlockContent],
    ["Mod-Alt-ArrowDown", newCursorBelow],
    ["Mod-Alt-ArrowUp", newCursorAbove],
    ["Mod-Shift-k", deleteLine],
    {
      key: "Mod-ArrowUp",
      run: gotoPreviousBlock,
      shift: selectPreviousBlock,
    },
    { key: "Mod-ArrowDown", run: gotoNextBlock, shift: selectNextBlock },
    {
      key: "Ctrl-ArrowUp",
      run: gotoPreviousParagraph,
      shift: selectPreviousParagraph,
    },
    {
      key: "Ctrl-ArrowDown",
      run: gotoNextParagraph,
      shift: selectNextParagraph,
    },
  ];
  // for some reason CodeMirror uses Ctrl + Y on Windows
  // and only binds Mod-Shift-z on Mac and Linux
  // Windows editors also use Ctrl-Shift-z
  if (platform.isWindows) {
    spec.push(["Mod-Shift-z", redo]);
  }
  return keymapFromSpec(spec);
}
