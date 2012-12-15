
var Render = (function (undefined) {

  'use strict';

  /**
   * From http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
   * Converts an RGB color value to HSL. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes r, g, and b are contained in the set [0, 255] and
   * returns h, s, and l in the set [0, 1].
   *
   * @param   Number  r       The red color value
   * @param   Number  g       The green color value
   * @param   Number  b       The blue color value
   * @return  Array           The HSL representation
   */
  function rgbToHsl(r, g, b){
      r /= 255, g /= 255, b /= 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;

      if(max === min){
          h = s = 0; // achromatic
      }
      else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch(max){
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
      }

      return [h, s, l];
  }

  var DEFAULT_TASK_COLOR = '#FFE073';

  // From http://24ways.org/2010/calculating-color-contrast
  function get_contrast_YIQ(hexcolor){
    var r = parseInt(hexcolor.substr(1,2),16);
    var g = parseInt(hexcolor.substr(3,2),16);
    var b = parseInt(hexcolor.substr(5,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
  }

  function hexToRgb(hexcolor) {
    // malformed color
    if (hexcolor[0] !== '#'
        || (hexcolor.length !== 4 && hexcolor.length !== 7))

      hexcolor = DEFAULT_TASK_COLOR;


    // normalize color
    if (hexcolor.length === '4')
      hexcolor = '#'
                 + hexcolor[1] + hexcolor[1]
                 + hexcolor[2] + hexcolor[2]
                 + hexcolor[3] + hexcolor[3];

    // calculate RGB values
    return [
      parseInt(hexcolor.substr(1,2), 16),
      parseInt(hexcolor.substr(3,2), 16),
      parseInt(hexcolor.substr(5,2), 16)
    ];
  }

  function wrap_hsl(components) {
    return 'hsl('+Math.round(components[0]*360)+','
                 +Math.round(components[1]*100)+'%,'
                 +Math.round(components[2]*100)+'%)';
  }

  function get_color_scheme(hexcolor) {
    var base, text, border;
    base = rgbToHsl.apply(null, hexToRgb(hexcolor));
    text = get_contrast_YIQ(hexcolor);
    border = [base[0], base[1], base[2] * 0.75];
    return {
      'background-color': wrap_hsl(base),
      'color': text,
      'border-color': wrap_hsl(border)
    };
  }

  function set_task(evt) {
    evt.dataTransfer.setData('task', evt.target.dataset.taskId);
    console.log('Moving task ' + evt.target.dataset.taskId);
  }

  function enable_highlight(evt) {
    evt.target.classList.add('destiny');
    console.log('Entering on ' + evt.target.id);
  }

  function disable_highlight(evt) {
    evt.tager.classList.remove('destiny');
    console.log('Leaving on ' + evt.target.id);
  }

  function set_state(evt) {
    var is_task = evt.dataTransfer.types.contains('taks');
    if (!is_taks)
      return;

    evt.preventDefault();
    var state = evt.target.id;
    console.log(evt.dataTransfer.getData('task') + '.state = ' + state);
  }

  function new_task_item(task, categories) {
    var task_text = 'Task';
    var category_text = 'Category';
    var completion_text = 'Completion';
    var due_text = 'Due date';

    var html = '<hgroup><h1>'+task.description+'</h1></hgroup>';
    if (task.details)
      html += '<p>'+task.details+'</p>';
    html += '<aside class="details"><dl>';

    html += '<dt>'+task_text+'</dt>';
    html += '<dd>'+task.id+'</dd>';

    if (task.category) {
      html += '<dt>'+category_text+'</dt>';
      html += '<dd>'+categories[task.category].name+'</dd>';
    }

    if (task.completion) {
      var max = parseInt(task.completion.total);
      var value = parseInt(task.completion.completed) || '0';
      html += '<dt>'+completion_text+'</dt>';
      html += '<dd><progress value="'+value+'" max="'+max+'"></progress></dd>';
    }

    if (task.completion && task.completion.due) {
      var max = parseInt(task.completion.total);
      var value = parseInt(task.completion.completed) || '0';
      html += '<dt>'+due_text+'</dt>';
      html += '<dd>'+task.completion.due+'</dd>';
    }

    html += '</dl>';

    var article = document.createElement('article');
    article.innerHTML = html;
    article.classList.add('task');
    article.setAttribute('contenteditable', 'false');
    article.setAttribute('draggable', 'true');
    article.dataset.taskId = task.id;
    article.addEventListener('dragstart', set_task);
    if (task.category) {
      var color = categories[task.category].color || DEFAULT_TASK_COLOR;
      var color_scheme = get_color_scheme(color);
      article.style.backgroundColor = color_scheme['background-color'];
      article.style.borderColor = color_scheme['border-color'];
      article.style.color = color_scheme['color'];
    }
    return article;
  }

  function draw_tasks(tasks, categories) {
    // Clear states
    var tasks_containers = document.querySelectorAll('.state section');
    [].forEach.call(tasks_containers, function (container) {
      container.innerHTML = '';
    });

    // Draw each task where it belongs to
    for (var task_id in tasks) {
      var task = tasks[task_id];
      var state_id = task.state;
      if (state_id) {
        var container = document.querySelector('#'+state_id+' section');
        container.appendChild(new_task_item(task, categories));
      }
    }
  }

  var states = document.querySelectorAll('.state');
  [].forEach.call(states, function(state) {
    console.log('Installing listeners ' + state.id);
    state.addEventListener('dragenter', enable_highlight);
    state.addEventListener('dragleave', disable_highlight);
    state.addEventListener('dragover', set_state);
  });

  return {
    draw_tasks: draw_tasks
  }

}());
