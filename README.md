# μTask

`/microTask/` is a simple application to remember the tasks your are doing.

In μTask you have an editor where you type plain text with a special syntax and
the application renders it to give you visual feedback about the state of your
tasks.

This is only a concept version but you can try and give me feedback ;)

The current state of the project is indeed the example you can find if it is
the first time you visit the demo.

[Try μTask now](http://delapuente.github.com/mtask)!

## Why to use it?

μTask is here to provide two things: a language-independant set of rules to define tasks and visual feedback.

You can use the rules to open a simple txt document and keep your tasks organized but you can copy the contents of
that document to the editor pad and get a visual representation of how are you doing.

## How to use it?

μTask is based on personal experience. So here I'm describing a method working for me:

When I face several tasks to do, I try to split them into different subtasks and write them into sticky-notes I stick
in a board. Each sticky-note has a number, so I can refer to the task in an unique form; a short description and
an estimation (maybe a deadline too). I keep some empty space to track the completion of the task or to add some
notes, details or clarifications.

Normally I use distinct colours for different tasks / projects. The precise semantics about colors and sticky-notes
is up to you.

## Syntax

Write tasks is quite simple, this is the skeleton of a complete task:

```
# <here the name>[: <here the description>]
[<Here the details, >]
[<you can break lines if you want.>]
[>> [[<completed>/]<total>] [(<year>/<month>/<day>)]
```
Does it seem weird? Just remember, text between square brackets `[` and `]` is optional and text between `<` and `>`
is used as a placeholder so you can replace with any text you want.

### Practical examples:

Paste these examples into the notepad (pass over the right area, that with the arrow, to reveal the notepad)
to see the results:

**Task with name**
```
To do:
  # tutorial
```

Note we are putting the `Task tutorial` inside the state `To do`. You will read more about this in the next section.
If you want your task to be displayed you need to put it in some state.

**Task with description**
```
To do:
  # tutorial: Read the μTask documentation
```

**Task with description and details**
```
To do:
  # tutorial: Read the μTask documentation
  Start with Syntax section and see some examples
  in the following sections. URL:
  https://github.com/lodr/mtask
```

**Task with description, details & completion**
```
To do:
  # 1: Read the μTask documentation
  Start with Syntax section and see some examples
  in the following sections. URL:
  https://github.com/lodr/mtask
  >> 1/5
```
Trick: you can add units to your completions. I.e: `1h/5h` but, at the moment, it does not support fractions, you can
not say `1.5h/5h`. Note μTask does not understand what `h` means (yet). It just ignore it xP.

**Task with description, details, completion and a deadline**
```
To do:
  # 1: Read the μTask documentation
  Start with Syntax section and see some examples
  in the following sections. URL:
  https://github.com/lodr/mtask
  >> 1/5 (2013/12/31)
```

**Only a deadline and a description**
```
To do:
  # 1: Read the μTask documentation
  >> (2013/12/31)
```

Note description, details, completion and deadline are optional in any combination.

### Updating a task

You can write tasks more than once, any time you use the same name, you are updating an existing task.

```
To do:
  # 1
```

Your task has only a name. Write this after:

```
# 1: Now with description
And further details
```

Now your task has a description and details.

### The kanban

The [kanban board](http://en.wikipedia.org/wiki/Kanban_board) is the board where I stick my notes. So it is the place
where your tasks will end.

If you want to see your task rendered, it is not enough to describe it, you have to put them inside some state.
At current time, states are fixed:
* `To do`: things that remain undone
* `Doing`: things in progress
* `Done`: things you finished
* `Unshecduled`: things you think about but they are not mandatory

To put a task into a state you write one the former names of the states, followed by two dots `:` and then the tasks
which are in this state.

```
To do:
  # 4: Read "Clasifying tasks" section
  # 5: Read "Colour your world" section
  
Doing:
  # 3: Read "The kanban" section

Done:
  # 1: Read "Practical examples" section
  # 2: Read "Updating a task" section
```

Trick: Use cut and paste to move your tasks from one state to another.

### Clasifying tasks

You can classify your tasks inside a topic. To do this, add two dashes to your kanban to create the
**classification area**:

```
To do:
  # 5: Read "Colour your world" section
  
Doing:
  # 4: Read "Clasifying tasks" section

Done:
  # 1: Read "Practical examples" section
  # 2: Read "Updating a task" section
  # 3: Read "The kanban" section

--

```

After the two dashes you can define topics by writing a name, two dots `:` and putting tasks inside:

```
To do:
  # 5: Read "Colour your world" section

Doing:
  # 4: Read "Clasifying tasks" section

Done:
  # 1: Read "Practical examples" section
  # 2: Read "Updating a task" section
  # 3: Read "The kanban" section

--

Syntax:
  # 1: Read "Practical examples" section
  # 2: Read "Updating a task" section
  # 5: Read "Colour your world" section

Areas:
  # 3: Read "The kanban" section
  # 4: Read "Clasifying tasks" section

```

Trick: use the classification area after the two dashes to write details, completion information and deadlines and keep
the kanban as simple as possible. You can always view all the information about a task by pointing over a task.

### Colour your world

After a topic, use `(<color in #RGB>)` to indicate a color.

```
To do:
  
Doing:
  # 5: Read "Colour your world" section

Done:
  # 1: Read "Practical examples" section
  # 2: Read "Updating a task" section
  # 3: Read "The kanban" section
  # 4: Read "Clasifying tasks" section

--

Syntax (#FF8C34):
  # 1: Read "Practical examples". section
  Go to http://github.com/lodr/mtask and start reading.
  See how task 1 is a very simple way to define a task ;)
  >> 3/3

  # 2: Read "Updating a task" section
  Note how we are updating the task 2 by adding further
  details. You could omit repeating the description, only
  the name is needed to refer a former task.
  >> 3/3

  # 5: Read "Colour your world" section
  Adding colour to tasks help you to distinguish what
  to do.
  >> 2/3

Areas (#F71BBA):
  # 3: Read "The kanban" section
  Keep your kanban as simple as possible. Task there should
  only have the name and description at most. Remember you
  can use any text as names. If you choose short names instead
  of numbers you could omit the description as well.
  >> 3/3

  # 4: Read "Clasifying tasks" section
  The classification section was though to be the starting point.
  Start by describing and classifying your tasks, then put them
  in different states while you complete them.
  >> 3/3
```

That is all by now. More features are coming. Please, use it and give me feedback ;)
