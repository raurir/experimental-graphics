// TODO , nice but just do it bash.
// md5 jsmin/composite.js

console.log(
	require('crypto').createHash('md5').update(
		require('fs').readFileSync(`${__dirname}/jsmin/composite.js`)
	).digest('hex')
);
