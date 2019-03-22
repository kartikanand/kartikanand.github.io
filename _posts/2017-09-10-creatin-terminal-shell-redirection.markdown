---
title: "Creating a Terminal shell - Redirecting Streams"
layout: post
date: 2017-09-10 09:00
author: kt
category: blog
description: Adding the functionality of redirecting streams to our terminal shell
---

> This post is in continuation to to our series on creating a terminal shell. You
> can checkout the first post
> [here]({% post_url 2017-08-13-creating-terminal-shell %}). In
> this post, we’ll add the ability to redirect streams for the programs we run
> through our terminal shell.*

In this post we’ll add another important functionality present in almost all
terminal shells, the ability to redirect streams — `stdin`, `stdout`, and
`stderr`.

In our shell, we’ll identify three specific tokens that will tell us that the
user wants to redirect streams :

    “>”  — Redirect the output stream

    “<”  — Redirect the input stream

    “>&” — Redirect the error stream

There is an easy way to redirect streams on Linux, we can use the `dup2`
function call which takes two arguments, the source file number, and the
destination file number :

    int dup2(int oldfd, int newfd);

So, let’s say we want to redirect the output stream, what we can do is, create a
new file in write mode, call `dup2` with the `oldfd` as our newly created file,
and the `newfd` as `stdout`. So, by doing this we’re in effect making our newly
created file as stdout.

See the following example :

    FILE* stdout_redirect = fopen(output_file_name, "w");
    dup2(fileno(stdout_redirect), fileno(stdout));

    fclose(stdout_redirect);

We need to call `fclose` because now `stdout` is pointing towards our file and
we can release the `stdout_redirect` file descriptor.

Using this process we can create a function `set_streams` which accepts a
`struct` of three different streams and just redirects each of them.

<script src="https://gist.github.com/kartikanand/23a7ee8f856c18efdc90ea78f4005bca.js"></script>

Now the other problem we need to solve is to get the file names for this
redirection to take place, whenever a user would want to redirect the streams,
they would have to use those symbols we earlier mentioned. We can use theme
symbols in our `tokenize_line` function. Before that we’ll create an enum and a
struct which we’ll rely on while detecting streams. We’ll add these to `shell.h`
header file.

    typedef enum {
     INPUT_STREAM,
     OUTPUT_STREAM,
     ERR_STREAM,
     NONE_STREAM
    } STREAM_TYPE;

    typedef struct {
     const char* input;
     const char* output;
     const char* err;
    } stream_s;

Now whenever we get one of the tokens from `[“>”, “<”, “>&”]`, we’ll set the
`STREAM_TYPE`, and when we get the next token from the input line, we’ll know
that it is the file name for redirection and not a simple token.

Here’s how it’s done:

<script src="https://gist.github.com/kartikanand/3ab8ec0edb3464f5d6bc06912ab3fa7c.js"></script>

Now just run make, and we can redirect streams !

    kartik@kt:~/projects/blog$ ./bin/msh
    msh >> ls
    bin  include  lib  LICENSE  Makefile  README  src
    msh >> ls > out
    msh >> cat out
    bin
    include
    lib
    LICENSE
    Makefile
    out
    README
    src
