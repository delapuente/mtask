# μTask

`/microTask/` is a simple application to remember the tasks your are doing.

In μTask you have an editor when you type plain text with a special syntax and
the application renders it to give you visual feedback about the state of your
tasks.

This is only a concept version but you can try and give me feedback ;)

The current state of the project is indeed the example you can find if it is
the first time you visit the demo.

[Try μTask it now](http://lodr.github.com/mtask)!

## Syntax

### The kanban

In order to start, you need at least the categories and currently they are fixed:
* `To do:` things you should start doing in short
* `Doing:` things you are currently doing
* `Done:` things you have finished
* `Unscheduled:` things you think about but are not mandatory

An empty document is something like this:

```
To do:

Doing:

Done:

Unscheduled:
```

Optionally you have an area to further describe and categorize your task. You can add this area by using a double dash
`--`:

```
Tasks go here to be rendered!

To do:

Doing:

Done:

Unscheduled:

--

Taks descriptions and categorization fit here!
```

### Simplest tasks

A task starts with the word `Task` followed by an identifier. The identifier could be any sequence of characters.

Yo would need the identifier if you want to refer to the task later but, despite I recommend numbers or short words,
you are not restricted about the nature of the identifiers.

You can write tasks in the kanban area (before the dashes) or in the description area (after the dashes) but they
won't be rendered unless you put under one **state in the kanban**.

All these are valid tasks:

```
To do:
  Task 1
  Task shortTask
  
Doing:
  Task A long task
  Task MY TASK
```

### Titles

If you use numbers as identifiers, you would want to add a real title, you can use this syntax instead:

```
To do:
  Task 1: clean up the living room
  Task shortTask: call mummy

Doing:
  Task A long task: write that awesome DSL parser
  Task MY TASK: buy some chocolat
```

### Descriptions

Probably you want to add detailed descriptions about one taks. To do this, only add the description just in
the line next to the title:

```
Doing:
  Task A long task: write that awesome DSL parser
  This is a description for the long task. You can split
  the explanation in several lines.
  
  Task MY TASK: buy some chocolat
  This task has a description as well.
```

Anyway, my recommendation is:
* Use the **description area** to detail your taks
* In the **kanban area**, refer to tasks only by their identifiers 

```
To do:
  Task 1
  Task shortTask
  
Doing:
  Task A long task
  Task MY TASK
  
--
Task A long task: write that awesome DSL parser
This is a description for the long task. You can split

Task MY TASK: buy some chocolat
This task has a description as well.
```

### Categorization

In the description area, you can add **categories**. To add a category simply use an arbitrary name followed by `:`
and add tasks below.

```
To do:
  Task 1
  Task shortTask
  
Doing:
  Task A long task
  Task MY TASK
  
--
Programming:
  Task A long task: write that awesome DSL parser
  This is a description for the long task. You can split

Buying:
  Task MY TASK: buy some chocolat
  This task has a description as well.
```

All tasks under a category belong to that category. If you want some tasks to remain uncategorized, leave them
before the first category.

If you want to colour tasks by category, point the color in brackets with a hexadecimal code like `#FF0000`:

```
To do:
  Task 1
  Task shortTask
  
Doing:
  Task A long task
  Task MY TASK
  
--
Programming (#FF0000):
  Task A long task: write that awesome DSL parser
  This is a description for the long task. You can split

Buying (#00FF00):
  Task MY TASK: buy some chocolat
  This task has a description as well.
```

Uncategorized tasks have default color __yellow__.