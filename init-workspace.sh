#!/bin/bash

source ~/.config/scripts/svc-helper.sh

# Services 
services=("redis-server" "rabbitmq")

# Start services
for svc in "${services[@]}"; do
    start_if_not_running "$svc" || {
        echo "Error: Failed to start $svc. Exiting."
        exit 1
    }
done

# Launch Zellij 
ZELLIJ_LAYOUT="$HOME/.config/zellij/upstride.kdl"
if [ -f "$ZELLIJ_LAYOUT" ]; then
    echo "Launching Zellij with layout $ZELLIJ_LAYOUT..."
    zellij --layout "$ZELLIJ_LAYOUT"
else
    echo "Zellij layout not found at $ZELLIJ_LAYOUT. Launching default Zellij session..." 
		exit 1
fi

