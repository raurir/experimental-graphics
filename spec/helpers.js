const poly = (sides, jump) =>
	Array(sides)
		.fill()
		.map((_, i) => {
			const angle = ((jump * i) / sides) * Math.PI * 2;
			return {
				x: Math.sin(angle),
				y: Math.cos(angle),
			};
		});

module.exports = {
	poly,
}