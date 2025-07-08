#!/bin/bash

# Create a bin directory
mkdir -p bin

# Download static FFmpeg with all codecs (includes libmp3lame, mpeg4, etc.)
curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz | tar -xJ

# Move the binary into ./bin and make it executable
mv ffmpeg-*-static/ffmpeg bin/ffmpeg
chmod +x bin/ffmpeg
