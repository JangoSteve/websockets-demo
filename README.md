# WebSockets Demo

This is a demo app to accompany the [WebSockets and Methods for
Real-Time Data
Streaming](http://www.meetup.com/SEM-JS/events/115354852/) talk at the SE Michigan JavaScript users
group.

For more info and documentation, view the [project's
homepage](http://os.alfajango.com/websockets-demo).

Also, view the [WebSockets presentation slides
here](http://os.alfajango.com/websockets-slides).

## Getting Started

Grab the repo from Github:

```
git clone git://github.com/JangoSteve/websockets-demo
```

Then `cd` into the project's root directory and install:

```
cd websockets-demo
npm install
```

Once everything is installed, run the server:

```
npm start
```

And finally, open the client page (assuming Chrome is your default
browser; if not, try browsing to the page in your Finder, right click,
and open with Chrome (then again, it may run in Firefox or some other
browser too, who knows)):

```
open index.html
```

To see the WebSockets in action, try opening the client page a bunch of
times in different tabs:

```
open index.html
open index.html
open index.html
open index.html
open index.html
open index.html
open index.html
open index.html
```

Optionally, you may also open the client page over the
network, e.g. locally or over wifi, if you have the server
running. Visit http://localhost:8080, or look
up your local network address (e.g. 192.168.1.1) using `ifconfig`
and visit your address on port 8080. 

## Client Modules

[View more info about client modules](http://os.alfajango.com/websockets-demo/#client-modules)
