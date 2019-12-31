# Advent of Code 2019

This repo contains my solutions to the Advent of Code problems from 2019.

## Coolest things I learned while doing this challenge

### Asynchronous Queue

I implemented a Queue class which has an `await`able pop method, so if the Queue happens to be empty when you call pop it will still eventually return a value as long as some other part of the code `push`es a value to the Queue before the timeout expires.

To make this work, I couldn't just use a regular promise, because a normal Promise requires you to call `resolve` or `reject` from within the Promise body itself, but that information is not available at the time the Promise is instantiated. Instead, I decided to create another class called `Deferred` which wraps the promise and exposes the resolve & reject methods so they can be called externally to the Promise.

The final solution ended up looking like:

1. Create a `Deferred` inside the `Queue.pop` function, and push it onto a FIFO buffer inside the Queue object
2. Set a 500 ms timeout which will `reject` the promise if it hasn't been `resolve`d by then
3. Return `deferred.promise`. The consumer can simply `await` this promise just like a normal promise
4. In the `Queue.push` function, pop the first `Deferred` object off the internal FIFO buffer, resolve its promise with the value being pushed onto the Queue.

This avoids any kind of busy-waiting which is wildly inefficient. I was able to get away with such a solution in some of the earlier problems, but problem 11 forced me to figure out another way, since I was running out of heap memory due to the amount of `await null` busy waiting I was doing.

### Graphs

This project (specifically problem 10's `AsteroidDetector` class) was my first time needing to use a graph data structure. I used it to keep track of which asteroids could see which of the others. My first approach was to create a fully-connected graph during parsing and then pruning the edges of asteroids that couldn't actually see each other later, but that resulted in more computation than I actually needed.

Eventually I settled on another approach: as I parsed the problem input to find each new asteroid, I would create that new node in the graph with only the edges that actually corresponded to the asteroids it could see, meaning that the graph was in its final correct state by the time parsing was complete. Then all I had to do to figure out which asteroid could see the most other asteroids was to iterate the map's adjacency list and see which node had the most neighbors.