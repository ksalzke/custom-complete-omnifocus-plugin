/* global PlugIn Version Perspective Project Alert */
(() => {
  const customCompleteLib = new PlugIn.Library(new Version('1.0'))

  customCompleteLib.customComplete = (task, functions) => functions.forEach(func => func(task))

  customCompleteLib.completeTask = task => task.markComplete()

  customCompleteLib.checkDependants = task => {
    // run 'complete prerequisite' action to check task and ancestors (if 'dependency' plugin installed)
    const dependencyPlugin = PlugIn.find('com.KaitlinSalzke.DependencyForOmniFocus')
    if (dependencyPlugin !== null) {
      dependencyPlugin
        .library('dependencyLibrary')
        .checkDependantsForTaskAndAncestors(task)
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
    const config = PlugIn.find('com.KaitlinSalzke.customComplete').library(
      'customCompleteConfig'
    )
    task.removeTags(config.tagsToRemove())
  }

  customCompleteLib.promptIfStalled = task => {
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
      const alert = new Alert(
        'Project Stalled',
        'There are no further actions in this project. Do you want to review it now?'
      )
      alert.addOption('Yes')
      alert.addOption('Mark Complete')
      alert.addOption('No')
      alert.show((result) => {
        if (result === 0) {
          const urlStr = 'omnifocus:///task/' + task.containingProject.id.primaryKey
          URL.fromString(urlStr).call(() => {})
        } else if (result === 1) {
          task.containingProject.task.markComplete()
        }
      })
    }
  }

  return customCompleteLib
})()
