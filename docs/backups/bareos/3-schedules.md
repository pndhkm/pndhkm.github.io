# Bareos Schedules 

Bareos schedules define **when** and **what level of backup** (Full, Incremental, Differential) runs.
Schedules are read by **bareos-dir** and stored as plain text files under `/etc/bareos/bareos-dir.d/schedule/`.

---

## Bareos Schedule Basics

A `Schedule` block contains one or more `Run` directives.

* **Full**: complete backup
* **Incremental**: changes since last backup
* **Differential**: changes since last Full
* Days: `mon tue wed thu fri sat sun` or ranges like `mon-sat`
* Time format: `HH:MM` (24-hour)

Bareos evaluates schedules **top-down** and applies the first matching rule for the current day and time.

---

## DailyCycle Schedule

This schedule runs:

* **Full backup** every Sunday at 21:00
* **Incremental backup** Monday–Saturday at 21:00

### Configuration File

Edit file on `/etc/bareos/bareos-dir.d/schedule/DailyCycle.conf`

Input:

```
cat /etc/bareos/bareos-dir.d/schedule/DailyCycle.conf
```

```
Schedule {
  Name = "DailyCycle"
  Run = Full sun at 21:00
  Run = Incremental mon-sat at 21:00
}
```

This means Bareos checks the current weekday; if it is Sunday, it runs a Full backup, otherwise it runs Incremental.

---

## DailyCycleAfterBackup Schedule 

This second schedule is **not for client data**.
It is typically used after normal backups finish.

It runs:

* **Full backup every day (sun–sat) at 23:00**

### Configuration File

Edit file on `/etc/bareos/bareos-dir.d/schedule/DailyCycleAfterBackup.conf`

Input:

```
nano /etc/bareos/bareos-dir.d/schedule/DailyCycleAfterBackup.conf
```

Add:

```
Schedule {
  Name = "DailyCycleAfterBackup"
  Description = "This schedule does the catalog backup after DailyCycle."
  Run = Full sun-sat at 23:00
}
```

This ensures the catalog is backed up **after** all client backups complete.

---

## Validate Schedule Syntax

Input:

```
bareos-dir -t
```

This confirms schedule syntax and file placement are correct.

---

## Reload Bareos Director

Input:

```
systemctl restart bareos-dir
```

This activates the new schedules.

---

## Verify Scheduled Runs

Input:

```
bconsole
```

Inside `bconsole`:

```
show schedule=DailyCycle
```

Output:

```
Schedule {
  Name = "DailyCycle"
  Run = Full Sun at 21:00
  Run = Incremental Mon-Sat at 21:00
}
```

This confirms Bareos parsed the schedule correctly.

---
