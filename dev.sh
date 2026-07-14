#!/bin/sh
#
# Local dev server.
#
# Two things `next dev` does not do on its own:
#   1. Frees the port first. A server left over from a previous run makes Next quietly start on
#      another port, so you end up editing one site and looking at another.
#   2. Dies on Ctrl+C. Killing the whole process group takes the Next workers and the inspector
#      with it, instead of leaving them holding the port.

PORT="${PORT:-3000}"

# `kill 0` signals the whole process group. Reset the trap first, so it does not re-enter itself.
trap 'trap - INT TERM EXIT; kill 0' INT TERM EXIT

for pid in $(lsof -ti:"$PORT" 2>/dev/null); do
  echo "dev: port $PORT held by pid $pid, killing it"
  kill -9 "$pid" 2>/dev/null
done

NODE_OPTIONS='--inspect' next dev --port "$PORT" &
wait $!
