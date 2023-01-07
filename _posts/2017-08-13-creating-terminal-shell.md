---
title: "Creating a Terminal shell"
layout: post
date: 2017-08-13 09:00:00
author: kt
category: blog
description: A tutorial on creating your own terminal shell
---

> In this series of posts we’ll create a Linux terminal shell from the ground up
> using the C programming language and some basic Linux system calls. This shell
is not designed to replace your current shell like Bash, Zsh, etc. which have
had years of development, but rather to learn how these programs work
internally.

Modern shells today support a myriad of features ranging anywhere from advanced
text completion to fancy prompts. Alas, it would be quite difficult to cover
everything in this series, so we’ll try to restrict ourselves to a very basic
shell, something that works and you can build upon later. We would at the very
least try to support the following features nearly every shell supports:

1.  Process Execution
2.  Builtins like `cd` (`cd` is not a program, but rather a builtin command nearly
every shell provides)
3.  Redirecting streams like `stdin`, `stdout`, and `stderr`
4.  Pipes : `ls | cowsay`
5.  Environment Variables : `$PATH, $HOME`
6.  Job Control — `Ctrl + C (Process Termination)`and `Ctrl + Z (Process
Suspension)`

To be able to follow along you would need `gcc` installed on your system, if you
are more comfortable with `clang`, or any other compiler tool chain, just follow
along, but be sure to substitute anything which is exclusive to `gcc` with what
you’re using. Since we would be doing system calls, I recommend people to follow
this tutorial with a Linux Operating system, this is only due to the fact that
I’m totally clueless about Windows and MacOs when it comes to system calls. If
you’re averse to Linux for any reason(I don’t judge), most parts of this program
should work well with any operating system, just be sure to substitute the ones
which don’t with the variants particular to your operating system(I’ll be sure
to remind you of this).

A shell in an essence is a
[REPL](https://en.wikipedia.org/wiki/Readâevalâprint_loop) program

#### R — Read the current command

#### E — Evaluate it

#### P — Print the results

#### L — Loop and continue with step 1 (Read)

In this post we’ll start with the basics of constructing a REPL system and
process execution.

Since we’re in the land of C Programming, we’ll be declaring our functions in
header files, and defining them in source files. Moreover, we’ll start by
creating a simple `Makefile` to build our shell. If you have little experience
with Makefiles then checkout these tutorials [here
](http://www.cs.colby.edu/maxwell/courses/tutorials/maketutor/)and
[here](https://www.cs.umd.edu/class/fall2002/cmsc214/Tutorial/makefile.html).

We’ll start with a simple `Makefile`, we’ll organize our source files into two
directories : `src` (containg actual code) and `include` (containing header
files). Our `Makefile` will be responsible for creating two more folders when
build is complete: `lib` (containing object files) and `bin` (containing the
actual binary).

<script src="https://gist.github.com/kartikanand/cf587ce752824d8ae68e375150ec7b84.js"></script>

Now first we’ll create the **REPL** part our of shell. This will be a do-while
loop which keeps running unless it encounters an error.

<script src="https://gist.github.com/kartikanand/4bc1750dbf5f6f6ed2db67217d53ae39.js"></script>

Now we’ll create the `print_prompt`, `read_line`, and `eval` functions.

The print_prompt function is the easiest of the set, it merely prints the name
of our shell and the `>> `symbol. For now we’ll leave it like this, but you can
always add stuff to it like the name of user, machine, and/or the current
working directory.

<script src="https://gist.github.com/kartikanand/d984f0c4f5a8e001d9a35797f77c449a.js"></script>

The other function that we have the `read_line` function is just a wrapper over
library functions for getting input string. In this tutorial I’m using the
`getline` function, but feel free to use any other function that gets the job
done. The `getline` function will return the number of characters read, we’ll
use this for our error handling mechanism

> A note: There are way better methods for error handling, for example setting
> error numbers. Returning error numbers is a simple method which works and is
simple to implement for small projects like this one, but for large and
production level projects look for more robust methods for handling errors.

<script src="https://gist.github.com/kartikanand/ef76069ef0eaab98f4dcdfe2423bd967.js"></script>

Now before working out the eval function, we need to make two more functions :
`strip_line` and `tokenize_line`

The first `strip_line` function is easy, it’s responsible for removing `\n` from
the end of line which we’ll get while using our `getline` function before

<script src="https://gist.github.com/kartikanand/2e3b748a068dd62c1fa40d23214a2ebb.js"></script>

The next `tokenize_line` is a bit more involved. We’re using `strtok` library
function for tokenizing our line into individual tokens. For now we’ll rely on
the `<space>` character as a delimiter. We’ll also create an array of `char*`,
this will be used for storing pointers to individual tokens. By default, we’ll
only handle upto 1024 tokens, we’ll create a macro to define this limit.

<script src="https://gist.github.com/kartikanand/ef6c2adae9be7c3475f9b97429728005.js"></script>

Let me explain the gory `char ***tokens`. So the `tokens` array is responsible
for holding `strings`, in C world it would be `char*`. Since `tokens` is an
array itself, its declaration would look something like `char **tokens`. Now,
the above function is responsible for mutating the `tokens` array, filling it up
with tokens, therefore we need to send a reference of this array to this
function, `tokenize_string(&tokens);` Thus, in the function itself, we would
need `char ***tokens`.

Now let’s finish up by creating our eval function, before that let’s learn the
basics of starting processes with the help of standard library. Now what I’m
describing below is specific to Linux systems, so be sure to switch them with
variants specific to your operating system.

The Linux Kernel provides a whole family of `exec` functions which can be used
for calling processes, these range from being able to pass array of arguments,
to variable number of arguments, and whether to search for program name in
`PATH` environment variable or not. You can find more information about them
[here](https://linux.die.net/man/3/execvp). The following is the list:


You can view the exact use of each exec function in this [StackOverflow
answer](https://stackoverflow.com/a/5769803). For us, `execvp` will do the job.
The `v` is there because we’ll be passing the arguments as an array, and the `p`
because we want `exec` to use the `PATH` environment variable for calling
processes (which is what you’d expect from any shell)

Apart from `execvp` we need to be aware of three more functions : `fork`,
`waitpid`, and `WIFEXITED`. The `fork` function lets us create a copy of the
calling process and the control then literally “forks” into two branches (that’s
why the name). One branch for the return value greater than 0 corresponds to the
parent process (The process which has called the `fork` function), the other
branch corresponds to the child process (which has forked from the parent). In
the child process we’ll call `execvp` to replace the child process with the
program we want to call, and in the parent process we would wait for the child
process to complete. We can use `waitpid` function call to achieve this, just to
remind you that the return value of `fork` is the process id of child process.
Then with the return value of `waitpid` we would call `WIFEXITED` to check
whether the child process terminated with or without errors, and take
corresponding action.

Here’s how it’s done:

<script src="https://gist.github.com/kartikanand/63453355d30771084219f68f25c7fe99.js"></script>

Now to sum it all up, create a file named `shell.c `in the `src` directory, it
should look like following :

<script src="https://gist.github.com/kartikanand/280730ba83c31e0aaf03d34116fda3ed.js"></script>

In the include directory, create the following file : `shell.h`

<script src="https://gist.github.com/kartikanand/23b381fa5c93ee82c0bf46e2ed31d090.js"></script>

In your working directory, you should have the following directory

    .
    ├── include
    │   └── shell.h
    ├── Makefile
    └── src
        ├── main.c
        └── shell.c

Now just run `make` on the command line, and voila you’ll have `bin/msh` as your
own shell, ready to run programs

    kartik@kt:~/projects/blog$ make
    kartik@kt:~/projects/blog$ ./bin/msh
    msh >> ls
    bin  include  lib  Makefile  src

In the next part, we’ll add builtins to our shell, especially the `cd` builtin!
