// Four layout examples (FourLayouts.html): the floor of one of the four layouts of the Yingzao Fashi,
// with a dot at every column and lines along the rows of columns, and the cross-section of its timber
// frame (草架側樣) standing on the last row of columns.
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
// plan z = section z + zShift, and its plane is the last row of columns along the building (endRow),
// the frame reaching into the building.
//
// The parts of the section are painted with the template of the page (paintLayoutExample): columns,
// beams and purlins (girder), rafters and roof boards (roof), and the 斗 and 栱 of the brackets, told
// apart by the size and shape of every piece (triangles joined at their corners). The base of the
// section is left out, as the floor is drawn instead.

var LAYOUT_EXAMPLES = {
	single: {
		plan: 36, section: 38, offset: 297.1, zShift: 30.4, endRow: 422.8,
		platform: [-701.2, -216.6, -14.2, 472.9, 441.9, 27.1],
		columns: [-651.1,-166.5,-651.1,-80.6,-651.1,48.2,-651.1,177,-651.1,305.9,-651.1,391.8,-565.2,-80.7,-565.2,48.2,-565.2,177,-565.2,305.9,-565.2,391.8,-565.1,-166.4,-436.3,-80.7,-436.3,177,-436.3,305.9,-436.3,391.8,-436.2,-166.4,-307.5,-80.7,-307.5,177,-307.5,305.9,-307.5,391.8,-307.4,-166.4,-178.6,-80.7,-178.6,177,-178.6,305.9,-178.6,391.8,-178.5,-166.4,-49.7,-166.4,-49.6,-80.7,-49.6,177,-49.6,305.9,-49.6,391.8,79.2,-166.4,79.3,-80.7,79.3,177,79.3,305.9,79.3,391.8,208,-166.4,208.1,-80.7,208.1,177,208.1,305.9,208.1,391.8,336.8,-166.4,336.9,-80.7,336.9,48.2,336.9,177,336.9,305.9,336.9,391.8,422.8,-166.5,422.8,-80.6,422.8,48.2,422.8,177,422.8,305.9,422.8,391.8]
	},
	double: {
		plan: 30, section: 32, offset: 455.4, zShift: 32.6, endRow: 984,
		platform: [-182.7, -230.9, -11.8, 1078, 642.4, 29.5],
		columns: [-89.6,-137.8,-89.6,-51.9,-89.6,76.9,-89.6,205.8,-89.6,334.6,-89.6,463.5,-89.6,549.4,-3.7,-137.8,-3.7,-51.9,-3.7,76.9,-3.7,205.8,-3.7,334.6,-3.7,463.5,-3.7,549.4,125.1,-137.8,125.1,-51.9,125.1,76.9,125.1,334.6,125.1,463.5,125.1,549.4,253.9,-137.8,253.9,-51.9,253.9,76.9,253.9,334.6,253.9,463.5,253.9,549.4,382.8,-137.8,382.8,-51.9,382.8,76.9,382.8,334.6,382.8,463.5,383.2,549.4,511.2,549.4,511.6,-137.8,511.6,-51.9,511.6,76.9,511.6,334.6,511.6,463.5,640.5,-137.8,640.5,-51.9,640.5,76.9,640.5,334.6,640.5,463.5,640.5,549.4,769.3,-137.8,769.3,-51.9,769.3,76.9,769.3,334.6,769.3,463.5,769.3,549.4,898.1,-137.8,898.1,-51.9,898.1,76.9,898.1,205.8,898.1,334.6,898.1,463.5,898.1,549.4,984,-137.8,984,-51.9,984,76.9,984,205.8,984,334.6,984,463.5,984,549.4]
	},
	split: {
		plan: 39, section: 41, offset: 167, zShift: 1.4, endRow: 281.2,
		platform: [-860.5, -375.8, -43, 360, 254.1, -1.7],
		columns: [-781.8,-297.1,-781.8,-179,-781.8,-60.9,-781.8,57.2,-781.8,175.3,-663.7,-297.1,-663.7,-60.9,-663.7,175.3,-545.5,-297.1,-545.5,-60.9,-545.5,175.3,-427.4,-297.1,-427.4,-60.9,-427.4,175.3,-309.3,-297.1,-309.3,-60.9,-309.3,175.3,-191.2,-297.1,-191.2,-60.9,-191.2,175.3,-73.1,-297.1,-73.1,-60.9,-73.1,175.3,45,-297.1,45,-60.9,45,175.3,163.1,-297.1,163.1,-60.9,163.1,175.3,281.2,-297.1,281.2,-179,281.2,-60.9,281.2,57.2,281.2,175.3]
	},
	concentric: {
		plan: 33, section: 35, offset: 625.4, zShift: 157.1, endRow: 1147.7,
		platform: [12.4, 210.1, 112.5, 1209.3, 1020.8, 153.8],
		columns: [74,271.2,74,357.5,74,486.4,74,615.2,74,744,74,872.9,74,958.8,159.9,271.6,159.9,357.5,159.9,486.4,159.9,615.2,159.9,744,159.9,872.9,159.9,958.8,288.7,271.6,288.7,357.5,288.7,486.4,288.7,615.2,288.7,744,288.7,872.9,288.7,958.8,417.6,271.6,417.6,357.5,417.6,486.4,417.6,744,417.6,872.9,417.6,958.8,546.4,271.6,546.4,357.5,546.4,486.4,546.4,744,546.4,872.9,546.4,958.8,675.3,271.6,675.3,357.5,675.3,486.4,675.3,744,675.3,872.9,675.3,958.8,804.1,271.6,804.1,357.5,804.1,486.4,804.1,744,804.1,872.9,804.1,958.8,932.9,271.6,932.9,357.5,932.9,486.4,932.9,744,932.9,872.9,932.9,958.8,933,615.2,1061.8,271.6,1061.8,357.5,1061.8,486.4,1061.8,615.2,1061.8,744,1061.8,872.9,1061.8,958.8,1147.7,271.6,1147.7,357.5,1147.7,486.4,1147.7,615.2,1147.7,744,1147.7,872.9,1147.7,959.3]
	}
};

var LAYOUT_SCALE = 0.0011;		// scene units per inch: the plans are 1100 to 1250 inches long

var layoutExampleShown = null;	// name of the layout shown
var layoutExamples = {};		// name -> { meshes: floor meshes and lines, section: mesh once loaded }

function showLayoutExample(name)
{
	var example = LAYOUT_EXAMPLES[name];
	if (!example) return;

	if (layoutExampleShown) {
		var shown = layoutExamples[layoutExampleShown];
		shown.meshes.forEach(function (mesh) { scene.remove(mesh); });
		if (shown.section) scene.remove(shown.section);
	}

	layoutExampleShown = name;

	var built = layoutExamples[name];
	if (!built) {
		built = layoutExamples[name] = { meshes: makeLayoutFloor(example), section: null };
		loadLayoutSection(name, example);
	}

	built.meshes.forEach(function (mesh) { scene.add(mesh); });
	if (built.section) scene.add(built.section);

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

// section coordinates -> plan: section x along the plan's y (the depth of the building), section y
// into the building from the last row of columns, z up
function sectionToPlan(example)
{
	return new THREE.Matrix4().set(
		0, -1, 0, example.endRow,
		1, 0, 0, example.offset,
		0, 0, 1, example.zShift,
		0, 0, 0, 1);
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

	// white lines along the rows, just above the platform
	var lines = new THREE.Geometry(), z = top + 0.4;
	xs.forEach(function (x) { lines.vertices.push(new THREE.Vector3(x, y0, z), new THREE.Vector3(x, y1, z)); });
	ys.forEach(function (y) { lines.vertices.push(new THREE.Vector3(x0, y, z), new THREE.Vector3(x1, y, z)); });
	lines.applyMatrix(toScene);
	meshes.push(new THREE.LineSegments(lines, new THREE.LineBasicMaterial({ color: 0xffffff })));

	// a dark dot where every column stands
	var dots = new THREE.Geometry(), dot = new THREE.CircleGeometry(13, 20);
	for (var i = 0; i < c.length; i += 2) {
		dots.merge(dot, new THREE.Matrix4().makeTranslation(c[i], c[i + 1], top + 0.8));
	}
	dots.applyMatrix(toScene);
	var marks = layoutMesh(dots, new THREE.MeshBasicMaterial({ color: 0x111111 }), 'LayoutColumns');
	marks.castShadow = false;
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
		if (layoutExampleShown === name) scene.add(section);
	});
}

// the section without its base, with the role of every vertex and colors painted from them
function makeLayoutSection(geometry, example)
{
	var pos = geometry.attributes.position.array, nrm = geometry.attributes.normal.array;
	var roles = sectionRoles(pos);
	var kept = [];

	for (var t = 0; t < roles.length; t++) {
		if (roles[t]) kept.push(t);
	}

	var positions = new Float32Array(kept.length * 9), normals = new Float32Array(kept.length * 9);
	var vertexRoles = [];

	kept.forEach(function (t, i) {
		for (var k = 0; k < 9; k++) {
			positions[i * 9 + k] = pos[t * 9 + k];
			normals[i * 9 + k] = nrm[t * 9 + k];
		}
		vertexRoles.push(roles[t], roles[t], roles[t]);
	});

	var section = new THREE.BufferGeometry();
	section.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	section.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
	section.addAttribute('color', new THREE.BufferAttribute(new Float32Array(positions.length), 3));
	section.applyMatrix(new THREE.Matrix4().multiplyMatrices(planToScene(example), sectionToPlan(example)));

	var material = partMaterial.clone();
	material.color.set(0xffffff);	// the vertex colors give the color
	material.vertexColors = THREE.VertexColors;

	var mesh = layoutMesh(section, material, 'LayoutSection');
	mesh.userData.roles = vertexRoles;
	return mesh;
}

// Role of every triangle: the piece it belongs to (triangles sharing a corner) by the size and the
// shape of its bounding box, in inches; null for the base of the section.
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

	// the columns first: their base tells the base of the section apart
	var columnBase = Infinity;
	for (root in boxes) {
		if (isSectionColumn(boxes[root])) columnBase = Math.min(columnBase, boxes[root][2]);
	}
	for (root in boxes) boxes[root].role = sectionPieceRole(boxes[root], columnBase);

	var roles = [];
	for (t = 0; t < triangles; t++) roles.push(boxes[find(t)].role);
	return roles;
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

	if (isSectionColumn(b)) return 'column';
	if (b[2] < columnBase + 5 && Math.max(dx, dy) > 100 && dz < 70) return null;	// the base of the section
	if (largest < 30) return smallest > 0 && largest / smallest < 2.5 ? 'dou' : 'bracket';	// 斗 compact, 栱 long
	if (dx >= dy && dx > 25 && dz >= 0.25 * dx) return 'roof';	// rafters and roof boards: sloping across the building
	return 'girder';	// beams, purlins and the other members
}

// Paints the section shown with the colors of the template (setPartColor in Painting.js): columns,
// girders and roof as their groups (their color also while a pattern is painted on the building),
// the 斗 and the 栱 as the brackets.
function paintLayoutExample()
{
	for (var name in layoutExamples) {
		var section = layoutExamples[name].section;
		if (!section) continue;

		var roles = section.userData.roles, color = section.geometry.attributes.color;
		var colors = {
			column: groupColors.column || partMaterial.color,
			girder: groupColors.girder || partMaterial.color,
			roof: groupColors.roof || partMaterial.color,
			dou: roleColors.dou.color,
			bracket: roleColors.bracket.color
		};

		for (var i = 0; i < roles.length; i++) {
			var c = colors[roles[i]];
			color.array[i * 3] = c.r;
			color.array[i * 3 + 1] = c.g;
			color.array[i * 3 + 2] = c.b;
		}
		color.needsUpdate = true;
	}
}

// the camera looks at the floor from the front left, above, from far enough to see all of it, a bit
// toward the section and above the floor, as the section stands at the left end and is high
function frameLayoutExample(example)
{
	var p = example.platform, s = LAYOUT_SCALE;
	var size = Math.max(p[3] - p[0], p[4] - p[1]) * s;
	var target = new THREE.Vector3(-0.1 * size, 0.12, 0);

	viewTurn = null;
	orbitControl.target.copy(target);
	// near enough that the floor and the section fill the view: about 0.7 of the size each side of
	// the target across the view and 0.5 up and down, seen from this direction
	var tan = Math.tan(THREE.Math.degToRad(camera.fov / 2));
	var distance = size * Math.max(0.7 / (tan * camera.aspect), 0.5 / tan);

	camera.position.copy(target).add(new THREE.Vector3(-0.42, 0.5, 0.76).setLength(distance));
	camera.lookAt(target);
}
