#!/bin/bash          

cd get-videos
node index.js

cd ../joiner
./joiner.sh

cd ../video
rm *
