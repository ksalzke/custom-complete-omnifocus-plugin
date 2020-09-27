(() => {
  var customCompleteLib = new PlugIn.Library(new Version("1.0"));

  customCompleteLib.customComplete = (task) => {
    additionalFunctions = PlugIn.find("com.KaitlinSalzke.customComplete")
      .library("customCompleteConfig")
      .additionalFunctions();

    functionLibrary = PlugIn.find("com.KaitlinSalzke.functionLibrary").library(
      "functionLibrary"
    );

    task.markComplete();

    // run 'complete prerequisite' action to check task and ancestors (if 'dependency' plugin installed)
    dependencyPlugin = PlugIn.find("com.KaitlinSalzke.DependencyForOmniFocus");
    if (dependencyPlugin !== null) {
      dependencyPlugin
        .library("dependencyLibrary")
        .checkDependantsForTaskAndAncestors(task);
    }

    // note details of follow-up if this is a follow up task (if 'delegation' plugin installed)
    delegationPlugin = PlugIn.find("com.KaitlinSalzke.Delegation");
    if (delegationPlugin !== null) {
      delegationPlugin.library("delegationLib").noteFollowUp(task);
    }

    // if no remaining tasks in project
    if (
      document.windows[0].perspective !== Perspective.BuiltIn.Projects &&
      task.containingProject !== null &&
      task.containingProject.status !== Project.Status.Done &&
      functionLibrary.isStalled(task.containingProject)
    ) {
      alert = new Alert(
        "Project Stalled",
        "There are no further actions in this project. Do you want to review it now?"
      );
      alert.addOption("Yes");
      alert.addOption("Mark Complete");
      alert.addOption("No");
      alert.show((result) => {
        if (result == 0) {
          urlStr = "omnifocus:///task/" + task.containingProject.id.primaryKey;
          URL.fromString(urlStr).call(() => {});
        } else if (result == 1) {
          task.containingProject.task.markComplete();
        }
      });
    }

    // run any other actions desired
    additionalFunctions.forEach(function (func) {
      func(task);
    });
  };

  return customCompleteLib;
})();
