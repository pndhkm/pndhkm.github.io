# Prepare GeoLite2 ASN Database

### Licensing & Official Source

* The database is officially provided by MaxMind, Inc. under the GeoLite2 Free Geolocation Data program
* The EULA requires users to register for a (free) account and accept the terms in order to download
* The GitHub repo GeoLite.mmdb lists in its README:

  > Database and Contents Copyright (c) MaxMind, Inc. GeoLite2 End User License Agreement
* A key question: Does the GitHub repo comply with MaxMind’s EULA (for redistribution)? The discussion in other projects suggests there’s concern. E.g., in a Docker forum thread:

  > Does the Maxmind license model allow shipping their databases as part of an Open Source project?

**Conclusion**: For full compliance with licensing and to guarantee latest updates, it is best to download directly from MaxMind with your own account/KEY. Use of third-party mirror repos should be evaluated for licensing, update frequency and trust.

---

### Using the GitHub repo GeoLite.mmdb by P3TERX

### Download

#### URL1

- [GeoLite2-ASN.mmdb](https://git.io/GeoLite2-ASN.mmdb)

#### URL2

- [GeoLite2-ASN.mmdb](https://github.com/P3TERX/GeoLite.mmdb/raw/download/GeoLite2-ASN.mmdb)

Download the `mmdb` and save to `/opt/geoip2/db/GeoLite2-ASN.mmdb`

Resource:
* [P3TERX](https://github.com/P3TERX/GeoLite.mmdb)
* [MaxMind's GeoLite2](https://dev.maxmind.com/geoip/geoip2/geolite2/) 