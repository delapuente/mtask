
(function (undefined) {

  'use strict';

  update(function () {

    var editpad = document.getElementById('editpad');
    var editor = ace.edit('editpad');
    editor.setTheme("ace/theme/chrome");
    editor.getSession().setMode("ace/mode/text");
    editor.getSession().setTabSize(2);
    editor.getSession().setUseSoftTabs(true);

    function parse_and_draw() {
      var result = Parser.parse(editor.getValue());
      Render.draw_tasks(result.tasks, result.categories);
    }

    var timeToSave = 0;
    editor.getSession().on('change', function (evt) {
      editpad.classList.add('modified');
      clearTimeout(timeToSave);
      timeToSave = setTimeout(function save() {
        localStorage['text'] = editor.getValue();
        editpad.classList.remove('modified');
      }, 1000);
    });

    editor.getSession().on('change', parse_and_draw);

    var localText = localStorage['text'];
    if (localText)
      editor.setValue(localText);

    parse_and_draw();
  });

}());
