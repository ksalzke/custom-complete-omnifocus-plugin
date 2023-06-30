/* global PlugIn Version Perspective Project Alert */
(() => {
  const customCompleteLib = new PlugIn.Library(new Version('1.0'))

  customCompleteLib.loadSyncedPrefs = () => {
    const syncedPrefsPlugin = PlugIn.find('com.KaitlinSalzke.SyncedPrefLibrary')

    if (syncedPrefsPlugin !== null) {
      const SyncedPref = syncedPrefsPlugin.library('syncedPrefLibrary').SyncedPref
      return new SyncedPref('com.KaitlinSalzke.customComplete')
    } else {
      const alert = new Alert(
        'Synced Preferences Library Required',
        'For the Custom Complete plug-in to work correctly, the \'Synced Preferences for OmniFocus\' plug-in (https://github.com/ksalzke/synced-preferences-for-omnifocus) is also required and needs to be added to the plug-in folder separately. Either you do not currently have this plugin installed, or it is not installed correctly.'
      )
      alert.show()
    }
  }

  customCompleteLib.tagsToRemove = () => {
    const preferences = customCompleteLib.loadSyncedPrefs()
    const tagsToRemoveIDs = preferences.read('tagsToRemoveIDs') || []

    return tagsToRemoveIDs.map(id => Tag.byIdentifier(id)).filter(tag => tag !== null)
  }

  customCompleteLib.selectNextNodePref = () => {
    const preferences = customCompleteLib.loadSyncedPrefs()
    const selectNextNodePref = preferences.read('selectNextNode') || false
    console.log(selectNextNodePref ? 'true' : 'false')
    return selectNextNodePref
  }

  customCompleteLib.onComplete = async (task) => {

    const lib = customCompleteLib
    await lib.selectNextNode(task)
    task.markComplete()
    await lib.unschedule(task)
    await lib.checkDependants(task)
    lib.noteFollowUp(task)
    lib.removeUnwantedTags(task)
    lib.removeDueSoonTag(task)
    await lib.checkWorkOnTask(task)
    await lib.promptIfStalled(task)

  }

  customCompleteLib.selectNextNode = async (task) => {
    // don't continue if preference is no
    const selectNextNodePref = customCompleteLib.selectNextNodePref()
    if (selectNextNodePref === false) return

    const contentTree = document.windows[0].content

    // only continue if single node selected
    console.log(contentTree.selectedNodes.length)
    if (contentTree.selectedNodes.length !== 1) return 

    // get currently selected note
    const selectedNode = contentTree.nodeForObject(task)

    // don't continue if node is last task
    if (selectedNode.index + 1 === selectedNode.parent.childCount) return

    // select next node
    contentTree.select([selectedNode.parent.childAtIndex(selectedNode.index + 1)], false)
  }

  customCompleteLib.unschedule = async (task) => {
    // don't continue if not repeating task
    if (task.repetitionRule === null) return
    const absoluteNotifications = task.notifications.filter(notification => notification.kind === Task.Notification.Kind.Absolute)
    for (notification of absoluteNotifications) task.removeNotification(notification)
  }

  customCompleteLib.checkDependants = async task => {
    // update dependencies (if 'dependency' plugin installed)
    const dependencyPlugin = PlugIn.find('com.KaitlinSalzke.DependencyForOmniFocus')
    if (dependencyPlugin !== null) {
      await dependencyPlugin.library('dependencyLibrary').updateDependencies()
    }
  }

  customCompleteLib.noteFollowUp = task => {
  // note details of follow-up if this is a follow up task (if 'delegation' plugin installed)
    const delegationPlugin = PlugIn.find('com.KaitlinSalzke.Delegation')
    if (delegationPlugin !== null) {
      delegationPlugin.library('delegationLib').noteFollowUp(task)
    }
  }

  customCompleteLib.removeUnwantedTags = task => {
    const tagsToRemove = customCompleteLib.tagsToRemove()
    task.removeTags(tagsToRemove)
  }

  customCompleteLib.removeDueSoonTag = task => {
    const plugin = PlugIn.find('com.KaitlinSalzke.TagTasksDueToday')
    if (plugin !== null) plugin.library('tagDueTasksLib').onComplete(task)
  }

  customCompleteLib.checkWorkOnTask = async task => {
    const plugin = PlugIn.find('com.KaitlinSalzke.WorkOn')
    if (plugin !== null) await plugin.library('workOnLib').onComplete(task)
  }

  customCompleteLib.promptIfStalled = async task => {

    // don't show prompt if already in Projects perspective
    if (document.windows[0].perspective === Perspective.BuiltIn.Projects) return

    // don't show prompt if task has no parent
    if (task.parent === null) return

    // don't show prompt if parent is SAL
    if (task.parent.project !== null && task.parent.project.containsSingletonActions) return

    // don't show prompt if there are remaining tasks
    const remainingChildren = task.parent.children.filter(child => child.taskStatus !== Task.Status.Completed && child.taskStatus !== Task.Status.Dropped)
    if (remainingChildren.length > 0) return

    // if parent already completed, check its parent
    if (task.parent.taskStatus === Task.Status.Completed) {
      await customCompleteLib.promptIfStalled(task.parent)
      return // don't proceed - no prompt required for this task (it's already completed)
    }

    // if parent is stalled, show prompt
    const form = new Form()

    form.addField(new Form.Field.Option('action', 'Do you want to review it now?', ['Yes', 'Mark complete', 'No'], null, 'Yes'))

    await form.show(`Stalled: ${task.parent.name}\nThere are no further actions.`, 'OK')

    switch (form.values.action) {
      case 'Yes':
        const urlStr = 'omnifocus:///task/' + task.parent.id.primaryKey
        URL.fromString(urlStr).open()
        break
      case 'Mark complete':
        task.parent.markComplete()
        await customCompleteLib.promptIfStalled(task.parent) // after marking complete, check if parent's parent is stalled
        break
      default:
        break
      }
  }

  return customCompleteLib
})()
