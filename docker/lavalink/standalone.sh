#!/bin/bash

docker run --rm -p 2333:2333 -v "./$(dirname "$0")/application.yml:/opt/Lavalink/application.yml" --name lavalink-standalone fredboat/lavalink
