#!/usr/bin/env bash
ports=(3000 5173 5174 5175)

for port in "${ports[@]}"; do
    pids=$(lsof -ti "tcp:$port" -sTCP:LISTEN 2>/dev/null)
    if [ -n "$pids" ]; then
        echo "$pids" | xargs kill -9 2>/dev/null
        echo "port $port killed"
    else
        echo "port $port already free"
    fi
done
