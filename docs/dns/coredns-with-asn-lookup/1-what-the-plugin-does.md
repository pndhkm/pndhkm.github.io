# What the Plugin Does
## Architecture

```
                         +--------------------------+
                         |        CoreDNS           |
                         |   (asnlookup plugin)     |
                         +------------+-------------+
                                      |
                     +----------------+------------------+
                     |                                   |
             Request from ASN 58820               Request from ASN ≠ 58820
            (APIK NETWORKS / Jakarta)                (ex: Telkomsel)
                     |                                   |
       +-------------+-------------+         +-----------+-------------+
       |                           |         |                         |
       v                           |         v                         |
+-------------+                    |   +-------------+                 |
| ASN Lookup  | -- returns --> 58820   | ASN Lookup  | -- returns --> 23693
+-------------+                        +-------------+                 
       |                                        |
       v                                        v
+---------------------------+        +---------------------------+
| Use Zone: example.com.cgk |        | Use Zone: example.com.jog |
| Location: Jakarta (CGK)   |        | Location: Yogyakarta (Jog)|
+-------------+-------------+        +-------------+-------------+
              |                                       |
              v                                       v
   +-----------------------+                +-----------------------+
   | Answer A record:      |                | Answer A record:      |
   |   cdn.example.com --> |                |   cdn.example.com --> |
   |         8.8.8.8       |                |         1.1.1.1       |
   +-----------------------+                +-----------------------+

                       Log Samples (when requests arrive)
                       ---------------------------------
   [INFO] plugin/asnlookup: IP 103.136.17.82 → ASN 58820 (APIK NETWORKS)
   [INFO] plugin/asnlookup: IP 182.0.140.171 → ASN 23693 (Telkomsel)
```
The *asnlookup* plugin allows you to retrieve ASN data associated with an IP address. This plugin uses the [MaxMind GeoLite2 ASN database](https://dev.maxmind.com/geoip/docs/databases) to map IP addresses to their ASN and associated organization.

The retrieved data is added to the request context using the *metadata* plugin. You can then access it programmatically, for example:

```go
import (
    "github.com/coredns/coredns/plugin/metadata"
)
// ...
if getASN := metadata.ValueFunc(ctx, "asnlookup/asn"); getASN != nil {
    fmt.Printf("ASN: %s\n", getASN())
} else {
    fmt.Println("ASN metadata is not set.")
}
// ...
```

## Database

The plugin supports the [GeoLite2 ASN database](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data). Ensure you update the database regularly for accurate results.

---