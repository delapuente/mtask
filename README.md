# μTask

`/microTask/` is a simple application to remember the tasks your are doing.

In μTask you have an editor when you type plain text with a special syntax and
the application renders it to give you visual feedback about the state of your
tasks.

This is only a concept version but you can try and give me feedback ;)

The current state of the project is indeed the example you can find if it is
the first time you visit the demo.

[Try μTask it now](http://lodr.github.com/mtask)!

## Why to use it?

μTask is here to provide two things: an (almost) language independant rules to define tasks and visual feedback.

You can use the rules to open a simple txt document and keep your tasks organized but you can copy the contents of
that document to the editor pad and get a visual representation of how are you doing.

## How to use it?

μTask is based on personal experience. So here I'm describing a method working for me:

When I face several tasks to do, I try to split them into different subtasks and write them into post-its I stick
in a board. Each post-it has a number, so I can refer to the task in an unique form; a short description and
an estimation (maybe a deadline too). I keep some empty space to track the completion of the task or to add some
notes, details or clarifications.

Normally I use distinct colours for different tasks / projects. The precise semantics about colors and post-its
is up to you.

## Syntax

Write tasks is quite simple, this is the skeleton of a complete task:

```
Task <here the name>[: <here the description>]
[<Here the details, >]
[<you can break lines if you want.>]
[>> [[<completed>/]<total>] [(<year>/<month>/<day>)]
```
Does it seem weird? Just remember, text between square brackets `[` and `]` is optional and text between `<` and `>`
is used as a placeholder so you can replace with any text you want.

### Practical examples:

**Task with name**
```
Task 1
```

**Task with description**
```
Task 1: Read the μTask documentation
```

**Task with description and details**
```
Task 1: Read the μTask documentation
Start with Syntax section and see some examples
in the following sections.
```

**Task with description, details & completion**
```
Task 1: Read the μTask documentation
Start with Syntax section and see some examples
in the following sections.
>> 1/5
```

**Task with description, details, completion and a deadline**
```
Task 1: Read the μTask documentation
Start with Syntax section and see some examples
in the following sections.
>> 1/5 (2013/12/31)
```

**Only a deadline and a title**
```
Task 1: Read the μTask documentation
>> (2013/12/31)
```

### Updating a task

You can write tasks more than once, any time you use the same name, you are updating an existing task.

```
Task 1
```

Your task has only a name. Write this after:

```
Task 1: Now with description
And further details
```

Now your task has a description and details.

### The kanban

It is not enough to describe the task, you have to put them on states. At current time, states are fixed:
* `To do`: things that remain undone
* `Doing`: things in progress
* `Done`: things you finished
* `Unshecduled`: things you think about but are not mandatory

To put a task into an state you write one the former names of the states, followed by two dots `:` and then the tasks
which are in this state.

```
To do:
  Task 4: Read "Clasifying tasks" section
  Task 5: Read "Colour your world" section
  
Doing:
  Task 3: Read "The kanban" section

Done:
  Task 1: Read "Practical examples" section
  Task 2: Read "Updating a task" section
```

Trick: Use cut and paste to move your tasks from one state to another.

### Clasifying tasks

You can classify your tasks inside a topic. To do this, add two dashes to your kanban to create the
**classification area**:

```
To do:
  Task 5: Read "Colour your world" section
  
Doing:
  Task 4: Read "Clasifying tasks" section

Done:
  Task 1: Read "Practical examples" section
  Task 2: Read "Updating a task" section
  Task 3: Read "The kanban" section

--

```

After the two dashes you can define topics by writing a name, two dots `:` and putting tasks inside:

```
To do:
  Task 5: Read "Colour your world" section

Doing:
  Task 4: Read "Clasifying tasks" section

Done:
  Task 1: Read "Practical examples" section
  Task 2: Read "Updating a task" section
  Task 3: Read "The kanban" section

--

Syntax:
  Task 1: Read "Practical examples" section
  Task 2: Read "Updating a task" section
  Task 5: Read "Colour your world" section

Areas:
  Task 3: Read "The kanban" section
  Task 4: Read "Clasifying tasks" section

```

Trick: use the classification area after the two dashes to write details, completion information and deadlines and keep
the kanban as simple as possible. You can always view all the information about a task by pointing over a task.

### Colour your world

After a topic, use `(<color in #RGB>)` to indicate a color.

```
To do:
  
Doing:
  Task 5: Read "Colour your world" section

Done:
  Task 1: Read "Practical examples" section
  Task 2: Read "Updating a task" section
  Task 3: Read "The kanban" section
  Task 4: Read "Clasifying tasks" section

--

Syntax (#FF8C34):
  Task 1: Read "Practical examples". section
  Go to http://github.com/lodr/mtask and start reading.
  See how task 1 is a very simple way to define a task ;)
  >> 3/3

  Task 2: Read "Updating a task" section
  Note how we are updating the task 2 by adding further
  details. You could omit repeating the description, only
  the name is needed to refer a former task.
  >> 3/3

  Task 5: Read "Colour your world" section
  Adding colour to tasks help you to distinguish what
  to do.
  >> 2/3

Areas (#F71BBA):
  Task 3: Read "The kanban" section
  Keep your kanban as simple as possible. Task there should
  only have the name and description at most. Remember you
  can use any text as names. If you choose shor names instead
  of numbers you could omit the description as well.
  >> 3/3

  Task 4: Read "Clasifying tasks" section
  The classification section was though to be the starting point.
  Start by describing and classifying your tasks, then put them
  in different states while you complete them.
  >> 3/3
```