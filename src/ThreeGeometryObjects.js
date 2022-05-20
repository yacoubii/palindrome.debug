import * as THREE from 'three';

export class SimpleLine extends THREE.Line {
	constructor(value1, value2, transparentLineMaterial) {
		const vertices = [
			new THREE.Vector3(value1[0], value1[2], value1[1]),
			new THREE.Vector3(value2[0], value2[2], value2[1]),
		] ;
		let geometry = new THREE.BufferGeometry().setFromPoints( vertices );
		super(geometry, transparentLineMaterial);
	}

	update(a,b){
		const vertices = [
			new THREE.Vector3(a[0], a[2], a[1]),
			new THREE.Vector3(b[0], b[2], b[1]),
		] ;
		this.geometry.setFromPoints( vertices );
		this.geometry.attributes.position.needsUpdate = true;
	};
}


export class DasheLine extends THREE.Line {
	constructor(value1, value2, transparentLineMaterial) {
		const vertices = new Float32Array([
			value1[0], value1[2], value1[1],
			value2[0], value2[2], value2[1],
		]) ;
		
		let geometry = new THREE.BufferGeometry();
		geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		
		super(geometry, transparentLineMaterial);
		this.computeLineDistances()
	}

	update(a,b){
		this.geometry.attributes.position.setXYZ( 0, a[0], a[2], a[1] );
		this.geometry.attributes.position.setXYZ( 1, b[0], b[2], b[1] );
		this.geometry.attributes.position.needsUpdate = true;
	};
}


export class Triangle extends THREE.Mesh {
	constructor(a, b, c, colorA, colorB, opacity) {
		if(!opacity){
			opacity = 0.5;
		}
		const vertices = new Float32Array( [
			a[0], a[2], a[1],
			b[0], b[2], b[1],
			c[0], c[2], c[1],
		] );

		let geometry = new THREE.BufferGeometry();
		geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

		const center = new THREE.Vector3();
		geometry.computeBoundingBox();
		geometry.boundingBox.getCenter(center);
		geometry.center();
		geometry.attributes.position.needsUpdate = true;
		if (!colorB){
			var material_front = new THREE.MeshBasicMaterial({
				color:colorA,
				transparent: true,
				opacity: opacity,
				side: THREE.DoubleSide
			});
		}
		else{
			material_front = new THREE.ShaderMaterial({
				uniforms: {
				  color1: {
					value: new THREE.Color(colorA)
				  },
				  color2: {
					value: new THREE.Color(colorB)
				  },
				  bboxMin: {
					value: geometry.boundingBox.min
				  },
				  bboxMax: {
					value: geometry.boundingBox.max
				  }
				},
				vertexShader: `
				  uniform vec3 bboxMin;
				  uniform vec3 bboxMax;
				
				  varying vec2 vUv;
			  
				  void main() {
					vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
				  }
				`,
				fragmentShader: `
				  uniform vec3 color1;
				  uniform vec3 color2;
				
				  varying vec2 vUv;
				  
				  void main() {
					
					gl_FragColor = vec4(mix(color1, color2, vUv.y), 0.5);
				  }
				`,
				wireframe: false,
				side: THREE.DoubleSide,
				transparent:true
			  });
		}

		super(geometry, material_front);
		this.position.copy(center);
	}

	update(a, b, c, colorA, colorB) {
		
		this.geometry.attributes.position.setXYZ( 0, a[0], a[2], a[1] );
		this.geometry.attributes.position.setXYZ( 1, b[0], b[2], b[1] );
		this.geometry.attributes.position.setXYZ( 2, c[0], c[2], c[1] );
		
		this.geometry.attributes.position.needsUpdate = true;
		const center = new THREE.Vector3();
		this.geometry.computeBoundingBox();
		this.geometry.boundingBox.getCenter(center);
		this.geometry.center();
	
		this.position.copy(center);

		if (colorA && colorB){
			this.material.uniforms.color1.value = new THREE.Color(colorA);
			this.material.uniforms.color2.value = new THREE.Color(colorB);
			this.material.needsUpdate= true;
		}
	}
}

export class Sphere extends THREE.Mesh {
	constructor(color){
		const geometry = new THREE.SphereGeometry( 0.8, 32, 16 );
		const material = new THREE.MeshBasicMaterial( {color} );
		material.transparent = true;
		material.needsUpdate = true;
		material.opacity=1;
		super(geometry, material);
	}
	update(color){
		this.material.color.set(color);
	};
}
