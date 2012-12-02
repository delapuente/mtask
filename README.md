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