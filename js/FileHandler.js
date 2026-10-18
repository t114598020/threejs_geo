function FileHandler() {
    // Only the drawing: the <svg> of #space (which also holds the 彩畫 buttons), written as XML and
    // sized to what is drawn, as its width of 100% means nothing once it is a file of its own (the
    // plan below the first 150 pixels was cut off).
    this.SVGexporter = function () {
        var svg = $('#space > svg')[0], box = svg.getBBox(), pad = 20;
        var w = Math.ceil(box.width + 2 * pad), h = Math.ceil(box.height + 2 * pad);
        var copy = svg.cloneNode(true);

        copy.setAttribute("width", w);
        copy.setAttribute("height", h);
        copy.setAttribute("viewBox", [Math.floor(box.x - pad), Math.floor(box.y - pad), w, h].join(" "));

        var xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(copy);
        var blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
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
