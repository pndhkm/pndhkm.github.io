# Directory Hierarchy Overview

Linux uses a *hierarchical file system*, where everything starts from the root directory (`/`).

---

## Main Directories and Their Purposes

| Directory          | Description                                      |
| ------------------ | ------------------------------------------------ |
| `/`                | Root directory — the base of the Linux system.   |
| `/home/`           | User home directories (e.g., `/home/student`).   |
| `/root/`           | Home for the root (administrator) user.          |
| `/etc/`            | System configuration files.                      |
| `/var/`            | Logs and variable data (changes frequently).     |
| `/usr/`            | Installed programs and utilities.                |
| `/bin/`            | Essential user commands (like `ls`, `cp`, `mv`). |
| `/sbin/`           | System commands used by administrators.          |
| `/tmp/`            | Temporary files (deleted after reboot).          |
| `/lib/`            | System libraries for programs.                   |
| `/opt/`            | Optional or third-party software.                |
| `/mnt/`, `/media/` | Mount points for external devices.               |
| `/dev/`            | Device files for hardware (e.g., `/dev/sda1`).   |

---

## Example Directory Structure

```
/
├── bin/
├── etc/
├── home/
│   ├── user1/
│   └── user2/
├── var/
│   └── log/
└── usr/
    └── bin/
```

