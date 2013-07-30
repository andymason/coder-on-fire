# Coder on Fire

My little personal homepage that I've built in the most complex way possible.
I'd been meaning to re-build my site for a long time while also wanting to learn
more about node.js and grunt so I thought I'd combine the two and build my new
site using the latest tool-set.

One of the most interseting aspects (for me anyway) is the syncing of articles
written on my mobile device to the server which triggers a hook to build the
site.

**ADD MORE DETAIL HERE**

== Todo
* Only resize images when needed
* Add real styles
* Add small screen styles
* Write an article explaining how it all works
* Replace bash script with grunt task (imagemagick)
* Create glitch based homepage
* Use log data and London weather to customise homepage

## Automatic build on file change

Using [inotify](http://en.wikipedia.org/wiki/Inotify).

```shell
incrontab -e

/home/andrew/coder_on_fire/src/articles/ IN_MODIFY,IN_CREATE,IN_DELETE,IN_MOVE /home/andrew/coder_on_fire/build.sh
```
