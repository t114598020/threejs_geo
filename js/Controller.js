$(document).ready(function ()
{
    init();
});


var my_model, svg, analysis_flag, stg_level, cmd_mgr, obs;

function init()
{
    my_model = new Model();
    cmd_mgr = new CommandManager();
    obs = new Observer();
    my_model.initStages();

    stg_level = 1;

    //Initialyze svg
    initSvg();

    //Reorder HTML elements.
    svg.append("g").attr("id", "rect");

    //Setting hot key
    $(document).bind('keydown', "ctrl+z", undo);
    $(document).bind('keydown', "ctrl+y", redo);
    $(document).bind('keydown', "right", doNextStage);
    $(document).bind('keydown', "left", doPreviousStage);
    $(document).bind('keydown', "return", autoAnalysisCtrl);

    //Using for pointing
    var ani = new UIAnimater();
    ani.hrightLight('New');

    ani = null;
    delete ani;

}

/************************************************
				Flag Controller
*************************************************/
function autoAnalysisCtrl() {
    if (analysis_flag) {
        $("#Analysis_flag").text("Pause").css({ 'font-size': "16px" });
        doAnalyze();
    }
    else {
        clearPreview();
        $("#Analysis_flag").text("Start").css({ 'font-size': "16px" });
    }
}

function toggleAnalysisCtrl() {
    if (!analysis_flag) {
        $("#Analysis_flag").text("Pause").css({ 'font-size': "16px" });
        analysis_flag = true;
        doAnalyze();
    }
    else {
        clearPreview();
        analysis_flag = false;
        $("#Analysis_flag").text("Start").css({ 'font-size': "16px" });
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
            return "Stage：6  階梯位置";
        case 7:
            return "Stage：7　屋頂"
           
    }

}

/************************************************
				ActionBar Controller
*************************************************/
function createNewLayoutMap() {

    var w = parseInt($("input[name='LayoutWidth']").val());
    var h = parseInt($("input[name='LayoutHeight']").val());
    var side_corr_flag = $("input[name='SideCorridor']").prop("checked");

    if (w > 2 && h > 2) {
        if (side_corr_flag && h < 5) alert("有副階縱向間數不得小於五間!");
        else if (side_corr_flag && w < 4) alert("有副階橫向間數不得小於四間!");
        else if (side_corr_flag && h > 9) alert("有副階縱向間數不得大於九間!");
        else if (!side_corr_flag && h > 8) alert("無副階縱向間數不得大於八間!");
        else if (w % 2 == 1) {
            //Clear used svg
            d3.select("#space").select("svg").remove();

            //Reinitial stage
            init();

            updateMessage(svg, "StageLevelCounter", getStageMsg(stg_level), "black", 20, 40);
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
        }
        else
            alert("Width must be cardinal number!");
    }
    else
        alert("Width and height must more than 3!");
}

function doAnalyze() {
    var rules = my_model.analyze( stg_level);

    var match_count = 0;
    if (rules.length > 0) {
        for (var i = 0; i < rules.length; i++) {
            var spaces = rules[i].spaces;

            for (var j = 0; j < spaces.length; j++) {

                var cmd = new PreviewCommand(this, svg, cmd_mgr, rules[i], spaces[j], stg_level);
                cmd.execute();
                cmd = null;
                delete cmd;

                match_count++;
            }
        }
    }
    updateMatchedObjects(match_count);
}

function undo() {
    analysis_flag = false;
    autoAnalysisCtrl();

    //In PreviewFunction
    clearPreview();
    cmd_mgr.undo();
}

function redo() {
    analysis_flag = false;
    autoAnalysisCtrl();

    //In PreviewFunction
    clearPreview();
    for (var i = 0; i < 3 ; i++) {		//Rect + Dot
        cmd_mgr.redo();
    }
}

function doPreviousStage() {

    clearPreview();
    if (stg_level > 1)
        stg_level--;

    updateMessage(svg, "StageLevelCounter", getStageMsg(stg_level), "black", 20, 40);
    updateCurrentStage(svg, stg_level);

    analysis_flag = true;
    autoAnalysisCtrl();
    
}

function doNextStage() {

    clearPreview();
    if (stg_level < my_model.getStageNum())
        stg_level++;

    $('#NextStage').removeClass();
    $('#NextStage').css("color", "DodgerBlue");

    updateMessage(svg, "StageLevelCounter", getStageMsg(stg_level), "black", 20, 40);
    updateCurrentStage(svg, stg_level);

    analysis_flag = true;
    autoAnalysisCtrl();

}

function updateCurrentStage(_svg, _stage_level) {
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
                        .attr("x", offset_x + 120* i)
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

function updateMatchedObjects(_val) {
    var str = "";
    if (_val == 1) {
        str = "[\t\t" + _val + "\t\tobject corresponds with rule\t\t]";
    } else if (_val > 1) {
        str = "[\t\t" + _val + "\t\tobjects correspond with rules\t\t]";
    } else {
        str = "[\t\tThere are no objects that corresponded with rules\t\t]";
		
		//Using for pointing
		var ani = new UIAnimater();
		ani.hrightLight('NextStage');

		
		ani = null;
		delete ani;
    }

    var obj = d3.select("[class=MatchedCount]");

    if (!obj[0][0]) {
        var text = svg.select("#text")
					.append("text")
					.attr("class", "MatchedCount")
					.attr("x", 300)
					.attr("y", 40)
					.attr("font-family", "sans-serif")
					.attr("font-size", "18")
					.attr("fill", "black")
                    .style("opacity", 0.8)
					.text(str);
    }
    else {
        obj.text(str);
    }
}

function initSvg() {
    //Init svg
    svg = d3.select("#space").append("svg")
                                 .attr("xmlns", "http://www.w3.org/2000/svg")
                                 .attr("width", "100%")
                                 .attr("height", "100%");

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

