#!/bin/bash

UUID=$(cat /proc/sys/kernel/random/uuid)
rm -f ./static/sw-prod.js
cp ./static/sw.js ./static/sw-prod.js
sed -i "s/%VERSION%/$UUID/g" ./static/sw-prod.js
echo "Built version: ${UUID}"
