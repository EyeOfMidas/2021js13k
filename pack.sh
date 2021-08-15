#!/usr/bin/env bash
echo "Minifying JS"
npm run clean
npm run build
echo "Zipping Project"
npm run bundle
echo "Zip Filesize"
npm run size
