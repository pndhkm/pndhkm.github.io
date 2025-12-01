
# Configuring Persistent Storage

Mounting /dev/vdb to /home/example/jetbackup5 

### creating a filesystem on the disk

Input:

```
mkfs.ext4 /dev/vdb
```

This creates an ext4 filesystem on the empty disk so it can be used for storage.

### creating the mountpoint directory

Input:

```
mkdir -p /home/example/jetbackup5
```

This directory will be used as the mount target.

### mounting the disk for the first time

Input:

```
mount /dev/vdb /home/example/jetbackup5
```

The disk is now mounted and ready to use.

### getting the UUID for fstab

Input:

```
blkid /dev/vdb
```

Output:

```
/dev/vdb: UUID="3f1c0b8f-7b1a-41cd-8e1c-635dbe22c291" TYPE="ext4"
```

This shows the UUID that will be used for persistent mounting.

### adding the entry to fstab

Input:

```
echo 'UUID=3f1c0b8f-7b1a-41cd-8e1c-635dbe22c291  /home/example/jetbackup5  ext4  defaults  0  2' >> /etc/fstab
```

This ensures the disk mounts automatically at every boot.

### testing the fstab configuration

Input:

```
mount -a
```