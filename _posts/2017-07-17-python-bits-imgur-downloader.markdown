---
title: "Python Bits — Writing an Imgur Album downloader"
layout: post
date: 2017-07-17 09:00
author: kt
category: blog
description: Using Python to download Imgur albums from the CLI
---

> This is the first in the series of Python blog posts I’m “hoping” to write. In
> this particular one I’ll write a simple python script to download whole Imgur
albums to your local hard drive. I’ll be continuing on this code and explain how
to add threads, later we’ll convert threads to “async await” style, and finally
create a standalone python package.

A while back I stumbled upon this [Digital Ocean wallpaper
album](https://imgur.com/a/q6i58) from reddit. Never being by satisfied with
just one, I went on to save all of them one by one (which in itself is quite a
boring process). Sure, I could have used a dozen Imgur album downloaders from
the Internet, but what’s the fun in that. So, I thought of writing another one,
and that too in Python, which I can run through my terminal.

I started by first searching for Imgur API docs, and a quick google search led
me to the official [Imgur API Python](https://github.com/Imgur/imgurpython)
bindings. It was quite simple to use the Imgur python package, all you had to do
was register over
[here](https://imgur.com/signin?redirect=https://api.imgur.com/oauth2/addclient)
to get your client secret and id.

I found an API `get_album_images` which when given an album id will give me a
list of image hyperlinks. I can then loop through them and simply download them
using the all powerful Python requests library.

You can get the required album id from the url itself. If you see closely at the
link below, you’ll see that the album id is usually the last few letters after
the /a/ sub-url.

    https://imgur.com/a/q6i58

Downloading a file using requests library is a little tricky, what we’ll have to
do is a GET request to our image with a special option `stream=True`. When this
option is given, instead of downloading the link immediately, requests would
defer the download and we can iterate over the request one chunk at a time and
save it to a file. Since we’re always consuming the whole request we don’t need
to call `Response.Close`

To create your environment you’ll need to install the following python packages:

    # Install these using pip in a virtual environment preferably
    imgurpython
    progressbar2
    requests

Here’s the solution I came up with :

<script src="https://gist.github.com/kartikanand/fa0c6ec8d7d010e8998ab49d4b5acd7e.js"></script>

You’ll notice a weird function `get_extension` which depends upon a cryptic
regex `r’\.(\w+)$’`, what this regex is doing is trying to find the last word
after a “.”(dot) character, which we can safely assume to be the extension of
our image.

It’s simple and gets the job done, but it’s hard to tell how many images it has
downloaded till now, it needed a progress bar.

So, let’s add one. For doing that we use a handy library for adding a [progress
bar](https://github.com/WoLpH/python-progressbar).

It’s very easy to add a progress bar using the above utility, the only thing
that we want to do is wrap our items list with a `ProgressBar` instance, and
just loop normally. Let me clear what I said using some code:

<script src="https://gist.github.com/kartikanand/a21ce26421de9bf147900743bdfa5cc0.js"></script>

In our case, instead of iterating over numbers, we’ll iterate over the list of
images we’re downloading. Also, while we’re doing that, why not abstract away
the code actually downloading the images to a separate function (This will help
us in creating a threaded version of our code as well):

<script src="https://gist.github.com/kartikanand/18b11c0679bb6d01bed4c1838de3b014.js"></script>

To run this code first set the `IMGUR_CLIENT_ID` and `IMGUR_CLIENT_SECRET`
environment variables with the values provided by Imgur. Then you can simply use
Python to call this script and pass the album id as a command line argument

    python imgur_download.py q6i58

The code as it stands currently is too slow, this is due to the fact that the
images are being download sequentially. In the next post, we’ll use threads to
speed it up by processing downloads in parallel.
