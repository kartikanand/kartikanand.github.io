---
title: "Python Bits — Moving from threads to async-await"
layout: post
date: 2018-01-15 09:00
author: kt
category: blog
description: An introduction to moving from threads to asynchronous programming
---

> This is the third post in the series of Python blog posts I’m writing, you can
> find the first one
[here]({% post_url 2017-07-17-python-bits-imgur-downloader %}).
In this particular one we’ll move from threads to async-await style introduced
in Python 3.5

Let’s start by clearing some terms, async-await is just another approach towards
asynchronous programming. The other two approaches that I know are callbacks and
promises (both quite famous in the JavaScript world).

One more thing thing we need to understand is that asynchronous just means that
tasks don’t block. For example, if I try to fetch a web-page from a slow
website, my program won’t have to wait for the download to finish, it can carry
on doing other things while it waits for the page to load. This isn’t the same
as doing multiple things in parallel. The following pseudocode should make
things a bit easier to understand :

```python
    # Blocking code example
    page = get_page_sync('some_page')

    # The call to print is blocked
    # If the get_page_sync is a slow function
    # Our whole program would get stalled

    print(page)
```

There are two approaches to mitigate the above scenarios. First, let’s use
threads (which we have done till now in our Imgur album downloader). By using
threads, we can offload the `get_page_sync` call to a separate thread and do
something else in the main program thread.

    ### offload the slow code to a thread
    t = threading.thread(target=get_page_sync, args=('some_page',))
    t.run()

    ### do something else while the thread runs
    do_something_else()

    ### wait for the thread to complete
    t.join()

There are several advantages as well as disadvantages to threading, the main
disadvantages being having to lock shared data structures before mutating them
and taking care of exceptions (within a thread) through message passing to the
main thread. At the same time, they’re a bit more convenient to work with as
compare to async-await (Or I’m just not yet used to this paradigm!)

Now let’s start with the second approach to mitigating the slow blocking
functions, the asynchronous programming approach, specifically we’ll be dealing
with the async-await syntax introduced in Python 3.5. The main difference that I
feel between async-await and multi-threaded programming is that in the latter
the kernel does a context switch while in the former we ourselves are
responsible for yielding control to a different part of code. What I mean by a
context switch is when multiple threads of code are running, it is upto the
kernel to stop executing the current thread, put it to sleep, and pick up a
different thread and continue execution. This is known as [preemptive
multitasking](https://en.wikipedia.org/wiki/Preemption_(computing)).

When we ourselves yield control, it is known as [non-preemptive or cooperative
multitasking](https://en.wikipedia.org/wiki/Cooperative_multitasking). Since,
with nonpreemptive multitasking it is our own code which is taking care of
context switches, we need a scheduler, also called an “event loop”. This event
loop just loops through all the events which are waiting to be scheduled and run
them. Whenever we yield control, the current task gets added to the queue, and
the first task (not by sequence, but by priority) gets popped from the queue and
starts executing. For example, the above pseudocode can be changed in the
following way to allow for yielding control:

    async def print_page():
        page = await get_page_async('some_page')
        print(page)

When we hit the above statement, the `get_page_async` function would do a
non-blocking fetch of `'some_page'` and yield control, which would in turn mean
that our `print_page` function would yield control to the event loop and the
event loop could continue doing something else till we get a response back.

Let’s start by changing our threaded code to this syntax. We’ll use the
`asyncio` library the Python itself provides for the event loop and use the
`aiohttp` package for doing asynchronous http requests.

We’ll create a function called `main` (defined later) which would be the entry
point of our asynchronous code. We’ll then create an event loop and a “future
object”. This future object is an abstraction over an asynchronous function
which stores some more attributes such as its current state (just like
promises). We will then tell our event loop to keep running until this future
completes.

    loop = asyncio.get_event_loop()
    future = asyncio.ensure_future(main())
    loop.run_until_complete(future)

Now in our main function, we’ll create another list of future tasks, each one
responsible for downloading a different image from the Imgur album. We do this
because each download would lead to a network call, and for each network call we
can yield control to another piece of code. After creating a list of tasks, we
can wait for the whole list to complete by calling `asyncio.gather`. This is how
its done:

    async def main():
        tasks = []
        async with aiohttp.ClientSession() as session:
            for img in img_lst:
                task = asyncio.ensure_future(download_img(img, session))
                tasks.append(task)

        await asyncio.gather(*tasks)

And the last function we need to modify is the `download_img` function which was
currently using threads. We just replace the `requests.get` call with `await
session.get` and change the synchronous save to disk operation to asynchronous:

    i = 1
    async def download_img(img, session):
        global i, bar

        # get the file extension
        file_ext = get_extension(img.link)
        # create unique name by combining file id with its extension
        file_name = img.id + file_ext

        resp = await session.get(img.link)
        with open(file_name, 'wb') as f:
            async for chunk in resp.content.iter_chunked(1024):
                f.write(chunk)

        bar.update(i)
        i += 1

One thing you’ll notice is that we no longer require the lock before updating
the value of `i`. This is because as I said earlier, only one piece of code is
running at a time, so there can never be any race conditions.

The asynchronous version of our previously implemented threaded code should be
slightly faster due to no overheads of either locks or threads.

Here’s the entire code:

<script src="https://gist.github.com/kartikanand/de7dd017af18078a7edf0b5be2317e20.js"></script>

Some very good sources for more info:

- [Get to grips with asyncio in Python 3 — Robert
Smallshire](https://www.youtube.com/watch?v=M-UcUs7IMIM&feature=youtu.be)
- [aiohttp docs](https://aiohttp.readthedocs.io/en/stable/)
