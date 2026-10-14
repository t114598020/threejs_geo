$(document).ready(function () {
    init();
});

// Scale test (ScaleTest.html): the size of the layout is entered as on the layout page
// (SpatialGrammarLayout.html), and the layout is generated like the four layout demos, where
// Resume applies the rules of every stage one after another. Used to measure how large a palace
// the preview can still draw.

var my_model, svg, analysis_flag, stg_level, cmd_mgr, obs, is_batch_flag, model_generate_speed;
var rule_pending;       // a rule is being drawn (VerifiedFunction.js), see doAnalyze
var layout_title = "規模測試 Scale Test";
var run_id = 0;         // counts the layouts created, so a result is not shown on a newer layout

function init() {
    my_model = new Model();
    cmd_mgr = new CommandManager();
    obs = new Observer();
    my_model.initStages();

    stg_level = 1;
    is_batch_flag = false;
    rule_pending = false;

    model_generate_speed = 100;

    //Initialyze svg
    initSvg();

    //Reorder HTML elements.
    svg.append("g").attr("id", "rect");
    updateMessage(svg, "PalaceTitle", layout_title, "black", 20, 16);

    doAnimate('New');

}

// rules of stage 2 for each kind of groove, as in the models of the layout demos
// (TDBGrooveModel.js, KTBBGrooveModel.js, SingleGrooveModel.js and DoubleGrooveModel.js)
var groove_names = { double: "單槽／雙槽", box: "金箱枓底槽", bottom: "分心枓底槽", none: "不分槽" };

function getGrooveRules(_groove) {
    switch (_groove) {
        case "box":
            return [new Rule9(), new Rule10(), new Rule11(), new Rule12()];
        case "bottom":
            return [new Rule8()];
        case "none":
            return [];
        default:
            return [new Rule9(), new Rule11()];
    }
}

/************************************************
                Flag Controller
*************************************************/
function autoAnalysisCtrl() {
    if (analysis_flag) {
        $("#Analysis_flag").text("Analyze On").css({ 'font-size': "16px" });
        doAnalyze();
    }
    else {
        clearPreview();
        $("#Analysis_flag").text("Analyze Off").css({ 'font-size': "16px" });
    }
}

function toggleAnalysisCtrl() {
    if (!analysis_flag) {
        $("#Analysis_flag").text("Analyze On").css({ 'font-size': "16px" });
        analysis_flag = true;
        doAnalyze();
    }
    else {
        clearPreview();
        analysis_flag = false;
        $("#Analysis_flag").text("Analyze Off").css({ 'font-size': "16px" });
    }
}

function getStageMsg(_level) {
    switch (_level) {
        case 1:
            return "Stage：1　開間的模數系統";
        case 2:
            return "Stage：2　殿身內外槽分位";
        case 3:
            return "Stage：3  鋪作分位與落柱系統";
        case 4:
            return "Stage：4　牆身";
        case 5:
            return "Stage：5　門、窗開口";
        case 6:
            return "Stage：6  階梯";
        case 7:
            return "Stage：7　屋頂";

    }

}

/************************************************
                ActionBar Controller
*************************************************/
function createNewLayoutMap() {

    var w = parseInt($("input[name='LayoutWidth']").val());
    var h = parseInt($("input[name='LayoutHeight']").val());
    var side_corr_flag = $("input[name='SideCorridor']").prop("checked");
    var groove = $("select[name='GrooveRules']").val();
    var delay = parseInt($("input[name='StepDelay']").val());

    // the same limits as the layout page (Controller.js)
    if (!(w > 2 && h > 2)) { alert("Width and height must more than 3!"); return; }
    if (side_corr_flag && w < 4) { alert("有副階橫向間數不得小於四間!"); return; }
    if (side_corr_flag && h > 9) { alert("有副階縱向間數不得大於九間!"); return; }
    if (!side_corr_flag && h > 8) { alert("無副階縱向間數不得大於八間!"); return; }
    if (w % 2 != 1) { alert("Width must be cardinal number!"); return; }

    // Rule 8 cuts the layout into 3 × 2 equal blocks (palacelayout/models/Rule.js)
    if (groove == "bottom" && (side_corr_flag || w % 3 != 0 || h % 2 != 0)) {
        alert("分心枓底槽（Rule 8）只用於無副階、寬為 3 的倍數、深為偶數的地盤!");
        return;
    }

    layout_title = "規模測試 " + w + " × " + h + (side_corr_flag ? " 副階" : "") + "，" + groove_names[groove];
    run_id++;
    resumePreview();

    //Clear used svg
    d3.select("#space").select("svg").remove();

    //Reinitial stage
    init();
    my_model.stages[1].rules = getGrooveRules(groove);
    model_generate_speed = delay >= 0 ? delay : 100;

    updateMessage(svg, "StageLevelCounter", getStageMsg(stg_level), "black", 20, 42);
    updateCurrentStage(svg, stg_level);

    //Draw layout; the models of the layout demos make _h - 1 rows (DoubleGrooveModel.js)
    my_model.initModel(side_corr_flag, w, h + 1);
    my_model.drawMap(svg, cmd_mgr);

    fitViewer(w, h, side_corr_flag, $("input[name='FitView']").prop("checked"));

    //Analysize
    analysis_flag = true;
    autoAnalysisCtrl();

    //Recovered font color
    $('#New').removeClass();
    $('#New').css("color", "DodgerBlue");

    doAnimate('NextStep');
    doAnimate('NextStage');

}

// The preview is set up for a building about as wide as the layout demos (Canvas.js: camera about
// 3 away, far plane and fog at 15). A larger layout would leave the view and fade into the fog, so
// the camera distance, its near and far planes, the fog and the ground grow with the layout, and
// the whole building is drawn while the frame rate is read.
function fitViewer(_w, _h, _side_corr_flag, _fit) {
    var viewer = document.getElementById('viewer').contentWindow;
    var camera = viewer.camera;

    // side corridors are half as wide as a bay; the building should take at most 90% of the
    // width of the view, seen from the direction of the camera of Canvas.js, (0, 1, 3)
    var width = (Math.max(_w, _h) - (_side_corr_flag ? 1 : 0)) * viewer.space_length;
    var half_view = Math.tan(camera.fov / 2 * Math.PI / 180) * camera.aspect;
    var scale = _fit ? Math.max(1, width / 0.9 / 2 / half_view / Math.sqrt(10)) : 1;

    camera.position.set(0, 1, 3).multiplyScalar(scale);
    camera.near = 0.01 * scale;
    camera.far = 15 * scale;
    camera.updateProjectionMatrix();

    viewer.scene.fog.near = 2 * scale;
    viewer.scene.fog.far = 15 * scale;
    viewer.scene.getObjectByName("Plane").scale.set(scale, scale, 1);
}

// The preview draws on the same thread as this page, and once it holds thousands of parts a frame
// takes longer than a step of the rules, so its frames slow the generation down. While Resume runs,
// the render loop of the preview (Canvas.js, animate) can be paused; it draws again when the
// generation is paused or done.
var preview_paused = false;
var preview_stopped = false;    // the loop has asked for its next frame while paused, and ended
var browser_raf;

function pausePreview() {
    if (preview_paused || !$("input[name='PausePreview']").prop("checked")) return;

    var viewer = document.getElementById('viewer').contentWindow;
    browser_raf = viewer.requestAnimationFrame;
    viewer.requestAnimationFrame = function () {
        preview_stopped = true;
        return 0;
    };
    preview_paused = true;
}

function resumePreview() {
    if (!preview_paused) return;

    var viewer = document.getElementById('viewer').contentWindow;
    viewer.requestAnimationFrame = browser_raf;
    preview_paused = false;

    // restart the loop if it has ended; otherwise its next frame continues it
    if (preview_stopped) {
        preview_stopped = false;
        viewer.animate();
    }
}

function doAnalyze() {
    // One rule at a time: Resume or Next step while a rule is still being drawn would start a
    // second chain of rules and place every part twice. If Resume is pressed meanwhile, the rule
    // being drawn continues the chain itself (isBatchType).
    if (rule_pending) return;

    var results = my_model.analyze(stg_level);

    if (results.length > 0) {

        // the roof (stage 7) is placed at once, the rules of the other stages are drawn after a delay
        if (stg_level < my_model.getStageNum()) rule_pending = true;

        var cmd = new VerifiedCommand(this, svg, cmd_mgr, results[0], stg_level);
        cmd.execute();

        if (my_model.getStageNum() == stg_level) reportResult();

        cmd = null;
        delete cmd;

    } else {

        if (my_model.getStageNum() == stg_level) alert("Finished!");
        else {
            doNextStage();
        }
    }
}

// asked by drawL1 to drawL6 (VerifiedFunction.js) once their rule has been drawn
function isBatchType() {
    rule_pending = false;
    return is_batch_flag;
}

// Once the roof is placed and no part has arrived for a second (the parts load asynchronously,
// Factory.js), shows how many parts the preview draws.
function reportResult() {
    var viewer = document.getElementById('viewer').contentWindow;
    var my_run = run_id;
    var last = -1;

    var timer = setInterval(function () {
        if (my_run != run_id) {
            clearInterval(timer);
            return;
        }

        var parts = 0;
        var objects = viewer.scene.children;
        for (var i = 0; i < objects.length; i++) {
            if (objects[i] instanceof viewer.THREE.Mesh && objects[i].name != "Plane") parts++;
        }

        if (parts != last) {
            last = parts;
            return;
        }
        clearInterval(timer);
        resumePreview();

        // draw a frame now, the render loop does not run while the page is in the background
        viewer.render();

        var text = layout_title + "　完成：構件 " + parts + " 個，draw call " + viewer.renderer.info.render.calls;
        updateMessage(svg, "PalaceTitle", text, "red", 20, 16);
        console.log(text);

        is_batch_flag = false;
        $("#NextStage").text("Resume").css({ 'font-size': "16px" });
    }, 1000);
}

function isLayoutCreated() {
    if (my_model.map.length > 0) return true;

    doAnimate('New');
    return false;
}

function doSkiptoNextStage() {
    if (!isLayoutCreated()) return;

    if (is_batch_flag) {
        $("#NextStage").text("Resume").css({ 'font-size': "16px" });
        is_batch_flag = false;
        resumePreview();
        doAnimate('NextStage');


        $('#NextStage').removeClass();
        $('#NextStage').css("color", "DodgerBlue");
    } else {
        $("#NextStage").text("Pause").css({ 'font-size': "16px" });
        is_batch_flag = true;
        pausePreview();
        doAnimate('NextStage');

        $('#NextStep').removeClass();
        $('#NextStep').css("color", "DodgerBlue");

        doAnalyze();
    }
}

function doPreviousStep() {
    if (!isLayoutCreated()) return;

    clearPreview();
    cmd_mgr.undo();

    updateMessage(svg, "StageLevelCounter", getStageMsg(stg_level), "black", 20, 42);
    updateCurrentStage(svg, stg_level);
}

function doNextStep() {
    if (!isLayoutCreated()) return;

    analysis_flag = false;

    $('#NextStep').removeClass();
    $('#NextStep').css("color", "DodgerBlue");
    //Recovered font color
    $('#NextStage').removeClass();
    $('#NextStage').css("color", "DodgerBlue");

    toggleAnalysisCtrl();
}

function doPreviousStage() {

    clearPreview();
    if (stg_level > 1)
        stg_level--;

    updateMessage(svg, "StageLevelCounter", getStageMsg(stg_level), "black", 20, 42);
    updateCurrentStage(svg, stg_level);

    analysis_flag = true;
    autoAnalysisCtrl();

}

function doNextStage() {

    clearPreview();
    if (stg_level < my_model.getStageNum())
        stg_level++;


    updateMessage(svg, "StageLevelCounter", getStageMsg(stg_level), "black", 20, 42);
    updateCurrentStage(svg, stg_level);

    analysis_flag = true;
    autoAnalysisCtrl();
}


function updateMessage(_svg, className, text, color, x_offset, y_offset) {
    var obj = d3.select("[class=" + className + "]");

    if (!obj[0][0]) {
        var text = _svg.select("#text")
            .append("text")
            .attr("class", className)
            .attr("x", x_offset)
            .attr("y", y_offset)
            .attr("font-family", "sans-serif")
            .attr("font-size", "20")
            .attr("fill", color)
            .text(text);
    }
    else {
        obj.text(text).attr("fill", color);
    }
}

function updateCurrentStage(_svg, _stage_level) {
    // the painting templates (js/PaintTemplates.js), once a layout has started
    $("#PartColors").show();

    var offset_x = 40, offset_y = 65;
    var stage = ["階段一", "階段二", "階段三", "階段四", "階段五", "階段六", "階段七"];
    var stage_topic = ["地盤開間", "分槽", "鋪作", "牆身", "門窗", "階梯", "屋頂"];

    for (var i = 0; i < stage.length; i++) {
        //High light current stage label
        var color, opacity;
        if (_stage_level == i + 1) {
            color = "red";
            opacity = 1;
        } else {
            color = "black";
            opacity = 0.3;
        }

        var label = d3.select("[class=StageLabel" + i + "]");
        var topic = d3.select("[class=StageTopic" + i + "]");

        if (!label[0][0]) {
            var text = _svg.select("#text")
                .append("text")
                .attr("class", "StageLabel" + i)
                .attr("x", offset_x + 120 * i)
                .attr("y", offset_y)
                .attr("font-family", "sans-serif")
                .attr("font-size", "18")
                .attr("fill", color)
                .style("opacity", opacity)
                .text(stage[i]);

            var text = _svg.select("#text")
                .append("text")
                .attr("class", "StageTopic" + i)
                .attr("x", offset_x + 120 * i)
                .attr("y", offset_y + 25)
                .attr("font-family", "sans-serif")
                .attr("font-size", "18")
                .attr("fill", color)
                .style("opacity", opacity)
                .text(stage_topic[i]);
        }
        else {
            label.attr("fill", color)
                .style("opacity", opacity);
            topic.attr("fill", color)
                .style("opacity", opacity);
        }
    }
}

function initSvg() {
    //Init svg
    svg = d3.select("#space").append("svg")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("width", $("#space").width())
        .attr("height", $("#space").height());

    //Reorder HTML elements.
    svg.append("g").attr("id", "rect");
    svg.append("g").attr("id", "path");
    svg.append("g").attr("id", "dot");
    svg.append("g").attr("id", "text");

}

function exportSvgFile() {

    var handler = new FileHandler();

    handler.SVGexporter();

    handler = null;
    delete handler;
}

function exportStlFile() {
    obs.exportSTLObserver();
}

// _useDEF: true = repeated parts written once (DEF/USE), false = one merged mesh
function exportX3dFile(_useDEF) {
    obs.exportX3DObserver(_useDEF);
}

function doGetMidLine() {
    return my_model.getMidLine();
}

function doAnimate(_topic) {
    //Using for pointing
    var ani = new UIAnimater();
    ani.hrightLight(_topic);

    ani = null;
    delete ani;
}
