var _ = (function() {
  var customCompleteConfig = new PlugIn.Library(new Version("1.0"));

  // additional items to run on complete
  customCompleteConfig.additionalFunctions = function() {
    personalConfigPlugin = PlugIn.find("com.KaitlinSalzke.config");
    if (personalConfigPlugin !== null) {
      return personalConfigPlugin
        .library("configLibrary")
        .customCompleteAdditionalFunctions();
    } else {
      return [];
    }
  };

  return customCompleteConfig;
})();
_;
