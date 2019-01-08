---
title: "Python Bits - Finally keyword"
layout: post
date: 2017-12-24 09:00
headerImage: false
tag:
- python
- development
- programming
category: blog
author: kartikanand
description: An introduction to the finally keyword in Python
---

If you’re familiar with Python exception handling, with `try` and `except`, we
also have the `finally` keyword which can seem a bit strange for someone who
codes regularly with `C` or `C++`

First let’s look at what it’s useful for

    try:
        print('inside try block')
        raise IndexError
    except IndexError:
        print('inside except block')
    finally:
        print('inside finally block')

    # running this should yield
    inside try block
    inside except block
    inside finally block

So, the main use for `finally` block is to clean up resources, for example, you
can close a file or a database connection in the finally block. It always runs,
when I say always I mean always, irrespective of the fact if any exception was
raised or not.

    try:
        print('inside try block')
    except IndexError:
        print('inside except block')
    finally:
        print('inside finally block')

    # running this should yield
    inside try block
    inside finally block

Here’s a piece of code where the fun begins :

    def ret_3():
        try:
            print('returning 3')
            return 3
        finally:
            print('in finally')

    data = ret_3()
    print(data)

    # running this should yield
    returning 3
    in finally
    3

The above code is something I find a little strange, if you’re used to reading
code from top to bottom, it would seem to someone that once we hit the return
statement, the function should return and the code shouldn’t have hit the
finally block. But it does, as I said, the finally block is always run.

Another interesting piece of code is:

    def ret_7():
        print('returning 7')
        return 7

    def ret_3():
        try:
            print('returning 3')
            return ret_7()
        finally:
            print('in finally')

    data = ret_3()
    print(data)

    # running this should yield
    returning 3
    returning 7
    in finally
    7

This means, if there is an expression in `return`, first we evaluate that, then
comes the `finally` block, and then we return the expression.

At the same time, you can also return from the `finally` block, something you
should not do if you’re returning from the `try` block as well, because :

    def ret_7():
        print('returning 7')
        return 7

    def ret_3():
        try:
            print('returning 3')
            return ret_7()
        finally:
            print('in finally')
            return 'oh no'

    data = ret_3()
    print(data)

    # running this should yield
    returning 3
    returning 7
    in finally
    oh no

Now credit where credit’s due, the reason for this blog post is because I
stumbled upon this piece of code by [Peter Bengtsson](https://www.peterbe.com/)
— [Really simple Django view function timer
decorator](https://www.peterbe.com/plog/really-simple-django-view-function-timer-decorator)

    try:
        t0 = time.time()
        return func(*args, **kwargs)
    finally:
        t1 = time.time()
        print('{:.2f}ms'.format(1000 * (t1 - t0)))

The above code will guarantee that even if our function throws an exception, we can still calculate the amount of time it took to complete, and the finally block will re-raise that exception.

**References:**

1.  [https://www.peterbe.com/plog/really-simple-django-view-function-timer-decorator](https://www.peterbe.com/plog/really-simple-django-view-function-timer-decorator)
1.  [https://docs.python.org/2/tutorial/errors.html](https://docs.python.org/2/tutorial/errors.html)

### Kartik Anand
