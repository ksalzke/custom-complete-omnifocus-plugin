# About

This is an Omni Automation plug-in bundle for OmniFocus that marks a task as complete and performs a series of customisable actions. Further details of the actions are provided below.

_Please note that all scripts on my GitHub account (or shared elsewhere) are works in progress. If you encounter any issues or have any suggestions please let me know--and do please make sure you backup your database before running scripts from the internet!)_

## Known issues 

Refer to ['issues'](https://github.com/ksalzke/custom-complete-omnifocus-plugin/issues) for known issues and planned changes/enhancements.

# Installation & Set-Up

1. Download the [latest release](https://github.com/ksalzke/move-to-action-group-omnifocus-plugin/releases/latest).
2. Unzip the downloaded file.
3. Open the configuration file located at `Resources/customCompleteConfig.js` (you can navigate to this by right clicking on the .omnifocusjs file and selecting 'Show Package Contents' and make any changes needed to reflect your OmniFocus set-up. Further explanations of the options are included within that file as comments.
4. Move the `.omnifocusjs` file to your OmniFocus plug-in library folder (or open it to install).

# Actions

This plug-in contains the following action:

## Custom Complete

This action runs the `onComplete` function on one selected task or project, using the other functions in the `customCompleteLib` (detailed below).

# Functions

This plugin contains the following functions within the `customCompleteLib` library:

## `onComplete (task: Task)`

Marks the given task as complete, and runs of the functions below (with the task as the only parameter).

## `checkDependendants (task: Task)`

If my [Dependency OmniFocus Plugin](https://github.com/ksalzke/dependency-omnifocus-plugin) is installed, this runs the `checkDependantsForTaskAndAncestors` function on the task to check whether any dependent tasks should become available.

## `noteFollowUp (task: Task)`

If my [Delegation OmniFocus Plugin](https://github.com/ksalzke/delegation-omnifocus-plugin) is installed, runs the `noteFollowUp` action. If the task being completed is a 'follow up' task, a note is added to the original task indicating that the task has been followed up at the current time and date.

## `removeUnwantedTags (task: Task)`

Removes any unwanted tags (specified in `customCompleteConfig.js`) from the task. (This is predominantly intended for repeating tasks where certain tags are intended to be applied to the current instance only.)

## `promptIfStalled` (task: Task)

If there are no remaining tasks in the project (and user is not in the Projects Perspective), and the project has not been completed automatically, prompts the user to confirm whether they would like to review the project or mark it complete.