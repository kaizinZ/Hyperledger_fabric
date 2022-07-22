#!/bin/bash -e

exec node build/index.js tsoa routes -c tsoa-config.json
