# Introduction

## Domain Name System

Domain Name System (DNS) is a distributed, hierarchical naming system that translates human-readable domain names into IP addresses required by network stacks. DNS operates over UDP/TCP port 53 and provides essential resolution for hostnames, service records, mail routing, and reverse lookups. It is structured around zones, resource records, caching, and recursive/iterative query workflows.

## Overview

DNS replaces static host mappings with scalable, authoritative data distributed across multiple servers. The resolver stack performs recursive resolution through root servers, TLD servers, and authoritative servers. Results are cached with TTL to reduce query latency. DNS supports multiple record types (A, AAAA, NS, SOA, MX, CNAME, TXT, PTR, SRV) and uses both forward and reverse mapping.

## DNS Query Example

### Querying an IPv4 A Record

Input:

```
dig A example.com
```

Output:

```
; <<>> DiG 9.18.24 <<>> A example.com
;; ANSWER SECTION:
example.com.        300   IN   A   93.184.216.34
```

This returns the IPv4 address mapped to the hostname via an A record.

### Querying an IPv6 AAAA Record

Input:

```
dig AAAA example.com
```

Output:

```
example.com.        300   IN   AAAA   2606:2800:220:1:248:1893:25c8:1946
```

This returns the IPv6 address for the hostname.

### Full Resolution Path (Trace Mode)

Input:

```
dig +trace example.com
```

Output:

```
.            518400 IN NS a.root-servers.net.
...
example.com. 172800 IN NS b.iana-servers.net.
```

This shows each delegation step from root → TLD → authoritative servers.

### Reverse DNS Lookup (PTR)

Input:

```
dig -x 8.8.8.8 +short
```

Output:

```
dns.google.
```

This resolves an IP address to its PTR record.

### Display Resolver Settings

Input:

```
resolvectl status
```

Shows system-level DNS configuration, including interfaces, DNS servers, and fallback behavior.

## DNS Record Types (Core)

| Type  | Description                              |
| ----- | ---------------------------------------- |
| A     | IPv4 address mapping                     |
| AAAA  | IPv6 address mapping                     |
| CNAME | Canonical alias                          |
| MX    | Mail exchanger routing                   |
| TXT   | Arbitrary metadata (SPF, DKIM, etc.)     |
| NS    | Delegation to authoritative name servers |
| SOA   | Zone metadata (serial, refresh, retry)   |
| PTR   | Reverse DNS mapping                      |
| SRV   | Service discovery                        |
