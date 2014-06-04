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

## Syntax

### Character classes

| Symbol       | Description                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| Alphanumeric | All alphanumeric characters (and special characters except if specified otherwise) output themselves |
| [xyz]        | Output one of the characters specified in brackets. Each character has the same chance to appear     |
| [a-z]        | Output a character from the specified range                                                          |
| .            | Output any printable ASCII character                                                                 |

### Repetition

| Symbol       | Description                                                        |
| ------------ | ------------------------------------------------------------------ |
| {x}          | Output the previous selection `x` times, select randomly each time |
| {,x}         | Output the selection randomly between 0 and `x` times              |
| {x,y}        | Output the selection randomly between `x` and `y` times            |
| {:x}         | Output the selection `x` times, keep selection                     |
| ?            | Output the selection 0 or 1 time                                   |

### Alternation and grouping

| Symbol       | Description                                                        |
| ------------ | ------------------------------------------------------------------ |
| ( )          | Group characters and regexes together, may be nested               |
| &#124;       | Output the left or right expression                                |

## Exemples

Ipv6: `([0-9a-f]{4}:){4}[0-9a-f]{4}`

Ipv4 (not restricted to 255): `([0-9]{3}\\.){3}[0-9]{3}`

Email address: `([rtnsd][aeiou]){2,3}\\.([rtnsd][aeiou]){2,3}@(github|gmail|yahoo|yopmail)\\.(com|org|info)`

Comment: `(Hey|Hello|Hi), I just saw (this|your) (amazing|incredible|beautiful) project !{1,3}`
