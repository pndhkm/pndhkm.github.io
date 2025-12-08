# Database Configuration

#### Edit MySQL Configuration

Input:

```bash
nano /etc/mysql/my.cnf
```

Example configuration for the slave:

```ini
[mysqld]
bind-address=192.168.30.3
server-id=2
relay-log=slave-relay-bin
relay-log-index=slave-relay-bin.index
replicate-do-db=powerdns
```

#### Restart MySQL

Input:
```bash
systemctl restart mariadb
```

---

#### Create Database and Import Master Dump

Input:


```bash
mysql -u root -e "CREATE DATABASE powerdns;"
mysql -u root powerdns < powerdns.sql
```

:::info `powerdns.sql` should be the mysqldump exported from the master node.
:::

---

#### Configure Replication

```bash
mysql -u root
```

#### Set Master Information and Start Slave

```sql
CHANGE MASTER TO
MASTER_HOST='192.168.30.2',
MASTER_USER='ns2-paha-my-id',
MASTER_PASSWORD='password',
MASTER_LOG_FILE='mysql-bin.xxx',
MASTER_LOG_POS=xxx;

START SLAVE;
```

:::info
`MASTER_LOG_FILE` and `MASTER_LOG_POS` are obtained from the master node,

```sql
SHOW MASTER STATUS;
```
:::

---

#### Verify Slave Status

```sql
SHOW SLAVE STATUS\G
```

Expected output:

```
Slave_IO_Running: Yes
Slave_SQL_Running: Yes
```

---

