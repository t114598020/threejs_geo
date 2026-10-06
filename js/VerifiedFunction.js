var pre_id = 0;
function VerifiedFunction() {
    this.verifiedL1 = function (_ctrl, _svg, _cmd_mgr, _result) {
        var result = _result;
        var x_offset = y_offset = 30;
        var my_id = pre_id;
        var name = _result[0].name;

        for (var i = 0; i < _result.length; i++) {
            //Draw hint of rectangle
            var space = _result[i].space;

            var rect = _svg.select("#path")
                        .append("rect")
                        .attr("id", my_id)
                        .attr("class", "preview")
                        .attr("x", space.getX())
                        .attr("y", space.getY())
                        .attr("width", space.getWidth())
                        .attr("height", space.getHeight())
                        .attr("fill", "white")
                        .attr("stroke", _result[i].color)
                        .attr("stroke-width", 1);


            //Text overload check
            var x_pos = space.getX();
            var y_pos = space.getY();
            d3.select("#space").select("#rect")
                            .selectAll("[class='preview']")
                            .each(function (d, i) {
                                var temp_x = parseInt(d3.select(this).attr("x"));
                                var temp_y = parseInt(d3.select(this).attr("y"));
                                if (temp_y == y_pos && temp_x == x_pos) {
                                    y_offset += 15;
                                }
                            });


            //Draw hint of rule
            var text = _svg.select("#text")
                        .append("text")
                        .attr("id", my_id)
                        .attr("class", "preview")
                        .attr("x", space.getX() + x_offset)
                        .attr("y", space.getY() + y_offset)
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "14")
                        .attr("fill", _result[i].color)
                        .text("Rule" + name);

        }
     
        setTimeout(function () { drawL1(_ctrl, _svg, _cmd_mgr, _result, name); }, model_generate_speed);

        pre_id++;
    }

    this.verifiedL2 = function (_ctrl, _svg, _cmd_mgr, _result) {
        var x_offset = 30;
        var y_offset = 30;
        var my_id = pre_id;

        var name = _result[0].name;
        var color = _result[0].color;

        var head = inOrgPosition(_result);
        var line_data = calPath(_result, head);

        var lineFunction = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate("linear");

        var lineGraph_t = _svg.select("#path")
                        .append("path")
                        .attr("id", my_id)
                        .attr("class", "preview")
                        .attr("d", lineFunction(line_data))
                        .attr("stroke", color)
                        .attr("stroke-width", 1)
                        .attr("fill", "white");
                       

        //Text overload check
        var x_pos = head.getX() + x_offset;
        var y_pos = head.getY() + y_offset;
        d3.select("#space").select("#text")
                        .selectAll("[class='preview']")
                        .each(function (d, i) {
                            var temp_x = parseInt(d3.select(this).attr("x"));
                            var temp_y = parseInt(d3.select(this).attr("y"));
                            //console.log("head x:" + x_pos + ",y:" + y_pos + ",temp x:" + temp_x + ",y:" + temp_y);
                            if (temp_y == y_pos && temp_x == x_pos) {
                                y_offset += 15;
                                y_pos = head.getY() + y_offset;
                            }
                        });

        //Draw hint of rule
        var text = _svg.select("#text")
                    .append("text")
                    .attr("id", my_id)
                    .attr("class", "preview")
                    .attr("x", head.getX() + x_offset)
                    .attr("y", head.getY() + y_offset)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "14")
                    .attr("fill", color)
                    .text("Rule" + name);

        setTimeout(function () { drawL2(_ctrl, _svg, _cmd_mgr, line_data, _result, name); }, model_generate_speed);

        pre_id++;
    }

    this.verifiedL3 = function (_ctrl, _svg, _cmd_mgr, _result) {
        var x_offset = 30;
        var y_offset = 30;
        var my_id = pre_id;

        var name = _result[0].name;
        var color = _result[0].color;
        var space = _result[0].space;
        var mid_lind = _ctrl.doGetMidLine();
        var line_data = calPath(_result, space);

        var lineFunction = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate("linear");

        var lineGraph_t = _svg.select("#path")
                        .append("path")
                        .attr("id", my_id)
                        .attr("class", "preview")
                        .attr("d", lineFunction(line_data))
                        .attr("stroke", color)
                        .attr("stroke-width", 1)
                        .attr("fill", "white");

        for (var i = 0; i < _result.length; i++) {
            var adjust_x = _result[i].x, adjust_y = _result[i].y;
            if (_result[i].y > space.getY() && _result[i].y < space.getY() + space.getHeight()) {
                if (_result[i].x < mid_lind.virtical) adjust_x -= 16;
                else adjust_x += 7;
            } else {
                adjust_x -= 6;
                adjust_y -= 5
            }
            var v_texts = _svg.select("#path")
                        .append("text")
                        .attr("id", my_id)
                        .attr("class", "preview")
                        .attr("x", adjust_x)
                        .attr("y", adjust_y)
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "20")
                        .attr("fill", color)
                        .text("V");
        }


        //Text overload check
        var x_pos = space.getX() + x_offset;
        var y_pos = space.getY() + y_offset;
        d3.select("#space").select("#text")
                        .selectAll("[class='preview']")
                        .each(function (d, i) {
                            var temp_x = parseInt(d3.select(this).attr("x"));
                            var temp_y = parseInt(d3.select(this).attr("y"));
                            //console.log("head x:" + x_pos + ",y:" + y_pos + ",temp x:" + temp_x + ",y:" + temp_y);
                            if (temp_y == y_pos && temp_x == x_pos) {
                                y_offset += 15;
                                y_pos = space.getY() + y_offset;
                            }
                        });

        //Draw hint of rule
        var text = _svg.select("#text")
                    .append("text")
                    .attr("id", my_id)
                    .attr("class", "preview")
                    .attr("x", space.getX() + x_offset)
                    .attr("y", space.getY() + y_offset)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "14")
                    .attr("fill", color)
                    .text("Rule" + name);

        setTimeout(function () { drawL3(_ctrl, _svg, _cmd_mgr, _result, name); }, model_generate_speed);

        pre_id++;
    }

    this.verifiedL4 = function (_ctrl, _svg, _cmd_mgr, _result) {
        var x_offset = 30;
        var y_offset = 30;
        var my_id = pre_id;

        var name = _result[0].name;
        var color = _result[0].color;
        var space = _result[0].space;

        var adjust_x = _result[0].x, adjust_y = _result[0].y;
        if (_result[0].w < _result[0].h) adjust_x -= 10;
        else adjust_y -= 10;
        var rect = _svg.select("#path")
				        .append("rect")
				        .attr("id", my_id)
				        .attr("class", "preview")
				        .attr("x", adjust_x)
				        .attr("y", adjust_y)
				        .attr("width", _result[0].w)
				        .attr("height", _result[0].h)
				        .attr("fill", "white")
				        .attr("stroke", color)
				        .attr("stroke-width", 5);


        //Text overload check
        var x_pos = space.getX() + x_offset;
        var y_pos = space.getY() + y_offset;
        d3.select("#space").select("#text")
                        .selectAll("[class='preview']")
                        .each(function (d, i) {
                            var temp_x = parseInt(d3.select(this).attr("x"));
                            var temp_y = parseInt(d3.select(this).attr("y"));
                            //console.log("head x:" + x_pos + ",y:" + y_pos + ",temp x:" + temp_x + ",y:" + temp_y);
                            if (temp_y == y_pos && temp_x == x_pos) {
                                y_offset += 15;
                                y_pos = space.getY() + y_offset;
                            }
                        });

        //Draw hint of rule
        var text = _svg.select("#text")
                    .append("text")
                    .attr("id", my_id)
                    .attr("class", "preview")
                    .attr("x", space.getX() + x_offset)
                    .attr("y", space.getY() + y_offset)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "14")
                    .attr("fill", color)
                    .text("Rule" + name);

        setTimeout(function () { drawL4(_ctrl, _svg, _cmd_mgr, _result, name); }, model_generate_speed);

        pre_id++;
    }

    this.verifiedL5 = function (_ctrl, _svg, _cmd_mgr, _result) {
        var x_offset = 30;
        var y_offset = 30;
        var my_id = pre_id;

        var name = _result[0].name;
        var color = _result[0].color;
        var space = _result[0].space;

        var adjust_x = _result[0].x, adjust_y = _result[0].y;
        if (_result[0].w < _result[0].h) adjust_x -= _result[0].w / 2;
        else adjust_y -= _result[0].h / 2;
        var lines = getLines({ w: _result[0].w, h: _result[0].h, x: adjust_x, y: adjust_y }, 3);

        var rect = _svg.select("#path")
                        .append("rect")
                        .attr("id", my_id)
                        .attr("class", "preview")
                        .attr("x", adjust_x)
                        .attr("y", adjust_y)
                        .attr("width", _result[0].w)
                        .attr("height", _result[0].h)
                        .attr("fill", "white")
                        .attr("stroke", color)
                        .attr("stroke-width", 5);


        for (var i = 0; i < lines.length; i++) {
            var line = _svg.select("#path")
                        .append("line")
                        .attr("id", my_id)
                        .attr("class", "preview")
                        .attr("x1", lines[i].x1)
                        .attr("y1", lines[i].y1)
                        .attr("x2", lines[i].x2)
                        .attr("y2", lines[i].y2)
                        .attr("stroke", color)
                        .attr("stroke-width", 5);
        }


        //Text overload check
        var x_pos = space.getX() + x_offset;
        var y_pos = space.getY() + y_offset;
        d3.select("#space").select("#text")
                        .selectAll("[class='preview']")
                        .each(function (d, i) {
                            var temp_x = parseInt(d3.select(this).attr("x"));
                            var temp_y = parseInt(d3.select(this).attr("y"));
                            //console.log("head x:" + x_pos + ",y:" + y_pos + ",temp x:" + temp_x + ",y:" + temp_y);
                            if (temp_y == y_pos && temp_x == x_pos) {
                                y_offset += 15;
                                y_pos = space.getY() + y_offset;
                            }
                        });

        //Draw hint of rule
        var text = _svg.select("#text")
                    .append("text")
                    .attr("id", my_id)
                    .attr("class", "preview")
                    .attr("x", space.getX() + x_offset)
                    .attr("y", space.getY() + y_offset)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "14")
                    .attr("fill", color)
                    .text("Rule" + name);

        setTimeout(function () { drawL5(_ctrl, _svg, _cmd_mgr, _result, lines, name); }, model_generate_speed);

        pre_id++;
    }

    this.verifiedL6 = function (_ctrl, _svg, _cmd_mgr, _result) {
        var x_offset = 30;
        var y_offset = 30;
        var my_id = pre_id;

        var name = _result[0].name;
        var color = _result[0].color;
        var space = _result[0].space;
        var adjust_y = _result[0].y;
        if (space.getY() < _ctrl.doGetMidLine().horizontal) adjust_y -= 50;
        var lines = getStairLines({ w: _result[0].w, h: _result[0].h, x: _result[0].x, y: adjust_y }, 2);

        var rect = _svg.select("#path")
                        .append("rect")
                        .attr("id", my_id)
                        .attr("class", "preview")
                        .attr("x", _result[0].x)
                        .attr("y", adjust_y)
                        .attr("width", _result[0].w)
                        .attr("height", _result[0].h)
                        .attr("fill", "white")
                        .attr("stroke", color)
                        .attr("stroke-width", 5);


        for (var i = 0; i < lines.length; i++) {
            var line = _svg.select("#path")
                        .append("line")
                        .attr("id", my_id)
                        .attr("class", "preview")
                        .attr("x1", lines[i].x1)
                        .attr("y1", lines[i].y1)
                        .attr("x2", lines[i].x2)
                        .attr("y2", lines[i].y2)
                        .attr("stroke", color)
                        .attr("stroke-width", 5);
        }


        //Text overload check
        var x_pos = space.getX() + x_offset;
        var y_pos = space.getY() + y_offset;
        d3.select("#space").select("#text")
                        .selectAll("[class='preview']")
                        .each(function (d, i) {
                            var temp_x = parseInt(d3.select(this).attr("x"));
                            var temp_y = parseInt(d3.select(this).attr("y"));
                            //console.log("head x:" + x_pos + ",y:" + y_pos + ",temp x:" + temp_x + ",y:" + temp_y);
                            if (temp_y == y_pos && temp_x == x_pos) {
                                y_offset += 15;
                                y_pos = space.getY() + y_offset;
                            }
                        });

        //Draw hint of rule
        var text = _svg.select("#text")
                    .append("text")
                    .attr("id", my_id)
                    .attr("class", "preview")
                    .attr("x", space.getX() + x_offset)
                    .attr("y", space.getY() + y_offset)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "14")
                    .attr("fill", color)
                    .text("Rule" + name);

        setTimeout(function () { drawL6(_ctrl, _svg, _cmd_mgr, _result, lines, name); }, model_generate_speed);

        pre_id++;
    }

    this.verifiedL7 = function (_ctrl, _svg, _cmd_mgr, _rule, _spaces) {

        _cmd_mgr.execute(new DrawStg7Command(_svg, _ctrl, _rule, _spaces));

        d3.selectAll("[class='preview']").remove();
    }
}

function drawL1(_ctrl, _svg, _cmd_mgr, _spaces, _type) {
    //Calculate dot
    var spaces = _spaces;
    var dots = [];
    var lines = [];
    var backup_spaces = [];
    var dots_arr = [];
    var lines_arr = [];
    var coor = {};
    for (var i = 0; i < _spaces.length; i++) {
        dots = [];      // every space gets its own corners and outline
        lines = [];
        var space = _spaces[i].space;

        coor = { x: space.getX(), y: space.getY() };
        dots.push(coor);
        lines.push(coor);

        coor = {
            x: space.getX() + space.getWidth(), y: space.getY()
        };
        dots.push(coor);
        lines.push(coor);

        coor = { x: space.getX() + space.getWidth(), y: space.getY() + space.getHeight() };
        dots.push(coor);
        lines.push(coor);

        coor = { x: space.getX(), y: space.getY() + space.getHeight() };
        dots.push(coor);
        lines.push(coor);

        coor = { x: space.getX(), y: space.getY() };
        lines.push(coor);

        //Backup
        backup_spaces.push(space);
        dots_arr.push(dots);
        lines_arr.push(lines);
    }

    _cmd_mgr.execute(new DrawStg1Command(_svg, _ctrl, backup_spaces, lines_arr, dots_arr, _type));

    d3.selectAll("[class='preview']").remove();

    if (_ctrl.isBatchType()) {
        _ctrl.doAnalyze();
    }

}

function drawL2(_ctrl, _svg, _cmd_mgr, _line_data, _spaces, _type) {
    //Calculate edges
    var spaces = _spaces;
    var cel_dots, cel_coors;
    var backup_spaces = [];
    //var bounds = findBounds(_line_data);

    for (var i = 0; i < _spaces.length; i++) {
        var space = _spaces[i].space;

        for (var j = 0; j < _spaces.length; j++) {
            if (space.getTopSpace() == _spaces[j].space) {
                space.setTopEdge(0);
                _spaces[j].space.setBotEdge(0);
            } else if (space.getRightSpace() == _spaces[j].space) {
                space.setRightEdge(0);
                _spaces[j].space.setLeftEdge(0);
            } else if (space.getBotSpace() == _spaces[j].space) {
                space.setBotEdge(0);
                _spaces[j].space.setTopEdge(0);
            } else if (space.getLeftSpace() == _spaces[j].space) {
                space.setLeftEdge(0);
                _spaces[j].space.setRightEdge(0);
            }
        }

        //Backup
        backup_spaces.push(space);
    }
    cel_coors = calCelCoordinates(backup_spaces);
    cel_dots = getCanceDots(cel_coors);

    _cmd_mgr.execute(new DrawStg2Command(_svg, _ctrl, backup_spaces, _line_data, cel_dots, cel_coors, _type));

    d3.selectAll("[class='preview']").remove();

    if (_ctrl.isBatchType()) {
        _ctrl.doAnalyze();
    }

}

function drawL3(_ctrl, _svg, _cmd_mgr, _result, _type) {

    var space = _result[0].space;                   //Backup
    var points = [];

    for (var i = 0; i < _result.length; i++) {
        var point = { x: _result[i].x, y: _result[i].y };
        points.push(point);
    }

    _cmd_mgr.execute(new DrawStg3Command(_svg, _ctrl, space, points, _type));

    d3.selectAll("[class='preview']").remove();

    if (_ctrl.isBatchType()) {
        _ctrl.doAnalyze();
    }
}

function drawL4(_ctrl, _svg, _cmd_mgr, _result, _type) {
    var space = _result[0].space;                   //Backup

    _cmd_mgr.execute(new DrawStg4Command(_svg, _ctrl, space, _result[0], _type));

    d3.selectAll("[class='preview']").remove();

    if (_ctrl.isBatchType()) {
        _ctrl.doAnalyze();
    }
}

function drawL5(_ctrl, _svg, _cmd_mgr, _result, _lines, _type) {
    var space = _result[0].space;                   //Backup

    _cmd_mgr.execute(new DrawStg5Command(_svg, _ctrl, space, _result[0], _lines, _type));

    d3.selectAll("[class='preview']").remove();

    if (_ctrl.isBatchType()) {
        _ctrl.doAnalyze();
    }
}

function drawL6(_ctrl, _svg, _cmd_mgr, _result, _lines, _type) {
    var space = _result[0].space;                   //Backup

    _cmd_mgr.execute(new DrawStg6Command(_svg, _ctrl, space, _result[0], _lines, _type));

    d3.selectAll("[class='preview']").remove();

    if (_ctrl.isBatchType()) {
        _ctrl.doAnalyze();
    }
}

function clearPreview() {
    d3.selectAll("[class='preview']").remove();
    pre_id = 0;
}

//counterclockwise go
function calPath(_results, _walker) {
    var walker = _walker;
    var tra_x = walker.getX();
    var tra_y = walker.getY();
    var pathes = [];
    var path = { x: tra_x, y: tra_y };
    pathes.push(path);


    //Right
    while (spaceInPath(walker.getBotSpace(), _results)) {
        walker = walker.getBotSpace();
    }
    tra_y = walker.getY() + walker.getHeight();
    path = { x: tra_x, y: tra_y };
    pathes.push(path);

    while (spaceInPath(walker.getRightSpace(), _results)) {
        walker = walker.getRightSpace();
    }
    tra_x = walker.getX() + walker.getWidth();
    path = { x: tra_x, y: tra_y };
    pathes.push(path);

    while (spaceInPath(walker.getTopSpace(), _results)) {
        walker = walker.getTopSpace();
    }
    tra_y = walker.getY();
    path = { x: tra_x, y: tra_y };
    pathes.push(path);

    //Left
    while (spaceInPath(walker.getLeftSpace(), _results)) {
        walker = walker.getLeftSpace();
    }
    tra_x = walker.getX();
    path = { x: tra_x, y: tra_y };
    pathes.push(path);

    //Polygon shape
    if (tra_x > pathes[0].x || tra_y > pathes[0].y) {

        while (spaceInPath(walker.getBotSpace(), _results)) {
            walker = walker.getBotSpace();
        }
        tra_y = walker.getY();
        path = { x: tra_x, y: tra_y };
        pathes.push(path);

        while (spaceInPath(walker.getLeftSpace(), _results)) {
            walker = walker.getLeftSpace();
        }
        tra_x = walker.getX() + walker.getWidth();
        path = { x: tra_x, y: tra_y };
        pathes.push(path);

        //go top
        while (spaceInPath(walker.getTopSpace(), _results)) {
            walker = walker.getTopSpace();
        }
        tra_y = walker.getY();
        path = { x: tra_x, y: tra_y };
        pathes.push(path);

        //go left
        path = { x: pathes[0].x, y: pathes[0].y };
        pathes.push(path);
    }

    return pathes;
}

function spaceInPath(_space, _spaces) {
    if (_space) {
        for (var i = 0; i < _spaces.length; i++) {
            if (_space == _spaces[i].space)
                return true;
        }
    }
    return false;
}

function inOrgPosition(_spaces) {
    var org_position = _spaces[0].space;
    for (var i = 0; i < _spaces.length; i++) {
        if (_spaces[i].space.getX() < org_position.getX() && _spaces[i].space.getY() < org_position.getY())
            org_position = _spaces[i].space;
    }
    return org_position;
}

function calCelCoordinates(_spaces) {
    cel_coors = [];
    for (var i = 0; i < _spaces.length; i++) {
        if (_spaces[i].getRightEdge() == 0 && _spaces[i].getBotEdge() == 0) {
            cel_coors.push({ x: _spaces[i].getX() + _spaces[i].getWidth(), y: _spaces[i].getY() + _spaces[i].getHeight() });
        }
    }
    return cel_coors;
}

function getCanceDots(_cel_dots) {
    var match = [];
    d3.selectAll("circle").each(function (d, i) {
        for (var i = 0; i < _cel_dots.length; i++) {
            if (d.x == _cel_dots[i].x && d.y == _cel_dots[i].y) {
                match.push(d3.select(this));
            }
        }
    });
    return match;
}

function getLines(_result, line_num) {
    var lines = [];
    var line = {};

    if (_result.w < _result.h) {
        var dist = _result.h / (line_num + 1);
        for (var i = 0; i < line_num; i++) {
            line.x1 = _result.x;
            line.y1 = _result.y + dist * (i + 1);
            line.x2 = line.x1 + _result.w;
            line.y2 = line.y1;
            lines.push(line);
            line = {};
        }
        return lines;
    }
    var dist = _result.w / (line_num + 1);
    for (var i = 0; i < line_num; i++) {
        line.x1 = _result.x + dist * (i + 1);
        line.y1 = _result.y;
        line.x2 = line.x1;
        line.y2 = line.y1 + _result.h;
        lines.push(line);
        line = {};
    }
    return lines;

}

function getStairLines(_result, line_num) {
    var lines = [];
    var line = {};

    var dist = _result.h / (line_num + 1);
    for (var i = 0; i < line_num; i++) {
        line.x1 = _result.x;
        line.y1 = _result.y + dist * (i + 1);
        line.x2 = line.x1 + _result.w;
        line.y2 = line.y1;
        lines.push(line);
        line = {};
    }
    return lines;
}