
# Use Case
## Configuring Persistent Storage

Mounting /dev/vdb to /home/example/jetbackup5 

### creating a filesystem on the disk

List available disks:
```
lsblk -f
```

Example disk: `/dev/vdb`

Create a GPT partition table, create a partition, and format it as ext4:

:::danger
This process will destroy all existing data on the disk.
:::

Input:
```
parted /dev/vdb --script mklabel gpt
parted /dev/vdb --script mkpart primary ext4 0% 100%
mkfs.ext4 /dev/vdb1
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
mount /dev/vdb1 /home/example/jetbackup5
```

The disk is now mounted and ready to use.

### getting the UUID for fstab

Input:

```
blkid /dev/vdb1
```

Output:

```
/dev/vdb1: UUID="3f1c0b8f-7b1a-41cd-8e1c-635dbe22c291" TYPE="ext4"
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