import ApiKeyGenerator from '@site/src/components/ApiKeyGenerator';

# Troubleshooting

## When using System Resolver

#### Configure systemd-resolved

Input:

```
nano /etc/systemd/resolved.conf
```

Use:

```
[Resolve]
DNS=8.8.8.8
DNSStubListener=no
#FallbackDNS=
#Domains=
#DNSSEC=no
#DNSOverTLS=no
#MulticastDNS=no
#LLMNR=no
#Cache=no-negative
#CacheFromLocalhost=no
#DNSStubListenerExtra=
#ReadEtcHosts=yes
#ResolveUnicastSingleLabel=no
```

#### Link to resolv.conf

Input:

```
ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
systemctl restart systemd-resolved
```

---

## User Cannot Add Domain

Edit file:

```
nano /opt/web/powerdns-admin/powerdnsadmin/routes/domain.py
```

Comment out lines at 369:

```

            # If User creates the domain, check some additional stuff
#           if current_user.role.name not in ['Administrator', 'Operator']:
                # Get all the account_ids of the user
#                user_accounts_ids = current_user.get_accounts()
#                user_accounts_ids = [x.id for x in user_accounts_ids]
                # User may not create domains without Account
#                if int(account_id) == 0 or int(account_id) not in user_account>
#                    return render_template(
#                        'errors/400.html',
#                        msg="Please use a valid Account"), 400



```

---

## unix:/run/powerdns-admin/socket failed (13: Permission denied) while connecting to upstream

Fix group and permissions powerdns-admin socket

Input:
```
chown powerdnsadmin:www-data /run/powerdns-admin/socket
chmod 660 /run/powerdns-admin/socket
```

--- 

## 'NoneType' object has no attribute 'id' when create new user

Input:

```
mysql -u root
```

Input:
```
SELECT * FROM role;
Empty set (0.000 sec)
```

If data not exist

Input:

```
INSERT INTO `role` VALUES (1,'Administrator','Administrator'),(2,'User','User'),(3,'Operator','Operator');
```

Then recreate user from powerdns-admin webui.

---

## Please complete your PowerDNS API configuration before continuing

#### Verify the api-key is set

Input:
```
grep api-key /etc/powerdns/pdns.conf
```

Or you can generate api-key:
<ApiKeyGenerator />

---

