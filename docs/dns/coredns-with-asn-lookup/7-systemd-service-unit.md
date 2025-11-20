# Systemd Service Unit

#### Create unit file

Input:

```
cat > /etc/systemd/system/coredns.service <<'EOF'
[Unit]
Description=CoreDNS DNS Server
After=network.target

[Service]
User=coredns
Group=coredns
ExecStart=/usr/local/bin/coredns -conf /etc/coredns/Corefile
Restart=on-failure
LimitNOFILE=1048576
AmbientCapabilities=CAP_NET_BIND_SERVICE
CapabilityBoundingSet=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
EOF
```

or you can custom the [systemd service](/docs/linux/service-management/systemd)

---


