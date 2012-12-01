# μTask

microTask is a simple application to remember the tasks your are doing.

In μTask you have an editor when you type plain text with a special syntax and
the application renders it to give you visual feedback about the state of your
tasks.

This is only a concept version but you can try and give me feedback ;)

The current state of the project is indeed the example you can find if it is
the first time you visit the demo.

[Try μTask it now](http://lodr.github.com/mtask)!

## Syntax

A task document seems something like this:

```
To do:
  Task Some task to do

Doing:
  Task A task in progress

Done:
  Task Finished task

Unscheduled:
  Task I can do this later
```

If your tasks are short you can use this style:

```
Task <identifier>
```

