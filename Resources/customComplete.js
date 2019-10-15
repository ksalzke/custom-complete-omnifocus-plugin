var _ = (function() {
  var action = new PlugIn.Action(function(selection, sender) {
    task = selection.tasks[0] || selection.projects[0].task;

    this.customCompleteLib.customComplete(task);
  });

  action.validate = function(selection, sender) {
    return selection.tasks.length === 1 || selection.projects.length === 1;
  };

  return action;
})();
_;
