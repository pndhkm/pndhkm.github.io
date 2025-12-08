# Let’s Encrypt for PowerDNS Admin

#### Request certificate

Input:

```
certbot --nginx -d pdns-admin.paha.my.id
```

---

#### Check renewal

Input:

```
systemctl status certbot.timer
certbot renew --dry-run
```

---


