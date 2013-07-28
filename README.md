# Coder on Fire


## Automatic build on file change

Using [inotify](http://en.wikipedia.org/wiki/Inotify).

```shell
incrontab -e

/home/andrew/coder_on_fire/src/articles/ IN_MODIFY,IN_CREATE,IN_DELETE,IN_MOVE /home/andrew/coder_on_fire/build.sh
```
