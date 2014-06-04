regen
==========

The name **regen** stands for RegExp-Generate. It's a lightweight tool that uses the Regular Expression syntax to generate strings.

It can be used in various ways, from debugging to generating data sets. If there's something that you can match using a RegExp, you can generate a random set of this thing using **regen**.

## Installation

### With npm

```shell
npm install -g re-gen
```
Remove the `-g` flag to install locally.

### For the browser
Download the [regen.js](https://raw.githubusercontent.com/Ensiss/regen/master/lib/regen.js) file and put it in your project. Include the script in your html file and you're done !

## How to use

### With node.js

```js
var regen = require("re-gen");
console.log(regen("my regexp"));
```

### From the command line

```shell
regen 'my regexp' [count]
```

### In the browser

Include the file in your html document like this:
```html
<script src="regen.js"></script>
```
You can then simply use the `regen` function.
```js
console.log(regen("my regexp"));
```

## Exemples

Ipv6: `([0-9a-f]{4}:){4}[0-9a-f]{4}`

Ipv4 (not restricted to 255): `([0-9]{3}\\.){3}[0-9]{3}`

Email address: `([rtnsd][aeiou]){2,3}\\.([rtnsd][aeiou]){2,3}@(github|gmail|yahoo|yopmail)\\.(com|org|info)`

Comment: `(Hey|Hello|Hi), I just saw (this|your) (amazing|incredible|beautiful) project !{1,3}`
