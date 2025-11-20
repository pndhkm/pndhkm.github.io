# Minimal Configuration
The following creates a minimal configuration for validating the plugin and query metadata.

#### Create Corefile 

Input:

```
cat > Corefile <<'EOF'
.:53 {
    log
    errors
    asnlookup /opt/geoip2/db/GeoLite2-ASN.mmdb
    metadata
}

example.com {
    view local {
        expr metadata('asnlookup/asn') in ['58820']
    }
    asnlookup /opt/geoip2/db/GeoLite2-ASN.mmdb
    metadata
    file example.com {
        reload 10s
    }
}
EOF

```

#### Create Zone file
```
cat > example.com<<'EOF'
$TTL 60
@   IN  SOA ns1.nameserver.com. noc.nameserver.com. (
        1758393516 ; Serial
        7200 ; Refresh
        7200 ; Retry
        2419200 ; Expire
        60) ; Minimum TTL

@   IN  NS  ns1.nameserver.com.
@   IN  NS  ns2.nameserver.com.

cdn		IN	A	8.8.8.8
EOF
```

#### Run CoreDNS

Input:

```
coredns -conf ./Corefile
```

Output:

```
.:53
example.com.:53
CoreDNS-1.12.0
linux/amd64, go1.23.0, 
```

#### Executes an A-record lookup to verify DNS response behavior when the request originates from an IP belonging to ASN 58820.

Input:

```
dig A cdn.example.com +short
```

Output:

```
8.8.8.8
```
This response indicates that the DNS server returns the configured address for clients originating from APIK NETWORKS.

---


