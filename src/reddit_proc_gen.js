// Source now at [https://github.com/raurir/experimental-graphics/blob/master/src/polygon_slice.js](src/polygon_slice.js)
const innerHTML = `
<style>
div#stage {
	padding: 20px;
}
div#stage a {
	color: white;
}
</style>
<div id='stage'>
	<a href='/?polygon_slice'>This experiment has been renamad to PolygonSlice... Click here to go there.</a>
</div>`;

define("reddit_proc_gen", () => {
	const stage = document.createElement("div");

	const init = options => {
		stage.innerHTML = innerHTML;
		progress("render:complete", stage);
	};

	return {
		stage,
		init,
	};
});
