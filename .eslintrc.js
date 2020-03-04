module.exports = {
	env: {
		browser: true,
	},
	extends: "eslint:recommended",
	globals: {
		Buffer: true,
		beforeEach: true,
		con: true,
		define: true,
		describe: true,
		dom: true,
		expect: true,
		it: true,
		module: true,
		rand: true,
		require: true,
	},
	parserOptions: {
		ecmaVersion: 8,
	},
	rules: {
		indent: ["error", "tab", {SwitchCase: 1}],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
	},
};
