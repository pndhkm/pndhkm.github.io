# Boot Logs

Boot logs record kernel initialization and early system events.

### Kernel Initialization Messages
Input:

```
dmesg | less
```

Output:
```
[    0.000000] Linux version 6.6.0 (gcc version 13.2.0)
[    1.234567] usb 1-3: new high-speed USB device number 2 using xhci_hcd
```

Kernel messages showing hardware detection and subsystem initialization.

References:
- https://man7.org/linux/man-pages/man1/dmesg.1.html

### systemd Boot Journal
Input:

```
journalctl -b
```

Output:
```
Nov 18 10:01:22 host systemd[1]: Starting udev Kernel Device Manager...
Nov 18 10:01:23 host NetworkManager[612]: <info> device added
```

Aggregated logs for the current boot from systemd’s journal.

References:
- https://man7.org/linux/man-pages/man1/journalctl.1.html

### Previous Boot Errors
Input:

```
journalctl -b -1 -p err
```

Output:
```
Nov 18 09:55:02 host kernel: ata1: COMRESET failed
```

Shows error-level logs from the previous boot for troubleshooting.

References:
- https://man7.org/linux/man-pages/man1/journalctl.1.html

---


