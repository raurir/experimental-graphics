module.exports = () => {
	const md5 = require('crypto').createHash('md5').update(
		require('fs').readFileSync(`${__dirname}/jsmin/composite.js`)
	).digest('hex');
	// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
	console.log(
`\x1b[32m--------------------------------
BUILD HASH
${md5}
--------------------------------\x1b[0m`
	);
	return md5;
};