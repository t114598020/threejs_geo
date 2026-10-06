/// <reference path="Command.js" />

// Building parts (models/*.stl) are shared by all their placements: each STL is downloaded and
// parsed only once, and all meshes of a part use the same geometry and the same material.
// Every mesh still has its own name, position, rotation and scale, so the scene commands
// and the exporters work as before.
var partGeometries = {};	// part name -> geometry
var partCallbacks = {};		// part name -> callbacks waiting for the STL to finish loading
var partMaterial = new THREE.MeshPhongMaterial({ color: 0xff5533, specular: 0x111111, shininess: 200 });

function loadPart(part, onLoad)
{
	// always call back asynchronously, like loading the STL did, so the scene commands see the
	// same order of events as before (e.g. the duplicate check in addSevenObliquelyBracket)
	if (partGeometries[part]) {
		setTimeout(function () { onLoad(partGeometries[part]); }, 0);
		return;
	}

	if (partCallbacks[part]) {
		partCallbacks[part].push(onLoad);
		return;
	}

	partCallbacks[part] = [onLoad];

	var loader = new THREE.STLLoader();
	loader.load('./models/' + part + '.stl', function (geometry) {
		partGeometries[part] = geometry;

		var callbacks = partCallbacks[part];
		delete partCallbacks[part];

		for (var i = 0; i < callbacks.length; i++) {
			callbacks[i](geometry);
		}
	}, undefined, function () {
		delete partCallbacks[part];	// let a later placement try again
	});
}

function Factory()
{
	this.addGround = function(x_size, y_size, color, specular)
	{
		var plane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( x_size, y_size ),
			new THREE.MeshPhongMaterial( { color: color, specular: specular } )
		);
		plane.rotation.x = -Math.PI/2;
		plane.position.y = 0;
		plane.receiveShadow = true;
		plane.name = "Plane";
			
		return plane;
	}

	this.addBaseSpace = function(_w, _d)
	{
	    var mesh;
					
		// ASCII file
		loadPart( 'BaseSpace', function ( geometry ) {

			mesh = new THREE.Mesh( geometry, partMaterial );
			mesh.userData.part = 'BaseSpace';   // source STL in models/, used by X3DExporter

			mesh.position.set( 0.0, 0.023, 0.0 );
			mesh.rotation.set( 0, Math.PI / 2, 0 );
			mesh.scale.set(0.001 * _d / 5, 0.0015, 0.001 * _w / 8);

			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.name = "BaseSpace";
			scene.add(mesh);
		});
	}
	
	this.addCenterColume = function(id, x, z)
	{
		var mesh;
					
		loadPart( 'CenterColumn', function ( geometry ) {

			mesh = new THREE.Mesh( geometry, partMaterial );
			mesh.userData.part = 'CenterColumn';   // source STL in models/, used by X3DExporter

			mesh.position.set( x, 0.055, z);
			mesh.rotation.set( - Math.PI / 2, 0, 0 );
			mesh.scale.set( 0.001, 0.001, 0.001 );

			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.name = id;
			scene.add(mesh);
		} );
	}
	
	this.addSecondColumn = function(id, x, z)
	{
		var mesh;
					
		loadPart( 'SecondColumn', function ( geometry ) {

			mesh = new THREE.Mesh( geometry, partMaterial );
			mesh.userData.part = 'SecondColumn';   // source STL in models/, used by X3DExporter

			mesh.position.set( x, 0.055, z );
			mesh.rotation.set( - Math.PI / 2, 0, 0 );
			mesh.scale.set( 0.001, 0.001, 0.001 );

			mesh.castShadow = true;
			mesh.receiveShadow = true;
			mesh.name = id;
			scene.add(mesh);
		} );
	}

	this.addFiveForwardBracket = function (id, x, z, rad_y) {
	    var mesh;

	    loadPart('FiveForwardBracket', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'FiveForwardBracket';   // source STL in models/, used by X3DExporter

	        mesh.position.set(x, 0.18, z);
	        mesh.rotation.set(0, Math.PI / 2 + rad_y, 0);
	        mesh.scale.set(0.001, 0.001, 0.001);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addFiveObliquelyBracket = function (id, x, z, rad_y) {
	    var mesh;

	    loadPart('FiveObliquelyBracket', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'FiveObliquelyBracket';   // source STL in models/, used by X3DExporter

	        mesh.position.set(x, 0.18, z);
	        mesh.rotation.set(0, rad_y, 0);
	        mesh.scale.set(0.001, 0.001, 0.001);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addSevenForwardBracket = function (id, x, z, rad_y) {
	    var mesh;

	    loadPart('SevenForwardBracket', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'SevenForwardBracket';   // source STL in models/, used by X3DExporter

	        mesh.position.set(x, 0.27, z);
	        mesh.rotation.set(0, Math.PI / 2 + rad_y, 0);
	        mesh.scale.set(0.001, 0.001, 0.001);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addSevenObliquelyBracket = function (id, x, z, rad_y) {
	    var mesh;

	    var mesh = scene.getObjectByName(id);
	    if (mesh && mesh instanceof THREE.Mesh) { } else {
	        loadPart('SevenObliquelyBracket', function (geometry) {
	            // a bracket with this name may have been added while the STL was loading
	            if (scene.getObjectByName(id)) return;

	            mesh = new THREE.Mesh(geometry, partMaterial);
	            mesh.userData.part = 'SevenObliquelyBracket';   // source STL in models/, used by X3DExporter

	            mesh.position.set(x, 0.27, z);
	            mesh.rotation.set(0, rad_y, 0);
	            mesh.scale.set(0.001, 0.001, 0.001);

	            mesh.castShadow = true;
	            mesh.receiveShadow = true;
	            mesh.name = id;
	            scene.add(mesh);
	        });
	    } 
	}

    //ผู
	this.addGirder = function (id, x, _y, z, _width, rad_y) {
	    var mesh;

	    loadPart('Girder', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'Girder';   // source STL in models/, used by X3DExporter

	        mesh.position.set(x, _y, z);
	        mesh.rotation.set(0, rad_y, 0);
	        mesh.scale.set(_width / 125, 0.001, 0.001);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addWall = function (id, x, z, rad_y) {
	    var mesh;

	    loadPart('Wall', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'Wall';   // source STL in models/, used by X3DExporter

	        mesh.position.set(x, 0.055, z);
	        mesh.rotation.set(0, rad_y, 0);
	        mesh.scale.set(0.001, 0.0016, 0.0012);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}
	
	this.addDoor = function (id, x, z, rad_y) {
	    var mesh;

	    loadPart('Door', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'Door';   // source STL in models/, used by X3DExporter

	        mesh.position.set(x, 0.055, z);
	        mesh.rotation.set(0, rad_y, 0);
	        mesh.scale.set(0.001, 0.0017, 0.0012);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addWindow = function (id, x, z, rad_y) {
	    var mesh;

	    loadPart('Window', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'Window';   // source STL in models/, used by X3DExporter

	        mesh.position.set(x, 0.055, z);
	        mesh.rotation.set(0, rad_y, 0);
	        mesh.scale.set(0.001, 0.0017, 0.0012);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addStair = function (id, x, z, rad_y) {
	    var mesh;

	    loadPart('Stair', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'Stair';   // source STL in models/, used by X3DExporter

	        mesh.position.set(x, -0.0055, z);
	        mesh.rotation.set(0, rad_y, 0);
	        mesh.scale.set(0.001, 0.00145, 0.001);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addSideCorridorTopPartVirtical = function (id, _rotate_degree_y, _x, _z) {
	    var mesh;

	    loadPart('SideCorridorTopPartVirtical', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'SideCorridorTopPartVirtical';   // source STL in models/, used by X3DExporter

	        mesh.position.set(_x, 0.2, _z);
	        mesh.rotation.set(0, _rotate_degree_y, 0);
	        mesh.scale.set(0.0008, 0.001, 0.001);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addMidTileInside = function (id, _x, _y, _z, _scale_rate) {
	    var mesh;

	    loadPart('MidTileInside', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'MidTileInside';   // source STL in models/, used by X3DExporter

	        mesh.position.set(_x, _y, _z);
	        mesh.rotation.set(0, 0, 0);
	        mesh.scale.set(0.00112, 0.001, 0.00112 * _scale_rate / 4);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addMidTileOutside = function (id, _x, _y, _z, _reotate_y, _scale_rate) {
	    var mesh;

	    loadPart('MidTileOutside', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'MidTileOutside';   // source STL in models/, used by X3DExporter

	        mesh.position.set(_x, _y, _z);
	        mesh.rotation.set(0, _reotate_y, 0);
	        mesh.scale.set(0.00112, 0.001, 0.00112 * _scale_rate / 4);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addTopTileOutside = function (id, _x, _y, _z, _reotate_y, _scale_rate) {
	    var mesh;

	    loadPart('TopTileOutside', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'TopTileOutside';   // source STL in models/, used by X3DExporter

	        mesh.position.set(_x, _y, _z);
	        mesh.rotation.set(0, _reotate_y, 0);
	        mesh.scale.set(0.00112, 0.001, 0.00112 * _scale_rate);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addTopTileInside = function (id, _x, _y, _z, _scale_rate) {
	    var mesh;

	    loadPart('TopTileInside', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'TopTileInside';   // source STL in models/, used by X3DExporter

	        mesh.position.set(_x, _y, _z);
	        mesh.rotation.set(0, 0, 0);
	        mesh.scale.set(0.00112, 0.001, 0.00112 * _scale_rate);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addCornerSideTile = function (id, _x, _y, _z, _reotate_y) {
	    var mesh;

	    loadPart('CornerTile', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'CornerTile';   // source STL in models/, used by X3DExporter

	        mesh.position.set(_x, _y, _z);
	        mesh.rotation.set(0,_reotate_y, 0.1);
	        mesh.scale.set(0.001, 0.001, 0.00115);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addSideCornerTile = function (id, _x, _y, _z, _reotate_y) {
	    var mesh;

	    loadPart('SideCornerTile', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'SideCornerTile';   // source STL in models/, used by X3DExporter

	        mesh.position.set(_x, _y, _z);
	        mesh.rotation.set(0, Math.PI / 4 + _reotate_y, 0);
	        mesh.scale.set(0.001, 0.001, 0.001);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addBaseTile = function (id, _x, _y, _z, _scale_rate) {
	    var mesh;

	    loadPart('BaseTile', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'BaseTile';   // source STL in models/, used by X3DExporter

	        mesh.position.set(_x, _y, _z);
	        mesh.rotation.set(0, 0, 0);
	        mesh.scale.set(0.00112, 0.001, 0.00112 * _scale_rate / 4);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addBaseTileOutside = function (id, _x, _y, _z, _reotate_y, _scale_rate) {
	    var mesh;

	    loadPart('BaseTileOutside', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'BaseTileOutside';   // source STL in models/, used by X3DExporter

	        mesh.position.set(_x, _y, _z);
	        mesh.rotation.set(0, _reotate_y, 0);
	        mesh.scale.set(0.00112, 0.001, 0.00112 * _scale_rate / 4);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}

	this.addSideBaseTile = function (id, _x, _y, _z, _reotate_y) {
	    var mesh;

	    loadPart('SideBaseTile', function (geometry) {

	        mesh = new THREE.Mesh(geometry, partMaterial);
	        mesh.userData.part = 'SideBaseTile';   // source STL in models/, used by X3DExporter

	        mesh.position.set(_x, _y, _z);
	        mesh.rotation.set(0, _reotate_y, 0);
	        mesh.scale.set(0.001, 0.001, 0.001);

	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	        mesh.name = id;
	        scene.add(mesh);
	    });
	}
	
	this.addShadowedLight = function( x, y, z, color, intensity ) {

		var directionalLight = new THREE.DirectionalLight( color, intensity );
		directionalLight.position.set( x, y, z );

		directionalLight.castShadow = true;
		directionalLight.shadowCameraVisible = true;

		var d = 1;
		directionalLight.shadowCameraLeft = -d;
		directionalLight.shadowCameraRight = d;
		directionalLight.shadowCameraTop = d;
		directionalLight.shadowCameraBottom = -d;

		directionalLight.shadowCameraNear = 1;
		directionalLight.shadowCameraFar = 4;

		directionalLight.shadowMapWidth = 1024;
		directionalLight.shadowMapHeight = 1024;

		directionalLight.shadowBias = -0.005;
		
		return directionalLight;

	}
	
	this.addNewRenderer = function(color, pixel_ratio, width, height )
	{
		var renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setClearColor(color);
		renderer.setPixelRatio(pixel_ratio);
		renderer.setSize(width, height);

		renderer.gammaInput = true;
		renderer.gammaOutput = true;

		renderer.shadowMap.enabled = true;
		renderer.shadowMap.cullFace = THREE.CullFaceBack;

		return renderer;	
		
	}
	
	this.addNewStats = function()
	{
		var stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		return stats;
	}

	this.removeMesh = function(_scene, id) {
	    var mesh = _scene.getObjectByName(id);
	    if (mesh && mesh instanceof THREE.Mesh) {
	        _scene.remove(mesh);

	        // parts share their geometry and material (see loadPart), keep them for the other placements
	        if (mesh.userData.part) return;

	        //Release memory spaces
	        if (mesh.material.map) {
	            mesh.material.map.dispose();
	            mesh.material.map = null;
	        }
	        if (mesh.material) {
	            mesh.material.dispose();
	            mesh.material = null;
	        }
	        if (mesh.geometry) {
	            mesh.geometry.dispose();
	            mesh.geometry = null;
	        }

	        mesh = null;
	    }
	}
}




