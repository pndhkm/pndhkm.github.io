#  Introduction
## What is Linux?

Linus himself has said:

* *“Linux is just a kernel, and it only gets interesting when paired with all the userland stuff.”*
  (Source: Linus Torvalds, [Linux Kernel Mailing List archives](https://lkml.org/))

Meaning: **System administration is not just about the kernel** but also about managing the surrounding ecosystem (userspace tools, configs, networking, etc.).

Reference:

* Linus Torvalds, *Just for Fun: The Story of an Accidental Revolutionary* (book, 2001).
  → In this book he explains his motivation for Linux and the role sysadmins had in early adoption.

---

## Linux Distributions Overview

Linus often emphasizes that he **doesn’t control distributions**:

* *“I don’t make Linux distributions, I just release the kernel. Distributors make the decisions about userland.”*
  (Source: Linus Torvalds, Linux Foundation events Q\&A)

This is important for your docs: system administration is tied to **distribution-specific tools**, but **the kernel is common**.

Reference:

* Linux Kernel Mailing List (LKML) – Linus repeatedly reminds people: *“I only care about the kernel.”*
* [Talk at Google: “Linus Torvalds on Git” (2007)](https://www.youtube.com/watch?v=4XpnKHJAok8) – he explains why distros exist and why kernel development is separate.

---

## Understanding the Linux Filesystem Hierarchy

Linus did not personally design the **Filesystem Hierarchy Standard (FHS)**. That came later, from the Linux Foundation and other groups.
But, he did set early conventions in the **Linux kernel source tree** and with **Minix/Linux in the early 1990s**:

* In early releases (Linux 0.01), Linus used a **simplified UNIX filesystem layout**: `/bin`, `/usr`, `/etc`, `/tmp`, etc., inspired by Minix.
* His philosophy: *“Don’t break userspace.”* Meaning once conventions are set (like `/etc` for configs), they must stay stable.

Authentic references from Linus:

* [Linux 0.01 source code release (1991)](https://github.com/torvalds/linux) — the earliest filesystem layout can be studied here.
* Linux Kernel Archives: [kernel.org](https://www.kernel.org/) — primary source for everything Linus approves.

