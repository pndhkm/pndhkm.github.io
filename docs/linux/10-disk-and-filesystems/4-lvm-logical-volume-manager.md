# LVM (Logical Volume Manager)

LVM abstracts disks into physical volumes (PV), groups them into volume groups (VG), and allocates logical volumes (LV).

### Displaying LVM structure

Input:

```
lvs
```

Output:

```
LV   VG      Attr       LSize  Pool Origin Data%  Meta%
root vg0     -wi-ao---- 20.00g
home vg0     -wi-ao---- 50.00g
```

Lists logical volumes with size and attributes.

References:

* [https://man7.org/linux/man-pages/man8/lvm.8.html](https://man7.org/linux/man-pages/man8/lvm.8.html)
* [https://man7.org/linux/man-pages/man8/lvs.8.html](https://man7.org/linux/man-pages/man8/lvs.8.html)

---


