# What the Exporter Does
### Architecture
```
          ┌───────────────────┐
          │ cPanel / WHM API  │
          └───────────────────┘
                    ▲
                    │  API responses (JSON)
                    │
         ┌───────────────────────┐
         │ cpanel_mail_exporter  │
         └──────────┬────────────┘
                    │
                    ▼
              ┌────────────┐
              │ Prometheus │
              └────────────┘

```

The exporter polls cPanel’s JSON API, transforms structured email statistics and log entries into flat Prometheus metrics, and attaches labels derived from API fields. 

**Two metric families are produced:**

| API Endpoint            | Prometheus Metric  | Description                                                   |
| ----------------------- | ------------------ | ------------------------------------------------------------- |
| `emailtrack_user_stats` | `email_user_stats` | Aggregated per-user counters (send/success/fail/defer sizes). |
| `emailtrack_search`     | `email_logs`       | Per-message log entries with metadata labels.                 |

---

### email_user_stats

The exporter issues a GET request to:

Input:

```
https://<host>/json-api/emailtrack_user_stats?api.version=1&starttime=<ts>&endtime=<ts>
```

Returned JSON contains counters per user/domain. For each counter type, the exporter emits a Prometheus gauge:

```
email_user_stats{domain="example.com",user="user1",stat_type="send_count"} 1
email_user_stats{domain="example.com",user="user1",stat_type="success_count"} 1
email_user_stats{domain="example.com",user="user1",stat_type="fail_count"} 0
email_user_stats{domain="example.com",user="user1",stat_type="defer_count"} 0
email_user_stats{domain="example.com",user="user1",stat_type="defer_fail_count"} 0
email_user_stats{domain="example.com",user="user1",stat_type="total_size"} 7301
```

**Explanation**

* Each raw key from cPanel is mapped to a `stat_type` label.
* Values are numeric counters for the selected window (`starttime`–`endtime`).

---

### email_logs

The exporter queries message-level logs:

Input:

```
https://<host>/json-api/emailtrack_search?api.version=1&api.filter.enable=1 ...
```

Each returned log entry (one per message) becomes a Prometheus gauge. The exporter flattens all fields into labels:

Output:

```
email_logs{
  actionunixtime="1763663000",
  delivered_to="user1@example.com",
  delivery_domain="example.com",
  delivery_user="user1",
  domain="example.com",
  host="mx1.example.com",
  ip="192.0.2.10",
  message="Accepted",
  msg_id="MSG-0001",
  recipient="user1@example.com",
  router="localuser",
  sender="sender@example.com",
  sender_auth="localuser",
  sender_host="mail.example.com",
  sender_ip="198.51.100.20",
  sendunixtime="1763662998",
  size="10240",
  time="2025-11-21 01:23:49",
  transport="dovecot_delivery",
  transport_is_remote="0",
  type="success",
  user="user1"
} 1
```
Resources:
* [emailtrack_search](https://api.docs.cpanel.net/openapi/whm/operation/emailtrack_search/)
* [emailtrack_user_stats](https://api.docs.cpanel.net/openapi/whm/operation/emailtrack_user_stats/)

---