"use strict";

function regen(reg) {
    var _patterns = [];

    function strRepeat(s, num) {
	return new Array(num + 1).join(s);
    }

    function exit(msg) {
	console.error("Invalid regex: " + msg);
	process.exit();
    }

    function doRepeat(builder, sub, outStr) {
	var reg_repeat = parseRepeat(builder, sub);
	if (reg_repeat > 0) {
	    for (var it = 0; it < reg_repeat; it++)
		builder.out += outStr();
	} else
	    builder.out += strRepeat(outStr(), -reg_repeat);
    }

    function parseRegex(reg, checkPatterns) {
	if (checkPatterns == undefined)
	    checkPatterns = true;
	var tab = explodeRegex(reg);
	reg = tab[Math.floor(Math.random() * tab.length)];
	var builder = {reg:reg, out:"", i:0, escaped:false};
	while (builder.i < reg.length) {
	    var i = builder.i;
	    if (!builder.escaped && reg[i] == '[')
		parsePool(builder);
	    else if (!builder.escaped && reg[i] == '(') {
		var end = getClosingIdx(builder.reg, i + 1, ')', true);
		end == -1 && exit("Closing character ')' not found");
		checkPatterns && _patterns.push(reg.substring(i + 1, end));
		builder.i = end + 1;
		doRepeat(builder, builder.reg.substr(end + 1), function() {
		    return (parseRegex(reg.substr(i + 1, end - i - 1)));
		});
	    } else if (!builder.escaped && reg[i] == '.') {
		builder.i++;
		doRepeat(builder, builder.reg.substr(builder.i), function() {
		    return (String.fromCharCode(Math.floor(Math.random() * 95) + 32));
		});
	    } else if (builder.escaped && "0123456789".indexOf(reg[i]) != -1) {
		builder.i++;
		builder.escaped = false;
		if (reg[i] != '0' && parseInt(reg[i]) - 1 < _patterns.length) {
		    doRepeat(builder, builder.reg.substr(i + 1), function() {
			return (parseRegex(_patterns[parseInt(reg[i]) - 1], false));
		    });
		} else
		    exit("the back reference '\\" + reg[i] + "' doesn't exist");
	    } else {
		if (/[^\\]/.test(reg[i]) || builder.escaped)
		    builder.out += strRepeat(reg[i], Math.abs(parseRepeat(builder, reg.substr(i + 1))));
		builder.escaped = (!builder.escaped && reg[i] == '\\');
		builder.i++;
	    }
	}
	return (builder.out);
    }

    function explodeRegex(reg) {
	var regxtab = [];
	var found = 0;
	var beg = 0;
	while (found != -1) {
	    found = getClosingIdx(reg, beg, '|', true);
	    if (found == -1)
		regxtab.push(reg.substr(beg));
	    else
		regxtab.push(reg.substr(beg, found - beg));
	    beg = found + 1;
	}
	return (regxtab);
    }

    function getClosingIdx(str, i, ch, isregex) {
	var escaped = false;
	while (escaped || str[i] != ch) {
	    if (!str[i])
		return (-1);
	    if (isregex && !escaped) {
		var closing = str[i] == '[' ? ']' : ')';
		if (str[i] == '[' || str[i] == '(')
		    i = getClosingIdx(str, i + 1, closing, str[i] == '(');
		i == -1 && exit("Closing character '" + closing + "' not found");
	    }
	    escaped = (!escaped && str[i] == '\\');
	    i++;
	}
	return (i);
    }

    function parsePool(builder) {
	var pool = "";
	builder.i++;
	builder.escaped = false;
	while (builder.escaped || builder.reg[builder.i] != ']') {
	    builder.i >= builder.reg.length && exit("missing ']'");
	    if (builder.escaped || builder.reg[builder.i] != '\\') {
		var match = /^([a-zA-Z0-9])-([a-zA-Z0-9])/.exec(builder.reg.substr(builder.i));
		if (match) {
		    var a = match[1].charCodeAt(0);
		    var b = match[2].charCodeAt(0);
		    a > b && exit("Invalid character range in pool");
		    for (var it = a; it <= b; it++)
			pool += String.fromCharCode(it);
		    builder.i += 2;
		} else {
		    pool += builder.reg[builder.i];
		}
	    }
	    builder.escaped = (!builder.escaped && builder.reg[builder.i] == '\\');
	    builder.i++;
	}
	builder.i++;
	doRepeat(builder, builder.reg.substr(builder.i), function() {
	    return (pool[Math.floor(Math.random() * pool.length)]);
	});
    }

    function parseRepeat(builder, str) {
	if (str[0] == '?') {
	    builder.i++;
	    return (Math.round(Math.random()));
	}
	if (str[0] != '{')
	    return (1);
	var offset = str.search('}') + 1;
	var mult = str[1] == ':' ? -1 : 1;
	str = str.substr((str[1] == ':') + 1);
	var res = /^([0-9]*),?([0-9]*)}/.exec(str);
	(!res || (!res[1] && !res[2])) && exit("bad repeater format");
	var a = parseInt(res[1], 10);
	var b = parseInt(res[2], 10);
	((isNaN(a) && isNaN(b)) || a > b || a < 0 || b < 0) && exit("bad numbers in repeater: " + res[1] + ", " + res[2]);
	builder.i += offset;
	if (a && isNaN(b))
	    return (mult * a);
	if (isNaN(a) && b)
	    return (mult * Math.floor(Math.random() * (b + 1)));
	return (mult * (Math.floor(Math.random() * (b - a + 1)) + a));
    }

    return (parseRegex(reg));
}

if (typeof module !== 'undefined' && module.exports)
    module.exports = regen;
