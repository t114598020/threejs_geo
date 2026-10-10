var g_id = 0;

function LineCommand(_svg, _data) {
    var my_id;

    this.execute = function () {

        my_id = g_id;

        var lineFuc = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate("linear");

        var line_graph = _svg.select("#path")
                        .append("path")
                        .attr("class", my_id)
                        .attr("d", lineFuc(_data))
                        .attr("stroke", "black")
                        .attr("stroke-width", 3)
                        .attr("fill", "white")
                        .style("opacity", 0)
                        .transition()
                        .duration(1000)
                        .style("opacity", 1);
        g_id++;
    }

    //Undo
    this.undo = function () {
        d3.selectAll("[class='" + my_id + "']").remove();
        g_id--;
    }

}

function DrawStg1Command(_svg, _ctrl, _spaces, _lines_arr, _dots_arr, _type) {
    var backup_types = [];
    var line_cmds = [];
    var dot_cmds = []

    this.execute = function () {
        for (var i = 0; i < _spaces.length; i++) {
            line_cmds.push(new LineCommand(_svg, _lines_arr[i]));
            dot_cmds.push(new CircleCommand(_svg, _dots_arr[i]));
            backup_types.push(_spaces[i].getType());
            _spaces[i].setType(_type);
            line_cmds[i].execute();
            dot_cmds[i].execute();
            obs.columnObersver(_spaces[i], _dots_arr[i]);
        }

    }
    this.undo = function () {
        for (var i = 0; i < _spaces.length; i++) {
            _spaces[i].setType(backup_types[i]);
            line_cmds[i].undo();
            dot_cmds[i].undo();
            obs.undoObserver();
        }
        stg_level = 1;
        _ctrl.updateMessage(_svg, "StageLevelCounter", _ctrl.getStageMsg(1), "black", 20, 40);
    }
}

function DrawStg2Command(_svg, _ctrl, _space, _lines, _cel_dots, _cel_coors, _type) {
    var backup_types = [];
    var line_cmd = new LineCommand(_svg, _lines);
    var cel_cmd = new CancelDotCommand(_cel_dots);

    this.execute = function () {
        for (var i = 0; i < _space.length; i++) {
            backup_types.push(_space[i].getType());
           _space[i].setType(_type);
        }
           
        line_cmd.execute();
        cel_cmd.execute();
        obs.cancelColumnObserver(_cel_coors);

    }
    this.undo = function () {
        for (var i = 0; i < _space.length; i++) {
            _space[i].setType(backup_types[i]);
            _space[i].setEdges({ top: 1, right: 1, bot: 1, left: 1 });
        }
        line_cmd.undo();
        cel_cmd.undo();
        obs.undoObserver();
        stg_level = 2;
        _ctrl.updateMessage(_svg, "StageLevelCounter", _ctrl.getStageMsg(2), "black", 20, 40);
    }
}

function DrawStg3Command(_svg, _ctrl, _space, _points, _type) {
    var my_id = g_id;
    var backup_type = _space.getType();
    var backup_edges = {top: _space.getTopEdge(), bot:_space.getBotEdge(), left:_space.getLeftEdge(), right:_space.getRightEdge()};

    this.execute = function () {
        var mid_lind = _ctrl.doGetMidLine();

        for (var i = 0; i < _points.length; i++) {
            var adjust_x = _points[i].x, adjust_y = _points[i].y;
            if (_points[i].y > _space.getY() && _points[i].y < _space.getY() + _space.getHeight()) {
                if (_points[i].x < mid_lind.virtical) adjust_x -= 16;
                else adjust_x += 7;
            } else {
                adjust_x -= 6;
                adjust_y -= 5
            }
            var v_texts = _svg.select("#path")
                        .append("text")
                        .attr("class", my_id)
                        .attr("x", adjust_x)
                        .attr("y", adjust_y)
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "20")
                        .attr("fill", "black")
                        .text("V")
                        .style("opacity", 0)
                        .transition()
                        .duration(1000)
                        .style("opacity", 1);
        }
        //Set type
        _space.setType(_type);

        //Set edges
        if (_space.haveTopEdge() && _type > _space.getTopEdge()) {
            _space.setTopEdge(_type);
            if (_space.getTopSpace() && _space.getTopSpace().getBotEdge() > 0)
                _space.getTopSpace().setBotEdge(_type);
        } 
        if (_space.haveBotEdge() && _type > _space.getBotEdge()) {
            _space.setBotEdge(_type);
            if (_space.getBotSpace() && _space.getBotSpace().getTopEdge() > 0)
                _space.getBotSpace().setTopEdge(_type);
        }
        if (_space.haveLeftEdge() && _type > _space.getLeftEdge()) {
            _space.setLeftEdge(_type);
            if (_space.getLeftSpace() && _space.getLeftSpace().getRightEdge() > 0)
                _space.getLeftSpace().setRightEdge(_type);
        } 
        if (_space.haveRightEdge() && _type > _space.getRightEdge()) {
            _space.setRightEdge(_type);
            if (_space.getRightSpace() && _space.getRightSpace().getLeftEdge() > 0)
                _space.getRightSpace().setLeftEdge(_type);
        } 

        obs.AddBracketsObserver(_space, _points);

        g_id++;
    }

    //Undo
    this.undo = function () {
        d3.selectAll("[class='" + my_id + "']").remove();
        _space.setType(backup_type);
        _space.setEdges(backup_edges);
        if (_space.getTopSpace())
            _space.getTopSpace().setBotEdge(backup_edges.top);
        if (_space.getBotSpace())
            _space.getBotSpace().setTopEdge(backup_edges.bot);
        if (_space.getLeftSpace())
            _space.getLeftSpace().setRightEdge(backup_edges.left);
        if (_space.getRightSpace())
            _space.getRightSpace().setLeftEdge(backup_edges.right);
        obs.undoObserver();
        stg_level = 3;
        _ctrl.updateMessage(_svg, "StageLevelCounter", _ctrl.getStageMsg(3), "black", 20, 40);
        g_id--;
    }
}

function DrawStg4Command(_svg, _ctrl, _space, _points, _type) {
    var my_id = g_id;
    var backup_type = _space.getType();
    var backup_edges = { top: _space.getTopEdge(), bot: _space.getBotEdge(), left: _space.getLeftEdge(), right: _space.getRightEdge() };

    this.execute = function () {
        var adjust_x = _points.x, adjust_y = _points.y;
        if (_points.w < _points.h) adjust_x -= 10;
        else adjust_y -= 10;
        var rect = _svg.select("#path")
                    .append("rect")
					.attr("class", my_id)
					.attr("x", adjust_x)
					.attr("y", adjust_y)
					.attr("width", _points.w)
					.attr("height", _points.h)
					.attr("fill", "none")
					.attr("stroke", "black")
					.attr("stroke-width", 4)
					.style("opacity", 0)
					.transition()
					.duration(1000)
					.style("opacity", 1);
        
        //Set type
        setEdgesType(_space, _points, _type);

        obs.AddWallObserver({w: _points.w, h: _points.h, space: _space});

        g_id++;
    }

    //Undo
    this.undo = function () {
        d3.selectAll("[class='" + my_id + "']").remove();
        _space.setEdges(backup_edges);
        if (_space.getTopSpace())
            _space.getTopSpace().setBotEdge(backup_edges.top);
        if (_space.getBotSpace())
            _space.getBotSpace().setTopEdge(backup_edges.bot);
        if (_space.getLeftSpace())
            _space.getLeftSpace().setRightEdge(backup_edges.left);
        if (_space.getRightSpace())
            _space.getRightSpace().setLeftEdge(backup_edges.right);
        obs.undoObserver();
        stg_level = 4;
        _ctrl.updateMessage(_svg, "StageLevelCounter", _ctrl.getStageMsg(4), "black", 20, 40);
        g_id--;
    }
}

function DrawStg5Command(_svg, _ctrl, _space, _result, _lines, _type) {
    var my_id = g_id;
    var backup_type = _space.getType();
    var backup_edges = { top: _space.getTopEdge(), bot: _space.getBotEdge(), left: _space.getLeftEdge(), right: _space.getRightEdge() };

    this.execute = function () {

        var adjust_x = _result.x, adjust_y = _result.y;
        if (_result.w < _result.h) adjust_x -= _result.w / 2;
        else adjust_y -= _result.h / 2;
        drawRectwithLines(_svg, {x: adjust_x, y: adjust_y, w: _result.w, h: _result.h}, _lines, my_id);

        //Set type
        _space.setType(_type);
        setEdgesType(_space, _result, _type);

        obs.AddDoorandWindowObserver({ w: _result.w, h: _result.h, space: _space });

        g_id++;
    }

    //Undo
    this.undo = function () {
        d3.selectAll("[class='" + my_id + "']").remove();
        //Set type (back to its type before, or the next step would skip this door or window)
        _space.setType(backup_type);
        _space.setEdges(backup_edges);
        if (_space.getTopSpace())
            _space.getTopSpace().setBotEdge(backup_edges.top);
        if (_space.getBotSpace())
            _space.getBotSpace().setTopEdge(backup_edges.bot);
        if (_space.getLeftSpace())
            _space.getLeftSpace().setRightEdge(backup_edges.left);
        if (_space.getRightSpace())
            _space.getRightSpace().setLeftEdge(backup_edges.right);
        obs.undoObserver();
        stg_level = 5;
        _ctrl.updateMessage(_svg, "StageLevelCounter", _ctrl.getStageMsg(5), "black", 20, 40);

        g_id--;
    }
}

function DrawStg6Command(_svg, _ctrl, _space, _result, _lines, _type) {
    var my_id = g_id;
    var backup_type = _space.getType();

    this.execute = function () {
        
        var adjust_y = _result.y;
        if (_space.getY() < _ctrl.doGetMidLine().horizontal) adjust_y -= 50;
        drawRectwithLines(_svg, { x: _result.x, y: adjust_y, w: _result.w, h: _result.h }, _lines, my_id);

        //Set type
        _space.setType(_type);

        obs.AddStairObserver({ w: _result.w, h: _result.h, space: _space });

        g_id++;
    }

    //Undo
    this.undo = function () {
        d3.selectAll("[class='" + my_id + "']").remove();
        //Set type
        _space.setType(backup_type);
        obs.undoObserver();
        stg_level = 6;
        _ctrl.updateMessage(_svg, "StageLevelCounter", _ctrl.getStageMsg(6), "black", 20, 40);
        g_id--;
    }
}

function DrawStg7Command(_svg, _ctrl, _rule, _spaces) {
    var backup_type = _spaces[0][0].getType();

    this.execute = function () {
        obs.AddRoofObserver({ spaces: _spaces });
        //Set type
        _spaces[0][0].setType(_rule.name);
    }

    this.undo = function () {
        _spaces[0][0].setType(backup_type);
        obs.undoObserver();
        _ctrl.updateMessage(_svg, "StageLevelCounter", _ctrl.getStageMsg(7), "black", 20, 40);
      
    }
}

function drawRectwithLines(_svg, _result, _lines, _id) {
    var rect = _svg.select("#path")
                    .append("rect")
					.attr("class", _id)
					.attr("x", _result.x)
					.attr("y", _result.y)
					.attr("width", _result.w)
					.attr("height", _result.h)
					.attr("fill", "none")
					.attr("stroke", "black")
					.attr("stroke-width", 4)
					.style("opacity", 0)
					.transition()
					.duration(1000)
					.style("opacity", 1);

    for (var i = 0; i < _lines.length; i++) {
        var line = _svg.select("#path")
                    .append("line")
                    .attr("class", _id)
                    .attr("x1", _lines[i].x1)
                    .attr("y1", _lines[i].y1)
                    .attr("x2", _lines[i].x2)
                    .attr("y2", _lines[i].y2)
                    .attr("stroke", "black")
                    .attr("stroke-width", 4)
                    .style("opacity", 0)
                    .transition()
                    .duration(1000)
                    .style("opacity", 1);
    }
}

function ViewLineCommand(_svg, _data, _stage) {
    var data = _data;
    this.execute = function () {
        var x_offset = y_offset = 30;
        var lineFuc = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate("linear");

        var line_graph = _svg.select("#rect")
                        .append("path")
                        .attr("class", "preview")
                        .attr("d", lineFuc(data))
                        .attr("stroke", data[0].color)
                        .attr("stroke-width", 1)
                        .attr("fill", "white")
                        .style("opacity", 0)
                        .on("click", function (d) { _stage.draw(_svg, _cmd_mgr, _data) });

        var text = _svg.select("#text")
                       .append("text")
                       .attr("class", "preview")
                       .attr("x", data[0].x + x_offset)
                       .attr("y", data[0].y + y_offset)
                       .attr("font-family", "sans-serif")
                       .attr("font-size", "14")
                       .attr("fill", data[0].color)
                       .text("Rule" + data[0].id)
                       .on("click", function (d) { _stage.draw(_svg, _cmd_mgr, _data) });
    }
}

function DashLineCommand(_svg, _data) {
    this.execute = function () {
        var lineFuc = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate("linear");

        var line_graph = _svg.select("#rect").append("path")
                        .attr("class", "LayoutMapHints")
                        .attr("d", lineFuc(_data))
                        .attr("stroke", "#444")
                        .attr("stroke-width", 1)
                        .attr("stroke-dasharray", "20, 10")
                        .attr("fill", "white")
                        
    }

    //Undo
    this.undo = function () {
        d3.selectAll("[class='LayoutMapHints']").remove();
    }

}

function PreviewCommand(_ctrl, _svg, _cmd_mgr, _rule, _space, _stg_level)
{
    var func = new PreviewFunction();
    this.execute = function () {
        switch (_stg_level) {
            case 1:
                func.previewL1(_ctrl, _svg, _cmd_mgr, _rule, _space);
                break;
            case 2:
                func.previewL2(_ctrl, _svg, _cmd_mgr, _rule, _space);
                break;
            case 3:
                func.previewL3(_ctrl, _svg, _cmd_mgr, _rule, _space);
                break;
            case 4:
                func.previewL4(_ctrl, _svg, _cmd_mgr, _rule, _space);
                break;
            case 5:
                func.previewL5(_ctrl, _svg, _cmd_mgr, _rule, _space);
                break;
            case 6:
                func.previewL6(_ctrl, _svg, _cmd_mgr, _rule, _space);
                break;
            case 7:
                func.previewL7(_ctrl, _svg, _cmd_mgr, _rule, _space);
        }
    }
}

function VerifiedCommand(_ctrl, _svg, _cmd_mgr, _results, _stg_level) {
    var func = new VerifiedFunction();
    this.execute = function () {
        switch (_stg_level) {
            case 1:
                func.verifiedL1(_ctrl, _svg, _cmd_mgr, _results);
                break;
            case 2:
                func.verifiedL2(_ctrl, _svg, _cmd_mgr, _results);
                break;
            case 3:
                func.verifiedL3(_ctrl, _svg, _cmd_mgr, _results);
                break;
            case 4:
                func.verifiedL4(_ctrl, _svg, _cmd_mgr, _results);
                break;
            case 5:
                func.verifiedL5(_ctrl, _svg, _cmd_mgr, _results);
                break;
            case 6:
                func.verifiedL6(_ctrl, _svg, _cmd_mgr, _results);
                break;
            case 7:
                func.verifiedL7(_ctrl, _svg, _cmd_mgr, _results.name, _results.spaces[0]);
        }
    }
}

function AutoGenerateCommand(_ctrl, _svg, _cmd_mgr, _rule, _space, _stg_level) {
    var func = new AutoGenerateFunction();
    this.execute = function () {
        switch (_stg_level) {
            case 1:
                func.autoGenerateL1(_ctrl, _svg, _cmd_mgr, _rule, _space);
                break;
            case 2:
                func.autoGenerateL2(_ctrl, _svg, _cmd_mgr, _rule, _space);
                break;
            case 3:
                func.autoGenerateL3(_ctrl, _svg, _cmd_mgr, _rule, _space);
                break;
            case 4:
                func.autoGenerateL4(_ctrl, _svg, _cmd_mgr, _rule, _space);
                break;
            case 5:
                func.autoGenerateL5(_ctrl, _svg, _cmd_mgr, _rule, _space);
                break;
            case 6:
                func.autoGenerateL6(_ctrl, _svg, _cmd_mgr, _rule, _space);
                break;
            case 7:
                func.autoGenerateL7(_ctrl, _svg, _cmd_mgr, _rule, _space);
        }
    }
}

function CircleCommand(_svg, _data) {
    var data = _data;			//[{CircleDataObject}, {CircleDataObject}, ...]
    var my_id = g_id;

    //Execute
    this.execute = function () {
        var circles = _svg.select("#dot").selectAll(".dot")
						.data(data).enter()
						.append("circle")
						.attr("class", my_id);

        var circleAttributes = circles.attr("cx", function (d) { return d.x; })
									.attr("cy", function (d) { return d.y; })
									.attr("r", 7)
									.style("fill", "black")
									.style("opacity", 0)
									.transition()
									.duration(1000)
									.style("opacity", 1);
        g_id++;
    }

    //Undo
    this.undo = function () {
        d3.selectAll("[class='" + my_id + "']").remove();
        g_id--;
    }
}

function DrawMapCommand(_svg, _map) {
    var dash_cmds = [];
    var obs = new Observer();
    
    this.execute = function () {
        var dash_cmd;
        obs.initBondsObserver(_map[0][0].isSideCorridor(), _map.length, _map[0].length);


        for (var i = 0; i < _map.length; i++) {
            for (var j = 0; j < _map[0].length; j++) {
                var infos = [];
                var info = {};
                info.x = _map[i][j].getX();
                info.y = _map[i][j].getY();
                infos.push(info);

                info = {};
                info.x = _map[i][j].getX() + _map[i][j].getWidth();
                info.y = _map[i][j].getY();
                infos.push(info);

                info = {};
                info.x = _map[i][j].getX() + _map[i][j].getWidth();
                info.y = _map[i][j].getY() + _map[i][j].getHeight();
                infos.push(info);

                info = {};
                info.x = _map[i][j].getX();
                info.y = _map[i][j].getY() + _map[i][j].getHeight();
                infos.push(info);

                info = {};
                info.x = _map[i][j].getX();
                info.y = _map[i][j].getY();
                infos.push(info);

                dash_cmd = new DashLineCommand(_svg, infos);
                dash_cmd.execute();
                obs.gridObserver(infos);

                dash_cmds.push(dash_cmd);
            }
        }
        dash_cmd = null;
        delete dash_cmd;

        
    }

    this.undo = function () {
        for (var i = 0; i < dash_cmds.length; i++)
            dash_cmds.undo();
    }
}

function CancelDotCommand(_data) {
    var data = _data;
    this.execute = function () {
        for (var i = 0; i < _data.length; i++) {
            var circle = _data[i].transition()
								.duration(1000)
								.style("opacity", 0);
        }
    }

    this.undo = function () {
        for (var i = 0; i < _data.length; i++) {
            var circle = _data[i].transition()
								.duration(1000)
								.style("opacity", 1);
        }
    }
}

function setEdgesType(_space, _result, _type) {
    if (_result.w < _result.h) {
        if (_result.x == _space.getX()){
            _space.setLeftEdge(_type);
            if(_space.getLeftSpace())
                _space.getLeftSpace().setRightEdge(_type);
        }
        else if (_result.x == _space.getX() + _space.getWidth()) {
            _space.setRightEdge(_type);
            if (_space.getRightSpace())
                _space.getRightSpace().setLeftEdge(_type);
        }
            
    }else{
        if (_result.y == _space.getY()) {
            _space.setTopEdge(_type);
            if (_space.getTopSpace())
                _space.getTopSpace().setBotEdge(_type);
        }
            
        else if (_result.y == _space.getY() + _space.getHeight()) {
            _space.setBotEdge(_type);
            if (_space.getBotSpace())
                _space.getBotSpace().setTopEdge(_type);
        }
    }
}