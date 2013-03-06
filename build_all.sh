#!/bin/sh

echo "Creating build script from the entry script using browserify"

cd ./app

echo "CD into app directory"

# Note - building it in both dist and public/javascripts directory:
# dist directory is used for distribution, and public/javascripts is used for testing with brunch server
rm ../dist/bundle.js 2>/dev/null
rm ../public/javascripts/bundle.js 2>/dev/null

echo "Removed previous bundle.js"

browserify entry.js  -o ../dist/bundle.js
browserify entry.js  -o ../public/javascripts/bundle.js

echo "build/bundle,js created using browserify tool."

cd ../
