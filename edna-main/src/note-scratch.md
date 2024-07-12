Welcome to Edna - a note taking app for developers and power users.

To learn more: https://edna.arslexis.io/help (or right-click for context menu and use `Help` / `Show help`).

This is a scratch note. Feel free to delete the content and use it for temporary notes.
∞∞∞markdown
# Keyboard shortcuts

{{keyHelp}}
∞∞∞markdown
# Blocks

Notes consist of blocks. Each block has a type:
* markdown
* plain text
* code block (JavaScript, Go and 30+ other programming languages)
* math block

Mod + L to change the type of block
Mod + B to navigate between blocks

Blocks have alternate background color.
∞∞∞math
This is a Math block. Lines are evaluated as math expressions with result rendered at end of line right.

radius = 5
area = radius^2 * PI
sqrt(9)

We support basic unit conversions and currencies:

13 inches in cm
time = 3900 seconds to minutes
time * 2

1 EUR in USD
∞∞∞markdown
In Markdown blocks, lists with [x] and [ ] are rendered as checkboxes:

- [ ] Try out Edna
- [ ] Do laundry
∞∞∞markdown
# Programmability

Learn more at https://edna.arslexis.io/help#running-code

If current block is Go or JavaScript block, you can run it:

- `Alt + Shift + R` keyboard shortcut
- context menu: `Run / Run <javascript> block`
- command palette: `Block: Run <language> block`

The output of execution will be shown in a new block created below the executed block.

You can run JavaScript functions with the content of a current block or a selection.

The function gets the content as argument, can traform it, and we show the output in a block below.

For example a function can sort the lines in a block, calculate md5 hash or transform it to upper case. The possibilities are literally limitless.

To run a JavasScript function with content of block:
- context menu: `Run` / `Run function with block content`
- command palette: `Run function with block content`
- pick a function from the list

To run a JavasScript function with selection:
- context menu: `Run` / `Run function with selection`
- command palette: `Run function with selection`
- pick a function from the list

If you want to see all built-in functions use:
- context menu: `Run`, `Show built-in functions`
- command palette: `Shw built-in functions`
