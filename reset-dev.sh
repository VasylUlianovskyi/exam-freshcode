#!/bin/bash

MARKER_FILE=".reset-done"
COMPOSE_FILE="docker-compose-dev.yaml"

if [ -f "$MARKER_FILE" ]; then
  echo ">>> Reset has already been performed."
  echo ">>> Last reset was on: $(cat $MARKER_FILE)"
  echo ">>> Skipping container, volume, and image cleanup."
else
  echo ">>> First-time setup detected. Performing full cleanup."

  echo ">>> Stopping and removing containers, volumes, and orphaned resources..."
  docker compose -f $COMPOSE_FILE down -v --remove-orphans

  echo ">>> Removing unused images related to this project..."
  docker image prune -f

  echo ">>> Writing timestamp of this reset to $MARKER_FILE..."
  date > "$MARKER_FILE"
fi

echo ">>> Done. If you want to reset again, just delete the $MARKER_FILE file."
