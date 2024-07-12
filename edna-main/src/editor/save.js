import { ViewPlugin } from "@codemirror/view";
import debounce from "debounce";
import { dirtyState } from "../state.svelte";

export const autoSaveContent = (saveFunction, interval) => {
  const debouncedSave = debounce((view) => {
    //console.log("saving buffer")
    saveFunction(view.state.sliceDoc());
    dirtyState.isDirty = false;
  }, interval);

  const debouncedClearDirtyFast = debounce(() => {
    dirtyState.isDirtyFast = false;
  }, 500);

  return ViewPlugin.fromClass(
    class {
      update(update) {
        if (update.docChanged) {
          dirtyState.isDirty = true;
          dirtyState.isDirtyFast = true;
          debouncedSave(update.view);
          debouncedClearDirtyFast();
        }
      }
    },
  );
};
