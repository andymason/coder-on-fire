#!/bin/bash
cd /home/andrew/coder_on_fire/
echo -n "Files synced. Building. " && date >> grunt_build.log
grunt
