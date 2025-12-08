# Setup MySQL Master

#### Create replication users

Input:

```
mysql -u root 
```

```
GRANT REPLICATION SLAVE ON *.* TO 'ns2-paha-my-id'@'192.168.30.3' IDENTIFIED BY 'password';
```


#### Add supermasters

Input:

```
use powerdns;
INSERT INTO supermasters VALUES ('192.168.30.3', 'ns2.paha.my.id', 'admin');
```

#### Show status

Input:
```
SHOW MASTER STATUS\G
```

```
*************************** 1. row ***************************
            File: mysql-bin.000006
        Position: 13023
    Binlog_Do_DB: powerdns
Binlog_Ignore_DB: mysql,test
```

#### Exit mysql

Input:

```
exit
```

#### Mysql Dump

Input:

```
mysqldump -u root powerdns > powerdns.sql
```

then scp/rsync `powerdns.sql` to slave node.