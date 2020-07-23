---
title: InterPlanetary File System
tags: [distributed systems]
---

## IPFS

The InterPlanetary file system (IPFS) aims to be not only just a peer to peer file system, but also an infrastructure for the distributed web. It aims to solve the challenge faced by traditional client-server architectures which is "lots of data, available everywhere". All data in the IPFS is part of the same dataset, represented in a Merkle Directed Acyclic Graph. Each node of the IPFS contains an ID, a public key, and a private key. The function used to hash the node's ID can also be specified and shared, allowing for more a flexible implementation for nodes.


<br />

The IPFS specifies interfaces that need to be met, rather than implementation details, allowing it to operate over a variety of network protocols including TCP, uTP, and overlay networks without IP. To protect against "greedy" nodes (i.e. nodes that only receive data and never seed it), the IPFS has a probabilistic strategy for block exchange which is calculated through the use of a node's "debt ratio", as expressed by the formula `bytes_sent / bytes_received + 1`.


<br />

Unlike some distributed ledger systems, nodes in the IPFS do not need to verify the entire ledger history of a peer during the exchange initiation. Instead, only the most recent ledger entries are enough for peers to take advantage of a history of good conduct, and older entries can be garbage collected. Objects and links make up some of the basic data structures of the IPFS:


<br />

* Link: has a name, a cryptographic hash of the target data, and the size of the target data
* Object: contains an array of links, and a byte array containing the data for the IPFS block.

<br />

Objects are immutable, which can cause problems when factoring in file system behavior such as renaming a file, or changing its location. To compensate for this, a InterPlanetary Name Space prefix is attached, allowing for human readable names and for the IPFS routing system to map the mutable name to the immutable object.

