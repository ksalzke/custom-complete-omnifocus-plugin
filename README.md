# About

This is an Omni Automation plug-in bundle for OmniFocus that marks a task as complete and performs a series of customisable actions.

_Please note that all scripts on my GitHub account (or shared elsewhere) are works in progress. If you encounter any issues or have any suggestions please let me know--and do please make sure you backup your database before running scripts from the internet!)_

## Known issues 

Refer to ['issues'](https://github.com/ksalzke/custom-complete-omnifocus-plugin/issues) for known issues and planned changes/enhancements.

# Installation & Set-Up

## Synced Preferences Plug-In

**Important note: for this plug-in bundle to work correctly, my [Synced Preferences for OmniFocus plug-in](https://github.com/ksalzke/synced-preferences-for-omnifocus) is also required and needs to be added to the plug-in folder separately.**

## Installation

1. Download the [latest release](https://github.com/ksalzke/custom-complete-omnifocus-plugin/releases/latest).
2. Unzip the downloaded file.
3. Move the `.omnifocusjs` file to your OmniFocus plug-in library folder (or open it to install).
4. If desired, add one or more tags to be removed from a task after completion using the 'Preferences' action.

# Actions

This plug-in contains the following actions:

## Custom Complete

This action runs the `onComplete` function on one selected task or project, using the other functions in the `customCompleteLib` (detailed below).

## Preferences

This action allows you to:
* select whether the next task in a perspective should automatically be selected when 'custom complete' is run (this will only apply when there is a single task selected)
* configure one or more tags that should be removed from tasks after they have been completed.

# Functions

This plug-in contains the following functions within the `customCompleteLib` library:

## `loadSyncedPrefs () : SyncedPref`

Returns the [SyncedPref](https://github.com/ksalzke/synced-preferences-for-omnifocus) object for this plug-in.

If the user does not have the plug-in installed correctly, they are alerted.

## `tagsToRemove () : Array<Tag>`

Returns an array of tags to be removed from tasks when they are completed, as configured in the preferences.

## `selectNextNodePref () : Boolean`

Returns 'true' or 'false' depending on whether the 'select next task' option is checked in the preferences.

## `onComplete (task: Task)`

**Asynchronous.** Marks the given task as complete, and runs each of the functions below (with the task as the only parameter).

## `selectNextNode (task: Task)` 

**Asynchronous.** Selects the next 'node' (task) in the tree, if the preference is set, and only one task is selected.

## `checkDependendants (task: Task)`

**Asynchronous.** If my [Dependency OmniFocus Plug-In](https://github.com/ksalzke/dependency-omnifocus-plugin) is installed, this runs the `checkDependantsForTaskAndAncestors` function on the task to check whether any dependent tasks should become available.

## `noteFollowUp (task: Task)`

If my [Delegation OmniFocus Plug-In](https://github.com/ksalzke/delegation-omnifocus-plugin) is installed, runs the `noteFollowUp` action. If the task being completed is a 'follow up' task, a note is added to the original task indicating that the task has been followed up at the current time and date.

## `removeUnwantedTags (task: Task)`

Removes any unwanted tags (specified in `customCompleteConfig.js`) from the task. (This is predominantly intended for repeating tasks where certain tags are intended to be applied to the current instance only.)

## `removeDueSoonTag (task: Task)`

If my ['Tag Tasks Due Today' Plug-In](https://github.com/ksalzke/tag-tasks-due-today-for-omnifocus) is installed, removes the 'Due Today' tag from the task.

## `checkWorkOnTask (task: Task)`

**Asynchronous.** If my ['Work On...' Plug-In](https://github.com/ksalzke/work-on-omnifocus-plug-in) is installed, runs the 'onComplete' action for 'work on...' tasks, prompting the user for whether the base task is completed, should be deferred, etc.

## `promptIfStalled (task: Task)`

**Asynchronous.** If the user is not in the Projects perspective, and an action group or project is stalled as a result of completing the task, prompts the user to confirm whether they would like to review the stalled group/project, or mark it complete.