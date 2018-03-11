#!/usr/bin/env bash

local uname=$(uname | tr '[:upper:]' '[:lower:]')
if [[ $uname == "darwin" ]]; then
    ./caddy/mac/caddy -conf ./Caddyfile
elif [[ $uname == "linux" ]]; then
    ./caddy/linux/caddy -conf ./Caddyfile
elif [[ $uname == "freebsd" ]]; then
    ./caddy/freebsd/caddy -conf ./Caddyfile
elif [[ $uname == "openbsd" ]]; then
    ./caddy/openbsd/caddy -conf ./Caddyfile
else
    echo -e "${red}Unable to determine operating system!${normal}"
fi
