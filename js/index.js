let $ = Bliss;
let $$ = $.$;

$$("pre.runnable > code").forEach(code => {
	let pre = code.parentNode;
	let text = code.textContent;
	text = text.replace(/let (\w+)/g, "window.$1");

	let fun = Function(`return (()=>{${text}})()`);

	$.create("button", {
		textContent: "▶",
		onclick: evt => {
			console.log(fun());
		},
		inside: pre
	});
});

let root = document.documentElement;
let cs = getComputedStyle(root);
let colors = {
	red: new Color(cs.getPropertyValue("--color-red")),
	green: new Color(cs.getPropertyValue("--color-green")),
	blue: new Color(cs.getPropertyValue("--color-blue"))
};

let supportsP3 = window.CSS && CSS.supports("color", "color(display-p3 0 1 0)");
let interpolationOptions = {steps: 5, space: "lch", outputSpace: supportsP3? "p3" : "hsl"};



let vars = {
	"gradient-steps": [
		...colors.red.steps(colors.green, interpolationOptions),
		...colors.green.steps(colors.blue, interpolationOptions),
		...colors.blue.steps(colors.red, interpolationOptions)
	]
};

let sheet = $.create("style", {inside: document.head}).sheet;
sheet.insertRule(`:root {${Object.entries(vars).map((name, value) => `--color-${name}: ${value}`)}}`);
