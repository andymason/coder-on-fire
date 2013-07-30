#!/bin/bash
cd src/articles/images/

for file in *.{png,jpg,gif};
    do
        if [ -f $file ]
        then
            echo "${file/./x2.}"
        fi;
done
