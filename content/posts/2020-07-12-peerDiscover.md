---
title: Peer Discover over UDP
page_title: 👓 Peer Discovery over UDP
author: Taylor Thompson
tags: [nodeJS, Rust, systems programming]
keywords: [nodeJS, Rust, udp, peer discovery]
date: 2020-07-12
description: Find and connect to other machines on your local network via UDP
aliases:
  - peer-discovery.html
images:
  [
    "https://images.unsplash.com/photo-1586307679625-79bf5a822584?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80",
  ]
---

### What is Peer discovery

Peer discovery allows you to discover other computers on the same subnet, intranet, or through the internet. Discovering peers directly removes the necessity of a centralized server architecture, reducing the number of network jumps your packets require to share information with each other. Peer discovery can be used in: discovering microservices in the same docker network or kubernetes cluster, file sharing (like airdrop and bittorrent), and peer to peer gaming. Eliminating a centralized communication server can reduce operating costs, improve communication times between clients, and lead to more robust services since there is no single point of failure. Taking advantage of the benefits listed above requires a decentralized architecture.

### Multicast Groups

Multicasting is one of the tools we can use in creating a decentralized system. Multicasting is the process where messages are sent to a group of participants on the network. Multicasting differs from Broadcasting by only sending data to a specified _group_ of network nodes, whereas broadcasting sends data to all network nodes. Implementing multicasting incurs a distinct set of challenges compared to centralized architectures; consider the following listed by Microsoft's article about [IPV4 Multicasting](<https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2003/cc759719(v=ws.10)>):

- Multicast traffic is sent to an ambiguous group destination.
- Because group addresses represent different groups with different members, group addresses generally cannot be summarized in the IP multicast forwarding table.
- The location of group members is not consistent, so the IP multicast forwarding table might need to be updated whenever a group member joins or leaves a multicast group. Multicast routing protocols update the IP multicast forwarding table.

Because the challenges like those listed above, reasoning about multicast traffic requires different mental model than a traditional client-server architecture. A critical concept in multicasting the _multicast group_. A multicast group can be compared to a chat application: membership is dynamic; members can leave and join at will, group members can be located anywhere on a multicast enabled network (compared to a server with a static IP address), a host can be a member of as many multicast groups as desired. A multicast group _can_ have a well known address, for example 224.0.0.1 is the multicast address for all hosts in the subnet.

Members of multicast groups listening for incoming traffic will first bind their UDP socket to an available interface and join the multicast group. After joining the group, this member can receive datagram packets on the bound interface without the other members of the group knowing it's specific IP address. A similar process goes for multicast group members sending data to the group. Senders will bind their UDP socket on an available interface and begin transmitting datagram packets to the multicast group address. Through the magic of multicasting, the sender does not require information other than the group address for their packets to reach group members who are listening for incoming data.

### Diving into the code

To start multicasting over UDP requires only a few lines of code. For this post, we'll create a small program which sends a username to members of a multicast group. First, we want to set up a listener for other peers sending data to the multicast group. To do this, we need to bind the UDP socket to an available interface and join the multicast group:

```rust
use std::net::{Ipv4Addr, SocketAddrV4, UdpSocket};

static MULTI_CAST_ADDR: Ipv4Addr = Ipv4Addr::new(224, 0, 0, 1);

pub fn listen() {
  let socket_address: SocketAddrV4 = SocketAddrV4::new(Ipv4Addr::new(0, 0, 0, 0), 9778);
  let bind_addr = Ipv4Addr::new(0, 0, 0, 0);
  let socket = UdpSocket::bind(socket_address)?;
  println!("Listening on: {}", socket.local_addr().unwrap());
  socket.join_multicast_v4(&MULTI_CAST_ADDR, &bind_addr)?;
}
```

Notice we create a new IP address struct with the values, `0, 0, 0, 0`, which the equivalent of saying "Any available IP interface".

```js
import dgram from "dgram";

const MULTI_CAST_ADDR = "224.0.0.1";

function listen() {
  const server = dgram.createSocket("udp4");
  server.bind(9778, () => {
    server.addMembership(MULTI_CAST_ADDR);
  });
  server.on("listening", () => {
    const address = server.address();
    console.log(`Listening on: ${address.address}:${address.port}`);
  });
}
```

`MULTI_CAST_ADDR` points an IP address, `224.0.0.1`, as stated earlier, this is the reserved multicast address for all systems on the current subnet. Since the code is listening for messages being sent to the multicast group, we need to _join_ the group _in addition to_ binding the socket on an available IP Interface. In contrast to a server listening to incoming HTTP connections, we not only bind our server to a local IP address and a port, but we also join a multicast group whose address is part of the subnet. Since we are binding the UDP server to a local address and port _and_ joining the multicast group, it can receive data from a direct connection ( like HTTP ), _and_ from the multicast group.

Now time for the logic for receiving the multicast group data. Luckily, whether the data coming from the multicast group or from a direct connection, the code the same.

```rust
pub fn listen() -> Result<()> {
    let socket_address: SocketAddrV4 = SocketAddrV4::new(Ipv4Addr::new(0, 0, 0, 0), 9778);
    let bind_addr = Ipv4Addr::new(0, 0, 0, 0);
    let socket = UdpSocket::bind(socket_address)?;
    println!("Listening on: {}", socket.local_addr().unwrap());
    socket.join_multicast_v4(&MULTI_CAST_ADDR, &bind_addr)?;
    loop {
        // set up message buffer with size of 120 bytes
        let mut buf = [0; 120];
        let (data, origin) = socket.recv_from(&mut buf)?;
        let buf = &mut buf[..data];
        let message = String::from_utf8(buf.to_vec()).unwrap();
        println!("server got: {} from {}", message, origin);
    }
}
```

```js
function listen() {
  const server = dgram.createSocket("udp4");
  // Listen for incoming messages
  server.on("message", (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });
  server.bind(9778, (a) => {
    server.addMembership(MULTI_CAST_ADDR);
  });
  server.on("listening", () => {
    const address = server.address();
    console.log(`Listening on: ${address.address}:${address.port}`);
  });
}
```

After setting up logic for listening to incoming messages on the multicast group address, our basic server is done! Now we can create the function that will send packets to the multicast address:

```rust
use std::net::{Ipv4Addr, SocketAddrV4, UdpSocket};

static MULTI_CAST_ADDR: Ipv4Addr = Ipv4Addr::new(224, 0, 0, 1);

pub fn cast() -> Result<()> {
    let socket_address: SocketAddrV4 = SocketAddrV4::new(Ipv4Addr::new(0, 0, 0, 0), 0);
    let socket = UdpSocket::bind(socket_address)?;
    socket.connect(SocketAddrV4::new(MULTI_CAST_ADDR, 9778))?;
    // Don't send messages to yourself.
    // In this case self discovery is for human developers, not machines.
    socket.set_multicast_loop_v4(false)?;
    let data = String::from("{\"username\": \"test\"}")
     loop {
        socket.send(data.as_bytes())?;
        thread::sleep(time::Duration::from_secs(2));
    }
    Ok(())
```

```js
import dgram from "dgram";

const MULTI_CAST_ADDR = "224.0.0.1";

function cast() {
  const client = dgram.createSocket("udp4");
  setInterval(() => {
    const message = Buffer.from(JSON.stringify({ username: "hackerman1337" }));
    client.send(message, 9778, MULTI_CAST_ADDR);
  }, 2000);
}
```

Unlike the `listen` function, when we are sending data to the multicast address, we don't need to join the multicast group. Since we are using UDP for peer discovery, we can fire and forget these messages from the `cast` function as there will be no response from the server.

To test our peer discovery functions, you need two computers connected to the same subnet, or two docker containers running in the same docker network, or a docker container and your computer. Note that while you don't need to expose docker ports in order for the program running on your computer to discover the program running in the docker container, you will need to expose ports in order for your container to discover the host machine. We also need to combine our two functions so that we are both broadcasting our presence and listening for peers.

```rust
use std::thread;

fn main() {
  thread::spawn(||{
      listen();
    });
  cast();
}
```

```js
import cluster from "cluster";

function main() {
  if (cluster.isMaster) {
    cluster.fork();
    listen();
  } else if (cluster.isWorker) {
    cast();
  }
}

main();
```

That's it! If you run the program on two different computers on the same subnet, or two docker containers in the same docker network, you can observe the peers are able to discover each other's username and IP Address. The final code output:

```rust
use std::net::{Ipv4Addr, SocketAddrV4, UdpSocket};
use std::thread;

static MULTI_CAST_ADDR: Ipv4Addr = Ipv4Addr::new(224, 0, 0, 1);

pub fn listen() {
  let socket_address: SocketAddrV4 = SocketAddrV4::new(Ipv4Addr::new(0, 0, 0, 0), 9778);
  let bind_addr = Ipv4Addr::new(0, 0, 0, 0);
  let socket = UdpSocket::bind(socket_address)?;
  println!("Listening on: {}", socket.local_addr().unwrap());
  socket.join_multicast_v4(&MULTI_CAST_ADDR, &bind_addr)?;
}

pub fn cast() -> Result<()> {
  let socket_address: SocketAddrV4 = SocketAddrV4::new(Ipv4Addr::new(0, 0, 0, 0), 0);
  let socket = UdpSocket::bind(socket_address)?;
  socket.connect(SocketAddrV4::new(MULTI_CAST_ADDR, 9778))?;
  // Don't send messages to yourself.
  // In this case self discovery is for human developers, not machines.
  socket.set_multicast_loop_v4(false)?;
  let data = String::from("{\"username\": \"test\"}")
   loop {
    socket.send(data.as_bytes())?;
    thread::sleep(time::Duration::from_secs(2));
  }
  Ok(())
}

fn main() {
  thread::spawn(||{
      listen();
    });
  cast();
}
```

```js
import dgram from "dgram";
import cluster from "cluster";

const MULTI_CAST_ADDR = "224.0.0.1";

function listen() {
  const server = dgram.createSocket("udp4");
  server.on("message", (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });
  server.bind(9778, (a) => {
    server.addMembership(MULTI_CAST_ADDR);
  });
  server.on("listening", () => {
    const address = server.address();
    console.log(`Listening on: ${address.address}:${address.port}`);
  });
}

function cast() {
  const client = dgram.createSocket("udp4");
  setInterval(() => {
    const message = Buffer.from("TEST");
    client.send(message, 9778, MULTI_CAST_ADDR);
  }, 2000);
}

function main() {
  if (cluster.isMaster) {
    cluster.fork();
    listen();
  } else if (cluster.isWorker) {
    cast();
  }
}

main();
```
