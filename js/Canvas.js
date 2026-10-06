
$( document ).ready(function() {
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	
	var container, stats, model;

	var camera, scene, renderer, orbitControl;

	init();
	animate();

});

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	model = new ModelingModel();
	
	//Fog
	scene = new THREE.Scene();
    //72645b
	scene.fog = new THREE.Fog(0x72645b, 2, 15);
				
	//CAMERA		
	camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 15 );
	camera.position.set( 0, 1, 3 ); 
	
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
	container.appendChild( renderer.domElement );
			
	//CONTROL				
	orbitControl = new THREE.OrbitControls( camera);

	// stats
	stats = fac.addNewStats();
	container.appendChild( stats.domElement );

	//
	window.addEventListener( 'resize', onWindowResize, false );

}

function initBonds(_sidecorridor_flag, _w, _h) {
    model.doInitBounds(scene, _sidecorridor_flag, _w, _h);
}

function drawNewLayoutGrid(_infos) {
    model.createNewLayoutGrid(scene, _infos);
}

function drawNewColumn(_space, _dots)
{
    model.createNewColumn(scene, _space, _dots);
}

function actUndo()
{
	model.undo();
}

function actCnacelColumns(data)
{
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

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );
				
	render();
				
	stats.update();

}

function render() {

	renderer.render( scene, camera );

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
