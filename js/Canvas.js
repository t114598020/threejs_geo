
$(document).ready(function () {
	if (!Detector.webgl) Detector.addGetWebGLMessage();

	var container, stats, model;

	var camera, scene, renderer, orbitControl;

	init();
	animate();

});

function init() {

	container = document.createElement('div');
	document.body.appendChild(container);

	model = new ModelingModel();

	//Fog
	scene = new THREE.Scene();
	// the fog takes the horizon color of the sky, so the far ground fades into it
	scene.fog = new THREE.Fog(0xffffff, 2, 15);

	sky = makeSky();
	skyScene = new THREE.Scene();
	skyScene.add(sky);

	//CAMERA		
	// near plane close to the camera, so zooming in on a detail does not cut it off (the whole
	// building is about 1.3 wide)
	camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.01, 15);
	camera.position.set(0, 1, 3);

	var fac = new Factory();

	// Ground0x999999
	var ground = fac.addGround(40, 40, 0x999999, 0x101010);
	scene.add(ground);

	// Lights443333
	scene.add(new THREE.HemisphereLight(0x443333, 0x111122));

	//0xffff99
	var shadow_light = fac.addShadowedLight(0, 2.5, 1.5, 0xffff99, 1);
	scene.add(shadow_light);


	// renderer
	renderer = fac.addNewRenderer(scene.fog.color, window.devicePixelRatio, window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	//CONTROL				
	orbitControl = new THREE.OrbitControls(camera);

	// stats
	stats = fac.addNewStats();
	container.appendChild(stats.domElement);

	//
	window.addEventListener('resize', onWindowResize, false);

}

function initBonds(_sidecorridor_flag, _w, _h) {
	model.doInitBounds(scene, _sidecorridor_flag, _w, _h);
}

function drawNewLayoutGrid(_infos) {
	model.createNewLayoutGrid(scene, _infos);
}

function drawNewColumn(_space, _dots) {
	model.createNewColumn(scene, _space, _dots);
}

function actUndo() {
	model.undo();
}

function actCnacelColumns(data) {
	model.cancelColumns(scene, data);
}

function actAddBrackets(_space, _points) {
	model.addBrackets(scene, _space, _points);
}

function actAddWall(_data) {
	model.addWall(scene, _data);
}

function actAddDoorandWindow(_data) {
	model.addDoorandWindow(scene, _data);
}

function actAddStair(_data) {
	model.addStair(scene, _data);
}

function actAddRoof(_data) {
	model.addRoof(scene, _data);
}

function actSetPartColor(_group, _color) {
	setPartColor(_group, _color);
}

function actSetPartPattern(_group, _url) {
	setPartPattern(_group, _url);
}

// Sky as in yingzaofashi_x3d (x3d1/x3d.html): blue overhead, lighter toward the horizon and white
// at and below it, interpolated over the angle from straight up like the X3D Background node
// there (skyColor 0x7fb0e0, 0x9bc2ea, 0xffffff at skyAngle 1.47, 1.61). The sphere moves with the
// camera, in a scene of its own so that the exporters and the benchmark do not see it.
var sky, skyScene;

function makeSky() {
	var material = new THREE.ShaderMaterial({
		uniforms: {
			top: { type: 'c', value: new THREE.Color(0x7fb0e0) },
			middle: { type: 'c', value: new THREE.Color(0x9bc2ea) },
			horizon: { type: 'c', value: new THREE.Color(0xffffff) },
			angles: { type: 'v2', value: new THREE.Vector2(1.47, 1.61) }
		},
		vertexShader: [
			'varying vec3 vDirection;',
			'void main() {',
			'	vDirection = position;',
			'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
			'}'
		].join('\n'),
		fragmentShader: [
			'uniform vec3 top;',
			'uniform vec3 middle;',
			'uniform vec3 horizon;',
			'uniform vec2 angles;',
			'varying vec3 vDirection;',
			'void main() {',
			'	float angle = acos( clamp( normalize( vDirection ).y, -1.0, 1.0 ) );',
			'	vec3 color = angle < angles.x ? mix( top, middle, angle / angles.x ) : mix( middle, horizon, clamp( ( angle - angles.x ) / ( angles.y - angles.x ), 0.0, 1.0 ) );',
			'	gl_FragColor = vec4( color, 1.0 );',
			'}'
		].join('\n'),
		side: THREE.BackSide,
		depthWrite: false
	});

	return new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), material);
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

	requestAnimationFrame(animate);

	render();

	stats.update();

}

function render() {

	// the sky first (it clears the frame), then the scene over it
	sky.position.copy(camera.position);
	renderer.render(skyScene, camera);
	renderer.autoClear = false;
	renderer.render(scene, camera);
	renderer.autoClear = true;

}

function actExportSTL() {
	var handler = new FileHandler();

	handler.STLexporter(scene);

	handler = null;
	delete handler;
}

function actExportX3D(_useDEF) {
	var handler = new FileHandler();

	handler.X3Dexporter(scene, _useDEF);

	handler = null;
	delete handler;
}
