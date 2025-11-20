# Advanced Metadata-Based View Example

Two zones for `example.com` one for 58820 traffic, one default.

#### Write extended Corefile

Input:

```
cat > /etc/coredns/Corefile <<'EOF'
. {
    log
    health :8080
    prometheus :9887
    reload
    errors
    template IN ANY . {
        rcode REFUSED
    }
}
example.com {
    view cgk {
        expr metadata('asnlookup/asn') in ['58820']
    }
    asnlookup /opt/geoip2/db/GeoLite2-ASN.mmdb
    metadata
    file /etc/coredns/example.com.cgk {
        reload 10s
    }
}
example.com {
    view jog {
        expr metadata('asnlookup/asn') not in ['58820']
    }
    asnlookup /opt/geoip2/db/GeoLite2-ASN.mmdb
    metadata
    file /etc/coredns/example.com.jog {
        reload 10s
    }
}
EOF
```

#### Create Zone for Jakarta (CGK) Region
```
cat > /etc/coredns/example.com.cgk <<'EOF'
$TTL 60
@   IN  SOA ns1.nameserver.com. noc.nameserver.com. (
        1758393511 ; Serial
        7200 ; Refresh
        7200 ; Retry
        2419200 ; Expire
        60) ; Minimum TTL

@   IN  NS  ns1.nameserver.com.
@   IN  NS  ns2.nameserver.com.

cdn		IN	A	8.8.8.8
EOF
```

#### Create Zone for Yogyakarta (Jog) Region
```
cat > /etc/coredns/example.com.jog <<'EOF'
$TTL 60
@   IN  SOA ns1.nameserver.com. noc.nameserver.com. (
        1758393912 ; Serial
        7200 ; Refresh
        7200 ; Retry
        2419200 ; Expire
        60) ; Minimum TTL

@   IN  NS  ns1.nameserver.com.
@   IN  NS  ns2.nameserver.com.

cdn		IN	A	1.1.1.1
EOF
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

#### Executes the same A-record lookup from a different ASN to ensure differentiated responses based on the client network.

```
dig A cdn.example.com +short
```

Output:

```
1.1.1.1
```
This response shows that the DNS server provides an alternate address for non-58820 networks.

#### These log entries appear on the DNS server when requests are processed through the asnlookup plugin.

```
[INFO] plugin/asnlookup: ASN lookup successful for IP 103.136.17.82: ASN=58820, Org=APIK NETWORKS
[INFO] plugin/asnlookup: ASN lookup successful for IP 182.0.140.171: ASN=23693, Org=PT. Telekomunikasi Selular
```

---


