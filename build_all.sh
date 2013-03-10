#!/bin/sh

echo "Creating build script from the entry script using browserify"
echo "Adding ./node_modules/.bin/ to the path, to execute commands from there."

# PATH="./node_modules/.bin:$PATH"
PROJECT_DIR=$(cd "$(dirname "$0")"; pwd)
NODE_BIN=$PROJECT_DIR"/node_modules/.bin"
echo "Nodejs binaries used from the location:  "$NODE_BIN

TEMPLATES_OUTPUT_FILE="all_templates_output.js"
HANDLEBARS_HACK_INCLUDE_FILE="prepend_handlebars_hack"

echo "Clean: Removing output files and will regenerate them........................"

# Note - building it in both dist and public/javascripts directory:
# dist directory is used for distribution, and public/javascripts is used for testing with brunch server
rm ./dist/bundle.js 2>/dev/null
rm ./public/javascripts/bundle.js 2>/dev/null
rm ./templates/$TEMPLATES_OUTPUT_FILE

echo "Generate templates: Running Handlebars to create a single tempalte file........................"

# Akshay hack - Added the following line to the TEMPLATES_OUTPUT_FILE in order for the variable Handlebars to be visible.
cat ./app/templates/$HANDLEBARS_HACK_INCLUDE_FILE >  ./app/templates/$TEMPLATES_OUTPUT_FILE
$NODE_BIN/handlebars ./app/templates/*.hbs >> ./app/templates/$TEMPLATES_OUTPUT_FILE

echo "Generate build file: Running browserify to create a single dist file........................"

$NODE_BIN/browserify ./app/entry.js  -o ./dist/bundle.js
$NODE_BIN/browserify ./app/entry.js  -o ./public/javascripts/bundle.js

echo "build/bundle,js created. Build complete......................"
