# Troubleshooting

## [ERROR] mariadbd: Got error '144 "Table is crashed and last repair failed"' for './mysql/global_priv'

That error means MariaDB cannot read the `mysql.global_priv` system table because it is corrupted, and an automatic repair already failed. Since this table controls users, passwords, and privileges, MariaDB refuses to start or operate correctly.

Below is a safe, ordered recovery process. Follow it carefully.

---

### Stop MariaDB completely

```bash
systemctl stop mariadb
```

Verify it’s not running:

```bash
ps aux | grep mariadbd
```

---

### Check the table engine (important)

MariaDB stores `mysql.global_priv` as Aria (not InnoDB).

Confirm:

```bash
ls -l /var/lib/mysql/mysql/global_priv.*
```

You should see files like:

* `global_priv.frm`
* `global_priv.MAD`
* `global_priv.MAI`

---

### Try Aria repair (offline)

Run aria_chk, not mysqlcheck.

```bash
cd /var/lib/mysql/mysql
aria_chk -r global_priv
```

If that fails, try force recovery:

```bash
aria_chk --force --recover global_priv
```

---


