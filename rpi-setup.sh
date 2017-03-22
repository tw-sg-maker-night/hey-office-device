#!/usr/bin/env bash

curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update
sudo apt-get -y upgrade

sudo apt-get -y install libasound2-dev swig3.0 python-pyaudio python3-pyaudio sox libatlas-base-dev nodejs yarn

cat > ~/.asoundrc << EOF
pcm.!default {
  type asym
   playback.pcm {
     type plug
     slave.pcm "hw:0,0"
   }
   capture.pcm {
     type plug
     slave.pcm "hw:1,0"
   }
}
EOF

amixer sset 'PCM' 100%

yarn install
yarn run build
