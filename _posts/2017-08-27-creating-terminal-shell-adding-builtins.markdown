---
title: "Creating a Terminal shell - Adding Builtins"
layout: post
date: 2017-08-27 09:00
headerImage: false
tag:
- C
- terminal
- programming
category: blog
author: kartikanand
description: Adding builtins to our terminal shell
---

![](https://cdn-images-1.medium.com/max/1600/1*N_G5C1B66rCmowP_aT-6Aw.png)

> This post is in continuation to to our series on creating a terminal shell. You
> can checkout the first post
[here]({% post_url 2017-08-13-creating-terminal-shell %}). In
this post, I’ll show how to add builtin commands to our shell.

Specifically, we’ll be tackling the `cd` builtin (A command provided by the
shell). Now first let’s clear the air, why the heck is `cd `not a program ? So
what is the primary purpose of the command `cd` ? To change the current working
directory right ? But for whom if I may ask ? Well, in this case the terminal
shell itself. So, if `cd` were to be a program (which it is in some POSIX
compliant systems), whenever we run `cd`, it would change the current working
directory of the `cd` process itself, and when the process would terminate, and
return to shell, the shell would still have the same current working directory

This is how it would look :

    shell $ pwd
    /home/blog
    shell $ cd_process /some/other/directory
        cd_process starts
            chdir (/some/other/directory) - System Call
            current working directory change successful
        cd_process terminates
    shell $ pwd
    /home/blog

Therefore, to get around this conundrum, the shell itself has call the `chdir`
system call to be able to change its current working directory. The code for
doing that is quite simple :

<script src="https://gist.github.com/kartikanand/7139ea2f8555052fcb8719bab9d15c14.js"></script>

Yes, that’s it. Now just for the sake of it, and to make it easier to add more
builtins in the future, we’ll add some code to our existing shell to figure out
whether it’s dealing with a builtin command or some other program.

First we’ll create a new header file inside our `include` directory `builtin.h`
which will house the declarations for common functions, and also declare an
`enum` which will correspond to all the builtins we’ll add to our shell. Right
now it’ll have only two entries, one for `cd`, and one for null check.

<script src="https://gist.github.com/kartikanand/d041b0c28d02e52f8d4a119983dde508.js"></script>

Now we’ll create a series of utility functions which will help in translating
the string “cd” that we’ll get from command line to the `enum BLTIN_CD`, to the
actual function to be called. These functions are not really necessary right
now, but it really helps to create them right in the beginning. In the future,
when you add more builtin commands to your shell, it will be way more easier to
do so.

The first function in our list takes a command string and returns an `enum`,
this is the easiest of the bunch, we just compare the input string to predefined
string list and return the corresponding `enum`.

<script src="https://gist.github.com/kartikanand/3928e7e584736972cafbcfc3b50c1b4d.js"></script>

Now the next function is getting the actual function pointer from the builtin
`enum`. Now don’t get scared of the syntax you’re going to see below. A function
pointer is just a pointer to a function, and using that pointer we can call
functions. Now there is a weird way to write functions which return a function
pointer, I never remember it, just google when need to :P

<script src="https://gist.github.com/kartikanand/da037568709199ec0bb7f5aa533bb27f.js"></script>

Now the only function left is calling our function through the function pointer,
which is not very difficult.

<script src="https://gist.github.com/kartikanand/10203907bcdef31a82e6125799c8350e.js"></script>

In the end we’ll have the following file, save this as `src/builtins.c`

<script src="https://gist.github.com/kartikanand/8508649c037967bd5d4621ae6ac771bc.js"></script>

Now we just need to call our function inside our `eval` function. (Don’t forget
to include `builtins.h`)

<script src="https://gist.github.com/kartikanand/d8b86183f6d3c130c199935fba6c7e84.js"></script>

The final thing to do is change our `Makefile` to start building our `builtins.c
`file. Just add `$(LIB_DIR)/builtins.o` to the `OBJS` variable

    OBJS=$(LIB_DIR)/shell.o $(LIB_DIR)/builtins.o

Now just build, and we can `cd` into directories

    kartik@kt:~/projects/blog$ ./bin/msh 
    msh >> pwd
    /hdd/projects/blog
    msh >> cd /
    msh >> pwd
    /

In the next post we’ll add the support for redirecting streams, so hold on!

### Kartik Anand
