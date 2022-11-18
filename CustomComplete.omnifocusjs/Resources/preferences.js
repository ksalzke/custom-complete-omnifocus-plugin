/* global PlugIn Form flattenedTags */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const syncedPrefs = this.customCompleteLib.loadSyncedPrefs()

    // get current preferences or set defaults if they don't yet exist
    const tagsToRemove = this.customCompleteLib.tagsToRemove()
    const selectNextNode = this.customCompleteLib.selectNextNodePref()

    // create and show form
    const form = new Form()
    form.addField(new Form.Field.Checkbox('selectNextNode', 'Select next task when completing', selectNextNode))
    form.addField(new Form.Field.MultipleOptions('tagsToRemove', 'Tag(s) to remove when a task is completed', flattenedTags, flattenedTags.map(t => t.name), tagsToRemove))
    await form.show('Preferences: Custom Complete', 'OK')

    // save preferences
    syncedPrefs.write('selectNextNode', form.values.selectNextNode)
    syncedPrefs.write('tagsToRemoveIDs', form.values.tagsToRemove.map(tag => tag.id.primaryKey))
  })

  action.validate = function (selection, sender) {
    return true
  }

  return action
})()
