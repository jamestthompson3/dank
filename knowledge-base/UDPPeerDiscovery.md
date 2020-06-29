# UDP Peer Discovery

`224.0.0.0 - 239.255.255.255` are the reserved multicast IP addresses, these are class D addresses.

### Examples of Link Local Addresses

| IP Address | Usage                                                         |
| :--------- | :------------------------------------------------------------ |
| 224.0.0.1  | All systems on this subnet                                    |
| 224.0.0.2  | All routers on this subnet                                    |
| 224.0.0.5  | OSPF routers                                                  |
| 224.0.0.6  | OSPF designated routers                                       |
| 224.0.0.12 | Dynamic Host Configuration Protocol (DHCP) server/relay agent |

- Servers are not **_bound_** to a specific interface, but instead we **_join the multicast group_** on a specific interface
- Clients aren't **_bound_** to a specific interface, but start **transmitting data to the multicast group.**

### Globally Scoped Addresses

Addresses in the range from 224.0.1.0 through 238.255.255.255 are called globally scoped addresses. These addresses are used to multicast data between organizations and across the Internet.

- The IP header of a multicast datagram includes a Time-to-Live (TTL) value that determines how far routers can forward a multicast datagram.

### IP Multicasting Components

| Component                 | Description                                                                                                                                                                                     |
| :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Host (source or receiver) | A host is any client or server on the network. A multicast-enabled host is configured to send and receive (or only send) multicast data.                                                        |
| Router                    | A multicast router is capable of handling host requests to join or leave a group and of forwarding multicast data to subnets that contain group members.                                        |
| Multicast address         | A Class D IP address used for sending IP multicast data. An IP multicast source sends the data to a single multicast address. A specific IP multicast address is also known as a group address. |
| Multicast group           | A multicast group is the set of hosts that listen for a specific IP multicast address. A multicast group is also known as a host group.                                                         |
| MBone                     | The Internet multicast backbone, or the portion of the Internet that supports multicast routing.                                                                                                |

### Unicast Routing Characteristics

- Unicast traffic is sent to a globally unique destination.
- Unicast routes in the routing table summarize ranges of globally unique destinations.
- Unicast routes are comparatively consistent, so the routing table needs to be updated only when the topology of the internetwork changes.
- Unicast routing protocols update the unicast routing table.

### Multicast Routing Characteristics

- Multicast traffic is sent to an ambiguous group destination.
- Because group addresses represent different groups with different members, group addresses generally cannot be summarized in the IP multicast forwarding table.
- The location of group members is not consistent, so the IP multicast forwarding table might need to be updated whenever a group member joins or leaves a multicast group. Multicast routing protocols update the IP multicast forwarding table.

### Multicast Groups

The set of hosts listening for a specific IP multicast address is
called a multicast group or a host group. Multicast groups have the
following attributes:

- Group membership is dynamic; hosts can join and leave the group at any time.
- Members of a group can be located anywhere on a multicast-enabled network.
- A host need not be a member of a multicast group to send data to the group’s IP multicast address.
- Group members can receive both unicast and multicast traffic.
- A host can be a member of any number of multicast groups.
- A multicast group has no size limits.
- Multicast groups can be either transient or permanent. Permanent
  groups are assigned a well-known multicast address. For example,
  multicast address 224.0.0.1 is a permanent address for the all-hosts
  multicast group. Membership in a permanent group is transient; only the
  address is permanent.
