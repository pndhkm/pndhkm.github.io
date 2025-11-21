# Prometheus Configuration

#### prometheus.yml

```
  - job_name: 'cpanel_mail_exporter'
    scrape_interval: 60s
    metrics_path: /metrics
    static_configs:
      - targets: ['localhost:9197']
        labels:
           instance: 'serverx'
```
:::warning Both TLS and Basic Auth are optional. If not configured, the server will run without these security features.
:::

#### Creating a bcrypt hashed password

You can enhance the security of the exporter using TLS and Basic Authentication by providing a `web-config.yml` file, you can create bcrypt hashed passwords using Python:

```python
import getpass
import bcrypt

password = getpass.getpass("password: ")
hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
print(hashed_password.decode())

```

#### web-config.yml:

```
tls_server_config:
  cert_file: server.crt
  key_file: server.key

basic_auth_users:
  alice: $2y$12$wXx/B7Gc9QbN/8VZ0fGh4.O4HvF3Z0tW5Vj3xZPL5cN7x9pkl9D4u  # bcrypt hashed password
```

- **TLS Configuration:** Provide paths to your certificate (`cert_file`) and key (`key_file`).
- **Basic Authentication:** List usernames and their bcrypt-hashed passwords.

---
