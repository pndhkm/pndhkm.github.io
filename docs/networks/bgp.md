# Border Gateway Protocol (BGP) 

## What is BGP

Border Gateway Protocol (BGP) is the routing protocol for the Internet. Much like the post office processing mail, BGP picks the most efficient routes for delivering Internet traffic.

## What is BIRD

The BIRD Internet Routing Daemon project aims to develop a fully functional dynamic IP routing daemon primarily targeted on (but not limited to) Linux, FreeBSD and other UNIX-like systems and distributed under the GNU General Public License.

Source: https://bird.network.cz/

## Pre Install BGP on BIRD

:::info Tested with Debian
:::
Basic system preparation ensures the router can forward packets and handle high route load.

### Enable IP forwarding

Input:

```
nano /etc/sysctl.conf
```

Uncomment the line:

```
net.ipv4.ip_forward=1
```

Reload:
Input:

```
sysctl -p
```

This activates IPv4 forwarding so the system can route packets between interfaces.

### Optional tuning for high-performance routing

Add the following lines to `/etc/sysctl.conf` when handling heavy BGP traffic:

```
fs.file-max = 16777216
fs.nr_open = 1073741824
net.core.netdev_max_backlog = 30000
net.ipv4.tcp_congestion_control = bbr
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
vm.max_map_count = 1048575
```

These tune kernel buffers, multipath, and routing responsiveness.

---

## Install and Configure Bird2

### Install Bird2

Input:

```
apt install bird2 -y
```

### Check version

Input:

```
bird --version
```

Output:

```
BIRD version 2.x.x
```

Shows installed Bird version.

### Enable service

Input:

```
systemctl enable --now bird
```

Bird2 starts at boot and loads configuration from `/etc/bird/bird.conf`.

---

## Basic Configuration

Bird learns directly connected IPs, the kernel routing table, and interface state.

### Enable direct protocol

Edit Bird:
Input:

```
nano /etc/bird/bird.conf
```

Change:

```
protocol direct {
##       disabled;
        ipv4;
        ipv6;
}
```

This allows Bird to detect interface addresses automatically.

### Kernel protocol – enable learn

Change kernel section:

```
protocol kernel {
        ipv4 {
              export all;
        };
        learn;
}
```

This allows Bird to read static routes created via `ip route add`.

### Device scan time

```
protocol device {
        scan time 5;
}
```

This lets Bird detect link up/down within 5 seconds.

---

## BGP Configuration

### Basic BGP Peer (R1 ↔ R2)

#### Router1 (AS100)

```
protocol bgp R2 {
        local 192.168.46.1 as 100;
        neighbor 192.168.46.2 as 200;
        ipv4 {
                import all;
                export all;
        };
}
```

#### Router2 (AS200)

```
protocol bgp R1 {
        local 192.168.46.2 as 200;
        neighbor 192.168.46.1 as 100;
        ipv4 {
                import all;
                export all;
        };
}
```

This establishes a basic eBGP session.

---

### BGP With Custom Filter

```
protocol bgp R2 {
        local 192.168.46.1 as 100;
        neighbor 192.168.46.2 as 200;
        ipv4 {
                import filter FILTER_in;
                export filter FILTER_out;
        };
}
```

Filters allow selective prefix control.

---

### BGP Multihop

```
protocol bgp R2 {
        local 192.168.46.1 as 100;
        neighbor 192.168.46.2 as 200;
        multihop;
        ipv4 {
                import all;
                export all;
        };
}
```

Useful when peers are not directly connected.

---

### BGP Route Reflector Client

```
protocol bgp R2 {
        local 192.168.46.1 as 100;
        neighbor 192.168.46.2 as 200;
        rr client;
        rr cluster id 1.1.1.1;
        ipv4 {
                import all;
                export all;
        };
}
```

Enables RR functions.

---

## Route Filtering Basics in BIRD

Route filters allow you to change attributes (Local Pref, AS-Path, Community), validate prefixes, or drop unwanted routes before they enter or leave your BGP table.

Below are simplified explanations of each example.

---

### Local Preference

Local Preference decides **which exit path your AS prefers**.
Higher value = more preferred.

Input:

```
filter R2_in {
        if net = 2.2.2.2/32 then {
                bgp_local_pref = 200;
                accept;
        }
        accept;
}
```

This sets **Local Preference 200** only for the prefix **2.2.2.2/32** coming from R2.

| Prefix     | Action          | Local Pref |
| ---------- | --------------- | ---------- |
| 2.2.2.2/32 | accept + modify | 200        |
| all others | accept          | default    |

---

### AS Path Prepend (2×)

AS-Path Prepend makes your route **less preferred** by making the AS-PATH look longer.

Input:

```
filter R2_out {
        if net = 1.1.1.1/32 then {
                bgp_path.prepend(100);
                bgp_path.prepend(100);
                accept;
        }
        reject;
}
```

This prepends **AS100 two times** only on route **1.1.1.1/32**.

| Prefix     | Action                       |
| ---------- | ---------------------------- |
| 1.1.1.1/32 | AS100 AS100 prepended + send |
| all others | drop                         |

---

### Add Standard Community

Communities are tags used for routing policies.

Input:

```
filter RO2_out {
        if net = 3.3.3.3/32 then {
                bgp_community.add((100,109));
                accept;
        }
        reject;
}

```

This attaches community **100:109** to the outgoing BGP update.

| Prefix     | Action       | Community Added |
| ---------- | ------------ | --------------- |
| 3.3.3.3/32 | accept + tag | 100:109         |
| all others | reject       | none            |


---

### Add Large Community

Large Communities use a 3-tuple for more structured tagging.

Input:

```
filter RO2_out {
        if net = 4.4.4.4/32 then {
                bgp_large_community.add((100,200,109));
                accept;
        }
        reject;
}
```

This sends only 4.4.4.4/32 with large community 100:200:109.

| Prefix     | Action       | Large Community |
| ---------- | ------------ | --------------- |
| 4.4.4.4/32 | accept + tag | 100:200:109     |
| all others | reject       | none            |


---

### BGP with ROA Validation (RPKI)

RPKI checks whether the advertised prefix and origin AS are valid.

Function:

```
function is_rpki_invalid() {
  if net.type = NET_IP4 then
    return roa_check(rpki4, net, bgp_path.last_nonaggregated) = ROA_INVALID;
}
```

Filter:

```
filter neighbor_in {
        if is_rpki_invalid() then reject;
        accept;
}
```

This rejects IPv4 prefixes that fail ROA validation.

| Prefix Status | Action |
| ------------- | ------ |
| ROA INVALID   | reject |
| VALID/UNKNOWN | accept |

---

### RPKI ROA Configuration

These lines define the RPKI tables and connection to the cache server.

Input:

```
roa4 table rpki4;
roa6 table rpki6;

protocol rpki cache {
  roa4 { table rpki4; };
  roa6 { table rpki6; };
  remote 10.0.0.1 port 3323;
  retry 30;
}
```

This:

| Component           | Function                                    |
| ------------------- | ------------------------------------------- |
| `roa4 table rpki4`  | Stores IPv4 ROAs                            |
| `roa6 table rpki6`  | Stores IPv6 ROAs                            |
| RPKI protocol block | Connects to RPKI cache at **10.0.0.1:3323** |


---


## Useful Commands

### See prefixes received from neighbor

Input:

```
birdc show route protocol R2
```

Output:
```
BIRD 2.0.12 ready.
Table master4:
192.168.46.0/24      unicast [R2 09:46:18.875] (100) [AS200i]
	via 192.168.46.2 on eth1
192.168.1.0/24       unicast [R2 09:46:18.875] (100) [AS200i]
	via 192.168.46.2 on eth1
```

### See detailed prefix info

Input:

```
birdc show route protocol R2 all
```

Output:
```
birdc show route protocol R2 all
BIRD 2.0.12 ready.
Table master4:
192.168.46.0/24      unicast [R2 09:46:18.875] (100) [AS200i]
	via 192.168.46.2 on eth1
	Type: BGP univ
	BGP.origin: IGP
	BGP.as_path: 200
	BGP.next_hop: 192.168.46.2
	BGP.local_pref: 100
192.168.1.0/24       unicast [R2 09:46:18.875] (100) [AS200i]
	via 192.168.46.2 on eth1
	Type: BGP univ
	BGP.origin: IGP
	BGP.as_path: 200
	BGP.next_hop: 192.168.46.2
	BGP.local_pref: 100
```

### See chosen route to a specific prefix

Input:

```
birdc show route for 192.168.1.1 protocol R2 all
```

Output:
```
BIRD 2.0.12 ready.
Table master4:
192.168.1.0/24       unicast [R2 09:46:18.875] (100) [AS200i]
	via 192.168.46.2 on eth1
	Type: BGP univ
	BGP.origin: IGP
	BGP.as_path: 200
	BGP.next_hop: 192.168.46.2
	BGP.local_pref: 100
```

### See exported prefixes

Input:

```
birdc show route export R2 all
```

Output:
```
BIRD 2.0.12 ready.
Table master4:
0.0.0.0/0            unicast [kernel1 09:46:08.875] * (10)
	via 192.168.1.1 on eth0 onlink
	Type: inherit univ
	Kernel.source: 3
	Kernel.metric: 0
192.168.46.0/24      unicast [direct2 09:46:08.875] * (240)
	dev eth1
	Type: device univ
192.168.1.0/24       unicast [direct2 09:46:08.875] * (240)
	dev eth0
	Type: device univ
```
---