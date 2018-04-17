module.exports = () =>
	require('crypto').createHash('md5').update(
		require('fs').readFileSync(`${__dirname}/jsmin/composite.js`)
	).digest('hex')