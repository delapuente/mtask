
describe('The parser', function () {

  'use strict';

  describe('task parsing', function () {

    it('accepts short task syntax `Task id`', function() {
      var source = 'Task short id';
      var result = Parser.parse(source);

      expect(Object.keys(result.tasks).length).toEqual(1);
      expect(result.tasks['short_id']).toBeDefined();
      expect(result.tasks['short_id'].id).toEqual('short_id');
      expect(result.tasks['short_id'].details).not.toBeDefined();
      expect(result.tasks['short_id'].completion).not.toBeDefined();
    });

    it('ignores blank lines', function() {
      var source = '\n\n   \n\t\t\nTask short id\n  \t  \n';
      var result = Parser.parse(source);

      expect(Object.keys(result.tasks).length).toEqual(1);
      expect(result.tasks['short_id']).toBeDefined();
      expect(result.tasks['short_id'].id).toEqual('short_id');
      expect(result.tasks['short_id'].details).not.toBeDefined();
      expect(result.tasks['short_id'].completion).not.toBeDefined();
    });

    it('accepts a more descriptive syntax `Task id: description`', function() {
      var source = 'Task short_id: description';
      var result = Parser.parse(source);

      expect(Object.keys(result.tasks).length).toEqual(1);
      expect(result.tasks['short_id']).toBeDefined();
      expect(result.tasks['short_id'].id).toEqual('short_id');
      expect(result.tasks['short_id'].description).toEqual('description');
      expect(result.tasks['short_id'].details).not.toBeDefined();
      expect(result.tasks['short_id'].completion).not.toBeDefined();
    });

    it('uses the id as description if no other description provided',
      function() {
        var source = 'Task short id';
        var result = Parser.parse(source);

        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toEqual('short_id');
        expect(result.tasks['short_id'].description).toEqual('short id');
        expect(result.tasks['short_id'].details).not.toBeDefined();
        expect(result.tasks['short_id'].completion).not.toBeDefined();
      }
    );

    it('accepts further details after the task header', function() {
      var source = 'Task short_id: description\n' +
                   'Further details line 1';
      var result = Parser.parse(source);

      expect(Object.keys(result.tasks).length).toEqual(1);
      expect(result.tasks['short_id']).toBeDefined();
      expect(result.tasks['short_id'].id).toEqual('short_id');
      expect(result.tasks['short_id'].description).toEqual('description');
      expect(result.tasks['short_id'].details)
        .toEqual('Further details line 1');
      expect(result.tasks['short_id'].completion).not.toBeDefined();
    });

    it('accepts further details in multiple lines', function() {
      var source = 'Task short_id: description\n' +
                   'Further details line 1\n' +
                   'Further details line 2';
      var result = Parser.parse(source);

      expect(Object.keys(result.tasks).length).toEqual(1);
      expect(result.tasks['short_id']).toBeDefined();
      expect(result.tasks['short_id'].id).toEqual('short_id');
      expect(result.tasks['short_id'].description).toEqual('description');
      expect(result.tasks['short_id'].details)
        .toEqual('Further details line 1 Further details line 2');
      expect(result.tasks['short_id'].completion).not.toBeDefined();
    });

    it('assumes details continue until a blank line is found', function() {
      var source = 'Task short_id: description\n' +
                   'Further details line 1\n' +
                   'Further details line 2\n' +
                   'Task fake';
      var result = Parser.parse(source);

      expect(Object.keys(result.tasks).length).toEqual(1);
      expect(result.tasks['short_id']).toBeDefined();
      expect(result.tasks['short_id'].id).toEqual('short_id');
      expect(result.tasks['short_id'].description).toEqual('description');
      expect(result.tasks['short_id'].details)
        .toEqual('Further details line 1 Further details line 2 Task fake');
      expect(result.tasks['short_id'].completion).not.toBeDefined();
    });

    xit('assumes two tasks can appear together if no description between them',
      function() {
        var source = 'Task short_id: description\n' +
                     'Further details line 1\n' +
                     'Further details line 2\n' +
                     'Task fake\n' +
                     '\n' +
                     'Task fake';
        var result = Parser.parse(source);

        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toEqual('short_id');
        expect(result.tasks['short_id'].description).toEqual('description');
        expect(result.tasks['short_id'].details)
          .toEqual('Further details line 1 Further details line 2 Task fake');
        expect(result.tasks['short_id'].completion).not.toBeDefined();
      }
    );

    xit('two tasks can appear together if no description between them',
      function() {
        var source = 'Task short_id: description\n' +
                     'Further details line 1\n' +
                     'Further details line 2\n' +
                     'Task fake\n' +
                     '\n' +
                     'Task fake';
        var result = Parser.parse(source);

        expect(Object.keys(result.tasks).length).toEqual(1);
        expect(result.tasks['short_id']).toBeDefined();
        expect(result.tasks['short_id'].id).toEqual('short_id');
        expect(result.tasks['short_id'].description).toEqual('description');
        expect(result.tasks['short_id'].details)
          .toEqual('Further details line 1 Further details line 2 Task fake');
        expect(result.tasks['short_id'].completion).not.toBeDefined();
      }
    );

    it('accepts a completion syntax after header `>> 5h/6h`', function() {
      var source = 'Task short_id: description\n' +
                   'Further details line 1\n' +
                   'Further details line 2\n' +
                   'Task fake\n' +
                   '>> 5h/6h';
      var result = Parser.parse(source);

      expect(Object.keys(result.tasks).length).toEqual(1);
      expect(result.tasks['short_id']).toBeDefined();
      expect(result.tasks['short_id'].id).toEqual('short_id');
      expect(result.tasks['short_id'].description).toEqual('description');
      expect(result.tasks['short_id'].details)
        .toEqual('Further details line 1 Further details line 2 Task fake');

      expect(result.tasks['short_id'].completion).toBeDefined();
      expect(result.tasks['short_id'].completion.completed).toBe('5h');
      expect(result.tasks['short_id'].completion.total).toBe('6h');
      expect(result.tasks['short_id'].completion.due).not.toBeDefined();
    });

    it('accepts a completion syntax with only total `>> 6h`', function() {
      var source = 'Task short_id: description\n' +
                   'Further details line 1\n' +
                   'Further details line 2\n' +
                   'Task fake\n' +
                   '>> 6h';
      var result = Parser.parse(source);

      expect(Object.keys(result.tasks).length).toEqual(1);
      expect(result.tasks['short_id']).toBeDefined();
      expect(result.tasks['short_id'].id).toEqual('short_id');
      expect(result.tasks['short_id'].description).toEqual('description');
      expect(result.tasks['short_id'].details)
        .toEqual('Further details line 1 Further details line 2 Task fake');

      expect(result.tasks['short_id'].completion).toBeDefined();
      expect(result.tasks['short_id'].completion.completed).not.toBeDefined();
      expect(result.tasks['short_id'].completion.total).toBe('6h');
      expect(result.tasks['short_id'].completion.due).not.toBeDefined();
    });

    it('accepts a due date as well `>> (2012/11/29)`', function() {
      var source = 'Task short_id: description\n' +
                   'Further details line 1\n' +
                   'Further details line 2\n' +
                   'Task fake\n' +
                   '>> (2012/11/29)';
      var result = Parser.parse(source);

      expect(Object.keys(result.tasks).length).toEqual(1);
      expect(result.tasks['short_id']).toBeDefined();
      expect(result.tasks['short_id'].id).toEqual('short_id');
      expect(result.tasks['short_id'].description).toEqual('description');
      expect(result.tasks['short_id'].details)
        .toEqual('Further details line 1 Further details line 2 Task fake');

      expect(result.tasks['short_id'].completion).toBeDefined();
      expect(result.tasks['short_id'].completion.completed).not.toBeDefined();
      expect(result.tasks['short_id'].completion.total).not.toBeDefined();
      expect(result.tasks['short_id'].completion.due).toBeDefined();
      expect(result.tasks['short_id'].completion.due).toBe('2012/11/29');
    });


  });

});
