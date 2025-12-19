# Backup MySQL via XtraBackup

Bareos backs up MySQL consistently by running Percona XtraBackup through the Bareos File Daemon Python plugin. The Director defines Job/FileSet/JobDefs, while the Client installs XtraBackup and the plugin.

---

## Server Side (Bareos Director)

### Create FileSet

Input:

```
nano /etc/bareos/bareos-dir.d/fileset/client01-xtrabackup.conf
```

```
FileSet {
  Name = "client01-xtrabackup"
  Include {
    Options {
      Signature = XXH128
    }
    Plugin = "python"
             ":module_path=/usr/lib64/bareos/plugins"
             ":module_name=bareos-fd-percona-xtrabackup"
             ":mycnf=/etc/bareos/xtrabackup-my.cnf"
  }
}
```

This FileSet instructs the File Daemon to run the XtraBackup plugin instead of backing up files directly.

### Create JobDefs

Input:

```
nano /etc/bareos/bareos-dir.d/jobdefs/DailyJob-client01-xtrabackup.conf
```

```
JobDefs {
  Name = "DailyJob-client01-xtrabackup"
  Type = Backup
  Level = Full
  FileSet = "client01-xtrabackup"
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

This defines the MySQL backup policy using S3 storage.

### Create Job

Input:

```
nano /etc/bareos/bareos-dir.d/job/client01-xtrabackup.conf
```

```
Job {
  Name = "client01-xtrabackup"
  Client = client01-fd
  FileSet = "client01-xtrabackup"
  JobDefs = "DailyJob-client01-xtrabackup"
  Storage = s3
  Pool = longterm-s3-storage
  Priority = 10
}
```

This binds the XtraBackup FileSet to the client.

### Reload Director

Input:

```
systemctl restart bareos-dir
```

This loads the MySQL backup job into the Director.

---

## Client Side (Bareos File Daemon)

### Detect MySQL Version

Input:

```
mysql --version
```

Output:

```
mysql  Ver 8.0.44-35 for Linux on x86_64 
```

This determines the compatible XtraBackup version.

### XtraBackup Version Mapping

| MySQL Version | XtraBackup Package    |
| ------------- | --------------------- |
| 8.0.x         | percona-xtrabackup-80 |
| 8.4.x         | percona-xtrabackup-84 |
| 5.6 / 5.7     | percona-xtrabackup-24 |

### Install Percona Repository

Input:

```
curl -fsSL https://repo.percona.com/apt/percona-release_latest.generic_all.deb -o /tmp/percona-release.deb && apt install -y /tmp/percona-release.deb
```

This enables Percona package repositories.

### Enable XtraBackup Repository

Input:

```
percona-release enable pxb-80
```

This activates the XtraBackup 8.0 repository.

### Install Percona XtraBackup

Input:

```
apt update && apt install -y percona-xtrabackup-80
```

This installs the XtraBackup binary used by the plugin.

### Install Bareos XtraBackup Plugin

Input:

```
apt install -y bareos-filedaemon-percona-xtrabackup-python-plugin
```

This installs the Bareos File Daemon plugin for XtraBackup.


### Create XtraBackup `my.cnf`

Input:

```
nano /etc/bareos/xtrabackup-my.cnf
```

```
[client]
user=bareos_xtrabackup
password=StrongPassword
socket=/var/run/mysqld/mysqld.sock
```

This file provides MySQL credentials for XtraBackup.

### Secure Credentials

Input:

```
chown bareos:bareos /etc/bareos/xtrabackup-my.cnf
chmod 0600 /etc/bareos/xtrabackup-my.cnf
```

This restricts access to MySQL credentials.

### Configure File Daemon 

Input:

```
nano /etc/bareos/bareos-fd.d/client/myself.conf
```

```
Client {
  Name = client01
  Plugin Directory = "/usr/lib/bareos/plugins"
  Plugin Names = "python3"
}
```

This enables Python plugins in the File Daemon.

### Restart File Daemon

Input:

```
systemctl restart bareos-fd
```

This activates the XtraBackup plugin.

---

## Verification

### Verify Plugin Availability

Input:

```
ls /usr/lib/bareos/plugins | grep xtrabackup
```

Output:

```
bareos-fd-percona-xtrabackup.py
```

This confirms the plugin is installed.

### Run MySQL Backup Manually

Input:

```
bconsole
```

```
run job=client01-xtrabackup yes
```

This executes a full MySQL backup using XtraBackup via Bareos.

### Show Job Details via WebUI

![Bareos Webui XtraBackup](https://calm-bonus-da0a.pndhkmgithub.workers.dev/163yGMVLUyDMcwTbm7X87_OA28XS2ghNL)

---