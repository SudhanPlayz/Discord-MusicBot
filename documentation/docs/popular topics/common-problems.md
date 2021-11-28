# Common Problems

## client.build is not a function

If you get an error in your console that says `TypeError: client.build is not a function`, this isn't the best error to get. (not saying any error is good)

Well at first, congratulations on picking the lucky card. This issue does not happen often.

Make sure your `config.js` file is completly filled up. If your config is completely filled out and it still causes the same error, Join our [support server](https://discord.gg/sbySMS7m3v) and report this problem.

## lavalink node not connected

### Common Errors

- **"❌ Lavalink node not connected"**
- **"Z [HeadersTimeoutError]: Headers Timeout Error"** from the console
- **"No matches found for ...."**
- Bot says **queue ended** as soon as it plays

### Possible cause

- The lavalink that your using is down.
- The lavalink that your using is overloaded.
- The lavalink that your using is unreliable.

Here is an example of what the Lavalink server looks like in the `config.js`

```js
nodes: [
  {
    identifier: "Main",
    host: "example.com", // The IP / Host name of the lavalink server.
    port: 80, // port that the lavalink server is listening on
    password: "", // password for connecting to the Lavalink server
    //retryAmount: 5, - Optional
    //retryDelay: 1000, - Optional
    //secure: false - Optional | Default: false
  },
];
```
