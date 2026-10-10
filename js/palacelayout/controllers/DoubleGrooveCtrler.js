$(document).ready(function () {
    init();
});


var my_model, svg, analysis_flag, stg_level, cmd_mgr, obs, is_batch_flag, model_generate_speed;

function init() {
    my_model = new Model();
    cmd_mgr = new CommandManager();
    obs = new Observer();
    my_model.initStages();

    stg_level = 1;
    is_batch_flag = false;

    model_generate_speed = 100;

    //Initialyze svg
    initSvg();

    //Init support svg
    /*sup_svg = d3.select("#toolsupport").append("svg")
                                    .attr("width", "100%")
                                    .attr("height", "100%");*/

    //Reorder HTML elements.
    svg.append("g").attr("id", "rect");
    updateMessage(svg, "PalaceTitle", "殿閣地盤殿身七間副階周匝各兩架椽身內雙槽", "black", 20, 16);

    doAnimate('New');

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

    var w = 9;
    var h = 7;
    var side_corr_flag = true;

    //Clear used svg
    d3.select("#space").select("svg").remove();

    //Reinitial stage
    init();

    updateMessage(svg, "StageLevelCounter", getStageMsg(stg_level), "black", 20, 42);
    updateCurrentStage(svg, stg_level);

    //Draw layout
    my_model.initModel(side_corr_flag, w, h);
    my_model.drawMap(svg, cmd_mgr);

    //Analysize
    analysis_flag = true;
    autoAnalysisCtrl();

    //Recovered font color
    $('#New').removeClass();
    $('#New').css("color", "DodgerBlue");

    doAnimate('NextStep');
    doAnimate('NextStage');

}

function doAnalyze() {
    var results = my_model.analyze(stg_level);

    if (results.length > 0) {

        var cmd = new VerifiedCommand(this, svg, cmd_mgr, results[0], stg_level);
        cmd.execute();

        if (my_model.getStageNum() == stg_level) {
            setTimeout(function () { $('#STLDownloadDialog').modal() }, 1500);
        }

        cmd = null;
        delete cmd;

    } else {

        if (my_model.getStageNum() == stg_level) alert("Finished!");
        else {
            doNextStage();
        }
    }
}

function isBatchType() {
    return is_batch_flag;
}

function doSkiptoNextStage() {
    if (is_batch_flag) {
        $("#NextStage").text("Resume").css({ 'font-size': "16px" });
        is_batch_flag = false;
        doAnimate('NextStage');


        $('#NextStage').removeClass();
        $('#NextStage').css("color", "DodgerBlue");
    } else {
        $("#NextStage").text("Pause").css({ 'font-size': "16px" });
        is_batch_flag = true;
        doAnimate('NextStage');

        $('#NextStep').removeClass();
        $('#NextStep').css("color", "DodgerBlue");

        doAnalyze();
    }
}

function doPreviousStep() {

    clearPreview();
    cmd_mgr.undo();

    updateMessage(svg, "StageLevelCounter", getStageMsg(stg_level), "black", 20, 42);
    updateCurrentStage(svg, stg_level);
}

function doNextStep() {
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
        obj.text(text);
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

function directGenerateModel() {
    createNewLayoutMap();

    model_generate_speed = 0;

    is_batch_flag = false;

    doSkiptoNextStage();
}