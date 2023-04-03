---
title: "Intro to browser internals"
layout: post
date: 2017-10-22 09:00:00
author: kt
category: blog
description: An introduction to web browser internals
---

Browsers are a complicated piece of software composed of many different modules
which work together to provide a unified interface to the world of the Internet.
People usually underestimate how much work browsers do behind the scene, after
all, there is way more to the magic than sending and receiving HTTP requests and
responses.

Most notably a browser consists of the following parts:

1.  [Networking stack ](https://en.wikipedia.org/wiki/Protocol_stack)— usually
provided by the Operating System
1.  [Widget Library](https://en.wikipedia.org/wiki/Widget_toolkit) — For displaying
controls, menu bars, the User Interface of the browser
1.  [Rendering engine](https://en.wikipedia.org/wiki/Web_browser_engine) — For
parsing HTML and CSS
1.  [JavaScript Interpreter ](https://en.wikipedia.org/wiki/JavaScript_engine)— As
the name suggests

Although there are numerous rending engines and JS Interpreters in the wild,
I’ll focus on the ones found in major browsers, specifically the following -

* [Chrome](https://en.wikipedia.org/wiki/Google_Chrome)
* [Mozilla Firefox](https://en.wikipedia.org/wiki/Firefox)
* [Safari](https://en.wikipedia.org/wiki/Safari_(web_browser))
* [Internet Explorer](https://en.wikipedia.org/wiki/Internet_Explorer)
* [Edge](https://en.wikipedia.org/wiki/Microsoft_Edge)

### Safari

Safari used the [WebKit](https://en.wikipedia.org/wiki/WebKit) rendering engine
developed by Apple which in itself is forked from KHTML and KJS (KDE HTML and
JavaScript engines). Webkit itself consists of two parts — WebCore which is
responsible for rendering layouts (HTML and CSS) and a JavaScript Core for
parsing and interpreting JavaScript. The JavaScript Core was later rewritten and
today is replace by an [LLVM](https://en.wikipedia.org/wiki/LLVM) based just in
time compiler called FTL, which stands for “Fourth-Tier-LLVM.”

### Chrome

Chrome initially used the WebCore part of WebKit rendering engine, but for its
JavaScript needs it relied on the [V8 JavaScript
engine](https://en.wikipedia.org/wiki/Chrome_V8) (Also used by the Node.js
project). In 2013, Chrome forked the WebKit engine and create its own rendering
engine called [Blink](https://en.wikipedia.org/wiki/Blink_(web_engine)) which is
now used by default in Chrome as well as Opera browser.

### Firefox

Firefox uses the [SpiderMonkey](https://en.wikipedia.org/wiki/SpiderMonkey)
JavaScript engine which is credited as the first JavaScript engine, created by
[Brenden Eich](https://en.wikipedia.org/wiki/Brendan_Eich), the creator of
JavaScript programming language. For rendering, it uses the
[Gecko](https://en.wikipedia.org/wiki/Gecko_(software)) web browser engine

### Internet Explorer/Edge

A browser plagued with issues w.r.t. to HTML and CSS standards, they did have a
mighty name for their layout engine —
[Trident](https://en.wikipedia.org/wiki/Trident_(layout_engine)). This was later
forked by the Edge team and rename to
[EdgeHTML](https://en.wikipedia.org/wiki/EdgeHTML). Internet Explorer uses the
[Chakra](https://en.wikipedia.org/wiki/Chakra_(JScript_engine)) engine for
executing [JScript](https://en.wikipedia.org/wiki/JScript) (Yes intentionally
called such to avoid trademark issues with Sun). Later on, the Edge team forked
it to create their own “JavaScript” engine, also called
[Chakra](https://en.wikipedia.org/wiki/Chakra_(JavaScript_engine)).
