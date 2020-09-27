(() => {
  var customCompleteConfig = new PlugIn.Library(new Version("1.0"));

  customCompleteConfig.additionalFunctions = () => {
    // this is my setup for demo purposes only, but won't interfere with
    // your usage and can be left as is without causing issues
    personalConfigPlugin = PlugIn.find("com.KaitlinSalzke.config");
    if (personalConfigPlugin !== null) {
      return personalConfigPlugin
        .library("configLibrary")
        .customCompleteAdditionalFunctions();
    } else {
      // edit the return value below to configure the additional functions
      // that are run when a task is marked as complete
      // THIS SHOULD BE AN ARRAY OF FUNCTIONS
      return [];
    }
  };

  customCompleteConfig.tagsToRemove = () => {
    // tags to be removed when a task is completed
    // THIS SHOULD BE AN ARRAY OF TAG OBJECTS
    return tagNamed("Scheduled").flattenedTags;
  };

  return customCompleteConfig;
})();
