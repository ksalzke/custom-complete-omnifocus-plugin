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

  customCompleteLib.onComplete = async (task) => {
    const lib = customCompleteLib
    task.markComplete()
    await lib.checkDependants(task)
    lib.noteFollowUp(task)
    lib.removeUnwantedTags(task)
    await lib.promptIfStalled(task)
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

  customCompleteLib.promptIfStalled = async task => {
    const functionLibrary = PlugIn.find('com.KaitlinSalzke.functionLibrary').library(
      'functionLibrary'
    )

    // if no remaining tasks in project
    if (
      document.windows[0].perspective !== Perspective.BuiltIn.Projects &&
      task.containingProject !== null &&
      task.containingProject.status !== Project.Status.Done &&
      functionLibrary.isStalled(task.containingProject)
    ) {
      const form = new Form()

      form.addField(new Form.Field.Option('action', 'Do you want to review it now?', ['Yes', 'Mark complete', 'No'], null, 'Yes'))

      await form.show(`Project Stalled: ${task.containingProject.name}\nThere are no further actions in this project.`, 'OK')

      switch (form.values.action) {
        case 'Yes':
          const urlStr = 'omnifocus:///task/' + task.containingProject.id.primaryKey
          URL.fromString(urlStr).open()
          break
        case 'Mark complete':
          task.containingProject.task.markComplete()
          break
        default:
          break
      }
    }
  }

  return customCompleteLib
})()
