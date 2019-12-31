# Coolest things I learned while doing this challenge

## Asynchronous Queue

I implemented a Queue class which has an `await`able pop method, so if the Queue happens to be empty when you call pop it will still eventually return a value as long as some other part of the code `push`es a value to the Queue before the timeout expires.

To make this work, I couldn't just use a regular promise, because a normal Promise requires you to call `resolve` or `reject` from within the Promise body itself, but that information is not available at the time the Promise is instantiated. Instead, I decided to create another class called `Deferred` which wraps the promise and exposes the resolve & reject methods so they can be called externally to the Promise.

The final solution ended up looking like:

1. Create a `Deferred` inside the `Queue.pop` function, and push it onto a FIFO buffer inside the Queue object
2. Set a 500 ms timeout which will `reject` the promise if it hasn't been `resolve`d by then
3. Return `deferred.promise`. The consumer can simply `await` this promise just like a normal promise
4. In the `Queue.push` function, pop the first `Deferred` object off the internal FIFO buffer, resolve its promise with the value being pushed onto the Queue.

This avoids any kind of busy-waiting which is wildly inefficient. I was able to get away with such a solution in some of the earlier problems, but problem 11 forced me to figure out another way, since I was running out of heap memory due because of the amount of `await null` busy waiting I was doing.
