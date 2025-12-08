import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Reset MySQL Root Password Using Skip-Grant-Tables

Resetting the root password through `skip-grant-tables` allows access without authentication, so you can update the internal `mysql.user` table even when normal password methods fail.

## Table of key options

| Option | Meaning |
|---|---|
| `--skip-grant-tables` | Disables password checking |
| `--skip-networking` | Prevents remote connections while unlocked |

---

## Stop the MySQL service

MySQL must be stopped before starting with special options.

Input:
```bash
sudo systemctl stop mysqld
```

---

## Start MySQL with skip-grant-tables

This starts MySQL without authentication and blocks network access for safety.

Input:
```bash
sudo systemctl set-environment MYSQLD_OPTS="--skip-grant-tables --skip-networking"
```

Input:
```bash
sudo systemctl start mysqld
```

---

## Login as root without a password

Input:
```bash
mysql -u root
```

---

## Empty the current authentication string

This clears the stored password hash.

Input:
```sql
UPDATE mysql.user SET authentication_string='' WHERE User='root';
```

Output:
```
Query OK, 1 row affected
```
This removes the existing password hash.

Input:
```sql
FLUSH PRIVILEGES;
```

Output:
```
Query OK, 0 rows affected
```
This reloads privilege tables.

---

## Set a new root password (legacy method)

<Tabs>
  <TabItem value="set-passowrd" label="With Set Password" default>
    The legacy `PASSWORD()` function is still available on some MySQL 5.7 and upgraded 8.x systems.

    Input:
    ```sql
    SET PASSWORD FOR 'root'@'localhost' = PASSWORD('!Your!New!Password!');
    ```

  </TabItem>
  <TabItem value="alter-user" label="With Alter User">
    Input:
    ```sql
    ALTER USER 'root'@'localhost' IDENTIFIED BY '!Your!New!Password!';
    ```
  </TabItem>
</Tabs>



Output:
```
Query OK, 0 rows affected
```
This writes the new password hash.

Input:
```sql
FLUSH PRIVILEGES;
```

Output:
```
Query OK, 0 rows affected
```
This makes the new password active.

Input:
```sql
exit;
```

---

## Stop MySQL and remove the special environment

Input:
```bash
sudo systemctl stop mysqld
```

Input:
```bash
sudo systemctl unset-environment MYSQLD_OPTS
```

Input:
```bash
sudo systemctl start mysqld
```

---

## Login with the new root password

Input:
```bash
mysql -u root -p
```

Output:
```
Enter password:
```
You should now be authenticated normally.