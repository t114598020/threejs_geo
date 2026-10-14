/**
 * X3D exporter for the layout scene, with the painting of the preview (Painting.js).
 *
 * Every building part is a THREE.Mesh whose geometry comes from one of the STL files in models/.
 * Factory.js records that file name in mesh.userData.part (e.g. "CenterColumn"), and parts are
 * grouped by it. A mesh without that name falls back to being grouped by its vertex data.
 *
 *   useDEF = true : each part is written once as <Shape DEF="CenterColumn"> (or "partN" for the
 *                   fallback), every placement is <Transform translation rotation scale><Shape USE/>.
 *                   Smallest file; one draw call per placement in X3D viewers.
 *   useDEF = false: all parts are transformed into one merged mesh per appearance.
 *                   Bigger file; renders fastest in x3dom.
 *
 * The appearance follows the material of the part:
 *   - the color of its group                         -> Material diffuseColor
 *   - colors per piece (鋪作, doors, windows)          -> Color, one per face (colorPerVertex="false")
 *   - a pattern (columns, girders) or the wall texture -> ImageTexture and TextureCoordinate; the
 *                                                       image is written into the file as a data: URL
 * The doors and windows have both, the wall texture on their wall surface and colors on their
 * frames, and are written as two shapes ("Door" and "Door_textured"), as X3D viewers do not agree
 * on how a Color node and an RGB texture combine. Every appearance and texture is written once
 * (DEF) and used again (USE), so an image is in the file only once.
 *
 * Colors are written as the preview shows them: the renderer takes material and vertex colors as
 * linear and converts what it draws (gammaOutput, Factory.js addNewRenderer), so they are converted
 * the same way here. Textures are converted when read and when drawn, so they show as they are.
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

        this.names = {};		// DEF names in use
        this.appearances = {};	// material (and whether textured) -> DEF name of its Appearance
        this.textures = {};		// texture -> DEF name of its ImageTexture

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
                names[key] = part || 'part' + (unnamed++);
            }
            parts[key].push(mesh);
        });

        var position = new THREE.Vector3(), quaternion = new THREE.Quaternion(), scale = new THREE.Vector3();
        order.forEach(function (key) {
            var shapes;
            parts[key].forEach(function (mesh, j) {
                mesh.matrixWorld.decompose(position, quaternion, scale);
                out += '\t\t<Transform translation="' + self.vec(position) + '" rotation="' + self.axisAngle(quaternion) +
                       '" scale="' + self.vec(scale) + '">\n';
                if (j === 0) {
                    shapes = self.shapes(mesh, null);
                    shapes.forEach(function (shape, i) {
                        shape.name = self.uniqueName(i === 0 ? names[key] : names[key] + '_' + shape.kind);
                        out += '\t\t\t<Shape DEF="' + shape.name + '">\n' +
                               self.shapeContent(mesh.material, shape, '\t\t\t\t') +
                               '\t\t\t</Shape>\n';
                    });
                } else {
                    shapes.forEach(function (shape) {
                        out += '\t\t\t<Shape USE="' + shape.name + '"/>\n';
                    });
                }
                out += '\t\t</Transform>\n';
            });
        });
        return out;
    },

    // ---- everything in world coordinates, one shape per appearance ----------------------------

    mergedBody: function (meshes) {
        var self = this, merged = {}, order = [], out = '';
        meshes.forEach(function (mesh) {
            self.shapes(mesh, mesh.matrixWorld).forEach(function (shape) {
                var key = mesh.material.uuid + ':' + shape.kind;
                var all = merged[key];
                if (!all) {
                    all = merged[key] = { material: mesh.material, kind: shape.kind, positions: [], normals: [], colors: [], uvs: [] };
                    order.push(key);
                }
                ['positions', 'normals', 'colors', 'uvs'].forEach(function (name) {
                    for (var i = 0; i < shape[name].length; i++) all[name].push(shape[name][i]);
                });
            });
        });
        order.forEach(function (key) {
            out += '\t\t<Shape>\n' + self.shapeContent(merged[key].material, merged[key], '\t\t\t') + '\t\t</Shape>\n';
        });
        return out;
    },

    // ---- triangles of a part, by how they are painted -----------------------------------------

    // The triangles of a mesh as positions [x,y,z,...] per triangle vertex and one normal per
    // triangle (the STL facet normal), in world coordinates when a matrix is given, sorted into
    // shapes by how they are painted:
    //   plain    : the color of the material
    //   colored  : a color per piece (vertex colors), one per triangle as the pieces have one color
    //   textured : the texture of the material, with texture coordinates per vertex
    // Where a part has both, the triangles in white take the texture; the others take their color,
    // as they show it on a white spot of the texture (the frames of the doors and windows,
    // makeWallUVs in Painting.js).
    shapes: function (mesh, matrix) {
        var geometry = mesh.geometry, material = mesh.material;
        var pos = geometry.attributes.position.array;
        var nrm = geometry.attributes.normal ? geometry.attributes.normal.array : null;
        var col = material.vertexColors === THREE.VertexColors && geometry.attributes.color ? geometry.attributes.color.array : null;
        var uv = material.map && material.map.image && geometry.attributes.uv ? geometry.attributes.uv.array : null;
        var index = geometry.index ? geometry.index.array : null;
        var shapes = {}, kinds = ['plain', 'colored', 'textured'];
        var v = new THREE.Vector3(), n = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3();
        var color = new THREE.Color();
        var normalMatrix = matrix ? new THREE.Matrix3().getNormalMatrix(matrix) : null;
        var count = index ? index.length : pos.length / 3;

        for (var i = 0; i < count; i += 3) {
            var ids = index ? [index[i], index[i + 1], index[i + 2]] : [i, i + 1, i + 2];

            if (col) color.setRGB(col[ids[0] * 3], col[ids[0] * 3 + 1], col[ids[0] * 3 + 2]);
            var white = col && color.r >= 0.999 && color.g >= 0.999 && color.b >= 0.999;
            var kind = uv && (!col || white) ? 'textured' : col ? 'colored' : 'plain';
            var shape = shapes[kind] || (shapes[kind] = { kind: kind, positions: [], normals: [], colors: [], uvs: [] });

            var tri = [];
            for (var k = 0; k < 3; k++) {
                v.set(pos[ids[k] * 3], pos[ids[k] * 3 + 1], pos[ids[k] * 3 + 2]);
                if (matrix) v.applyMatrix4(matrix);
                tri.push(v.clone());
                shape.positions.push(v.x, v.y, v.z);
                if (kind === 'textured') shape.uvs.push(uv[ids[k] * 2], uv[ids[k] * 2 + 1]);
            }
            if (nrm) {
                n.set(nrm[ids[0] * 3], nrm[ids[0] * 3 + 1], nrm[ids[0] * 3 + 2]);
                if (normalMatrix) n.applyMatrix3(normalMatrix);
            } else {
                n.crossVectors(a.subVectors(tri[1], tri[0]), b.subVectors(tri[2], tri[0]));
            }
            if (n.lengthSq() > 0) n.normalize();
            shape.normals.push(n.x, n.y, n.z);

            if (kind === 'colored') {
                var shown = this.shown(color.multiply(material.color));
                shape.colors.push(shown.r, shown.g, shown.b);
            }
        }

        return kinds.filter(function (kind) { return shapes[kind]; }).map(function (kind) { return shapes[kind]; });
    },

    // ---- writing -------------------------------------------------------------------------------

    shapeContent: function (material, shape, indent) {
        var points = this.unique(shape.positions, 3), vectors = this.unique(shape.normals, 3);
        var fields = [
            'solid="true" normalPerVertex="false"',
            'coordIndex="' + this.faces(points.index) + '"',
            'normalIndex="' + vectors.index.join(' ') + '"'
        ];
        var nodes = indent + '\t<Coordinate point="' + points.values.join(' ') + '" />\n' +
                    indent + '\t<Normal vector="' + vectors.values.join(' ') + '" />\n';

        if (shape.kind === 'colored') {
            var colors = this.unique(shape.colors, 3);
            fields.push('colorPerVertex="false" colorIndex="' + colors.index.join(' ') + '"');
            nodes += indent + '\t<Color color="' + colors.values.join(' ') + '" />\n';
        }

        if (shape.kind === 'textured') {
            var uvs = this.unique(shape.uvs, 2);
            fields.push('texCoordIndex="' + this.faces(uvs.index) + '"');
            nodes += indent + '\t<TextureCoordinate point="' + uvs.values.join(' ') + '" />\n';
        }

        return this.appearance(material, shape.kind === 'textured', indent) +
               indent + '<IndexedFaceSet ' + fields.join('\n' + indent + '                ') + '>\n' +
               nodes +
               indent + '</IndexedFaceSet>\n';
    },

    // The Appearance of a material: written the first time (DEF), used again after. A Color node
    // in the geometry takes the place of the diffuse color. three.js shininess is the Phong
    // exponent, X3D shininess that exponent / 128.
    appearance: function (material, textured, indent) {
        var key = material.uuid + (textured ? ':textured' : '');
        if (this.appearances[key]) return indent + '<Appearance USE="' + this.appearances[key] + '"/>\n';

        var name = this.appearances[key] = this.uniqueName('app_' + this.materialName(material) + (textured ? '_textured' : ''));
        var out = indent + '<Appearance DEF="' + name + '">\n' +
                  indent + '\t<Material diffuseColor="' + this.rgb(this.shown(material.color)) + '"' +
                  (material.specular ? ' specularColor="' + this.rgb(this.shown(material.specular)) + '"' +
                                       ' shininess="' + this.num(Math.min(1, material.shininess / 128)) + '"' : '') + ' />\n';
        if (textured) out += this.texture(material, indent + '\t');
        return out + indent + '</Appearance>\n';
    },

    // The ImageTexture of a material, its image written into the file as a data: URL, once. three.js
    // (r73) draws a texture that repeats from a copy resized to powers of two, which is what is in
    // texture.image then; it maps the same way, as texture coordinates go from 0 to 1 over the image.
    texture: function (material, indent) {
        var texture = material.map;
        if (this.textures[texture.uuid]) return indent + '<ImageTexture USE="' + this.textures[texture.uuid] + '"/>\n';

        var name = this.textures[texture.uuid] = this.uniqueName('tex_' + this.materialName(material));
        return indent + '<ImageTexture DEF="' + name + '"' +
               ' repeatS="' + (texture.wrapS !== THREE.ClampToEdgeWrapping) + '"' +
               ' repeatT="' + (texture.wrapT !== THREE.ClampToEdgeWrapping) + '"\n' +
               indent + '              url=\'"' + this.dataURL(texture.image) + '"\' />\n';
    },

    // drawings up to 512 x 512 (the wall texture) as PNG, larger images (the pattern pictures) as JPEG
    dataURL: function (image) {
        var canvas = image;
        if (!(image instanceof HTMLCanvasElement)) {
            canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth || image.width;
            canvas.height = image.naturalHeight || image.height;
            canvas.getContext('2d').drawImage(image, 0, 0);
        }
        return canvas.width * canvas.height <= 512 * 512 ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.92);
    },

    // ---- helpers -------------------------------------------------------------------------------

    // a color as the preview shows it (see above)
    shown: function (c) {
        var r = typeof renderer !== 'undefined' ? renderer : null;
        return r && r.gammaOutput ? new THREE.Color().copyLinearToGamma(c, r.gammaFactor) : c.clone();
    },

    // the group of parts of a material (partMaterials in Painting.js), for the DEF names
    materialName: function (material) {
        if (typeof partMaterials !== 'undefined') {
            for (var group in partMaterials) {
                if (partMaterials[group] === material) return group;
            }
        }
        return 'material';
    },

    // DEF names must be valid XML names (letters, digits, '_', '-', '.', not starting with a digit)
    // and different from each other
    uniqueName: function (s) {
        s = String(s).replace(/[^A-Za-z0-9_.-]/g, '_');
        if (!/^[A-Za-z_]/.test(s)) s = '_' + s;
        var name = s;
        for (var i = 2; this.names[name]; i++) name = s + '_' + i;
        this.names[name] = true;
        return name;
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

    // indices of triangle corners -> "a b c -1 ..."
    faces: function (index) {
        var faces = [];
        for (var i = 0; i < index.length; i += 3) faces.push(index[i] + ' ' + index[i + 1] + ' ' + index[i + 2] + ' -1');
        return faces.join(' ');
    },

    // dedupe tuples of `size` numbers (6 decimals) -> { values: ["x y z", ...], index: [...] }
    unique: function (flat, size) {
        var map = {}, values = [], index = [];
        for (var i = 0; i < flat.length; i += size) {
            var parts = [];
            for (var k = 0; k < size; k++) parts.push(this.num(flat[i + k]));
            var s = parts.join(' ');
            var j = map[s];
            if (j === undefined) { j = map[s] = values.length; values.push(s); }
            index.push(j);
        }
        return { values: values, index: index };
    },

    num: function (x) {
        var s = x.toFixed(6).replace(/\.?0+$/, '');
        return s === '-0' || s === '' ? '0' : s;
    },

    rgb: function (c) {
        return this.num(c.r) + ' ' + this.num(c.g) + ' ' + this.num(c.b);
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
