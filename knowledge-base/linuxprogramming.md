---
title: Linux Programming
tags: [linux, systems_programming]
---

> Threads are for people who can't program state machines
Alan Cox [@loveLinuxSystemProgramming2013 212]

> There is in theory no programming problem that is solvable with threads that isn't solvable with a state machine
[@loveLinuxSystemProgramming2013 212]

## Boot Process

_On an x86-based PC, the first sector of every hard disk is known as the boot sector and contains the partition table for that disk and possibly also code for booting anoperating system. The boot sector of the first hard disk is known as the master boot record (MBR), because when you boot the system, the BIOS transfers control to a program that lives on that sector along with the partition table. That code is the boot loader, the code that initiates an operating system. When you add Linux to the system, you need to modify the boot loader, replace it, or boot from a floppy or CD to start Linux. In Linux, each disk and each partition on the disk is treated as a device._

## GRUB

A GRUB installation consists of at least two and sometimes three executables, known as stages. The stages are:

### Stage 1

Stage 1 is the piece of GRUB that resides in the MBR or the boot sector of another partition or drive. Since the main portion of GRUB is too large to fit into the 512 bytes of a boot sector, Stage 1 is used to transfer control to the next stage, either Stage 1.5 or Stage 2.

### Stage 1.5

Stage 1.5 is loaded by Stage 1 only if the hardware requires it. Stage 1.5 is filesystem-specific; that is, there is a different version for each filesystem that GRUB can load. The name of the filesystem is part of the filename (e2fs\_stage1\_5, fat\_stage1\_5, etc.). Stage 1.5 loads Stage 2.

### Stage 2

Stage 2 runs the main body of the GRUB code. It displays the menu, lets you select the operating system to be run, and starts the system you've chosen.

## Systems Programming

What most of us call “files” are what Linux labels regular files. A regular file contains bytes of data, organized into a linear array called a byte stream.

### Special file types

Block device files, character device files, named pipes, and Unix domain sockets.

### VOCAB

*   **File position:** current byte in file being read or written
*   **Length:** size of file
*   **Truncation:** changing file size
*   **Inode:** a unique integer in file system that refers to a file metadata, but not filename

write()

*   When a call to write() returns the kernel has copied the data from the supplied buffer into the kernel buffer.

*   There is no guarantee that the data has been written out to its intended destination.

*   The kernel runs a background task that gathers all the ( buffers that contain data newer than that on disk, sorts them and writes them to disk.

    dirty buffers
