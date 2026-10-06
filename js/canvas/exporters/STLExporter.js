
THREE.STLExporter = function () { };

THREE.STLExporter.prototype = {

    constructor: THREE.STLExporter,

    parse: (function () {

        var vector = new THREE.Vector3();
        var normalMatrixWorld = new THREE.Matrix3();

        return function (scene) {

            var outputs = [];

            var output = '';

            output += 'solid exported\n';

            var repeat_record = [];

            scene.traverse(function (object) {

                if (object instanceof THREE.Mesh) {

                    if (!isRepeated(object.name, repeat_record)) {

                        //Recording in repeated array
                        repeat_record.push(object.name);

                        var geometry = new THREE.Geometry().fromBufferGeometry(object.geometry);
                        var matrixWorld = object.matrixWorld;
                        var mesh = object;

                        console.log(output.length + Math.pow(2, 21));
                        if (output.length + Math.pow(2, 21) < Math.pow(2, 28)) {
                            if (geometry instanceof THREE.Geometry && object.name != "Plane") {

                                var vertices = geometry.vertices;
                                var faces = geometry.faces;

                                normalMatrixWorld.getNormalMatrix(object.matrixWorld);

                                for (var i = 0, l = faces.length; i < l; i++) {
                                    var face = faces[i];

                                    vector.copy(face.normal).applyMatrix3(normalMatrixWorld).normalize();

                                    output += '\tfacet normal ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';
                                    output += '\t\touter loop\n';

                                    var indices = [face.a, face.b, face.c];

                                    for (var j = 0; j < 3; j++) {
                                        var vertexIndex = indices[j];
                                        if (geometry.skinIndices.length == 0) {
                                            vector.copy(vertices[vertexIndex]).applyMatrix4(matrixWorld);
                                            output += '\t\t\tvertex ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';
                                        }
                                    }
                                    output += '\t\tendloop\n';
                                    output += '\tendfacet\n';
                                }
                            }
                        } else {
                            output += 'endsolid exported\n';
                            outputs.push(output);
                            output = 'solid exported\n';
                        }
                    }
                }
            });

            output += 'endsolid exported\n';
            outputs.push(output);

            return outputs;
        };
    }())
};

function isRepeated(_name, _compare_array) {
    for (var i = 0; i < _compare_array.length; i++)
        if (_name == _compare_array[i])
            return true;
    return false;
}