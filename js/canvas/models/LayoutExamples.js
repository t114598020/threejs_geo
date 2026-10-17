// Four layout examples (FourLayouts.html): the floor of one of the four layouts of the Yingzao Fashi,
// with a dot at every column and lines along the rows of columns, and the cross-section of its timber
// frame (草架側樣) standing on a row of columns near the end of the building.
//
// Both come from the SketchUp models of yingzaofashi_x3d (inches, z up), which use the same units:
//   layout       plan (殿閣分槽圖)                        section (草架側樣)
//   single       圖樣三十六 身內單槽                        圖樣三十八 殿堂等五鋪作副階四鋪作單槽
//   double       圖樣三十 身內雙槽                          圖樣三十二 殿堂等八鋪作副階六鋪作雙槽
//   split        圖樣三十九 身內分心槽 無副階                圖樣四十一 殿堂等六鋪作分心槽
//   concentric   圖樣三十三 身內金箱斗底槽                  圖樣三十五 殿堂等七鋪作副階五鋪作雙槽（斗底槽準此）
// The floor is drawn from the columns and the platform of the plan (LAYOUT_EXAMPLES below), the
// section is read from models/layouts/<section>.stl. Its columns stand on the plan's rows of columns:
// plan y = section x + offset (found by matching the columns of the two models, within 1.5 inches),
// plan z = section z + zShift, and its plane is a row of columns across the building, the frame reaching
// into the building: inset rows in from the last one (sectionRow), i.e. the first frame inside the
// building, two rows in with side corridors (the last row is that of the side corridor, the next one
// the end of the hall) and one without. The frame of section 35 reaches the other way in its model, so
// it is turned half round (turned) about the middle of the row of columns it stands on.
//
// The parts of the section are told apart by the size and shape of every piece (triangles joined at
// their corners): columns, beams and purlins (girder), rafters and roof boards (roof), and the 斗 and
// 栱 of the brackets. The round columns have the material of the columns of the other pages, so that
// the patterns of the templates are painted on them; the rest shows the colors of the template
// (makeLayoutSection). The base of the section is left out, as the floor is drawn instead.

var LAYOUT_EXAMPLES = {
	single: {
		plan: 36, section: 38, offset: 297.1, zShift: 30.4, inset: 2,
		platform: [-701.2, -216.6, -14.2, 472.9, 441.9, 27.1],
		columns: [-651.1,-166.5,-651.1,-80.6,-651.1,48.2,-651.1,177,-651.1,305.9,-651.1,391.8,-565.2,-80.7,-565.2,48.2,-565.2,177,-565.2,305.9,-565.2,391.8,-565.1,-166.4,-436.3,-80.7,-436.3,177,-436.3,305.9,-436.3,391.8,-436.2,-166.4,-307.5,-80.7,-307.5,177,-307.5,305.9,-307.5,391.8,-307.4,-166.4,-178.6,-80.7,-178.6,177,-178.6,305.9,-178.6,391.8,-178.5,-166.4,-49.7,-166.4,-49.6,-80.7,-49.6,177,-49.6,305.9,-49.6,391.8,79.2,-166.4,79.3,-80.7,79.3,177,79.3,305.9,79.3,391.8,208,-166.4,208.1,-80.7,208.1,177,208.1,305.9,208.1,391.8,336.8,-166.4,336.9,-80.7,336.9,48.2,336.9,177,336.9,305.9,336.9,391.8,422.8,-166.5,422.8,-80.6,422.8,48.2,422.8,177,422.8,305.9,422.8,391.8]
	},
	double: {
		plan: 30, section: 32, offset: 455.4, zShift: 32.6, inset: 2,
		platform: [-182.7, -230.9, -11.8, 1078, 642.4, 29.5],
		columns: [-89.6,-137.8,-89.6,-51.9,-89.6,76.9,-89.6,205.8,-89.6,334.6,-89.6,463.5,-89.6,549.4,-3.7,-137.8,-3.7,-51.9,-3.7,76.9,-3.7,205.8,-3.7,334.6,-3.7,463.5,-3.7,549.4,125.1,-137.8,125.1,-51.9,125.1,76.9,125.1,334.6,125.1,463.5,125.1,549.4,253.9,-137.8,253.9,-51.9,253.9,76.9,253.9,334.6,253.9,463.5,253.9,549.4,382.8,-137.8,382.8,-51.9,382.8,76.9,382.8,334.6,382.8,463.5,383.2,549.4,511.2,549.4,511.6,-137.8,511.6,-51.9,511.6,76.9,511.6,334.6,511.6,463.5,640.5,-137.8,640.5,-51.9,640.5,76.9,640.5,334.6,640.5,463.5,640.5,549.4,769.3,-137.8,769.3,-51.9,769.3,76.9,769.3,334.6,769.3,463.5,769.3,549.4,898.1,-137.8,898.1,-51.9,898.1,76.9,898.1,205.8,898.1,334.6,898.1,463.5,898.1,549.4,984,-137.8,984,-51.9,984,76.9,984,205.8,984,334.6,984,463.5,984,549.4]
	},
	split: {
		plan: 39, section: 41, offset: 167, zShift: 1.4, inset: 1,
		platform: [-860.5, -375.8, -43, 360, 254.1, -1.7],
		columns: [-781.8,-297.1,-781.8,-179,-781.8,-60.9,-781.8,57.2,-781.8,175.3,-663.7,-297.1,-663.7,-60.9,-663.7,175.3,-545.5,-297.1,-545.5,-60.9,-545.5,175.3,-427.4,-297.1,-427.4,-60.9,-427.4,175.3,-309.3,-297.1,-309.3,-60.9,-309.3,175.3,-191.2,-297.1,-191.2,-60.9,-191.2,175.3,-73.1,-297.1,-73.1,-60.9,-73.1,175.3,45,-297.1,45,-60.9,45,175.3,163.1,-297.1,163.1,-60.9,163.1,175.3,281.2,-297.1,281.2,-179,281.2,-60.9,281.2,57.2,281.2,175.3]
	},
	concentric: {
		plan: 33, section: 35, offset: 625.4, zShift: 157.1, inset: 2, turned: true,
		platform: [12.4, 210.1, 112.5, 1209.3, 1020.8, 153.8],
		columns: [74,271.2,74,357.5,74,486.4,74,615.2,74,744,74,872.9,74,958.8,159.9,271.6,159.9,357.5,159.9,486.4,159.9,615.2,159.9,744,159.9,872.9,159.9,958.8,288.7,271.6,288.7,357.5,288.7,486.4,288.7,615.2,288.7,744,288.7,872.9,288.7,958.8,417.6,271.6,417.6,357.5,417.6,486.4,417.6,744,417.6,872.9,417.6,958.8,546.4,271.6,546.4,357.5,546.4,486.4,546.4,744,546.4,872.9,546.4,958.8,675.3,271.6,675.3,357.5,675.3,486.4,675.3,744,675.3,872.9,675.3,958.8,804.1,271.6,804.1,357.5,804.1,486.4,804.1,744,804.1,872.9,804.1,958.8,932.9,271.6,932.9,357.5,932.9,486.4,932.9,744,932.9,872.9,932.9,958.8,933,615.2,1061.8,271.6,1061.8,357.5,1061.8,486.4,1061.8,615.2,1061.8,744,1061.8,872.9,1061.8,958.8,1147.7,271.6,1147.7,357.5,1147.7,486.4,1147.7,615.2,1147.7,744,1147.7,872.9,1147.7,959.3]
	}
};

var LAYOUT_SCALE = 0.0011;		// scene units per inch: the plans are 1100 to 1250 inches long

var layoutExampleShown = null;	// name of the layout shown
var layoutExamples = {};		// name -> { meshes: floor meshes and lines, section: its meshes once loaded }

function showLayoutExample(name)
{
	var example = LAYOUT_EXAMPLES[name];
	if (!example) return;

	if (layoutExampleShown) {
		var shown = layoutExamples[layoutExampleShown];
		shown.meshes.concat(shown.section || []).forEach(function (mesh) { scene.remove(mesh); });
	}

	layoutExampleShown = name;

	var built = layoutExamples[name];
	if (!built) {
		built = layoutExamples[name] = { meshes: makeLayoutFloor(example), section: null };
		loadLayoutSection(name, example);
	}

	built.meshes.concat(built.section || []).forEach(function (mesh) { scene.add(mesh); });

	frameLayoutExample(example);
}

// plan coordinates (inches, z up) -> scene (y up): the platform centred at the origin and standing
// on the ground; turned so that the section (at the end of the larger x) is on the left of the view
function planToScene(example)
{
	var p = example.platform, s = LAYOUT_SCALE;
	var cx = (p[0] + p[3]) / 2, cy = (p[1] + p[4]) / 2;

	return new THREE.Matrix4().set(
		-s, 0, 0, s * cx,
		0, 0, s, -s * p[2],
		0, s, 0, -s * cy,
		0, 0, 0, 1);
}

// the row of columns across the building that the section stands on (plan x): inset rows in from the
// last one
function sectionRow(example)
{
	var xs = layoutRows(example.columns, 0);
	return xs[xs.length - 1 - example.inset];
}

// section coordinates -> plan: section x along the plan's y (the depth of the building), section y
// into the building from its row of columns, z up. A turned section is then turned half round about
// the middle of its row of columns, which keeps its columns on the columns of the plan (the rows are
// the same from the front and from the back).
function sectionToPlan(example)
{
	var row = sectionRow(example);
	var matrix = new THREE.Matrix4().set(
		0, -1, 0, row,
		1, 0, 0, example.offset,
		0, 0, 1, example.zShift,
		0, 0, 0, 1);

	if (example.turned) {
		var ys = layoutRows(example.columns, 1), middle = (ys[0] + ys[ys.length - 1]) / 2;
		var turn = new THREE.Matrix4().set(
			-1, 0, 0, 2 * row,
			0, -1, 0, 2 * middle,
			0, 0, 1, 0,
			0, 0, 0, 1);
		matrix = new THREE.Matrix4().multiplyMatrices(turn, matrix);
	}

	return matrix;
}

/************************************************
				Floor
*************************************************/

function makeLayoutFloor(example)
{
	var p = example.platform, top = p[5], c = example.columns;
	var toScene = planToScene(example);
	var meshes = [];

	// platform, marble white as the base of the other pages (group "floor" of Painting.js)
	var platform = new THREE.BoxGeometry(p[3] - p[0], p[4] - p[1], top - p[2]);
	platform.applyMatrix(new THREE.Matrix4().makeTranslation((p[0] + p[3]) / 2, (p[1] + p[4]) / 2, (p[2] + top) / 2));
	platform.applyMatrix(toScene);
	meshes.push(layoutMesh(platform, getGroupMaterial('floor'), 'LayoutFloor'));

	// rows of columns: the x and the y shared by columns (within 3 inches)
	var xs = layoutRows(c, 0), ys = layoutRows(c, 1);
	var x0 = xs[0], x1 = xs[xs.length - 1], y0 = ys[0], y1 = ys[ys.length - 1];

	// black lines along the rows, just above the platform, as the layout grid of the other pages
	var lines = new THREE.Geometry(), z = top + 0.4;
	xs.forEach(function (x) { lines.vertices.push(new THREE.Vector3(x, y0, z), new THREE.Vector3(x, y1, z)); });
	ys.forEach(function (y) { lines.vertices.push(new THREE.Vector3(x0, y, z), new THREE.Vector3(x1, y, z)); });
	lines.applyMatrix(toScene);
	meshes.push(new THREE.LineSegments(lines, new THREE.LineBasicMaterial({ color: 0x000000 })));

	// a dark dot where every column stands, over the lines: drawn after them and pulled toward the
	// camera, so that a line never shows across a dot
	var dots = new THREE.Geometry(), dot = new THREE.CircleGeometry(9, 20);
	for (var i = 0; i < c.length; i += 2) {
		dots.merge(dot, new THREE.Matrix4().makeTranslation(c[i], c[i + 1], top + 1.2));
	}
	dots.applyMatrix(toScene);
	var marks = layoutMesh(dots, new THREE.MeshBasicMaterial({ color: 0x111111, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), 'LayoutColumns');
	marks.castShadow = false;
	marks.renderOrder = 1;
	meshes.push(marks);

	return meshes;
}

function layoutRows(columns, axis)
{
	var values = [];
	for (var i = axis; i < columns.length; i += 2) values.push(columns[i]);
	values.sort(function (a, b) { return a - b; });

	var rows = [];
	values.forEach(function (v) {
		if (!rows.length || v - rows[rows.length - 1] > 3) rows.push(v);
	});
	return rows;
}

function layoutMesh(geometry, material, part)
{
	var mesh = new THREE.Mesh(geometry, material);
	mesh.userData.part = part;	// counted as part of the building, e.g. by the Straight view
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh;
}

/************************************************
				Section
*************************************************/

function loadLayoutSection(name, example)
{
	new THREE.STLLoader().load('./models/layouts/' + example.section + '.stl', function (geometry) {
		var section = makeLayoutSection(geometry, example);

		layoutExamples[name].section = section;
		paintLayoutExample();
		if (layoutExampleShown === name) section.forEach(function (mesh) { scene.add(mesh); });
	});
}

// The section is drawn as two meshes. The columns have the material of the columns of the other pages
// (Painting.js) and texture coordinates column by column, so that the patterns of the templates
// (五彩遍裝, 碾玉裝) are painted on them as on the columns there. The rest of the frame shows only the
// colors of the template, per vertex (paintLayoutExample): beams and purlins as the girders, rafters
// and roof boards as the roof, and the 斗 and 栱 of the brackets as those of the 鋪作.
var SECTION_GROUPS = [
	{ name: 'column', roles: ['column'], uvs: sectionColumnUVs },
	{ name: 'frame', roles: ['girder', 'roof', 'dou', 'bracket'] }
];

var layoutFrameMaterial = null;	// white, the vertex colors give the color

// the meshes of the section, without its base
function makeLayoutSection(geometry, example)
{
	var pos = geometry.attributes.position.array, nrm = geometry.attributes.normal.array;
	var found = sectionRoles(pos);
	var toScene = new THREE.Matrix4().multiplyMatrices(planToScene(example), sectionToPlan(example));

	if (!layoutFrameMaterial) {
		layoutFrameMaterial = partMaterial.clone();
		layoutFrameMaterial.color.set(0xffffff);
		layoutFrameMaterial.vertexColors = THREE.VertexColors;
	}

	return SECTION_GROUPS.map(function (g) {
		// the triangles of the group, piece by piece
		var pieces = {}, t, k;
		for (t = 0; t < found.roles.length; t++) {
			if (g.roles.indexOf(found.roles[t]) >= 0) (pieces[found.pieces[t]] = pieces[found.pieces[t]] || []).push(t);
		}
		var keys = Object.keys(pieces);
		if (!keys.length) return null;

		var triangles = [];
		keys.forEach(function (key) { triangles = triangles.concat(pieces[key]); });

		var positions = new Float32Array(triangles.length * 9), normals = new Float32Array(triangles.length * 9);
		var roles = [];
		triangles.forEach(function (t, i) {
			for (k = 0; k < 9; k++) {
				positions[i * 9 + k] = pos[t * 9 + k];
				normals[i * 9 + k] = nrm[t * 9 + k];
			}
			roles.push(found.roles[t], found.roles[t], found.roles[t]);
		});

		var part = new THREE.BufferGeometry();
		part.addAttribute('position', new THREE.BufferAttribute(positions, 3));
		part.addAttribute('normal', new THREE.BufferAttribute(normals, 3));

		// texture coordinates of every piece, from the section as it is (inches, z up)
		if (g.uvs) {
			var uv = new Float32Array(triangles.length * 6), start = 0;
			keys.forEach(function (key) {
				var n = pieces[key].length * 9;
				uv.set(g.uvs(positions.subarray(start, start + n), normals.subarray(start, start + n)), start / 3 * 2);
				start += n;
			});
			part.addAttribute('uv', new THREE.BufferAttribute(uv, 2));
		}

		if (g.name === 'frame') part.addAttribute('color', new THREE.BufferAttribute(new Float32Array(positions.length), 3));
		part.applyMatrix(toScene);

		var mesh = layoutMesh(part, g.name === 'column' ? getGroupMaterial('column') : layoutFrameMaterial, 'LayoutSection_' + g.name);
		if (g.name === 'frame') mesh.userData.roles = roles;
		return mesh;
	}).filter(function (mesh) { return mesh; });
}

// Columns: the pattern stands upright on the shaft as on the columns of the other pages
// (makeColumnUVs in Painting.js, which also takes a column upright along z).
function sectionColumnUVs(positions)
{
	var column = new THREE.BufferGeometry();
	column.addAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
	makeColumnUVs(column);
	return column.attributes.uv.array;
}

// Role of every triangle and the piece it belongs to (triangles sharing a corner): the role by the
// size and the shape of the bounding box of the piece, in inches; null for the base of the section.
function sectionRoles(pos)
{
	var triangles = pos.length / 9;
	var parent = new Int32Array(triangles), owner = {}, boxes = {};
	var t, k, root;

	function find(i)
	{
		while (parent[i] !== i) {
			parent[i] = parent[parent[i]];
			i = parent[i];
		}
		return i;
	}

	for (t = 0; t < triangles; t++) {
		parent[t] = t;
		for (k = t * 9; k < t * 9 + 9; k += 3) {
			var corner = Math.round(pos[k] * 100) + ',' + Math.round(pos[k + 1] * 100) + ',' + Math.round(pos[k + 2] * 100);
			if (owner[corner] === undefined) owner[corner] = t;
			else parent[find(owner[corner])] = find(t);
		}
	}

	for (t = 0; t < triangles; t++) {
		root = find(t);
		var b = boxes[root] || (boxes[root] = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity]);
		for (k = 0; k < 9; k++) {
			b[k % 3] = Math.min(b[k % 3], pos[t * 9 + k]);
			b[k % 3 + 3] = Math.max(b[k % 3 + 3], pos[t * 9 + k]);
		}
	}

	// round: the pieces shaped as a column whose corners lie in at least 12 directions round its axis
	// (SketchUp draws circles with 24 sides; a square post has 4, an octagonal one 8). The radius
	// changes with the height (base, shaft and the 卷殺 of the top), so it is not compared.
	var directions = {};
	for (t = 0; t < triangles; t++) {
		root = find(t);
		var c = boxes[root];
		if (!isSectionColumn(c)) continue;
		var cx = (c[0] + c[3]) / 2, cy = (c[1] + c[4]) / 2, seen = directions[root] || (directions[root] = {});
		for (k = t * 9; k < t * 9 + 9; k += 3) {
			if (Math.abs(pos[k] - cx) + Math.abs(pos[k + 1] - cy) < 0.5) continue;	// on the axis
			seen[Math.round(Math.atan2(pos[k + 1] - cy, pos[k] - cx) * 90 / Math.PI)] = true;	// in steps of 2°
		}
	}
	for (root in directions) boxes[root].round = Object.keys(directions[root]).length >= 12;

	// the columns first: their base tells the base of the section apart
	var columnBase = Infinity;
	for (root in boxes) {
		if (isSectionColumn(boxes[root])) columnBase = Math.min(columnBase, boxes[root][2]);
	}
	for (root in boxes) boxes[root].role = sectionPieceRole(boxes[root], columnBase);

	var roles = [], pieces = [];
	for (t = 0; t < triangles; t++) {
		pieces.push(find(t));
		roles.push(boxes[pieces[t]].role);
	}
	return { roles: roles, pieces: pieces };
}

function isSectionColumn(b)
{
	var dx = b[3] - b[0], dy = b[4] - b[1], dz = b[5] - b[2];
	return dz > 4 * Math.max(dx, dy) && dz > 60 && Math.max(dx, dy) > 5;
}

function sectionPieceRole(b, columnBase)
{
	var dx = b[3] - b[0], dy = b[4] - b[1], dz = b[5] - b[2];
	var largest = Math.max(dx, dy, dz), smallest = Math.min(dx, dy, dz);

	if (isSectionColumn(b)) return b.round ? 'column' : 'girder';	// square posts are painted as the beams
	if (b[2] < columnBase + 5 && Math.max(dx, dy) > 100 && dz < 70) return null;	// the base of the section
	if (largest < 30) return smallest > 0 && largest / smallest < 2.5 ? 'dou' : 'bracket';	// 斗 compact, 栱 long
	if (dx >= dy && dx > 25 && dz >= 0.25 * dx) return 'roof';	// rafters and roof boards: sloping across the building
	return 'girder';	// beams, purlins and the other members
}

// Paints the frame of the sections (all but the columns) with the colors of the template (setPartColor
// in Painting.js): beams and purlins as the girders and the rafters and roof boards as the roof, in
// their color also while a pattern is painted on the girders of the other pages, and the 斗 and the
// 栱 as those of the 鋪作. The columns follow the material of the columns.
function paintLayoutExample()
{
	var colors = {
		girder: groupColors.girder || partMaterial.color,
		roof: groupColors.roof || partMaterial.color,
		dou: roleColors.dou.color,
		bracket: roleColors.bracket.color
	};

	for (var name in layoutExamples) {
		(layoutExamples[name].section || []).forEach(function (mesh) {
			var roles = mesh.userData.roles;
			if (!roles) return;

			var color = mesh.geometry.attributes.color;
			for (var i = 0; i < roles.length; i++) {
				var c = colors[roles[i]];
				color.array[i * 3] = c.r;
				color.array[i * 3 + 1] = c.g;
				color.array[i * 3 + 2] = c.b;
			}
			color.needsUpdate = true;
		});
	}
}

// The camera looks at the floor from the front right, above (31.6° round from the front and 26.6°
// up), with the section at the far left end, as in the pictures of the layouts (imgs/four_layouts_*.jpg),
// at a point a bit toward the section and above the floor.
function frameLayoutExample(example)
{
	var p = example.platform, s = LAYOUT_SCALE;
	var size = Math.max(p[3] - p[0], p[4] - p[1]) * s;
	var target = new THREE.Vector3(-0.113 * size, 0.088, 0);
	var round = THREE.Math.degToRad(31.6), up = THREE.Math.degToRad(26.6);

	viewTurn = null;
	orbitControl.target.copy(target);
	// near enough that the floor and the section fill the view, as in the pictures (1190 x 725), and
	// farther in a narrower view, so that the floor stays across it
	var tan = Math.tan(THREE.Math.degToRad(camera.fov / 2));
	var distance = size * Math.max(0.744 / (tan * camera.aspect), 0.4635 / tan);

	camera.position.copy(target).add(new THREE.Vector3(Math.cos(up) * Math.sin(round), Math.sin(up), Math.cos(up) * Math.cos(round)).multiplyScalar(distance));
	camera.lookAt(target);
}
