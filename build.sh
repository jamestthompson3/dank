#!/bin/bash

UUID=$(cat /proc/sys/kernel/random/uuid)
rm -f sw-prod.js
cp sw.js sw-prod.js
sed -i "s/%VERSION%/$UUID/g" sw-prod.js
