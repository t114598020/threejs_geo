// Painting of the building parts in the preview (彩畫).
//
// Every part keeps sharing its geometry with its other placements (Factory.js, loadPart), and all
// parts of a group share one material, so painting changes a handful of materials and geometries,
// never the meshes. What the STL files do not have is added to the shared geometry when it loads
// (preparePart): texture coordinates for the patterns and the walls, colors per piece (鋪作, doors,
// windows) and, for the 鋪作, where every vertex lies on its face (the edge bands of 棱間裝).

var partGroups = {
	BaseSpace: 'floor', Stair: 'floor',
	CenterColumn: 'column', SecondColumn: 'column',
	FiveForwardBracket: 'bracket', FiveObliquelyBracket: 'bracket', SevenForwardBracket: 'bracket', SevenObliquelyBracket: 'bracket',
	Girder: 'girder',
	Wall: 'wall', Door: 'wall', Window: 'wall',
	SideCorridorTopPartVirtical: 'roof', MidTileInside: 'roof', MidTileOutside: 'roof', TopTileOutside: 'roof', TopTileInside: 'roof',
	CornerTile: 'roof', SideCornerTile: 'roof', BaseTile: 'roof', BaseTileOutside: 'roof', SideBaseTile: 'roof'
};

var partMaterial = new THREE.MeshPhongMaterial({ color: 0xff5533, specular: 0x111111, shininess: 200 });
var partMaterials = { default: partMaterial };
var groupColors = {};		// group -> its color, also while a pattern is painted on it (setPartPattern)

function getGroupMaterial(group)
{
	if (!partMaterials[group]) partMaterials[group] = partMaterial.clone();
	return partMaterials[group];
}

function getPartMaterial(part)
{
	return getGroupMaterial(partGroups[part] || 'default');
}

// adds what the painting needs to the geometry of a part, once, when its STL has loaded
function preparePart(part, geometry)
{
	if (partGroups[part] === 'column') makeColumnUVs(geometry);
	if (partGroups[part] === 'girder') makeGirderUVs(geometry);

	if (pieceRoles[part]) {
		partPieces[part] = findPieces(geometry, pieceRoles[part]);
		if (partGroups[part] === 'bracket') makeFaceCoords(geometry);
		if (partGroups[part] === 'wall') makeWallUVs(geometry, partPieces[part]);
		paintPieces(part);
	}
}

/************************************************
				Colors
*************************************************/

// Changes the color of every part of a group at once, also of the parts placed later. A role of
// the parts painted per piece (roleColors) takes a color the same way, and "<role>_edge" sets the
// color of its edge bands (null: no bands).
function setPartColor(group, color)
{
	var role = roleColors[group.replace(/_edge$/, '')];

	if (role) {
		if (/_edge$/.test(group)) role.edge = color ? new THREE.Color(color) : null;
		else role.color.set(color);

		for (var part in partPieces) paintPieces(part);
		return;
	}

	var material = getGroupMaterial(group);

	groupColors[group] = new THREE.Color(color);
	if (!material.map) material.color.set(color);
}

// the color a part is shown in (X3DExporter): for the parts painted per piece the color of their main pieces
function getPartColor(part)
{
	if (mainRoles[part]) return roleColors[mainRoles[part]].color;

	var group = partGroups[part] || 'default';
	return groupColors[group] || getGroupMaterial(group).color;
}

/************************************************
				Patterns (columns and girders)
*************************************************/

// Patterns (images, see textures/) can be painted on the columns and the girders; null shows
// their color again. All parts of a group share one texture.
var patternTextures = {};	// image url -> texture
var groupPatterns = {};		// group -> url of the pattern asked for
var patternAspect = 1920 / 682;	// width / height of the pattern drawings (all about 2.8), kept on the parts
var patternGround = [0.576, 0.152];	// (u, v) of a plain spot of the ground of every pattern drawing, for the column bases

function setPartPattern(group, url)
{
	groupPatterns[group] = url;

	if (!url) {
		showPattern(group, null);
		return;
	}

	if (!patternTextures[url]) {
		// shown once the image has loaded, to every group that still asks for it
		patternTextures[url] = new THREE.TextureLoader().load(url, function (texture) {
			for (var g in groupPatterns) {
				if (groupPatterns[g] === url) showPattern(g, texture);
			}
		});
		patternTextures[url].wrapS = patternTextures[url].wrapT = THREE.RepeatWrapping;
		patternTextures[url].anisotropy = 8;	// sharper where seen at a slant (as far as the GPU allows)
	}

	if (patternTextures[url].image) showPattern(group, patternTextures[url]);
}

function showPattern(group, texture)
{
	var material = getGroupMaterial(group);
	if (material.map === texture) return;

	material.map = texture;
	material.color.copy(texture ? new THREE.Color(0xffffff) : groupColors[group] || partMaterial.color);	// a pattern shows its own colors
	material.needsUpdate = true;
}

// Columns (height along z): the pattern stands upright on the shaft, three times along it (top,
// middle, bottom) and as many times around as keeps its proportions. The base below the shaft
// takes the ground color of the pattern (patternGround: red for 五彩遍裝, deep blue for 碾玉裝).
function makeColumnUVs(geometry)
{
	var pos = geometry.attributes.position.array;
	var count = pos.length / 3;
	var uv = new Float32Array(count * 2);
	var heights = [], i, k;

	// the shaft starts where its first long straight part starts, above the base
	for (i = 2; i < pos.length; i += 3) heights.push(pos[i]);
	heights.sort(function (a, b) { return a - b; });

	var bottom = heights[0], top = heights[count - 1], shaft = bottom;
	for (i = 1; i < count; i++) {
		if (heights[i] - heights[i - 1] > (top - bottom) / 10) {
			shaft = heights[i - 1];
			break;
		}
	}

	// axis and radius of the shaft
	var min = [Infinity, Infinity], max = [-Infinity, -Infinity];
	for (i = 0; i < count; i++) {
		if (pos[i * 3 + 2] <= shaft) continue;
		for (k = 0; k < 2; k++) {
			min[k] = Math.min(min[k], pos[i * 3 + k]);
			max[k] = Math.max(max[k], pos[i * 3 + k]);
		}
	}

	var cx = (min[0] + max[0]) / 2, cy = (min[1] + max[1]) / 2;
	var radius = (max[0] - min[0] + max[1] - min[1]) / 4;
	var along = 3;
	var around = Math.max(1, Math.round(2 * Math.PI * radius / ((top - shaft) / along / patternAspect)));

	// u runs along the pattern (up the shaft), v across it (around the shaft)
	for (i = 0; i < count; i += 3) {
		var base = true;
		for (k = i; k < i + 3; k++) {
			if (pos[k * 3 + 2] > shaft + 0.01) base = false;
		}

		for (k = i; k < i + 3; k++) {
			var angle = Math.atan2(pos[k * 3 + 1] - cy, pos[k * 3] - cx);
			uv[k * 2] = base ? patternGround[0] : along * (pos[k * 3 + 2] - shaft) / (top - shaft);
			uv[k * 2 + 1] = base ? patternGround[1] : around * (angle / (2 * Math.PI) + 0.5);
		}

		// a triangle across the seam, where the angle jumps from +PI to -PI
		var v0 = uv[i * 2 + 1], v1 = uv[i * 2 + 3], v2 = uv[i * 2 + 5];
		if (Math.max(v0, v1, v2) - Math.min(v0, v1, v2) > around / 2) {
			for (k = i; k < i + 3; k++) {
				if (uv[k * 2 + 1] < around / 2) uv[k * 2 + 1] += around;
			}
		}
	}

	geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

// Girders (length along x, height along y): the pattern lies along the girder, repeated as many
// times as keeps its proportions, on the front and back as well as on the top and bottom.
function makeGirderUVs(geometry)
{
	var pos = geometry.attributes.position.array, normal = geometry.attributes.normal.array;
	var count = pos.length / 3;
	var uv = new Float32Array(count * 2);

	geometry.computeBoundingBox();
	var min = geometry.boundingBox.min, size = geometry.boundingBox.size();
	var along = Math.max(1, Math.round(size.x / (size.y * patternAspect)));

	for (var i = 0; i < count; i += 3) {
		var nx = Math.abs(normal[i * 3]), ny = Math.abs(normal[i * 3 + 1]), nz = Math.abs(normal[i * 3 + 2]);

		for (var k = i; k < i + 3; k++) {
			var x = (pos[k * 3] - min.x) / size.x, y = (pos[k * 3 + 1] - min.y) / size.y, z = (pos[k * 3 + 2] - min.z) / size.z;

			if (nz >= nx && nz >= ny) {		// front and back
				uv[k * 2] = along * x;
				uv[k * 2 + 1] = y;
			} else if (ny >= nx) {			// top and bottom
				uv[k * 2] = along * x;
				uv[k * 2 + 1] = z;
			} else {						// ends
				uv[k * 2] = z;
				uv[k * 2 + 1] = y;
			}
		}
	}

	geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

/************************************************
				Parts painted per piece
*************************************************/

// The pieces of a part (triangles joined at their corners) get a role from the size of their
// bounding box (in STL units, y up), and every role has its color. The colors are written per
// vertex into the shared geometry, so all placements still share one geometry and one material.
var pieceRoles = {
	FiveForwardBracket: bracketRole, FiveObliquelyBracket: bracketRole, SevenForwardBracket: bracketRole, SevenObliquelyBracket: bracketRole,
	Wall: wallRole, Door: doorRole, Window: windowRole
};

// the role giving the color of the whole part (getPartColor)
var mainRoles = {
	FiveForwardBracket: 'bracket', FiveObliquelyBracket: 'bracket', SevenForwardBracket: 'bracket', SevenObliquelyBracket: 'bracket',
	Wall: 'wall', Door: 'door', Window: 'frame'
};

// colors of the roles; the 鋪作 roles also have the color of their edge bands (null: none). The
// walls, doors and windows follow the red and white halls of the reference photo (薬師寺); 0xaa1100
// is the color that shows as its 朱 (0xd0410a) here, as the colors are not converted (paintPieces).
var roleColors = {
	dou: { color: new THREE.Color(0xff5533), edge: null },			// 鋪作: the 斗 (bearing blocks)
	bracket: { color: new THREE.Color(0xff5533), edge: null },		// 鋪作: the 栱 and 昂 (arms)
	wall: { color: new THREE.Color(0xffffff), edge: null },			// wall surfaces: show the wall texture
	door: { color: new THREE.Color(0xaa1100), edge: null },			// door leaves and sills, 朱
	stud: { color: new THREE.Color(0xaa1100), edge: null },			// door studs, as the door for now (gold: 0xc56c0f)
	frame: { color: new THREE.Color(0xaa1100), edge: null },		// window frames, 朱
	lattice: { color: new THREE.Color(0x6e9a7e), edge: null }		// window bars, green
};

var partPieces = {};		// part name -> { roles: role per vertex, boxes: bounding box of its piece per vertex }

// 斗: small blocks, at most 11 across and 6 high but at least 3 wide (the arms are 22 long or
// more, and the thin pieces are less than 3 wide)
function bracketRole(size)
{
	return Math.max(size.x, size.z) <= 11 && Math.min(size.x, size.z) >= 3 && size.y <= 6 ? 'dou' : 'bracket';
}

// the wall surfaces have no thickness, the door studs are the small pieces
function wallRole(size)
{
	return 'wall';
}

function doorRole(size)
{
	if (size.x < 0.01) return 'wall';
	return Math.max(size.x, size.y, size.z) < 5 ? 'stud' : 'door';
}

// the window bars are 2.2 thick
function windowRole(size)
{
	if (size.x < 0.01) return 'wall';
	if (Math.max(size.x, size.z) < 2.5) return 'lattice';
	return 'frame';
}

function findPieces(geometry, roleOf)
{
	var pos = geometry.attributes.position.array;
	var triangles = pos.length / 9;
	var parent = [], owner = {}, boxes = {};
	var result = { roles: [], boxes: [] };
	var t, k, box;

	function find(i)
	{
		while (parent[i] !== i) {
			parent[i] = parent[parent[i]];
			i = parent[i];
		}
		return i;
	}

	// triangles sharing a corner belong to the same piece
	for (t = 0; t < triangles; t++) {
		parent[t] = t;
		for (k = t * 9; k < t * 9 + 9; k += 3) {
			var corner = Math.round(pos[k] * 1000) + ',' + Math.round(pos[k + 1] * 1000) + ',' + Math.round(pos[k + 2] * 1000);
			if (owner[corner] === undefined) owner[corner] = t;
			else parent[find(owner[corner])] = find(t);
		}
	}

	// bounding box of every piece
	for (t = 0; t < triangles; t++) {
		var root = find(t);
		box = boxes[root] || (boxes[root] = new THREE.Box3());
		for (k = t * 9; k < t * 9 + 9; k += 3) box.expandByPoint(new THREE.Vector3(pos[k], pos[k + 1], pos[k + 2]));
	}

	for (root in boxes) boxes[root].role = roleOf(boxes[root].size());

	for (t = 0; t < triangles; t++) {
		box = boxes[find(t)];
		result.roles.push(box.role, box.role, box.role);
		result.boxes.push(box, box, box);
	}

	return result;
}

// Writes the colors of the roles into the vertex colors of a part (and the edge colors of the 鋪作),
// as they are: the renderer (three.js r73) takes material colors and vertex colors as they are and
// converts only textures (gammaInput, Factory.js addNewRenderer), so a color painted per piece shows
// the same as on the material of a part, as the parts always showed in this project.
function paintPieces(part)
{
	var geometry = partGeometries[part], roles = partPieces[part].roles;
	var count = roles.length;
	var color = vertexAttribute(geometry, 'color', 3);
	var edge = geometry.attributes.faceCoord ? vertexAttribute(geometry, 'edgeColor', 4) : null;

	for (var i = 0; i < count; i++) {
		var role = roleColors[roles[i]];

		color.array[i * 3] = role.color.r;
		color.array[i * 3 + 1] = role.color.g;
		color.array[i * 3 + 2] = role.color.b;

		if (edge) {
			var c = role.edge || role.color;
			edge.array[i * 4] = c.r;
			edge.array[i * 4 + 1] = c.g;
			edge.array[i * 4 + 2] = c.b;
			edge.array[i * 4 + 3] = role.edge ? 1 : 0;
		}
	}

	color.needsUpdate = true;
	if (edge) edge.needsUpdate = true;
}

function vertexAttribute(geometry, name, size)
{
	if (!geometry.attributes[name]) {
		geometry.addAttribute(name, new THREE.BufferAttribute(new Float32Array(geometry.attributes.position.count * size), size));
	}
	return geometry.attributes[name];
}

/************************************************
				Walls (牆): white plaster framed in red
*************************************************/

// The wall surfaces (also around the doors and windows) show the wall texture over their whole
// size; the other pieces of the doors and windows take a white spot of it and their own color.
function makeWallUVs(geometry, pieces)
{
	var pos = geometry.attributes.position.array;
	var count = pos.length / 3;
	var uv = new Float32Array(count * 2);

	for (var i = 0; i < count; i++) {
		var box = pieces.boxes[i];

		if (pieces.roles[i] === 'wall') {		// the surface lies in the y-z plane
			uv[i * 2] = (pos[i * 3 + 2] - box.min.z) / (box.max.z - box.min.z);
			uv[i * 2 + 1] = (pos[i * 3 + 1] - box.min.y) / (box.max.y - box.min.y);
		} else {
			uv[i * 2] = 0.5;
			uv[i * 2 + 1] = 0.6;
		}
	}

	geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

// As on the reference photo: white plaster between red members, posts at both sides, a band at
// the top, a rail at a quarter of the height and the sill at the bottom. The plaster is pure white,
// so the frames of the doors and windows (which take a white spot of it) keep their own color.
function makeWallTexture()
{
	var size = 512;
	var canvas = document.createElement('canvas');
	canvas.width = canvas.height = size;

	var g = canvas.getContext('2d');
	g.fillStyle = '#ffffff';
	g.fillRect(0, 0, size, size);

	// the red of the door and window frames: textures are converted, the colors of the pieces not (see
	// paintPieces), so it is drawn as the color that shows as that red once converted (gamma factor 2)
	g.fillStyle = '#' + new THREE.Color().copyLinearToGamma(roleColors.frame.color, 2).getHexString();
	g.fillRect(0, 0, size, 20);						// band at the top
	g.fillRect(0, size - 140, size, 24);			// rail
	g.fillRect(0, size - 34, size, 34);				// sill
	g.fillRect(0, 0, 18, size);						// posts beside the columns
	g.fillRect(size - 18, 0, 18, size);

	var texture = new THREE.Texture(canvas);
	texture.anisotropy = 8;
	texture.needsUpdate = true;
	return texture;
}

partMaterials.wall = partMaterial.clone();
partMaterials.wall.color.set(0xffffff);
partMaterials.wall.map = makeWallTexture();
partMaterials.wall.vertexColors = THREE.VertexColors;

/************************************************
				鋪作: edge bands (棱間裝)
*************************************************/

// For the edge bands: groups the triangles into faces (neighbors in the same plane) and gives
// every vertex its place on its face (faceCoord: along the longest outline edge of the face and
// across it, from the corner) and the size of the face (faceSize). The bands of faces that are
// not rectangles follow their bounding rectangle.
function makeFaceCoords(geometry)
{
	var pos = geometry.attributes.position.array;
	var count = pos.length / 3, triangles = count / 3;
	var normals = [], parent = [], edges = {}, faces = {};
	var t, k, key;

	function find(i)
	{
		while (parent[i] !== i) {
			parent[i] = parent[parent[i]];
			i = parent[i];
		}
		return i;
	}

	function point(i)
	{
		return new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
	}

	function corner(i)
	{
		return Math.round(pos[i * 3] * 1000) + ',' + Math.round(pos[i * 3 + 1] * 1000) + ',' + Math.round(pos[i * 3 + 2] * 1000);
	}

	function edgeKey(t, k)
	{
		var a = corner(t * 3 + k), b = corner(t * 3 + (k + 1) % 3);
		return a < b ? a + '|' + b : b + '|' + a;
	}

	// triangles sharing an edge and facing the same way belong to the same face
	for (t = 0; t < triangles; t++) {
		parent[t] = t;
		normals[t] = new THREE.Vector3().crossVectors(point(t * 3 + 1).sub(point(t * 3)), point(t * 3 + 2).sub(point(t * 3))).normalize();

		for (k = 0; k < 3; k++) {
			key = edgeKey(t, k);
			if (edges[key] === undefined) edges[key] = t;
			else if (normals[edges[key]].dot(normals[t]) > 0.999) parent[find(edges[key])] = find(t);
		}
	}

	// the outline of a face: its edges that no other triangle of the face shares
	for (t = 0; t < triangles; t++) {
		var face = faces[find(t)] || (faces[find(t)] = { normal: normals[t], edges: {}, u: null, min: [Infinity, Infinity], max: [-Infinity, -Infinity] });
		for (k = 0; k < 3; k++) {
			key = edgeKey(t, k);
			face.edges[key] = face.edges[key] ? null : { from: t * 3 + k, to: t * 3 + (k + 1) % 3 };
		}
	}

	// axes of a face: along its longest outline edge and across it
	for (var root in faces) {
		var longest = 0;
		face = faces[root];

		for (key in face.edges) {
			var edge = face.edges[key];
			if (!edge) continue;

			var direction = point(edge.to).sub(point(edge.from));
			if (direction.length() > longest) {
				longest = direction.length();
				face.u = direction.normalize();
			}
		}

		if (!face.u) face.u = new THREE.Vector3(Math.abs(face.normal.x) < 0.9 ? 1 : 0, Math.abs(face.normal.x) < 0.9 ? 0 : 1, 0).cross(face.normal).normalize();
		face.v = new THREE.Vector3().crossVectors(face.normal, face.u);
	}

	var coord = new Float32Array(count * 2), size = new Float32Array(count * 2);

	for (t = 0; t < triangles; t++) {
		face = faces[find(t)];
		for (k = t * 3; k < t * 3 + 3; k++) {
			var p = point(k);
			coord[k * 2] = p.dot(face.u);
			coord[k * 2 + 1] = p.dot(face.v);
			face.min[0] = Math.min(face.min[0], coord[k * 2]);
			face.min[1] = Math.min(face.min[1], coord[k * 2 + 1]);
			face.max[0] = Math.max(face.max[0], coord[k * 2]);
			face.max[1] = Math.max(face.max[1], coord[k * 2 + 1]);
		}
	}

	for (t = 0; t < triangles; t++) {
		face = faces[find(t)];
		for (k = t * 3; k < t * 3 + 3; k++) {
			coord[k * 2] -= face.min[0];
			coord[k * 2 + 1] -= face.min[1];
			size[k * 2] = face.max[0] - face.min[0];
			size[k * 2 + 1] = face.max[1] - face.min[1];
		}
	}

	geometry.addAttribute('faceCoord', new THREE.BufferAttribute(coord, 2));
	geometry.addAttribute('faceSize', new THREE.BufferAttribute(size, 2));
}

// The material of the 鋪作: the Phong shading of the other parts, plus the edge bands. Along
// every edge of a face, a band (edgeWidth, in STL units: about 1.4 分; the 2 分 of 營造法式 would cover
// the small faces of the 斗 almost entirely, 1 分 = 0.36 here as the 栱 are 15 分 = 5.4 high) takes the
// edge color of its piece in 疊暈: three steps getting lighter toward the edge, with a white line
// on it. Pieces without an edge color show their color only.
function makeBracketMaterial()
{
	var phong = THREE.ShaderLib.phong;

	var vertexShader = phong.vertexShader.replace('void main() {', [
		'attribute vec2 faceCoord;',
		'attribute vec2 faceSize;',
		'attribute vec4 edgeColor;',
		'varying vec2 vFaceCoord;',
		'varying vec2 vFaceSize;',
		'varying vec4 vEdgeColor;',
		'void main() {',
		'	vFaceCoord = faceCoord;',
		'	vFaceSize = faceSize;',
		'	vEdgeColor = edgeColor;'
	].join('\n'));

	var fragmentShader = phong.fragmentShader.replace('void main() {', [
		'uniform float edgeWidth;',
		'varying vec2 vFaceCoord;',
		'varying vec2 vFaceSize;',
		'varying vec4 vEdgeColor;',
		'void main() {'
	].join('\n')).replace('diffuseColor.rgb *= vColor;', [
		'diffuseColor.rgb *= vColor;',
		'	float edge = min( min( vFaceCoord.x, vFaceSize.x - vFaceCoord.x ), min( vFaceCoord.y, vFaceSize.y - vFaceCoord.y ) ) / edgeWidth;',
		'	if ( vEdgeColor.a > 0.5 && edge < 1.0 ) {',
		'		float light = edge < 0.15 ? 0.85 : edge < 0.43 ? 0.5 : edge < 0.71 ? 0.25 : 0.0;',
		'		diffuseColor.rgb = mix( vEdgeColor.rgb, vec3( 1.0 ), light );',
		'	}'
	].join('\n'));

	if (vertexShader === phong.vertexShader || fragmentShader.indexOf('edgeWidth;') < 0 || fragmentShader.indexOf('vEdgeColor.a') < 0) {
		console.warn('Painting.js: the Phong shader has changed, the 鋪作 have no edge bands');
	}

	var material = new THREE.ShaderMaterial({
		uniforms: THREE.UniformsUtils.merge([phong.uniforms, { edgeWidth: { type: 'f', value: 0.5 } }]),
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		lights: true,
		fog: true,
		vertexColors: THREE.VertexColors
	});

	// as partMaterial, the vertex colors give the color
	material.uniforms.diffuse.value.set(0xffffff);
	material.uniforms.specular.value.set(0x111111);
	material.uniforms.shininess.value = 200;

	return material;
}

partMaterials.bracket = makeBracketMaterial();

// the base and the stairs are stone, marble white with every painting template
setPartColor('floor', 0xe6e2da);
