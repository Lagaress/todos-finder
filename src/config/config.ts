type TodosFinderConfig = {
  IGNORE_TODO_COMMENT: string;
  BASIC_TAG_TO_SEARCH: string;
  FILES_TO_INCLUDE_IN_SEARCH: string;
  FILES_TO_EXCLUDE_FROM_SEARCH: string;
  STATUS_BAR_ELEMENT_PRIORITY: number;
}

const config: TodosFinderConfig = {
  IGNORE_TODO_COMMENT: "//ignore-todo",
  BASIC_TAG_TO_SEARCH: "TODO",
  FILES_TO_INCLUDE_IN_SEARCH:  "**/*",
  FILES_TO_EXCLUDE_FROM_SEARCH: "**/node_modules/**",
  STATUS_BAR_ELEMENT_PRIORITY: 1,
}

export default config;