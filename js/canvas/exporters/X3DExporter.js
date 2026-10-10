/**
 * X3D exporter for the layout scene.
 *
 * Every building part is a THREE.Mesh whose geometry comes from one of the STL files in models/.
 * Factory.js records that file name in mesh.userData.part (e.g. "CenterColumn"), and parts are
 * grouped by it. A mesh without that name falls back to being grouped by its vertex data.
 *
 *   useDEF = true : each part is written once as <Shape DEF="CenterColumn"> (or "partN" for the
 *                   fallback), every placement is <Transform translation rotation scale><Shape USE/>.
 *                   Smallest file; one draw call per placement in X3D viewers.
 *   useDEF = false: all parts are transformed into one merged mesh.
 *                   Bigger file; renders fastest in x3dom.
 *
 * Coordinates are the scene's own (Y up), as in the STL export. Facet normals and triangle winding
 * are kept, and solid="true" matches three.js FrontSide. The ground ("Plane") is skipped, like the
 * STL exporter does.
 */

THREE.X3DExporter = function () { };

THREE.X3DExporter.prototype = {

    constructor: THREE.X3DExporter,

    parse: function (scene, useDEF) {

        var meshes = [];
        scene.updateMatrixWorld(true);
        scene.traverse(function (object) {
            if (!(object instanceof THREE.Mesh)) return;
            if (object.name == "Plane") return;
            meshes.push(object);
        });

        var body = useDEF ? this.instancedBody(meshes) : this.mergedBody(meshes);

        return '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<!DOCTYPE X3D PUBLIC "ISO//Web3D//DTD X3D 3.3//EN" "http://www.web3d.org/specifications/x3d-3.3.dtd">\n' +
            '<X3D version="3.3" profile="Interchange">\n' +
            '\t<head>\n' +
            '\t\t<meta name="generator" content="yingzao_fashi_spatial_grammar X3DExporter' + (useDEF ? ' (DEF/USE)' : ' (merged)') + '" />\n' +
            '\t</head>\n' +
            '\t<Scene>\n' + body + '\t</Scene>\n' +
            '</X3D>\n';
    },

    // ---- one DEF per distinct part geometry, USE for every placement ------------------------

    instancedBody: function (meshes) {
        var self = this, parts = {}, names = {}, order = [], out = '', unnamed = 0;
        meshes.forEach(function (mesh) {
            var part = mesh.userData && mesh.userData.part;
            var key = part ? 'part:' + part : 'data:' + self.geometryKey(mesh.geometry);
            if (!parts[key]) {
                parts[key] = []; order.push(key);
                names[key] = part ? self.defName(part) : 'part' + (unnamed++);
            }
            parts[key].push(mesh);
        });

        var position = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3();
        order.forEach(function (key) {
            var name = names[key];
            parts[key].forEach(function (mesh, j) {
                mesh.matrixWorld.decompose(position, quaternion, scale);
                out += '\t\t<Transform translation="' + self.vec(position) + '" rotation="' + self.axisAngle(quaternion) +
                       '" scale="' + self.vec(scale) + '">\n';
                if (j === 0) {
                    out += '\t\t\t<Shape DEF="' + name + '">\n' +
                           self.shapeContent(mesh, self.triangles(mesh.geometry, null), '\t\t\t\t') +
                           '\t\t\t</Shape>\n';
                } else {
                    out += '\t\t\t<Shape USE="' + name + '"/>\n';
                }
                out += '\t\t</Transform>\n';
            });
        });
        return out;
    },

    // ---- everything in world coordinates, one shape ------------------------------------------

    mergedBody: function (meshes) {
        var self = this, all = { positions: [], normals: [] };
        meshes.forEach(function (mesh) {
            var t = self.triangles(mesh.geometry, mesh.matrixWorld), i;
            for (i = 0; i < t.positions.length; i++) all.positions.push(t.positions[i]);
            for (i = 0; i < t.normals.length; i++) all.normals.push(t.normals[i]);
        });
        if (!meshes.length) return '';
        return '\t\t<Shape>\n' + this.shapeContent(null, all, '\t\t\t') + '\t\t</Shape>\n';
    },

    // ---- helpers -------------------------------------------------------------------------------

    // DEF names must be valid XML names: letters, digits, '_', '-', '.', not starting with a digit
    defName: function (s) {
        s = String(s).replace(/[^A-Za-z0-9_.-]/g, '_');
        return /^[A-Za-z_]/.test(s) ? s : '_' + s;
    },

    // fallback for meshes without userData.part: same vertex data -> same key
    geometryKey: function (geometry) {
        var p = geometry.attributes.position.array, h = 2166136261, i, v;
        var view = new Uint32Array(p.buffer, p.byteOffset, p.length);
        for (i = 0; i < view.length; i++) {
            v = view[i];
            h ^= v; h = Math.imul(h, 16777619);
        }
        return p.length + ':' + (h >>> 0);
    },

    // positions as [x,y,z,...] per triangle vertex, one normal per triangle (the STL facet normal)
    triangles: function (geometry, matrix) {
        var pos = geometry.attributes.position.array;
        var nrm = geometry.attributes.normal ? geometry.attributes.normal.array : null;
        var index = geometry.index ? geometry.index.array : null;
        var positions = [], normals = [];
        var v = new THREE.Vector3(), n = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3();
        var normalMatrix = matrix ? new THREE.Matrix3().getNormalMatrix(matrix) : null;
        var count = index ? index.length : pos.length / 3;
        for (var i = 0; i < count; i += 3) {
            var ids = index ? [index[i], index[i + 1], index[i + 2]] : [i, i + 1, i + 2];
            var tri = [];
            for (var k = 0; k < 3; k++) {
                v.set(pos[ids[k] * 3], pos[ids[k] * 3 + 1], pos[ids[k] * 3 + 2]);
                if (matrix) v.applyMatrix4(matrix);
                tri.push(v.clone());
                positions.push(v.x, v.y, v.z);
            }
            if (nrm) {
                n.set(nrm[ids[0] * 3], nrm[ids[0] * 3 + 1], nrm[ids[0] * 3 + 2]);
                if (normalMatrix) n.applyMatrix3(normalMatrix);
            } else {
                n.crossVectors(a.subVectors(tri[1], tri[0]), b.subVectors(tri[2], tri[0]));
            }
            if (n.lengthSq() > 0) n.normalize();
            normals.push(n.x, n.y, n.z);
        }
        return { positions: positions, normals: normals };
    },

    // the color a part is shown in (getPartColor in Painting.js; the brackets are painted per vertex,
    // so their material is white). The merged mesh (mesh = null) takes the color of the parts in no group.
    color: function (mesh) {
        return getPartColor(mesh ? mesh.userData.part : null);
    },

    shapeContent: function (mesh, t, indent) {
        var c = this.color(mesh);
        var points = this.unique(t.positions), vectors = this.unique(t.normals);
        var coordIndex = [];
        for (var i = 0; i < points.index.length; i += 3) {
            coordIndex.push(points.index[i] + ' ' + points.index[i + 1] + ' ' + points.index[i + 2] + ' -1');
        }
        return indent + '<Appearance>\n' +
               indent + '\t<Material diffuseColor="' + this.num(c.r) + ' ' + this.num(c.g) + ' ' + this.num(c.b) + '" />\n' +
               indent + '</Appearance>\n' +
               indent + '<IndexedFaceSet solid="true" normalPerVertex="false"\n' +
               indent + '                coordIndex="' + coordIndex.join(' ') + '"\n' +
               indent + '                normalIndex="' + vectors.index.join(' ') + '">\n' +
               indent + '\t<Coordinate point="' + points.values.join(' ') + '" />\n' +
               indent + '\t<Normal vector="' + vectors.values.join(' ') + '" />\n' +
               indent + '</IndexedFaceSet>\n';
    },

    // dedupe xyz triples (6 decimals) -> { values: ["x y z", ...], index: [...] }
    unique: function (flat) {
        var map = {}, values = [], index = [];
        for (var i = 0; i < flat.length; i += 3) {
            var s = this.num(flat[i]) + ' ' + this.num(flat[i + 1]) + ' ' + this.num(flat[i + 2]);
            var k = map[s];
            if (k === undefined) { k = map[s] = values.length; values.push(s); }
            index.push(k);
        }
        return { values: values, index: index };
    },

    num: function (x) {
        var s = x.toFixed(6).replace(/\.?0+$/, '');
        return s === '-0' || s === '' ? '0' : s;
    },

    vec: function (v) {
        return this.num(v.x) + ' ' + this.num(v.y) + ' ' + this.num(v.z);
    },

    axisAngle: function (q) {
        q = q.clone().normalize();
        if (q.w < 0) { q.x = -q.x; q.y = -q.y; q.z = -q.z; q.w = -q.w; }
        var s = Math.sqrt(Math.max(0, 1 - q.w * q.w));
        if (s < 1e-8) return '0 1 0 0';
        return this.num(q.x / s) + ' ' + this.num(q.y / s) + ' ' + this.num(q.z / s) + ' ' + this.num(2 * Math.acos(Math.min(1, q.w)));
    }

};
