#!/bin/sh

echo ".......................Creating build script from the entry script using browserify......................."
echo ".......................Adding ./node_modules/.bin/ to the path, to execute commands from there........................"

# PATH="./node_modules/.bin:$PATH"
PROJECT_DIR=$(cd "$(dirname "$0")"; pwd)
NODE_BIN=$PROJECT_DIR"/node_modules/.bin"
BUILD_FILE="bundle.js"
TEMPLATES_OUTPUT_FILE="all_templates_output.js"
HANDLEBARS_HACK_INCLUDE_FILE="include_template_config.js"

echo ".......................Nodejs binaries used from the location: $NODE_BIN......................."
echo ".......................Clean: Removing output file. Will regenerate them........................"
# Note - building it in both dist and public/javascripts directory:
# dist directory is used for distribution, and public/javascripts is used for testing with brunch server
rm ./dist/$BUILD_FILE 2>/dev/null
rm ./public/javascripts/$BUILD_FILE 2>/dev/null
rm ./app/templates/$TEMPLATES_OUTPUT_FILE 2>/dev/null

echo ".......................Generate templates: Running Handlebars to create a single tempalte file........................"
# Akshay hack - Added the following line to the TEMPLATES_OUTPUT_FILE in order for the variable Handlebars to be visible.
cat ./app/templates/$HANDLEBARS_HACK_INCLUDE_FILE >  ./app/templates/$TEMPLATES_OUTPUT_FILE
$NODE_BIN/handlebars ./app/templates/*.hbs -f ./app/templates/temp_file  -k l -k s
cat ./app/templates/temp_file >> ./app/templates/$TEMPLATES_OUTPUT_FILE
rm ./app/templates/temp_file

echo ".......................Generate build file: Running browserify to create a single dist file........................"
$NODE_BIN/browserify ./app/entry.js  -o ./dist/$BUILD_FILE
$NODE_BIN/browserify ./app/entry.js  -o ./public/javascripts/$BUILD_FILE

echo ".......................Cleaning up......................."
rm ./app/templates/$TEMPLATES_OUTPUT_FILE 2>/dev/null
echo ".......................Build complete. The output file is at dist/$BUILD_FILE......................"
