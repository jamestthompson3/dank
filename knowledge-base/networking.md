---
title: Network Learning
tags: [distributed_systems]
---

#### ALOHA PROTOCOL
* Late 60s Hawaiian radio network.
> The Aloha protocol was very simple: an Aloha station could send whenever it liked, and then wait for an acknowledgment. If an acknowledgment wasn’t received within a short amount of time, the station would assume that another station had transmitted simul‐ taneously, causing a collision in which the combined transmissions were garbled so that the receiving station did not hear them and did not return an acknowledgment. Upon detecting a collision, both transmitting stations would choose a random backoff time, and then retransmit their packets with a good probability of success. However, as traffic increased on the Aloha channel, the collision rate would rapidly increase as well.

*_pure Aloha_*: Only achieves max channel utilization of 18% due to increasing collisions
*_slotted Aloha_*: Assigned transmission slots with a master clock to sync transmissions -> max channel utilization 37%.
[@spurgeonEthernetDefinitiveGuide2014 4]
