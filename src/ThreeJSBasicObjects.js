import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { WebGLUtils } from 'three';

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
	//scene.background = new THREE.Color(0xffffff);
	scene.background = new THREE.Color( "#e3e3e3" );
	return scene;
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


export function sphereHoverInit(meshs, camera, scene, conf) {	
	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();
	
	var hoveredObjects = {};
	window.addEventListener('mousemove', 
	function (event) {
		
		event.preventDefault();

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		var intersects = raycaster.intersectObjects(scene.children, true);
		var hoveredObjectUuids = intersects.filter(e => e.object.name.includes("_sphereHoverRegion")).map(el => el.object.uuid);
		for (var i = 0; i < intersects.length; i++) {
			
			if(intersects[i].object.name.includes("_sphereHoverRegion")){	
				let name = intersects[i].object.name;
				name = name.replace('_sphereHoverRegion','_text');
				var hoveredObj = intersects[i].object;
				meshs[name].visible=true;
				if(conf.metricsLabelsRenderingMode === "2D"){
					meshs[name].element.style.display="";
				}
				if (hoveredObjects[hoveredObj.uuid]) {
					continue; // this object was hovered and still hovered
				}
				hoveredObjects[hoveredObj.uuid] = hoveredObj;
				

				
			}
				
		}

		for (let uuid of Object.keys(hoveredObjects)) {
			let idx = hoveredObjectUuids.indexOf(uuid);
			if (idx === -1) {
				// object with given uuid was unhovered
				let unhoveredObj = hoveredObjects[uuid];
				let name = unhoveredObj.name;
				name = name.replace('_sphereHoverRegion','_text');
				if(meshs[name]){
					meshs[name].visible=false;
					if(conf.metricsLabelsRenderingMode === "2D"){
						meshs[name].element.style.display="none";
					}
				}
					
			
				delete hoveredObjects[uuid];
	
			}
		}
	}
	);
}