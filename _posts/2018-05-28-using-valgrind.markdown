---
title: "Developer toolkit - Using valgrind"
layout: post
date: 2018-05-28 09:00
author: kt
category: blog
description: An intro to using valgrind to detect memory errors
---

When you code in C and C++, you’re responsible for memory being allocated on the heap. Whenever you use malloc or new, you’re effectively taking memory from the heap, which you’re supposed to give back yourself.

If you’re not careful, this could potentially lead to memory leaks, memory corruption due to double free, or sometimes accessing the wrong pointer.

Thankfully, we’ve tools that can at help us in identifying our mistakes. One particularly powerful tool in this regard is valgrind, it’ll not only show memory leaks, but will also point towards double free and uninitialized variables.

In this introductory blog post, I’ll show three areas where valgrind is particularly useful, how to run it, and what kind of output you can expect to see.

To install valgrind on Ubuntu, just use the following command:

    sudo apt install valgrind

## Memory leaks

Let’s tackle the issue of memory leaks first, this happens when you allocate memory on heap but forget to release it to system yourself

    #include<stdio.h>
    #include<stdlib.h>
    int main(int argc, char** argv) {
        int* p = (int*)malloc(sizeof(int));
        *p = 3;
        printf("pointer value : %d\n", *p);
        //free(p);
        return 0;
    }

You can compile the above program using the following command. The `-g` flag tells `gcc` that we want to create a debug build

    gcc -o test -g test.c

Then run valgrind using the following command:

    valgrind --leak-check=full --show-leak-kinds=all --track-origins=yes ./test

And voila, valgrind would tell you that you forgot to free the memory:

    ==4083== HEAP SUMMARY:
    ==4083==     in use at exit: 4 bytes in 1 blocks
    ==4083==     total heap usage: 2 allocs, 1 frees, 1,028 bytes allocated
    ==4083==
    ==4083== 4 bytes in 1 blocks are definitely lost in loss record 1 of 1
    ==4083==    at 0x4C2DB8F: malloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
    ==4083==    by 0x40057E: main (test.c:5)

Not only will valgind tell you that you’ve got memory that you forgot to free, but it’ll also point towards the line where you actually allocated memory from the system.

Uncomment the `free(p)` line, compile the program and run it again. You’ll see that the above message will disappear.

## Double free

Double free generally happens when you free a portion of memory more than once. You may think why would someone do this, but for huge code bases, where there is no standardization of as to who should free the memory, the caller or callee, this is a problem people keep running into. Most of the times, this may not do anything at all, and sometimes it may just take the whole program down.

    #include<stdio.h>
    #include<stdlib.h>
    int main(int argc, char** argv) {
        int* p = (int*)malloc(sizeof(int));
        *p = 3;
        printf("pointer value : %d\n", *p);
        free(p);
        free(p);
        return 0;
    }

If you compile and run the above program, chances are you may see something like this:

    pointer value : 3
    *** Error in `./test': double free or corruption (fasttop): 0x00000000016dc010 ***
    ======= Backtrace: =========
    /lib/x86_64-linux-gnu/libc.so.6(+0x777e5)[0x7f85e83457e5]
    /lib/x86_64-linux-gnu/libc.so.6(+0x8037a)[0x7f85e834e37a]
    /lib/x86_64-linux-gnu/libc.so.6(cfree+0x4c)[0x7f85e835253c]
    ./test[0x40060c]
    /lib/x86_64-linux-gnu/libc.so.6(__libc_start_main+0xf0)[0x7f85e82ee830]
    ./test[0x4004e9]
    ======= Memory map: ========

The problem is that in a short program like this it is easy to figure out that you’re freeing the memory twice, but in case of huge code-bases you’ll need help. Run valgrind again and you’ll see something like below:

    ==4321== Invalid free() / delete / delete[] / realloc()
    ==4321==    at 0x4C2EDEB: free (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
    ==4321==    by 0x40060B: main (test.c:10)
    ==4321==  Address 0x5204040 is 0 bytes inside a block of size 4 free'd
    ==4321==    at 0x4C2EDEB: free (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
    ==4321==    by 0x4005FF: main (test.c:9)
    ==4321==  Block was alloc'd at
    ==4321==    at 0x4C2DB8F: malloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
    ==4321==    by 0x4005CE: main (test.c:5)

You can see that valgrind exactly tells you which block got allocated, and how it was freed twice on which line -

Alloc -

    by 0x4005CE: main (test.c:5)

1st Free -

    by 0x4005FF: main (test.c:9)

2nd Free -

    by 0x40060B: main (test.c:10)

## Uninitialized variables

This is one problem that can hurt your program and you wouldn’t even notice. Although, turning on compiler warnings may help you mitigate the above for variables allocated on stack, it is generally a good idea to run valgrind and look for such uninitialized variables

    #include<stdio.h>
    #include<stdlib.h>
    int main(int argc, char** argv) {
        int p;
        if (p) {
            printf("Hello, world!\n");
        }
        int *hp = (int*)malloc(sizeof(int));
        if (*hp) {
            printf("Hello, world!\n");
        }
        return 0;
    }

Here, we’re printing something based on the value of variable p, but we’ve not initialized it, therefore it has garbage value. The compiler won’t automatically initialize such variables for you.

The above error can be caught both by the compiler as well as valgrind. If you run `gcc` with the flag `-Wall`, it would give a warning for uninitialized variables on stack

    gcc -o test -g test.c -Wall

And the below warning:

    test.c: In function ‘main’:
    test.c:6:8: warning: ‘p’ is used uninitialized in this function [-Wuninitialized]
         if (p) {

Running valgrind on the above test-case should yield something like below:

    ==4746== Conditional jump or move depends on uninitialised value(s)
    ==4746==    at 0x400579: main (test.c:6)
    ==4746==  Uninitialised value was created by a stack allocation
    ==4746==    at 0x400566: main (test.c:4)
    ==4746==
    Hello, world!
    ==4746== Conditional jump or move depends on uninitialised value(s)
    ==4746==    at 0x40059B: main (test.c:11)
    ==4746==  Uninitialised value was created by a heap allocation
    ==4746==    at 0x4C2DB8F: malloc (in /usr/lib/valgrind/vgpreload_memcheck-amd64-linux.so)
    ==4746==    by 0x40058E: main (test.c:10)

You can see that valgrind caught both initialized variable on the stack as well as on the heap. You may also notice we got one print of “Hello, World!” owing to the fact that it had some garbage value and the conditional evaluated to true in this particular case.

Valgrind, is not limited to just what I’ve shown above. It can be used for profiling your programs, as well as detecting race conditions in multi-threaded code. It is an indispensable tool for anyone programming in C and C++ as you saw above. You can find more information on using valgrind as a memory error detector as well as the test cases here:

- [valgrind manual](http://valgrind.org/docs/manual/mc-manual.html)
- [using valgrind](https://github.com/kartikanand/using-valgrind)
