'use strict';

function update(callback) {

  // Manage updates
  var updater = new Updater(localStorage, [
    // To move from no version to 1.0.0
    ['1.0.0', function () {
      if (this['text']) {
        var converted = this['text'].replace(/^(\s*)(Task)(\s+.*)$/mg, '$1#$3');
        this['text'] = converted;
      }
    }]
  ]);

  var progress = updater.start_update('1.0.0');
  if (!progress.is_updated) {
    var step = updater.next();
    alert('You are ' + progress.total_steps + ' step(s) from last ' +
          'version.\nNow updating to version ' + step.version);
    step();
  }

  callback();
}
