---
title: "My terminal is my IDE"
layout: post
date: 2018-02-13 09:00
headerImage: false
tag:
- development
- programming
- linux
category: blog
author: kartikanand
description: A description of command-line tools I use for development
---

![](https://cdn-images-1.medium.com/max/1600/1*l7pz0seA3lNR-11nRhgK-Q.jpeg)

When people ask me what IDE I use at my work, I tell them I don’t. This always
baffles my friends who are used to working with PyCharm, Eclipse and Visual
Studio. When they pester me further, I would generally say something along the
lines of

> My terminal is my IDE

For my day job I work on creating synthesis tools for hardware description
languages. Synthesis tools are your compilers for Verilog, VHDL, and System
Verilog family of languages. These compilers are generally run on Linux based
operating systems and we use a mixture of C and C++ for their development.

First thing I want to say is that these compilers are huge something along the
lines of half a million lines of code and take almost 30 minutes to build even
when parallel compilation is turned on. Generally, today’s IDEs are well
equipped for these kind of code bases but to me they kind of get in the way.

Here are some of the tools which I use to accomplish the same tasks a modern IDE
has in built support for.

`cscope` : This is an excellent tool for navigating huge C and C++ code bases.
It lets you find where a particular identifier is defined. Where is this
function getting called, yada yada. To add to this, the tool is fast, on the
first run `cscope` would automatically create a index of identifiers and thus
searches are very fast. You can have a look at the screenshot below which
summarised what this nifty command-line tool can accomplish. You can download
`cscope` from [here](http://cscope.sourceforge.net/).

![](https://cdn-images-1.medium.com/max/1600/1*G2b0cCWZ2CyfS54JnO1kog.png)

---

`cgdb` : This is a curses based wrapper over `gdb` which allows you to see your
code base while debugging through it (Yes, this is possible in `gdb` as well,
but `cgdb` doesn’t require you to press awkward shortcut keys to make the code
appear, plus it doesn’t mess up the code window whenever you print something
that goes beyond the current command window). Moreover, `cgdb` even has support
for syntax highlighting and allows you to browse through history of commands
using arrow keys, which `gdb` doesn’t when your source window is open. You can
get `cgdb` from [here](https://cgdb.github.io/).

![](https://cdn-images-1.medium.com/max/1600/1*XvK8VlaCzBBwtwTXiDIiaQ.png)

---

`vim` : My editor for choice. I was introduced to it 4 years ago, and I love it.
I do use other editors like Sublime Text and VS Code, but for some reason,
coding in C and C++ just feels right at home in Vim. I won’t get into much
details since I believe I don’t even use 10% of Vim’s full potential, but there
is one feature that most developers prefer in IDEs that is essential for
development — jumping to the definition of a particular identifier. This can be
easily accomplished in Vim using either the built-in support for `ctags` or
using the powerful [ctrlp.vim](https://github.com/ctrlpvim/ctrlp.vim) plugin.
You can find more about `ctags` and `vim`
[here](https://andrew.stwrt.ca/posts/vim-ctags/). And you can see ctrlp.vim in
action below :

![](https://cdn-images-1.medium.com/max/1600/1*OtcvuQk_KgHzOSXCn6fohA.png)

Adding to the above, I use [vim-plug](https://github.com/junegunn/vim-plug) for
managing my vim plugins, I use the
[base16](http://chriskempson.com/projects/base16/) monokai theme for my terminal
(Gnome Terminal) as well as for Vim. As far as fonts are concerned, [Source Code
Pro](https://github.com/adobe-fonts/source-code-pro) is my font of choice.

---

`htop` : This is a replacement for the `top` command available on most unix
systems. `htop` provides a nice graphical interface (much nicer as compared to
`top`) and could graphically show the utilisation of each cpu core. You can see
for yourself looking at a screenshot of `htop` below and comparing it to `top`.
You can get `htop` from [here](https://medium.com/p/b7267ddd3bb2/edit).

![](https://cdn-images-1.medium.com/max/1600/1*IWiw_Ks36ZURR__37RttwA.png)

---

And that’s it, these lightweight tools are able to do most of the heavy lifting
for me. Apart from these, I just use normal linux commands like `grep`, `find`,
`sed`, `cut`, etc. if I want to create scripts or find something in a hurry.

### [Kartik Anand](https://medium.com/@exqu17)
