class DocDirtyState {
  isDirty = $state(false);
  isDirtyFast = $state(false);
}

export const dirtyState = new DocDirtyState();
