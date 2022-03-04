/* global PlugIn Version Perspective Project Alert */
(() => {
  const customCompleteLib = new PlugIn.Library(new Version('1.0'))

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
    const config = PlugIn.find('com.KaitlinSalzke.customComplete').library(
      'customCompleteConfig'
    )
    task.removeTags(config.tagsToRemove())
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
