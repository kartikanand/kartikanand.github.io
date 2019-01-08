---
title: "Python Bits — Using Threads"
layout: post
date: 2017-07-30 09:00
headerImage: false
tag:
- python
- api
- programming
- multi-threading
category: blog
author: kartikanand
description: Adding threads to our Python Imgur album downloader
---

![](https://cdn-images-1.medium.com/max/1600/1*QizxjQI0lGert9Fv6q3Vfw.jpeg){: .center-image }

> This is the second in the series of Python blog posts I’m writing, you can find
> the first one
> [here]({% post_url 2017-07-17-python-bits-imgur-downloader %}).
> In this particular one we’ll add threads to our Imgur Album downloader,
> hopefully making it a tad bit faster than before.

First of, you must be wondering, due to the infamous
[GIL](https://wiki.python.org/moin/GlobalInterpreterLock)(in
[CPython](https://stackoverflow.com/questions/17130975/python-vs-cpython) of
course), threads are not useful in Python. Luckily in our case, most of the time
threads will be waiting for network activity, and the GIL would happily switch
threads from one to another instead of locking on one of them. So, it would
actually be beneficial to use threads since most of the times we’ll be doing
either Network IO (while downloading the images) or File IO (while writing the
images to disk)

Since this is Python, using threads is quite simple, we just need to import the
threading module, create a thread instance, and then tell it to run. While
creating the instance we can tell it what function to run, and if needed, we can
pass arguments to that function through this thread we have created. We will
then call the `join` function in the main process loop so that we can wait for
our thread to finish

<script src="https://gist.github.com/kartikanand/7b5307cfd85af075a1eb787df9212f7d.js"></script>

We’ll just call our `download_img` function from each thread, telling it to
download a different picture. One problem we might face now is with the progress
bar, since threads run parallel to our main process thread, our for loop will
finish as soon as we have launched all the requisite number of threads, and thus
the progress bar would reach 100% before all the images have finished
downloading.

To counter this, after each thread completes, we’ll manually update our progress
bar.

This is how we do it :

<script src="https://gist.github.com/kartikanand/cfc6f18f0ebc667ea847962cf3fb7851.js"></script>

The `max_value` tells it that we have this many items, when the count reaches
that number, the progress bar should be at 100%. To update the progress bar,
we’ll take a lock to increment a variable, and use that variable to update the
progress bar. The lock is necessary to prevent multiple threads from updating
the same global variable simultaneously, and not mess up the whole thing.

<script src="https://gist.github.com/kartikanand/4e8ca7e24a4c7b61debb127ff947644c.js"></script>

Phew, that was quite some work with locks and all. In the next post, we’ll move
from these messy threads to the new and shiny **async-await** style for doing
asynchronous code.

### Kartik Anand
