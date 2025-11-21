# Systemd Service

Service file definition

Input:

```
[Unit]
Description=cPanel Mail Exporter
After=network-online.target
Wants=network-online.target

[Service]
Group=cpanelmail
ExecStart=/usr/bin/cpanel_mail_exporter --apikey="your-api-key" --listen="127.0.0.1:9197" --endpoint="your-whm-endpoint:2087"
Restart=always

[Install]
WantedBy=multi-user.target
```


Enable and Manage the Service

#### Reload systemd

Input:

```
systemctl daemon-reload
```

#### Enable service at boot

Input:

```
systemctl enable cpanel-mail-exporter.service
```

#### Start service

Input:

```
systemctl start cpanel-mail-exporter.service
```

#### Check service status

Input:

```
systemctl status cpanel-mail-exporter.service
```

Output:

```
● cpanel-mail-exporter.service - cPanel Mail Exporter
   Loaded: loaded (/etc/systemd/system/cpanel-mail-exporter.service; enabled)
   Active: active (running)
```

---