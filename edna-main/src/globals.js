/** @typedef {{
  openSettings: () => void,
  openLanguageSelector: () => void,
  openCreateNewNote: () => void,
  openNoteSelector: () => void,
  openCommandPalette: () => void,
  openHistorySelector: () => void,
  createScratchNote: () => void,
  openBlockSelector: () => void,
  openFunctionSelector: (boolean) => void,
  smartRun: () => void,
  getPassword: (msg: string) => Promise<string>,
}} GlobalFuncs
*/

import { formatDurationShort } from "./util";

// it's easier to make some functions from App.vue available this way
// then elaborate scheme of throwing and catching events
// could also use setContext()
/** @type {GlobalFuncs} */
let globalFunctions;

/**
 * @param {GlobalFuncs} gf
 */
export function setGlobalFuncs(gf) {
  globalFunctions = gf;
}

export function openSettings() {
  globalFunctions.openSettings();
}

export function openLanguageSelector() {
  globalFunctions.openLanguageSelector();
}

export function openCreateNewNote() {
  globalFunctions.openCreateNewNote();
}

export function openNoteSelector() {
  globalFunctions.openNoteSelector();
}

export function openCommandPalette() {
  globalFunctions.openCommandPalette();
}

export function openHistorySelector() {
  globalFunctions.openHistorySelector();
}

export function createScratchNote() {
  globalFunctions.createScratchNote();
}

export function openBlockSelector() {
  globalFunctions.openBlockSelector();
}

export function openFunctionSelector(onSelection = false) {
  globalFunctions.openFunctionSelector(onSelection);
}

export function smartRun() {
  globalFunctions.smartRun();
}

/**
 * @param {string} msg
 * @returns {Promise<string>}
 */
export async function getPasswordFromUser(msg) {
  let pwd = await globalFunctions.getPassword(msg);
  console.log("got password:", pwd);
  return pwd;
}

let sessionStart = performance.now();
/**
 * @returns {string}
 */
export function getSessionDur() {
  let durMs = Math.round(performance.now() - sessionStart);
  return formatDurationShort(durMs);
}
