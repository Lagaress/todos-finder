# TODO Finder

An extension for Visual Studio Code that helps you find and manage TODOs in your codebase. This extension provides a sidebar view and a status bar item to display the number of TODOs, and it allows you to configure custom tags and file patterns for inclusion and exclusion in the search.

## Features

- Display the total number of TODOs in your project.
- Sidebar view with a list of files containing TODOs.
- Configure custom tags for filtering TODOs.
- Configure file inclusion and exclusion patterns for the search.
- Ignore specific TODOs with an `//ignore-todo` comment.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking the square icon in the sidebar or pressing `Ctrl+Shift+X`.
3. Search for `TODO Finder`.
4. Click `Install`.

## Usage

### Sidebar View

- Open the TODOs view from the activity bar to see the list of files containing TODOs.
- Click on a file to navigate to it.

### Status Bar

- The status bar shows the total number of TODOs in the project.
- It updates automatically when you save a file or switch active editors.

### Ignoring TODOs

- Add `//ignore-todo` on the line before a TODO to exclude it from the count.

## Configuration

### Default Values

- **Tag**: `""` (empty string).
- **Files to Include**: `**/*`
- **Files to Exclude**: `**/node_modules/**`

### Setting Custom Values

You can configure the extension settings through the VSCode settings UI or by editing your `settings.json` file:

```json
{
  "todosfinder.tag": "BUG",
  "todosfinder.filesToInclude": "**/*.js",
  "todosfinder.filesToExclude": "**/node_modules/**"
}
```

- **Tag**: Custom tag to search for TODOs. Example: `BUG`.
  - By default the extension will search for the keyword **TODO**. If you add a custom value, for example **BUG**, the extension will search for **TODO[BUG]**.
- **Files to Include**: Global pattern of files to include in the search. Example: `**/*.js`
- **Files to Exclude**: Global pattern of files to exclude from the search. Example: `**/node_modules/**`
