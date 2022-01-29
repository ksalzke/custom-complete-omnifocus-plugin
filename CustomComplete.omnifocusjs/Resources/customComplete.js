/* global PlugIn */
(() => {
  const action = new PlugIn.Action(function (selection, sender) {
    const task = selection.tasks[0] || selection.projects[0].task

    const lib = this.customCompleteLib

    lib.customComplete(task,
      [lib.completeTask,
        lib.checkDependants,
        lib.noteFollowUp,
        lib.removeUnwantedTags,
        lib.promptIfStalled])
  })

  action.validate = function (selection, sender) {
    return selection.tasks.length === 1 || selection.projects.length === 1
  }

  return action
})()
