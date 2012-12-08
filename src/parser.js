
var Parser = (function (undefined) {

  'use strict';

  function get_id(string) {
    string = string.trim();
    string = string.toLowerCase();
    string = string.replace(/[\s-+]/g, '_');
    string = string.replace(/\W/g, '');
    return string;
  }

  function parse_source(source) {
    var parsing_task, starting_details;

    function reset() {
      parsing_task = false;
      starting_details = false;
    }

    var tasks = {}, states = {}, categories = {};

    var state_header = /^(.+?):$/i;
    var category_header = /^(.+?)(?:\s+\(\s*(.*?)\s*\)\s*)?:$/i;
    var task_header = /^task\s+(.+?)(?::\s*(.*))?$/i;
    var task_completion = /^>>\s*(.*?)(?:\/(.*?))?\s*(?:\((.*?)\))?$/;
    var separator = /^-{2,}$/;
    var mode = 'state';

    reset();
    var lines = source.split('\n');
    var current_task, current_state, current_category;
    for (var i=0, len=lines.length; i<len; i++) {

      var line = lines[i];
      var trimmed = line.trim();

      if (!trimmed) { reset(); continue; }

      // Separator found, now looking for classification
      var separator_found = separator.exec(trimmed);
      if (separator_found && mode === 'state') {
        parsing_task = false;
        current_state = undefined;
        mode = 'classification';
        continue;
      }

      // Looking for a task definition
      var task_found = task_header.exec(trimmed);
      if (!parsing_task && task_found) {
        parsing_task = true;
        starting_details = true;
        current_task = get_id(task_found[1]);

        // not already defined, create new
        if (!tasks[current_task]) {
          tasks[current_task] = {
            id: current_task,
            description: task_found[2] || task_found[1],
            category: current_category,
            state: current_state
          };
        }

        // already defined, expand it
        else {
          if (task_found[2])
            tasks[current_task].description = task_found[2];
          if (current_category)
            tasks[current_task].category = current_category;
          if (current_state)
            tasks[current_task].state = current_state;
        }

        continue;
      }

      // Looking for task completion
      if (parsing_task) {
        var completion_found = task_completion.exec(trimmed);
        if (completion_found) {
          parsing_task = false;
          tasks[current_task].completion = {
            completed: completion_found[2] ? completion_found[1] : undefined,
            total: completion_found[2] || completion_found[1] || undefined,
            due: completion_found[3] || undefined
          };
          continue;
        }
      }

      var rtrimmed = line.replace(/\s*$/, '');

      // The State is the set of tasks distributed among the different states
      if (mode === 'state') {
        // New state found, tasks found since now are in this state
        var state_found = state_header.exec(rtrimmed);
        if (state_found && !parsing_task) {
          current_state = get_id(state_found[1]);
          states[current_state] = {
            id: current_state,
            name: state_found[1]
          };
          continue;
        }
      }

      // The Classification is a space where to distribute tasks among
      // categories
      else if (mode === 'classification') {
        // New category found, tasks found since now belong to this category
        var category_found = category_header.exec(rtrimmed);
        if (category_found && !parsing_task) {
          current_category = get_id(category_found[1]);
          categories[current_category] = {
            id: current_category,
            name: category_found[1],
            color: category_found[2] || DEFAULT_TASK_COLOR
          };
          continue;
        }
      }

      // Any remaining patter is ignored or added as details if we are
      // parsing a task
      if (parsing_task) {

        // if no details or recently started recognizing details
        if (!tasks[current_task].details || starting_details) {
          tasks[current_task].details = trimmed;
          starting_details = false;
        }

        else
          tasks[current_task].details += ' '+trimmed;

        continue;
      }
    }

    console.dir(tasks);
    return {
      tasks: tasks,
      states: states,
      categories: categories
    };
  }

  return {
    'parse': parse_source
  };

}());
