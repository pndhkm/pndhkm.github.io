# Backup MariaDB via maria-backup

BareOS backs up MariaDB consistently by running **maria-backup** through the **BareOS File Daemon Python plugin**.
The Director defines **Job / FileSet / JobDefs**, while the Client installs **maria-backup** and the plugin.

---

## Server Side (BareOS Director)

### Create FileSet

Input:

```
nano /etc/bareos/bareos-dir.d/fileset/client02-maria-backup.conf
```

```
FileSet {
  Name = "client02-maria-backup"
  Include {
    Options {
      Signature = XXH128
    }
    Plugin = "python"
             ":module_path=/usr/lib/bareos/plugins"
             ":module_name=bareos-fd-mariabackup"
             ":mycnf=/etc/bareos/maria-backup-my.cnf"
  }
}
```

This FileSet tells the File Daemon to run the MariaDB backup plugin instead of file-based backups.

---

### Create JobDefs

Input:

```
nano /etc/bareos/bareos-dir.d/jobdefs/DailyJob-client02-maria-backup.conf
```

```
JobDefs {
  Name = "DailyJob-client02-maria-backup"
  Type = Backup
  Level = Full
  FileSet = "client02-maria-backup"
  Schedule = "DailyCycle"
  Storage = s3
  Messages = Standard
  Pool = longterm-s3-storage
  Priority = 10
  Write Bootstrap = "/var/lib/bareos/%c.bsr"
  Full Backup Pool = Full
  Differential Backup Pool = Differential
  Incremental Backup Pool = Incremental
}
```

This defines the MariaDB backup policy and storage behavior.

---

### Create Job

Input:

```
nano /etc/bareos/bareos-dir.d/job/client02-maria-backup.conf
```

```
Job {
  Name = "client02-maria-backup"
  Client = client02
  FileSet = "client02-maria-backup"
  JobDefs = "DailyJob-client02-maria-backup"
  Storage = s3
  Pool = longterm-s3-storage
  Priority = 10
}
```

This binds the MariaDB FileSet to the client.

---

### Reload Director

Input:

```
systemctl restart bareos-dir
```

This loads the MariaDB backup job into the Director.

---

## Client Side (BareOS File Daemon + MariaDB)

### Detect MariaDB Version

Input:

```
mariadb --version
```

Output:

```
mariadb  Ver 15.1 Distrib 10.11.6-MariaDB
```

This confirms MariaDB is installed and compatible with maria-backup.

---

### Install MariaDB Backup Tool

Input:

```
apt update && apt install -y maria-backup
```

This installs the native MariaDB physical backup tool.

---

### Install BareOS MariaDB Backup Plugin

Input:

```
apt install -y bareos-filedaemon-mariabackup-python-plugin
```

This installs the BareOS File Daemon plugin for maria-backup.

---

### Create MariaDB Backup Credentials

Input:

```
nano /etc/bareos/maria-backup-my.cnf
```

```
[client]
user=bareos_backup
password=StrongPassword
socket=/run/mysqld/mysqld.sock
```

This file provides credentials used by maria-backup.

---

### Secure Credentials

Input:

```
chown bareos:bareos /etc/bareos/maria-backup-my.cnf
chmod 0600 /etc/bareos/maria-backup-my.cnf
```

This restricts access to the MariaDB credentials.

---

### Configure File Daemon

Input:

```
nano /etc/bareos/bareos-fd.d/client/myself.conf
```

```
Client {
  Name = client02
  Plugin Directory = "/usr/lib/bareos/plugins"
  Plugin Names = "python3"
}
```

This enables Python plugins in the File Daemon.

---

### Restart File Daemon

Input:

```
systemctl restart bareos-fd
```

This activates the MariaDB backup plugin.

---

## Verification

### Verify Plugin Availability

Input:

```
ls /usr/lib/bareos/plugins | grep maria
```

Output:

```
bareos-fd-mariabackup.py
```

This confirms the MariaDB backup plugin is available.

---

### Run MariaDB Backup Manually

Input:

```
bconsole
```

```
run job=client02-maria-backup yes
```

This executes a full MariaDB backup using maria-backup via BareOS.

---

### Show Job Details via WebUI

![Bareos Webui MariaBackup](https://calm-bonus-da0a.pndhkmgithub.workers.dev/11at4zzZDHWXz6wmix8gTq5AE5paXtsmQ)

---