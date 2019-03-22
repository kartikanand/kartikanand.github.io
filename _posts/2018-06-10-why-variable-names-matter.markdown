---
title: "Why variable names matter"
layout: post
date: 2018-06-10 09:00
author: kt
category: blog
description: A short post on why variable names matter
---

>This is a short story of me spending three days to debug a bug in the serializer code of a project and explain why it took me so much time to find the actual piece of code responsible for incorrect behaviour.

The story starts with a simple bug being reported that we’re getting incorrect values while reading in from the serialized binary file. While, I was able to reproduce the bug deterministically every time, it seemed to me that we were actually dumping the correct value to file.

Since this was a binary dump, it was not easy to poke into the file and see what values are present in it. So, to debug it, I resorted to the function which was dumping this value to file and figure out if it is doing the right thing or not. It looked a bit like below:

    SerialDumper d;
    for e in expressions:
        d.write(e);

This was a very simple piece of code, and I could see correct values being written to the dumper class in the debugger. I spent days trying to figure out where things are going wrong. To be honest, I never peeked inside the write function, and this was due to the fact that this code has been dumping values for 10 years now, if there was something wrong in this single function, nothing else should’ve been working correctly.

See, after spending a lot of time in frustration, I started checking other parts of the same function, and somewhere down below I found this:

```c
SerialDumper dmp;
for e in expressions:
    dmp.write(e);
...
for e in dmp:
    if some_cond:
        strm << e;
    else:
        strm << something_else;
```

The bug here was quite simple, the condition `some_cond` wasn’t getting fulfilled in this case, and the incorrect expressions `something_else` was getting dumped instead of the actual expressions. I never looked at this piece of code, since to me the `dmp.write` method was writing the correct expression all along.

And this is where I realised that the dumper class I thought as responsible for dumping the value of expression to file, was incorrectly named as so. The class `SerialDumper` is actually just a cache to make sure we don’t dump duplicate expressions and unnecessarily increase the size of serialized file.

To make matters worse, the member function was called “write”, which sounded to me that well this is actually writing everything, so it should be correct.

And this is why, people say that name your variables correctly and for their correct purpose. Even if the variable name was a single character or something (which engineers strongly suggest against) I would’ve checked it. But the fact was that it was named “dumper” and I didn't give it another thought.

This goes on to prove that, one should write code assuming that other people are going to read it. It doesn’t matter if you thought that naming the map cleverly is ok, since, when other people would debug thus code they would not think of this cleverness.
