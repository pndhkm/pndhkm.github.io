# Bareos WebUI

Bareos WebUI is a PHP web application that connects to **bareos-dir** using a dedicated **Console** user and ACL **Profile**, allowing safe monitoring and control of backup jobs via browser.

## Components Overview

| Component    | Role                  |
| ------------ | --------------------- |
| bareos-webui | PHP WebUI application |
| apache2      | Web server            |
| php-fpm      | PHP runtime           |
| bareos-dir   | Director service      |
| Console      | Auth for WebUI        |
| Profile      | ACL permissions       |

---

## Install Required Packages

This installs WebUI, Apache, PHP-FPM, and PHP extensions required by Bareos.

Input:

```
apt update
```

Input:

```
apt install -y bareos-webui apache2 php-fpm php-cli php-curl php-xml php-mbstring php-zip libapache2-mod-fcgid
```

---

## Enable Required Apache Modules

Bareos WebUI relies on rewrite and proxy for PHP-FPM.

Input:

```
a2enmod rewrite proxy proxy_fcgi env
```

Input:

```
a2enconf php8.2-fpm
```

---

## Enable and Start Services

Ensure services persist across reboot.

Input:

```
systemctl enable --now apache2
```

Input:

```
systemctl enable --now php8.2-fpm
```

---

## Create WebUI ACL Profile

The **Profile** defines what WebUI users can do inside Bareos.

Input:

```
nano /etc/bareos/bareos-dir.d/profile/webui-admin.conf
```

```
Profile {
    Name = webui-admin
    CommandACL = !.bvfs_clear_cache, !.exit, !.sql, !configure, !create, !delete, !purge, !sqlquery, !umount, !unmount, *all*
    Job ACL = *all*
    Schedule ACL = *all*
    Catalog ACL = *all*
    Pool ACL = *all*
    Storage ACL = *all*
    Client ACL = *all*
    FileSet ACL = *all*
    Where ACL = *all*
    Plugin Options ACL = *all*
}
```

---

## Create WebUI Console User

The WebUI authenticates using a **Console** resource, not an OS user.

Input:

```
nano /etc/bareos/bareos-dir.d/console/admin.conf
```

```
Console {
    Name = "admin"
    Password = "STRONGPASSWORD"
    Profile = "webui-admin"
    TlsEnable = false
}
```

---

## Validate and Restart Bareos Director

Input:

```
bareos-dir -t
```

Configuration syntax is valid.

Input:

```
systemctl restart bareos-dir
```

---

## Configure Apache VirtualHost

Bareos WebUI lives under `/bareos-webui`.

Input:

```
nano /etc/apache2/sites-available/bareos-webui.conf
```

```
<VirtualHost *:80>
    ServerName example.com

    RewriteEngine On
    RewriteRule ^/?$ /bareos-webui/ [R=302,L]

    Alias /bareos-webui /usr/share/bareos-webui/public

    <Directory /usr/share/bareos-webui/public>
        Options FollowSymLinks
        AllowOverride None
        Require all granted

        RewriteEngine On
        RewriteBase /bareos-webui
        RewriteCond %{REQUEST_FILENAME} -f [OR]
        RewriteCond %{REQUEST_FILENAME} -d
        RewriteRule ^ - [L]
        RewriteRule ^ index.php [L]
    </Directory>
</VirtualHost>
```

---

## Enable Site and Reload Apache

Input:

```
a2ensite bareos-webui
```

Input:

```
apachectl configtest
```

Output:

```
Syntax OK
```

Apache configuration is valid.

Input:

```
systemctl reload apache2
```

---

## Verify WebUI Files and Permissions

Input:

```
ls -ld /usr/share/bareos-webui/public
```

Output:

```
drwxr-xr-x  bareos bareos  ...
```

Files are readable by Apache.

---

## Login to WebUI

Open in browser:

```
http://example.com/bareos-webui
```

| Field    | Value           |
| -------- | --------------- |
| Username | admin           |
| Password | STRONGPASSWORD |

![Bareos Webui](https://calm-bonus-da0a.pndhkmgithub.workers.dev/1ORbKhA-oak7mZN84ttdpSnRScPGBs0if)

---
## Common Troubleshooting Commands

Check Apache errors:

```
journalctl -u apache2 -e
```

Check PHP-FPM:

```
journalctl -u php8.2-fpm -e
```

Check Bareos authentication:

```
journalctl -u bareos-dir -e
```

---

Resources:

* [Bareos Webui](https://docs.bareos.org/IntroductionAndTutorial/BareosWebui.html)

---

