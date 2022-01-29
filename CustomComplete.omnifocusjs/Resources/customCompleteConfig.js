/* global PlugIn Version tagsMatching */
(() => {
  const customCompleteConfig = new PlugIn.Library(new Version('1.0'))

  customCompleteConfig.tagsToRemove = () => {
    // tags to be removed when a task is completed
    // THIS SHOULD BE AN ARRAY OF TAG OBJECTS
    return [tagsMatching('Due Today')[0]]
  }

  return customCompleteConfig
})()
