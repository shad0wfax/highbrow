#!/bin/sh

echo "Creating build script from the entry script using browserify"

cd ./app

echo "CD into app directory"

rm ../build/bundle.js 2>/dev/null

echo "Removed previous bundle.js"

browserify entry.js  -o ../build/bundle.js

echo "build/bundle,js created using browserify tool."

cd ../
