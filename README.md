# About

This is an Omni Automation plug-in bundle for OmniFocus that marks a task as complete and performs a series of customisable actions. Further details of the actions are provided below.

_Please note that all scripts on my GitHub account (or shared elsewhere) are works in progress. If you encounter any issues or have any suggestions please let me know--and do please make sure you backup your database before running scripts from a random amateur on the internet!)_

## Known issues 

None so far! 🤞

# Installation & Set-Up

**Important note: for this plug-in bundle to work correctly, my [Function Library for OmniFocus](https://github.com/ksalzke/function-library-for-omnifocus) is also required and needs to be added to the plug-in folder separately.**

1. Click on the green `Clone or download` button above to download a `.zip` file of all the files in this GitHub repository.
2. Unzip the downloaded file.
3. Open the configuration file located at `Resources/customCompleteConfig.js` and make any changes needed to reflect your OmniFocus set-up. Further explanations of the options are included within that file as comments.
4. Rename the entire folder to anything you like, with the extension `.omnifocusjs`
5. Move the resulting file to your OmniFocus plug-in library folder.

# Actions

This plug-in contains the following action:

## Custom Complete

This action runs the `customComplete` function (detailed below) on one selected task.

# Functions

This plugin contains the following function within the `customCompleteLib` library:

## customComplete

This function takes a single task object as input. It then:

1. Marks the task as completed.
2. If my [Dependency OmniFocus Plugin](https://github.com/ksalzke/dependency-omnifocus-plugin) is installed, runs the `checkDependantsForTaskAndAncestors` function on the task to check whether any dependent tasks should become available.
3. If my [Delegation OmniFocus Plugin](https://github.com/ksalzke/delegation-omnifocus-plugin) is installed, runs the `noteFollowUp` action. If the task being completed is a 'follow up' task, a note is added to the original task indicating that the task has been followed up at the current time and date.
4. Removes any unwanted tags (specified in `customCompleteConfig.js`) from the task. (This is predominantly intended for repeating tasks where certain tags are intended to be applied to the current instance only.)
5. If there are no remaining tasks in the project (and user is not in the Projects Perspective), and the project has not been completed automatically, prompts the user to confirm whether they would like to review the project or mark it complete.
6. Runs any other functions desired, with the selected task as the parameter. These functions can be specified as an array in the `customCompleteConfig.js` file. (For example, I have additional functions to create follow-up tasks that are specific to my set-up.)