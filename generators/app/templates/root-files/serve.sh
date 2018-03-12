#!/usr/bin/env bash

uname=$(uname -s | tr '[:upper:]' '[:lower:]')
if [[ $uname == "darwin" ]]; then
    ./caddy/mac/caddy -conf ./Caddyfile
elif [[ $uname == "linux" ]]; then
    ./caddy/linux/caddy -conf ./Caddyfile
elif [[ $uname == "freebsd" ]]; then
    ./caddy/freebsd/caddy -conf ./Caddyfile
elif [[ $uname == "openbsd" ]]; then
    ./caddy/openbsd/caddy -conf ./Caddyfile
else
    echo -e "\033[31mUnable to determine operating system!\033[0;0;0m"
fi

unset uname
