module.exports = {
	env: {
		browser: true,
	},
	extends: "eslint:recommended",
	globals: {
		con: true,
		define: true,
		dom: true,
		module: true,
		rand: true,
		require: true
	},
	parserOptions: {
		ecmaVersion: 7,
	},
	rules: {
		indent: ["error", "tab", {SwitchCase: 1}],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
	},
};
