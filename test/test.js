var regen = require("../lib/regen.js");

function test(gen, rx, title, count) {
    if (!count)
	count = 100;
    rx = RegExp("^" + rx + "$");
    process.stdout.write("\tTesting: " + title + "...");
    var failed = [];
    var success = 0;
    for (var i = 0; i < count; i++) {
	var gend = regen(gen);
	if (!rx.test(gend))
	    failed.indexOf(gend) == -1 && failed.push(gend);
	else
	    success++;
    }
    console.log(" " + success + "/" + count + " tests passed.");
    for (var i in failed)
	console.log("\t\t`" + failed[i] + "': fail");
}

console.log("Character classes");
test("abcdef^$-_@", "abcdef\\^\\$-_@", "Simple symbols");
test("[abcdef]", "[abcdef]", "Character select");
test("[a-z][A-Z][0-9]", "[a-z][A-Z][0-9]", "Character range");
test(".", "[ -~]", "Wildcard");
console.log("");

console.log("Repetition");
test("tes{5}t", "tes{5}t", "Character repetition");
test("(test){5}", "(test){5}", "Group repetition");
test("tes{,3}t", "te(s?|ss|sss)t", "Repetition max");
test("tes{3,5}t", "tes{3,5}t", "Repetition min-max");
test("t[ea]{:3}st", "t(e{3}|a{3})st", "Repetition fixed");
test("tests?", "tests?", "Repetition 0-1");
console.log("");

console.log("Alternation and grouping");
test("Hello|Hi", "Hello|Hi", "Alternation");
test("Hello|Hi|Test", "Hello|Hi|Test", "Multiple alternations");
test("(Hello|Hi) world", "(Hello|Hi) world", "Alternations and grouping");
test("(Hello|Hi)|(world|you)", "Hello|Hi|world|you", "Alternations and grouping");
test("(Hello|Hi) (world|you)", "(Hello|Hi) (world|you)", "Alternations and grouping");
console.log("");

console.log("Back references");
test("([0-9]{3}) - \\1", "[0-9]{3} - [0-9]{3}", "Back reference");
test("(([0-9]){3}) - \\1\\2", "[0-9]{3} - [0-9]{4}", "Back reference 2");
console.log("");
