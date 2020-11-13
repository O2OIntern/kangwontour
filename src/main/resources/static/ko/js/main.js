/* eslint-disable no-invalid-this */

window.onload = async () => {
	this.scene = new Scene();
	this.scene.action = new Action(scene);
	this.scene.action.setCallbacks();
	this.canvas = window.interactiveCanvas;
	const that = this;


	var images = [];
	var endimages = [];

	function preload(images) {
		for (i = 0; i < images.length; i++) {
			var preimg = new Image();
			preimg.src = images[i];
			console.log("image " + i + " loaded");
		}
	}
	images = [
		"./img/p2-2.png",
		"./img/p2-3.png",
		"./img/p2-4.png",
	];
	endimages = [
		"./img/end0.png",
		"./img/end1.png",
		"./img/end2.png",
		"./img/end3.png",
	]
	this.endimages = endimages;
	preload(images);
	preload(endimages);

	// //AoG 위쪽 상단바 크기 구하기
	// let headerheight;
	// that.canvas.getHeaderHeightPx().then(data => {
	// 	console.log(`Bar Height : ${data}`);
	// 	headerheight = data;
	// });
	// console.log(`Header Height : ${headerHeight}`);
	let height = await headerHeight();
	console.log(height);
	barHeight = height;
	console.log(barHeight);
};

class Scene {
	constructor() {
		//화면 크기를 콘솔에 출력
		const view = document.getElementById('welcome');
		this.radio = window.devicePixelRatio;
		console.log("width : " + view.clientWidth + ", height : " + view.clientHeight);
	}
}
