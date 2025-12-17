# QinQ

![Citraweb QinQ](https://calm-bonus-da0a.pndhkmgithub.workers.dev/1t_35CpA8b26v_M92RY_v5qgZOlUmvC_I)
> source: Citraweb

## What is QinQ
QinQ (802.1ad) is used to encapsulate VLAN (802.1Q), meaning the data packets you send or receive will carry two VLAN headers. Since VLAN itself is an encapsulation process that adds a header to your data packet, QinQ adds another layer. Below is an example of QinQ configuration on a Dell Switch:

## QinQ Configuration on Dell Switch
![QinQ](https://calm-bonus-da0a.pndhkmgithub.workers.dev/15k-CQqOAlJQjJ0aTVT5fxFwSZpHMnGBh)
[Preview Image](https://calm-bonus-da0a.pndhkmgithub.workers.dev/15k-CQqOAlJQjJ0aTVT5fxFwSZpHMnGBh)


Based on the diagram above, data packets using QinQ have 2 headers, which increases the packet frame size by an additional 4 bytes. The standard MTU size is 1500 bytes, so you must adjust the MTU on interfaces passing QinQ to 1504 bytes or more.

---

### Switch-2 Configuration
Input
```
sh run int gi 0/2
```
Output:
```
!
interface GigabitEthernet 0/2
 description to-switch-1
 no ip address
 switchport
 vlan-stack access
 no shutdown
```
Input:
```
sh run int vlan 1000
```
Output:
```
!
interface Vlan 1000
 description VID1000-to-QinQ-1to4
 no ip address
 vlan-stack compatible
 member GigabitEthernet 0/2
 member GigabitEthernet 0/3
 shutdown
```
Input:
```
sh run int gi 0/3
```
Output:
```
!
interface GigabitEthernet 0/3
 description to-switch-3
 no ip address
 switchport
 vlan-stack trunk
 no shutdown
```

---

### Switch-3 Configuration

Input:
```
sh run int gi 0/5
```
Output:
```
!
interface GigabitEthernet 0/5
 description to-switch-4
 no ip address
 switchport
 vlan-stack access
 no shutdown
```
Input:
```
sh run int vlan 1000
```
Output:
```
!
interface Vlan 1000
 description VID1000-to-QinQ-1to4
 no ip address
 vlan-stack compatible
 member GigabitEthernet 0/4
 member GigabitEthernet 0/5
 shutdown
```

Input:
```
sh run int gi 0/4
```
Output:
```
!
interface GigabitEthernet 0/4
 description to-switch-4
 no ip address
 switchport
 vlan-stack trunk
 no shutdown
```

From the configuration above, we have created VLAN ID 1000 as the QinQ VLAN and aligned it to the ports connecting to Switch-1 and Switch-4.

---

### Switch-1 Configuration

Now it’s time to create VLANs 100, 200, and 300 on Switch-1 and Switch-4, then forward them to clients and the provider switches, with the following configuration:

Input:
```
sh run int gi 0/1
```
Output:
```
!
interface GigabitEthernet 0/1
 description to-switch-2
 no ip address
 switchport
 no shutdown
```

Input:
```
sh run int vlan 100
```
Output:
```
!
interface Vlan 100
 description vid0100-client-a
 no ip address
 tagged GigabitEthernet 0/1
 untagged GigabitEthernet 0/7
 shutdown
```

Input:
```
sh run int vlan 200
```

Output:
```
!
interface Vlan 200
 description vid0200-client-b
 no ip address
 tagged GigabitEthernet 0/1
 untagged GigabitEthernet 0/8
 shutdown
```

Input:
```
sh run int vlan 300
```

Output:
```
!
interface Vlan 300
 description vid0300-client-c
 no ip address
 tagged GigabitEthernet 0/1
 untagged GigabitEthernet 0/9
```

---

### Switch-4 Configuration

Input:
```
sh run int gi 0/6
```

Output:
```
!
interface GigabitEthernet 0/6
 description to-switch-3
 no ip address
 switchport
 no shutdown
```

Input:
```
sh run int vlan 100
```

Output:
```
!
interface Vlan 100
 description vid0100-client-a
 no ip address
 tagged GigabitEthernet 0/6
 untagged GigabitEthernet 0/10
 shutdown
```

Input:
```
sh run int vlan 200
```

Output:
```
!
interface Vlan 200
 description vid0200-client-b
 no ip address
 tagged GigabitEthernet 0/6
 untagged GigabitEthernet 0/11
 shutdown
```

Input:
```
sh run int vlan 300
```

Output:
```
!
interface Vlan 300
 description vid0300-client-c
 no ip address
 tagged GigabitEthernet 0/6
 untagged GigabitEthernet 0/12
```

After completing the configuration, you can test connectivity by pinging between clients, or checking the MAC address table on the provider switches. If the MAC addresses from clients on Switch-1 and Switch-4 appear on the provider switches, the VLAN path is correctly aligned.

---