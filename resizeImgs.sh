#!/bin/bash
cd build/articles/images/

for file in *.{png,jpg};
    do
        if [ -f $file ]
        then
            echo "Resizing $file"
            convert $file -resize 1400 -quality 80 -strip "${file/./-x2.}"
            convert $file -resize 700 -quality 80 -strip $file
        fi;
done