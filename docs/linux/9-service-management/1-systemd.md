

# Service Management with systemd

Systemd manages system services, their lifecycle, logging, and dependency handling.

---

### Creating a New Service
Systemd service units define how a process starts, stops, and restarts.

Input:
```
sudo vi /etc/systemd/system/example.service
```

Example content:
```
[Unit]
Description=Example Service

[Service]
ExecStart=/usr/bin/example --flag
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and reload units:

Input:
```
sudo systemctl daemon-reload
```

Input:
```
sudo systemctl enable example.service
```

### Checking Service Logs
Systemd stores logs in the journal, viewable per unit.

Input:
```
journalctl -u example.service -n 20
```

Output:
```
Jan 01 10:00:00 host example[1234]: Service started
Jan 01 10:00:05 host example[1234]: Running
```

Shows the last 20 log entries for the service.

---

### Starting or Stopping a Service
Basic lifecycle control for systemd units.

Input:
```
sudo systemctl start example.service
```

Input:
```
sudo systemctl stop example.service
```

### Checking Service Status
Status displays active state, PID, and recent logs.

Input:
```
systemctl status example.service
```

Output:
```
● example.service - Example Service
   Loaded: loaded (/etc/systemd/system/example.service; enabled)
   Active: active (running) since Tue 2025-01-01 10:00:00 UTC; 5min ago
 Main PID: 1234 (example)
    Tasks: 1
   Memory: 5.0M
   CGroup: /system.slice/example.service
           └─1234 /usr/bin/example --flag
```

Shows operational state, start time, and resource usage.

References:
- https://man7.org/linux/man-pages/man1/systemctl.1.html
- https://man7.org/linux/man-pages/man5/systemd.service.5.html
- https://man7.org/linux/man-pages/man1/journalctl.1.html