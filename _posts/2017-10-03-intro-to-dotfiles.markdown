---
title: "Intro to dot files"
layout: post
date: 2017-10-03 09:00
author: kt
category: blog
description: An introduction to managing your dot files
---

So what’re dot files and why should you care. If you’ve been slamming away on
the command-line for some time, then you must have accrued lines and lines of
configuration files. Some to make your prompt display the current git branch, or
maybe to use that fancy power line at the bottom of your editor or to simply set
your username and email for git commits.

The term dot files refer to these configuration files that many popular command
line (as well as some gui) programs use for configuring themselves as per
individual tastes. These files are usually hidden files in user home directory
(These days many programs refer to configuration files under `$XDG_CONFIG_HOME`,
usually `~/config`), and hence the name “dot files”.

Mostly, your dot files will be there to configure your shell :

    ~/.bashrc
    ~/.bash_aliases
    ~/.cshrc
    ~/.zshrc
    ~/.inputrc

Or maybe your editor :

    ~/.vimrc
    ~/.emacs

Or even command-line programs like `git`

    ~/.gitconfig

When you’re just starting up, you’ll create and edit these files as and when you
use any application which depends on them. The problem arises when let’s say
you’re moving to a new laptop and you want the hard work you’ve put in
customising your bash prompt just right to appear on your new and shiny
hardware. Most people backup their important files and documents on cloud
storage, and use version control systems for their projects, but many people
just gloss over doing something like this for their dot files.

Backing up your dot files allows you to sync and restore them across your
computers, or maybe even make them accessible when you need to remember that
particular alias or setting.

One of the easiest way of doing this, which I follow is, I make a directory in
my home directory and create folders like `vim`, `bash`, and `git` inside it.
Then I store individual dot files inside these folders. The parent folder is
hosted on GitHub. Then whenever I install a new operating system, or if I want
my settings on a new computer, I just clone this folder and run a script to copy
these dot files to my home directory manually. And that’s it.

Personally, I take the Github approach since I like to have full control over my
applications, but some of you may want a complete system for organising and
managing your dot files. In that case, you may want to browse through the
following article by GitHub itself which has listed multitudes of applications
for managing your dot files

    https://dotfiles.github.io/
