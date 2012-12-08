
(function (undefined) {

  'use strict';

  var editpad = document.getElementById('editpad');
  function parse_and_draw() {
    var result = Parser.parse(editpad.value);
    Render.draw_tasks(result.tasks, result.categories);
  }

  var timeToSave = 0;
  editpad.addEventListener('input', function (evt) {
    editpad.classList.add('modified');
    clearTimeout(timeToSave);
    timeToSave = setTimeout(function save() {
      localStorage['text'] = editpad.value;
      editpad.classList.remove('modified');
    }, 1000);
  });

  editpad.addEventListener('input', parse_and_draw);

  var localText = localStorage['text'];
  if (localText)
    editpad.value = localText;

  parse_and_draw();

}());
