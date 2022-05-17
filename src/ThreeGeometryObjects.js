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

export class Sphere extends THREE.Sphere {
	constructor(value1, value2, value3, material) {
		const geometry = new THREE.BufferGeometry(value1, value2, value3);
		super(geometry, material);
	}
}

export class DasheLine extends THREE.Line {
	constructor(value1, value2, transparentLineMaterial) {
		const vertices = [
			new THREE.Vector3(value1[0], value1[2], value1[1]),
			new THREE.Vector3(value2[0], value2[2], value2[1]),
		] ;
		
		let geometry = new THREE.BufferGeometry().setFromPoints( vertices );
		
		super(geometry, transparentLineMaterial);
		this.computeLineDistances()
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


export class Triangle extends THREE.Mesh {
	constructor(a, b, c, color,opacity) {
		const vertices = [
			a[0], a[2], a[1],
			b[0], b[2], b[1],
			c[0], c[2], c[1],
		] ;
		
		if(!opacity){
			opacity = 0.5;
		}
		let geometry = new THREE.BufferGeometry().setFromPoints( vertices );
		
		const center = new THREE.Vector3();
		geometry.computeBoundingBox();
		geometry.boundingBox.getCenter(center);
		geometry.center();
		geometry.attributes.position.needsUpdate = true;

		const material_front = new THREE.MeshBasicMaterial({
			color,
			transparent: true,
			opacity: opacity,
			side: THREE.DoubleSide
		});


		super(geometry, material_front);

	}

	update(a, b, c) {

		
		const vertices = [
			new THREE.Vector3(a[0], a[2], a[1]),
			new THREE.Vector3(b[0], b[2], b[1]),
			new THREE.Vector3(c[0], c[2], c[1]),
		] ;

		this.geometry.setFromPoints( vertices );


		const center = new THREE.Vector3();
		this.geometry.computeBoundingBox();

		this.geometry.boundingBox.getCenter(center);
		this.geometry.center();
		this.geometry.attributes.position.needsUpdate = true;

		this.position.copy(center);
	}
}

export class GradientedTriangle extends THREE.Mesh {
	constructor(a, b, c, colorA,colorB,opacity) {
		const i1 = new THREE.Vector3(a[0], a[2], a[1]);
		const i2 = new THREE.Vector3(b[0], b[2], b[1]);
		const i3 = new THREE.Vector3(c[0], c[2], c[1]);
		if(!opacity){
			opacity = 0.5;
		}
		const geometry = new THREE.Geometry();
		geometry.vertices.push(i1);
		geometry.vertices.push(i2);
		geometry.vertices.push(i3);

		const center = new THREE.Vector3();
		geometry.computeBoundingBox();
		geometry.boundingBox.getCenter(center);
		geometry.center();
		geometry.verticesNeedUpdate = true;

		const face = new THREE.Face3(0, 1, 2);
		geometry.faces.push(face);

		function adjust(color, amount) {
			return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
		}
		colorA=adjust(colorA,100);
		colorB=adjust(colorB,100);

		var material_front = new THREE.ShaderMaterial({
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


		super(geometry, material_front);
		this.position.copy(center);
	}

	update(a, b, c, colorA, colorB) {
		const geometry = this.geometry;
		geometry.vertices[0].set(a[0], a[2], a[1]);
		geometry.vertices[1].set(b[0], b[2], b[1]);
		geometry.vertices[2].set(c[0], c[2], c[1]);

		const center = new THREE.Vector3();
		geometry.computeBoundingBox();
		geometry.boundingBox.getCenter(center);
		geometry.center();
		geometry.verticesNeedUpdate = true;

		this.position.copy(center);

		this.material = new THREE.ShaderMaterial({
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
}


/*
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


export class Sphere extends THREE.Sphere {
	constructor(value1, value2, value3, material) {
		const geometry = new THREE.BufferGeometry(value1, value2, value3);
		super(geometry, material);
	}
}

export class DasheLine extends THREE.Line {
	constructor(value1, value2, transparentLineMaterial) {
		const vertices = [
			new THREE.Vector3(value1[0], value1[2], value1[1]),
			new THREE.Vector3(value2[0], value2[2], value2[1]),
		] ;
		
		let geometry = new THREE.BufferGeometry().setFromPoints( vertices );
		
		super(geometry, transparentLineMaterial);
		this.computeLineDistances()
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



export class Triangle extends THREE.Mesh {
	constructor(a, b, c, color,opacity) {
		const vertices = [
			new THREE.Vector3(a[0], a[2], a[1]),
			new THREE.Vector3(b[0], b[2], b[1]),
			new THREE.Vector3(c[0], c[2], c[1]),
		] ;
		
		if(!opacity){
			opacity = 0.5;
		}
		let geometry = new THREE.BufferGeometry().setFromPoints( vertices );
		
		const center = new THREE.Vector3();
		geometry.computeBoundingBox();
		geometry.boundingBox.getCenter(center);
		geometry.center();
		geometry.attributes.position.needsUpdate = true;

		const material_front = new THREE.MeshBasicMaterial({
			color,
			transparent: true,
			opacity: opacity,
			side: THREE.DoubleSide
		});


		super(geometry, material_front);
		this.position.copy(center);
	}

	update(a, b, c) {
		const vertices = [
			new THREE.Vector3(a[0], a[2], a[1]),
			new THREE.Vector3(b[0], b[2], b[1]),
			new THREE.Vector3(c[0], c[2], c[1]),
		] ;
		this.geometry.setFromPoints( vertices );
		const center = new THREE.Vector3();
		this.geometry.computeBoundingBox();
		this.geometry.boundingBox.getCenter(center);
		this.geometry.center();
		this.geometry.attributes.position.needsUpdate = true;

		this.position.copy(center);
	}
}

export class GradientedTriangle extends THREE.Mesh {
	constructor(a, b, c, colorA,colorB,opacity) {

		const vertices = [
			new THREE.Vector3(a[0], a[2], a[1]),
			new THREE.Vector3(b[0], b[2], b[1]),
			new THREE.Vector3(c[0], c[2], c[1]),
		] ;
		
		if(!opacity){
			opacity = 0.5;
		}
		
		let geometry = new THREE.BufferGeometry().setFromPoints( vertices );
		
		const center = new THREE.Vector3();
		geometry.computeBoundingBox();
		geometry.boundingBox.getCenter(center);
		geometry.center();
		geometry.attributes.position.needsUpdate = true;

		var material_front = new THREE.ShaderMaterial({
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


		super(geometry, material_front);
		this.position.copy(center);
	}

	update(a, b, c, colorA, colorB) {
		const vertices = [
			new THREE.Vector3(a[0], a[2], a[1]),
			new THREE.Vector3(b[0], b[2], b[1]),
			new THREE.Vector3(c[0], c[2], c[1]),
		] ;
		this.geometry.setFromPoints( vertices );
		const center = new THREE.Vector3();
		this.geometry.computeBoundingBox();
		this.geometry.boundingBox.getCenter(center);
		this.geometry.center();
		this.geometry.attributes.position.needsUpdate = true;

		this.position.copy(center);

		this.material = new THREE.ShaderMaterial({
			uniforms: {
			  color1: {
				value: new THREE.Color(colorA)
			  },
			  color2: {
				value: new THREE.Color(colorB)
			  },
			  bboxMin: {
				value: this.geometry.boundingBox.min
			  },
			  bboxMax: {
				value: this.geometry.boundingBox.max
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

}
*/