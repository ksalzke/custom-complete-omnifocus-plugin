/* global PlugIn */
(() => {
  const action = new PlugIn.Action(async function (selection, sender) {
    const task = selection.tasks[0] || selection.projects[0].task

    const lib = await this.customCompleteLib.onComplete(task)
  })

  action.validate = function (selection, sender) {
    return selection.tasks.length === 1 || selection.projects.length === 1
  }

  return action
})()
