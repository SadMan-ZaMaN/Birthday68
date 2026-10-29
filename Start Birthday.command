#!/bin/bash
# Double-click this file on a Mac to open the birthday app in your browser.
cd "$(dirname "$0")" || exit 1

NODE_VERSION="v20.18.1"

if command -v node >/dev/null 2>&1; then
  NODE="node"
else
  # No Node.js installed — download a portable copy into this folder (one time only).
  ARCH="$(uname -m)"; [ "$ARCH" = "arm64" ] || ARCH="x64"
  NODE_DIR=".node/node-$NODE_VERSION-darwin-$ARCH"
  if [ ! -x "$NODE_DIR/bin/node" ]; then
    echo "Preparing (one time only, about 40 MB download)... please wait"
    mkdir -p .node
    if ! curl -fL --progress-bar "https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-darwin-$ARCH.tar.gz" | tar -xz -C .node; then
      echo "Download failed. Check your internet connection and try again."
      read -r -p "Press Enter to close."
      exit 1
    fi
  fi
  NODE="$NODE_DIR/bin/node"
fi

"$NODE" serve.mjs 8080
