
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
	ground = fac.addGround(40, 40, 0x999999, 0x101010);
	scene.add(ground);

	// Lights443333
	scene.add(new THREE.HemisphereLight(0x443333, 0x111122));

	//0xffff99
	sunLight = fac.addShadowedLight(0, 2.5, 1.5, 0xffff99, 1);
	scene.add(sunLight);


	// renderer
	renderer = fac.addNewRenderer(scene.fog.color, window.devicePixelRatio, window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	//CONTROL				
	orbitControl = new THREE.OrbitControls(camera);
	// dragging the view stops a turn of the View menu
	orbitControl.addEventListener('start', function () { viewTurn = null; });

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
	paintLayoutExample();	// the section of FourLayouts.html (LayoutExamples.js)
}

function actShowLayoutExample(_name) {
	showLayoutExample(_name);
}

function actSetPartPattern(_group, _url) {
	setPartPattern(_group, _url);
}

// Sky as in yingzaofashi_x3d (x3d1/x3d.html): blue overhead, lighter toward the horizon and white
// at and below it, interpolated over the angle from straight up like the X3D Background node
// there (skyColor 0x7fb0e0, 0x9bc2ea, 0xffffff at skyAngle 1.47, 1.61). The sphere moves with the
// camera, in a scene of its own so that the exporters do not see it.
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

// View menu of the layout pages (ViewMenu.js, through Observer.js).
// The camera turns around the orbit target to the front (+z, where it starts), the back, or the
// left (-x) or right (+x) side, keeping its distance and height; the turn takes half a second and
// goes the short way around.
var view_azimuths = { front: 0, right: Math.PI / 2, back: Math.PI, left: -Math.PI / 2 };
var viewTurn = null;

function actSetView(_direction) {
	var offset = camera.position.clone().sub(orbitControl.target);
	var from = Math.atan2(offset.x, offset.z);
	var turn = view_azimuths[_direction] - from;

	viewTurn = { from: from, turn: Math.atan2(Math.sin(turn), Math.cos(turn)), start: Date.now() };
}

function turnView() {
	if (!viewTurn) return;

	var t = Math.min((Date.now() - viewTurn.start) / 500, 1);
	var theta = viewTurn.from + viewTurn.turn * t * t * (3 - 2 * t);
	var target = orbitControl.target;
	var radius = Math.sqrt(Math.pow(camera.position.x - target.x, 2) + Math.pow(camera.position.z - target.z, 2));

	camera.position.x = target.x + radius * Math.sin(theta);
	camera.position.z = target.z + radius * Math.cos(theta);
	camera.lookAt(target);

	if (t == 1) viewTurn = null;
}

// The shadowed light shines from the front, the left or the right (View menu), always as strong.
// It is the same light moved, so the shaders keep their number of lights and shadows.
var sunLight;
var light_positions = { front: [0, 2.5, 1.5], left: [-1.5, 2.5, 0], right: [1.5, 2.5, 0] };

function actSetLight(_direction) {
	var p = light_positions[_direction];
	sunLight.position.set(p[0], p[1], p[2]);
}

// Shadows on or off (View menu): the darkness of the shadows is set to nothing rather than the
// shadows turned off, which would compile the shaders again. It is read from light.shadow, as
// light.shadowDarkness of three.js r73 can only be set (reading it gives undefined, which turned
// the whole view black once written back).
var shadowDarkness;

function actShowShadow(_show) {
	if (shadowDarkness === undefined) shadowDarkness = sunLight.shadow.darkness;
	sunLight.shadow.darkness = _show ? shadowDarkness : 0;
}

// Screenshot (View menu): the view is drawn once more with _scale times the pixels of the screen and
// saved as a PNG (e.g. DoubleGroove_20261016-153012.png); the canvas then goes back to its size. The
// picture is read right after it is drawn, before the frame is cleared.
function actScreenshot(_scale) {
	var ratio = renderer.getPixelRatio();

	renderer.setPixelRatio(_scale);
	renderer.setSize(window.innerWidth, window.innerHeight);
	render();
	var url = renderer.domElement.toDataURL('image/png');

	renderer.setPixelRatio(ratio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	render();

	var bytes = atob(url.split(',')[1]), data = new Uint8Array(bytes.length);
	for (var i = 0; i < bytes.length; i++) data[i] = bytes.charCodeAt(i);
	saveAs(new Blob([data], { type: 'image/png' }), screenshotName() + '.png');
}

// the page (and the layout shown on FourLayouts.html) and the time
function screenshotName() {
	var page = window.parent.location.pathname.split('/').pop().replace(/\.html$/, '') || 'preview';
	var d = new Date();
	function two(n) { return (n < 10 ? '0' : '') + n; }

	return page + (layoutExampleShown ? '_' + layoutExampleShown : '') + '_' +
		d.getFullYear() + two(d.getMonth() + 1) + two(d.getDate()) + '-' + two(d.getHours()) + two(d.getMinutes()) + two(d.getSeconds());
}

// Straight (View menu): the camera looks level at the middle height of the building, from where it
// is turned now and at the same distance, e.g. for elevations with parallel projection.
function actSetStraight() {
	var box = new THREE.Box3(), target = orbitControl.target;

	for (var i = 0; i < scene.children.length; i++) {
		var mesh = scene.children[i];
		if (!(mesh instanceof THREE.Mesh) || !mesh.userData.part) continue;

		if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
		mesh.updateMatrixWorld();
		box.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld));
	}

	var distance = camera.position.distanceTo(target);
	var offset = camera.position.clone().sub(target);

	if (box.max.y >= box.min.y) target.y = (box.min.y + box.max.y) / 2;

	offset.y = 0;
	if (offset.lengthSq() < 1e-12) offset.set(0, 0, 1);	// looking straight down: face the front
	offset.setLength(distance);

	viewTurn = null;
	camera.position.copy(target).add(offset);
	camera.lookAt(target);
}

// Top (View menu): the camera looks straight down at the orbit target from the same distance, with
// the front of the building at the bottom of the view. It stays a hair in front of straight above,
// as the orbit control cannot turn the view while looking exactly down.
function actSetTop() {
	var target = orbitControl.target, distance = camera.position.distanceTo(target);

	viewTurn = null;
	camera.position.set(target.x, target.y + distance, target.z + distance * 1e-4);
	camera.lookAt(target);
}

// Parallel projection (View menu): an orthographic camera follows the perspective camera, which the
// orbit control keeps moving, and shows at the orbit target as much as the perspective camera shows
// there, so the view keeps its size when switching and zooming still works by moving closer.
var orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 15), parallelProjection = false;

function actSetParallelProjection(_parallel) {
	parallelProjection = _parallel;
}

// the camera the scene is drawn with
function viewCamera() {
	if (!parallelProjection) return camera;

	var half = camera.position.distanceTo(orbitControl.target) * Math.tan(THREE.Math.degToRad(camera.fov / 2));

	orthoCamera.left = -half * camera.aspect;
	orthoCamera.right = half * camera.aspect;
	orthoCamera.top = half;
	orthoCamera.bottom = -half;
	orthoCamera.updateProjectionMatrix();

	orthoCamera.position.copy(camera.position);
	orthoCamera.quaternion.copy(camera.quaternion);

	return orthoCamera;
}

// The background (sky, ground and fog) can be hidden, leaving the model on white (the clear color
// of the renderer). The fog is moved beyond the far plane rather than removed, so the materials do
// not need to be compiled again.
var ground, showBackground = true;

function actShowBackground(_show) {
	showBackground = _show;
	ground.visible = _show;
	scene.fog.near = _show ? 2 : 100;
	scene.fog.far = _show ? 15 : 101;
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

	turnView();
	var view = viewCamera();

	if (!showBackground) {
		renderer.render(scene, view);
		return;
	}

	// the sky first (it clears the frame), then the scene over it; the sky is always seen in
	// perspective, as it lies far away
	sky.position.copy(camera.position);
	renderer.render(skyScene, camera);
	renderer.autoClear = false;
	renderer.render(scene, view);
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
