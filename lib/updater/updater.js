'use strict';

/*
 * The Updater is a tool to manage updates of an object.
 * You constructs a new Updater providing a target (the object to be updated)
 * and an array of update steps. Each update step is a pair with a version
 * label and a transformation function.
 *
 * The target must have an attribute named `current_version` that holds the
 * current version of the object. It is used to check if an update is needed.
 *
 * Update steps are an ordered list of pairs. Each pair represents the version
 * to update to and the transformation needed to do it. The function receives
 * the target as `this` and must transform the target from the immediatly 
 * previous version to the current one. If target is not in the previous version
 * when transformation is applied, it raises an error.
 *
 * Once applied the transformation, the target's version is updated
 * automatically.
 * 
 */
function Updater(target, updaters) {
  var that = this;
  updaters = updaters || [];

  // Creates an augmented version of a transformation step
  function build_update_step(v, f) {

    // Check target is in prior version before applying the transformation
    // Apply the transformation on target
    // Updates the target's current version
    function update_step() {
      var prior_index = that.versions.indexOf(v)-1;
      if (prior_index >= 0 &&
          that.versions[prior_index] !== target.current_version)
        throw new Error('Impossible to apply ' + v + 'transformation to ' +
                        'target in version ' + target.current_version +
                        '. Version ' + that.versions[prior_index] + ' needed.');

      var result = f.apply(target, arguments);
      that._current_step++;
      target.current_version = update_step.version;
      return result;
    }
    update_step.version = v;

    return update_step;
  }

  this._target = target;
  this.versions = [];
  this.updaters = {};
  updaters.forEach(function (pair) {
    that.versions.push(pair[0]);
    that.updaters[pair[0]] = build_update_step(pair[0], pair[1]);
  });
};

// Provided a goal version, return true if the target is in that version
Updater.prototype.is_updated = function(goal_version) {
  return this._target.current_version === goal_version;
}

// Return a progress object with the following fields:
// is_updated: if the tarjet is in the goal version
// total_steps: how many steps from the goal version
// current_step: in which step towards the goal version
Updater.prototype.get_progress = function() {
  return {
    is_updated: this.is_updated(this._goal_version),
    total_steps: this._total_steps,
    current_step: this._current_step
  };
}

// Set a goal version and start an update to it.
// Return a progress object ( see get_progress() )
Updater.prototype.start_update = function(goal_version) {
  var len = this.versions.indexOf(goal_version) + 1;
  if (!len)
    throw new Error('Goal version is not valid');

  if (this._target.current_version &&
      this.versions.indexOf(this._target.current_version) === -1)
    throw new Error('Current version not recognized');

  var current_version = this._target.current_version;
  this._total_steps = len - this.versions.indexOf(current_version) - 1;
  this._goal_version = goal_version;
  this._is_updated = (current_version === goal_version);
  this._current_step = 0;

  return this.get_progress();
}

// Get the next transformation step to be applied
Updater.prototype.next = function() {
  if (this._current_step === this._total_steps)
    return null;

  var version = this.versions[this._current_step];
  return this.updaters[version];
}
