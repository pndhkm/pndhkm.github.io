# Boot Loaders

Boot loaders load the Linux kernel and initramfs, pass parameters, and support multi-boot.

### GRUB Configuration Location
Input:

```
ls /boot/grub*/grub.cfg
```

Output:
```
/boot/grub/grub.cfg
```

Shows the active GRUB configuration file.

References:
- https://www.gnu.org/software/grub/manual/

### Listing Installed Kernels
Input:

```
ls /boot/vmlinuz-*
```

Output:
```
/boot/vmlinuz-6.6.0
/boot/vmlinuz-6.1.0
```

Useful to verify available kernel versions for bootloader entries.

References:
- https://man7.org/linux/man-pages/man1/ls.1.html

### Examining Kernel Parameters
Input:

```
cat /proc/cmdline
```

Output:
```
BOOT_IMAGE=/vmlinuz-6.6.0 root=/dev/sda1 ro quiet splash
```

Shows parameters passed by the bootloader to the kernel.

References:
- https://man7.org/linux/man-pages/man5/proc.5.html

---


