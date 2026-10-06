function FileHandler() {
    this.SVGexporter = function () {
        //Get all svg element
        var html = $('<div>').append($('#space').clone()).html();

        var blob = new Blob([html.toString()], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "layout.svg");
    }

    this.STLexporter = function (_scene) {

        var exporter = new THREE.STLBinaryExporter();
        var stl_string = exporter.parse(_scene);

        var blob = new Blob([stl_string], { type: "text/plain" });
        saveAs(blob, "layout.stl");
    }

    // _useDEF: true = repeated parts written once (DEF/USE), false = one merged mesh
    this.X3Dexporter = function (_scene, _useDEF) {

        var exporter = new THREE.X3DExporter();
        var x3d_string = exporter.parse(_scene, _useDEF);

        var blob = new Blob([x3d_string], { type: "model/x3d+xml;charset=utf-8" });
        saveAs(blob, _useDEF ? "layout_def.x3d" : "layout.x3d");
    }

}
