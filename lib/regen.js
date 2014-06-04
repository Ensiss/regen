"use strict";

function regen(reg) {
    function strRepeat(s, num) {
	return new Array(num + 1).join(s);
    }

    function exit(msg) {
	console.log("Invalid regex: " + msg);
	process.exit();
    }

    function parseRegex(reg) {
	var tab = explodeRegex(reg);
	reg = tab[Math.floor(Math.random() * tab.length)];
	var builder = {reg:reg, out:"", i:0, escaped:false};
	while (builder.i < reg.length) {
	    var i = builder.i;
	    if (!builder.escaped && reg[i] == '[') {
		parsePool(builder);
		continue;
	    }
	    else if (!builder.escaped && reg[i] == '(') {
		var end = getClosingIdx(builder.reg, i + 1, ')', true);
		end == -1 && exit("Closing character ')' not found");
		builder.i = end + 1;
		var reg_repeat = parseRepeat(builder, builder.reg.substr(end + 1));
		if (reg_repeat > 0) {
		    for (var it = 0; it < reg_repeat; it++)
			builder.out += parseRegex(reg.substr(i + 1, end - i - 1));
		} else
		    builder.out += strRepeat(parseRegex(reg.substr(i + 1, end - i - 1)), -reg_repeat);
		continue;
	    }
	    else if (!builder.escaped && reg[i] == '.') {
		builder.i++;
		var reg_repeat = parseRepeat(builder, builder.reg.substr(builder.i));
		if (reg_repeat > 0) {
		    for (var it = 0; it < reg_repeat; it++)
			builder.out += String.fromCharCode(Math.floor(Math.random() * 95) + 32);
		} else
		    builder.out += strRepeat(String.fromCharCode(Math.floor(Math.random() * 95) + 32), -reg_repeat);
		continue;
	    }
	    if (/[^\\]/.test(reg[i]) || builder.escaped)
		builder.out += strRepeat(reg[i], Math.abs(parseRepeat(builder, reg.substr(i + 1))));
	    builder.escaped = (!builder.escaped && reg[i] == '\\');
	    builder.i++;
	}
	return (builder.out);
    }

    function parseRegex(reg) {
	var tab = explodeRegex(reg);
	reg = tab[Math.floor(Math.random() * tab.length)];
	var builder = {reg:reg, out:"", i:0, escaped:false};
	while (builder.i < reg.length) {
	    var i = builder.i;
	    if (!builder.escaped && reg[i] == '[') {
		parsePool(builder);
		continue;
	    }
	    else if (!builder.escaped && reg[i] == '(') {
		var end = getClosingIdx(builder.reg, i + 1, ')', true);
		end == -1 && exit("Closing character ')' not found");
		builder.i = end + 1;
		var reg_repeat = parseRepeat(builder, builder.reg.substr(end + 1));
		if (reg_repeat > 0) {
		    for (var it = 0; it < reg_repeat; it++)
			builder.out += parseRegex(reg.substr(i + 1, end - i - 1));
		} else
		    builder.out += strRepeat(parseRegex(reg.substr(i + 1, end - i - 1)), -reg_repeat);
		continue;
	    }
	    else if (!builder.escaped && reg[i] == '.') {
		builder.i++;
		var reg_repeat = parseRepeat(builder, builder.reg.substr(builder.i));
		if (reg_repeat > 0) {
		    for (var it = 0; it < reg_repeat; it++)
			builder.out += String.fromCharCode(Math.floor(Math.random() * 95) + 32);
		} else
		    builder.out += strRepeat(String.fromCharCode(Math.floor(Math.random() * 95) + 32), -reg_repeat);
		continue;
	    }
	    if (/[^\\]/.test(reg[i]) || builder.escaped)
		builder.out += strRepeat(reg[i], Math.abs(parseRepeat(builder, reg.substr(i + 1))));
	    builder.escaped = (!builder.escaped && reg[i] == '\\');
	    builder.i++;
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
	var nrep = parseRepeat(builder, builder.reg.substr(builder.i));
	if (nrep > 0) {
	    for (var it = 0; it < nrep; it++)
		builder.out += pool[Math.floor(Math.random() * pool.length)];
	} else
	    builder.out += strRepeat(pool[Math.floor(Math.random() * pool.length)], -nrep);
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
