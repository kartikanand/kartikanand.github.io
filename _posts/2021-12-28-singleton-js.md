---
title: "Singleton pattern in JavaScript"
layout: post
date: 2021-12-28 01:00
author: kt
category: blog
description: How to create restrict single instantiation of a class in JavaScript
---

Singleton pattern can be achieved quite trivially in JavaScript with the help of Immediately Invoked Function Expression, also known as [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)

The idea is to directly call a function as it is declared.

Let's say we have a class conveniently called `Singleton` that we want to instantiate just once over the course of our application. One way of going about it is as follows -

```javascript
const getInstance = (() => {
  let instance = null;
  return () => {
    if (instance == null) {
      instance = new Singleton();
    }

    return instance;
  };
})();

const i = getInstance();
```

#### References

- [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)
