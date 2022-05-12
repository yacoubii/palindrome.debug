import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DObject, CSS2DRenderer } from 'three-css2drender';


function initCamera() {
	const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
	camera.position.set(40, 40, 70);
	return camera;
}

function initRenderer() {
	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
		transparent: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	return renderer;
}

function initLabelsRenderer() {
	const labelsRenderer = new CSS2DRenderer();
	labelsRenderer.setSize(window.innerWidth, window.innerHeight);
	labelsRenderer.domElement.style.position = 'absolute';
	labelsRenderer.domElement.style.top = 0;
	return labelsRenderer;
}

function initControls(camera, labelsRenderer) {
	return new OrbitControls(camera, labelsRenderer.domElement);
}

function initScene() {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xffffff);
	return scene;
}

function createHtmlText(labelText, cardColor, cardBackground, parameters) {
	let p = document.createElement('p');
	p.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
	p.style.color = parameters['labelColor'];
	p.style.fontSize = parameters['labelSize'] + 'px';
	p.style.fontFamily = parameters['characterFont'];
	p.style.fontWeight = parameters["labelBold"];
	p.style.fontStyle = parameters["labelItalic"];
	p.style.padding = '5px';
	if (cardColor) {
		p.style.border = ' 2px ' + parameters['labelColor'] + ' dashed';
	}
	if (cardBackground) {
		p.style.background = parameters["labelBackground"];
	}
	p.innerText = labelText;
	return p;
}


export function initThreeObjects() {
	const scene = initScene();
	const camera = initCamera();
	const renderer = initRenderer();
	const labelsRenderer = initLabelsRenderer();
	const controls = initControls(camera, labelsRenderer);
	
	window.addEventListener('resize', function () {
		const width = window.innerWidth;
		const height = window.innerHeight;
		renderer.setSize(width, height);
		labelsRenderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	});

	
	return {
		scene,
		labelsRenderer,
		controls,
		renderer,
		camera
	};
}
