
describe('The parser:', function () {

  'use strict';

  describe('task syntax', function () {

    it('accepts short form `# id`', function() {
      var source = '# short id';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toEqual('short_id');
        expect(result.tasks['short_id'].details).not.toBeDefined();
        expect(result.tasks['short_id'].completion).not.toBeDefined();
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('admits multiple tasks', function() {
      var source = '# short_id: description\n' +
                   '# another: description\n';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.tasks).length).toEqual(2);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toEqual('short_id');
        expect(result.tasks['short_id'].description).toEqual('description');
        expect(result.tasks['another']).toBeDefined();
        expect(result.tasks['another'].id).toEqual('another');
        expect(result.tasks['another'].description).toEqual('description');
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });


    it('ignores blank lines', function() {
      var source = '\n\n   \n\t\t\n# short id\n  \t  \n';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toEqual('short_id');
        expect(result.tasks['short_id'].details).not.toBeDefined();
        expect(result.tasks['short_id'].completion).not.toBeDefined();
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('accepts a description `# id: description`', function() {
      var source = '# short_id: description';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toEqual('short_id');
        expect(result.tasks['short_id'].description).toEqual('description');
        expect(result.tasks['short_id'].details).not.toBeDefined();
        expect(result.tasks['short_id'].completion).not.toBeDefined();
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('uses the id as description if no other description provided',
      function() {
        var source = '# short id';
        var result = Parser.parse(source);

        function t() {
          expect(Object.keys(result.tasks).length).toEqual(1);
          expect(result.tasks['short_id']).toBeDefined();
          expect(result.tasks['short_id'].id).toEqual('short_id');
          expect(result.tasks['short_id'].description).toEqual('short id');
          expect(result.tasks['short_id'].details).not.toBeDefined();
          expect(result.tasks['short_id'].completion).not.toBeDefined();
        }
        t(); result = Parser.parse(source.split('\n')); t();
      }
    );

    it('admits further details after the task header', function() {
      var source = '# short_id: description\n' +
                   'Further details line 1';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toEqual('short_id');
        expect(result.tasks['short_id'].description).toEqual('description');
        expect(result.tasks['short_id'].details)
          .toEqual('Further details line 1');
        expect(result.tasks['short_id'].completion).not.toBeDefined();
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('admits further details in multiple lines', function() {
      var source = '# short_id: description\n' +
                   'Further details line 1\n' +
                   'Further details line 2';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toEqual('short_id');
        expect(result.tasks['short_id'].description).toEqual('description');
        expect(result.tasks['short_id'].details)
          .toEqual('Further details line 1 Further details line 2');
        expect(result.tasks['short_id'].completion).not.toBeDefined();
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('accepts a completion syntax after header `>> 5h/6h`', function() {
      var source = '# short_id: description\n' +
                   'Further details line 1\n' +
                   'Further details line 2\n' +
                   '>> 5h/6h';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toEqual('short_id');
        expect(result.tasks['short_id'].description).toEqual('description');
        expect(result.tasks['short_id'].details)
          .toEqual('Further details line 1 Further details line 2');

        expect(result.tasks['short_id'].completion).toBeDefined();
        expect(result.tasks['short_id'].completion.completed).toBe('5h');
        expect(result.tasks['short_id'].completion.total).toBe('6h');
        expect(result.tasks['short_id'].completion.due).not.toBeDefined();
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('accepts a completion syntax with only total `>> 6h`', function() {
      var source = '# short_id: description\n' +
                   '>> 6h';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toEqual('short_id');
        expect(result.tasks['short_id'].description).toEqual('description');
        expect(result.tasks['short_id'].details).not.toBeDefined();

        expect(result.tasks['short_id'].completion).toBeDefined();
        expect(result.tasks['short_id'].completion.completed).not.toBeDefined();
        expect(result.tasks['short_id'].completion.total).toBe('6h');
        expect(result.tasks['short_id'].completion.due).not.toBeDefined();
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('accepts a due date as well `>> (2012/11/29)`', function() {
      var source = '# short_id\n' +
                   'Further details line 1\n' +
                   'Further details line 2\n' +
                   '>> (2012/11/29)';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toEqual('short_id');
        expect(result.tasks['short_id'].description).toEqual('short_id');
        expect(result.tasks['short_id'].details)
          .toEqual('Further details line 1 Further details line 2');

        expect(result.tasks['short_id'].completion).toBeDefined();
        expect(result.tasks['short_id'].completion.completed).not.toBeDefined();
        expect(result.tasks['short_id'].completion.total).not.toBeDefined();
        expect(result.tasks['short_id'].completion.due).toBeDefined();
        expect(result.tasks['short_id'].completion.due).toBe('2012/11/29');
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });
  });

  describe('task updating', function() {

    it('allows the developer refer to a task by its id', function(){
      var source = '# short_id\n' +
                   '# short_id';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toEqual('short_id');
        expect(result.tasks['short_id'].details).not.toBeDefined();
        expect(result.tasks['short_id'].completion).not.toBeDefined();
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('allows the developer update information of the task', function(){
      var source = '# short_id: description\n' +
                   'Details line 1\nDetails line 2\n' +
                   '# short_id: updated description\n' +
                   'Updated details';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toBe('short_id');
        expect(result.tasks['short_id'].description).toBe('updated description');
        expect(result.tasks['short_id'].details).toBe('Updated details');
        expect(result.tasks['short_id'].completion).not.toBeDefined();
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('never deletes information, just add or update', function(){
      var source = '# short_id: description\n' +
                   'Details line 1\nDetails line 2\n' +
                   '# short_id: \n' +
                   '>> (Sunday)';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toBe('short_id');
        expect(result.tasks['short_id'].description).toBe('description');
        expect(result.tasks['short_id'].details)
          .toBe('Details line 1 Details line 2');
        expect(result.tasks['short_id'].completion).toBeDefined();
        expect(result.tasks['short_id'].completion.due).toBe('Sunday');
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });
  });

  describe('states syntax', function () {

    it('has the form `state:`', function () {
      var source = 'State:';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.states).length).toEqual(1);
        expect(result.states['state']).toBeDefined();
        expect(result.states['state'].id).toBe('state');
        expect(result.states['state'].name).toBe('State');
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('accept multiple states in different lines', function () {
      var source = 'State:\n' +
                   'Another state:';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.states).length).toEqual(2);
        expect(result.states['state']).toBeDefined();
        expect(result.states['state'].id).toBe('state');
        expect(result.states['state'].name).toBe('State');
        expect(result.states['another_state']).toBeDefined();
        expect(result.states['another_state'].id).toBe('another_state');
        expect(result.states['another_state'].name).toBe('Another state');
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('is not recognized inside tasks', function() {
      var source = 'State:\n' +
                   '# task_id: description\n' +
                   'details:';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.states).length).toEqual(1);
        expect(result.states['state']).toBeDefined();
        expect(result.states['state'].id).toBe('state');
        expect(result.states['state'].name).toBe('State');

        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['task_id']).toBeDefined();
        expect(result.tasks['task_id'].id).toBe('task_id');
        expect(result.tasks['task_id'].description).toBe('description');
        expect(result.tasks['task_id'].details).toBe('details:');
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('should be separated from the last task with a blankline', function() {
      var source = 'State:\n' +
                   '# task_id: description\n' +
                   '\n' +
                   'details:';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.states).length).toEqual(2);
        expect(result.states['state']).toBeDefined();
        expect(result.states['state'].id).toBe('state');
        expect(result.states['state'].name).toBe('State');
        expect(result.states['details']).toBeDefined();
        expect(result.states['details'].id).toBe('details');
        expect(result.states['details'].name).toBe('details');

        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['task_id']).toBeDefined();
        expect(result.tasks['task_id'].id).toBe('task_id');
        expect(result.tasks['task_id'].description).toBe('description');
        expect(result.tasks['task_id'].details).not.toBeDefined();
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });
  });

  describe('adding tasks into states', function() {
    it('is to write tasks after states', function() {
      var source = 'State:\n' +
                   '# task_id: description\n' +
                   '# another_id: description\n' +
                   '\n' +
                   'Another state:\n' +
                   '# another_one: description';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.states).length).toEqual(2);
        expect(result.states['state']).toBeDefined();
        expect(result.states['state'].id).toBe('state');
        expect(result.states['state'].name).toBe('State');
        expect(result.states['another_state']).toBeDefined();
        expect(result.states['another_state'].id).toBe('another_state');
        expect(result.states['another_state'].name).toBe('Another state');

        expect(Object.keys(result.tasks).length).toEqual(3);
        expect(result.tasks['task_id']).toBeDefined();
        expect(result.tasks['task_id'].state).toBe('state');
        expect(result.tasks['another_id'].state).toBe('state');
        expect(result.tasks['another_one'].state).toBe('another_state');
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('has no effect to add the same task to more than one state. ' +
       'Only the last appearance has effect.', function() {
      var source = 'State:\n' +
                   '# task_id: description\n' +
                   '\n' +
                   'Another state:\n' +
                   '# task_id: description';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.states).length).toEqual(2);
        expect(result.states['state']).toBeDefined();
        expect(result.states['state'].id).toBe('state');
        expect(result.states['state'].name).toBe('State');
        expect(result.states['another_state']).toBeDefined();
        expect(result.states['another_state'].id).toBe('another_state');
        expect(result.states['another_state'].name).toBe('Another state');

        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['task_id']).toBeDefined();
        expect(result.tasks['task_id'].state).toBe('another_state');
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });
  });

  describe('categories syntax', function() {
    it('is the same as states but after the separator `--` symbol', function() {
      var source = '--\n' +
                   'Category 1:';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.states).length).toEqual(0);
        expect(Object.keys(result.categories).length).toEqual(1);
        expect(result.categories['category_1']).toBeDefined();
        expect(result.categories['category_1'].id).toBe('category_1');
        expect(result.categories['category_1'].name).toBe('Category 1');
        expect(result.categories['category_1'].color).not.toBeDefined();
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('accetps a color between brackets `State (#RRGGBB):`', function() {
      var source = '--\n' +
                   'Category 1 (#FF0000):';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.states).length).toEqual(0);
        expect(Object.keys(result.categories).length).toEqual(1);
        expect(result.categories['category_1']).toBeDefined();
        expect(result.categories['category_1'].id).toBe('category_1');
        expect(result.categories['category_1'].name).toBe('Category 1');
        expect(result.categories['category_1'].color).toBe('#FF0000');
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('accept multiple categories in different lines', function () {
      var source = '--\n' +
                   'Category 1:\n' +
                   'Category 2:\n';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.categories).length).toEqual(2);
        expect(result.categories['category_1']).toBeDefined();
        expect(result.categories['category_1'].id).toBe('category_1');
        expect(result.categories['category_1'].name).toBe('Category 1');
        expect(result.categories['category_2']).toBeDefined();
        expect(result.categories['category_2'].id).toBe('category_2');
        expect(result.categories['category_2'].name).toBe('Category 2');
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('is not recognized inside tasks', function() {
      var source = '--\n' +
                   'Category 1:\n' +
                   '# task_id: description\n' +
                   'details:';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.categories).length).toEqual(1);
        expect(result.categories['category_1']).toBeDefined();
        expect(result.categories['category_1'].id).toBe('category_1');
        expect(result.categories['category_1'].name).toBe('Category 1');

        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['task_id']).toBeDefined();
        expect(result.tasks['task_id'].id).toBe('task_id');
        expect(result.tasks['task_id'].description).toBe('description');
        expect(result.tasks['task_id'].details).toBe('details:');
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('should be separated from the last task with a blankline', function() {
      var source = '--\n' +
                   'Category 1:\n' +
                   '# task_id: description\n' +
                   '\n' +
                   'details:';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.categories).length).toEqual(2);
        expect(result.categories['category_1']).toBeDefined();
        expect(result.categories['category_1'].id).toBe('category_1');
        expect(result.categories['category_1'].name).toBe('Category 1');
        expect(result.categories['details']).toBeDefined();
        expect(result.categories['details'].id).toBe('details');
        expect(result.categories['details'].name).toBe('details');

        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['task_id']).toBeDefined();
        expect(result.tasks['task_id'].id).toBe('task_id');
        expect(result.tasks['task_id'].description).toBe('description');
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });
  });

  describe('classifying tasks', function() {
    it('is to write tasks after categories', function() {
      var source = '--\n' +
                   'Category 1:\n' +
                   '# task_id: description\n' +
                   '# another_id: description\n' +
                   '\n' +
                   'Category 2:\n' +
                   '# another_one: description';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.categories).length).toEqual(2);
        expect(result.categories['category_1']).toBeDefined();
        expect(result.categories['category_1'].id).toBe('category_1');
        expect(result.categories['category_1'].name).toBe('Category 1');
        expect(result.categories['category_2']).toBeDefined();
        expect(result.categories['category_2'].id).toBe('category_2');
        expect(result.categories['category_2'].name).toBe('Category 2');

        expect(Object.keys(result.tasks).length).toEqual(3);
        expect(result.tasks['task_id']).toBeDefined();
        expect(result.tasks['task_id'].category).toBe('category_1');
        expect(result.tasks['another_id'].category).toBe('category_1');
        expect(result.tasks['another_one'].category).toBe('category_2');
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });

    it('has no effect to add the same task to more than one category. ' +
       'Only the last appearance has effect.', function() {
      var source = '--\n' +
                   'Category 1:\n' +
                   '# task_id: description\n' +
                   '\n' +
                   'Category 2:\n' +
                   '# task_id: description';
      var result = Parser.parse(source);

      function t() {
        expect(Object.keys(result.categories).length).toEqual(2);
        expect(result.categories['category_1']).toBeDefined();
        expect(result.categories['category_1'].id).toBe('category_1');
        expect(result.categories['category_1'].name).toBe('Category 1');
        expect(result.categories['category_2']).toBeDefined();
        expect(result.categories['category_2'].id).toBe('category_2');
        expect(result.categories['category_2'].name).toBe('Category 2');

        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['task_id']).toBeDefined();
        expect(result.tasks['task_id'].category).toBe('category_2');
      }
      t(); result = Parser.parse(source.split('\n')); t();
    });
  });
});
