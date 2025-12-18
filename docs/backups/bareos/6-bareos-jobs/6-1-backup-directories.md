# Backup Directories

---

## FileSet Configuration 

A FileSet defines which directories are included in a backup job.

### Create FileSet for a Directory

Input:

```
nano /etc/bareos/bareos-dir.d/fileset/client01-www.conf
```

```
FileSet {
  Name = "client01-www"
  Include {
    Options {
      signature = MD5
    }
    File = /var/www
    File = /etc/nginx
  }
}
```

This FileSet backs up web content and configuration paths.

---

## JobDefs Configuration

JobDefs define reusable defaults like schedule, pool, and backup level.

### Create JobDefs

Input:

```
nano /etc/bareos/bareos-dir.d/jobdefs/DailyJob-client01-www.conf
```

```
JobDefs {
  Name = "DailyJob-client01-www"
  Type = Backup
  Level = Full
  FileSet = "client01-www"
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

This defines a daily backup policy using S3 storage.

---

## Job Configuration 

A Job binds a FileSet and JobDefs to a specific client.

### Create Job

Input:

```
nano /etc/bareos/bareos-dir.d/job/client01-www.conf
```

```
Job {
  Name = "client01-www"
  Client = client01
  FileSet = "client01-www"
  JobDefs = "DailyJob-client01-www"
  Storage = s3
  Pool = longterm-s3-storage
  Priority = 10
}
```

This job runs backups for the defined client and directory set.

---

## Reload and Validate Configuration

### Fix Permission

Input:

```
chown -R /etc/bareos
```

### Restart Bareos Director

Input:

```
systemctl restart bareos-dir
```

This reloads all FileSet, Job, and JobDefs configurations.

### Verify Job Registration

Input:

```
bconsole
```

```
show jobs
```

Output:

```
Job {
  Name = "client01-www"
  Storage = "s3"
  Pool = "longterm-s3-storage"
  Client = "client01"
  FileSet = "client01-www"
  JobDefs = "DailyJob-client01-www"
}
```

This confirms the directory backup job is registered.

### Test Job Manually

Input:

```
run job=client01-www yes
```

Output:
```
Using Catalog "MyCatalog"
Job queued. JobId=5
```

This starts an immediate backup for verification.


### Show Job Details via WebUI

```
http://bareos/bareos-webui/job/details/5
```

![Bareos Job via Webui](https://calm-bonus-da0a.pndhkmgithub.workers.dev/1DB8fvjtPCvJI4B6n7V9vsCPuvxbkrTwq)

---
