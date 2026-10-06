function Rule(_name)
{
	this.name = _name;
    this.color = Colors.random();
}

Rule.prototype.getName = function(){return this.name;}
Rule.prototype.match = function (){}

//
//Stage 1 
//
function Rule1(){
    Rule.call(this, 1);
}

Rule1.prototype.match = function(_map){
	var tra_pos_y = 0;
	var tra_pos_x = Math.round(_map.length / 2) - 1;

	var rule = { name: this.name, color: this.color.rgb };

	if (_map[tra_pos_x][tra_pos_y].isSideCorridor())
		tra_pos_y++;

	var spaces = [];
	var couple_space = [];
	if(_map[tra_pos_x][tra_pos_y].getType() == 0){
	    couple_space.push(_map[tra_pos_x][tra_pos_y]);
	    spaces.push(couple_space);
	    rule.spaces = spaces;
	    return rule;
	}
	return null;
}

function Rule2() {
    Rule.call(this, 2);
}

Rule2.prototype.match = function (_map) {
    var tra_pos_y = 0;
    var tra_pos_x = Math.round(_map.length / 2) - 1;

    if (_map[tra_pos_x][tra_pos_y].isSideCorridor())
        tra_pos_y++;

    var rule = { name: this.name, color: this.color.rgb };

    var spaces = [];
    var couple_space = [];

    if (_map[tra_pos_x][tra_pos_y].getType() == 1) {
        var bot = _map[tra_pos_x][tra_pos_y].getBotSpace();
        while (bot.getType() != 0 && !bot.isSideCorridor()) {
            bot = bot.getBotSpace();
            if (!bot)
                return null;
        }
        if (bot.getType() == 0 && !bot.isSideCorridor()) {
            couple_space.push(bot);
            spaces.push(couple_space);
            rule.spaces = spaces;
            return rule;
        }
    }
    return null;
}

function Rule3() {
    Rule.call(this, 3);
}

Rule3.prototype.match = function (_map) {
    var tra_pos_y = 0;
    var tra_pos_x = Math.round(_map.length / 2) - 1;

    if (_map[tra_pos_x][tra_pos_y].isSideCorridor())
        tra_pos_y++;

    var rule = { name: this.name, color: this.color.rgb };

    var spaces = [];
    var couple_space = [];

    if (_map[tra_pos_x][tra_pos_y].getType() == 1) {
        var left = _map[tra_pos_x][tra_pos_y].getLeftSpace();
        var right = _map[tra_pos_x][tra_pos_y].getRightSpace();
        //Analyze to left
        while(left.getType() > 0 && left.getType() <= 3) {
            left = left.getLeftSpace();
            if (!left || left.isSideCorridor())
                return null;
        }
        if (left.getType() == 0) {
            couple_space.push(left);
        }

        //Analyze to right
        while (right.getType() > 0 && right.getType() <= 3) {
            right = right.getRightSpace();
            if (!right || right.isSideCorridor())
                return null;
        }
        if (right.getType() == 0) {
            couple_space.push(right);
        }

        spaces.push(couple_space);
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule4() {
    Rule.call(this, 4);
}

Rule4.prototype.match = function (_map) {
    var end_point_x =  Math.round(_map.length / 2);
    var tra_pos_y = 0;
    if (_map[0][0].isSideCorridor())
        tra_pos_y++;

    var rule = { name: this.name, color: this.color.rgb };

    var spaces = [];

    for (var i = 0; i < end_point_x; i++) {
        for (var j = tra_pos_y + 1; j < _map[0].length; j++) {
            if (_map[i][j].getType() > 0) continue;
            if (_map[i][j].getRightSpace().getType() > 0 && _map[i][j].getTopSpace().getType() > 0) {
                if (_map[i][j].getRightSpace().getTopSpace().getType() > 0) {
                    if (!_map[i][j].isSideCorridor()) {
                        spaces.push([_map[i][j]]);
                    }
                }
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule5() {
    Rule.call(this, 5);
}

Rule5.prototype.match = function (_map) {
    var start_point_x = Math.round(_map.length / 2);
    var tra_pos_y = 0;
    if (_map[0][0].isSideCorridor())
        tra_pos_y++;

    var rule = { name: this.name, color: this.color.rgb };

    var spaces = [];

    for (var i = start_point_x; i < _map.length; i++) {
        for (var j = tra_pos_y + 1; j < _map[0].length; j++) {
            if (_map[i][j].getType() > 0) continue;
            if (_map[i][j].getLeftSpace().getType() > 0 && _map[i][j].getTopSpace().getType() > 0) {
                if (_map[i][j].getLeftSpace().getTopSpace().getType() > 0) {
                    if (!_map[i][j].isSideCorridor()) {
                        spaces.push([_map[i][j]]);
                    }
                }
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule6() {
    Rule.call(this, 6);
}

Rule6.prototype.match = function (_map) {
    
    var rule = { name: this.name, color: this.color.rgb };

    var spaces = [];

    for (var i = 0; i < _map.length; i++) {
        for (var j = 0; j < _map[0].length; j++) {
            if (!_map[i][j].isSideCorridor()) continue;
            if (_map[i][j].getWidth() != _map[i][j].getHeight()) {
                if (_map[i][j].getType() == 0) {
                    if (_map[i][j].getBotSpace() && _map[i][j].getBotSpace().getType() > 0) {
                        if (!_map[i][j].getBotSpace().isSideCorridor()) {
                            spaces.push([_map[i][j]]);
                        }
                    }
                    if (_map[i][j].getTopSpace() && _map[i][j].getTopSpace().getType() > 0) {
                        if (!_map[i][j].getTopSpace().isSideCorridor()) {
                            spaces.push([_map[i][j]]);
                        }
                    }
                    if (_map[i][j].getRightSpace() && _map[i][j].getRightSpace().getType() > 0) {
                        if (!_map[i][j].getRightSpace().isSideCorridor()) {
                            spaces.push([_map[i][j]]);
                        }
                    }
                    if (_map[i][j].getLeftSpace() && _map[i][j].getLeftSpace().getType() > 0) {
                        if (!_map[i][j].getLeftSpace().isSideCorridor()) {
                            spaces.push([_map[i][j]]);
                        }
                    }
                } 
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule7() {
    Rule.call(this, 7);
}

Rule7.prototype.match = function (_map) {
    
    var rule = { name: this.name, color: this.color.rgb };

    var spaces = [];

    if (_map[0][0].getType() == 0) {
        if (_map[0][0].getRightSpace().getType() == 6 && _map[0][0].getBotSpace().getType() == 6) {
            spaces.push([_map[0][0]]);
        }
    }
    if (_map[_map.length - 1][0].getType() == 0) {
        if (_map[_map.length - 1][0].getLeftSpace().getType() == 6 && _map[_map.length - 1][0].getBotSpace().getType() == 6) {
            spaces.push([_map[_map.length - 1][0]]);
        }
    }
    if (_map[_map.length - 1][_map[0].length - 1].getType() == 0) {
        if (_map[_map.length - 1][_map[0].length - 1].getLeftSpace().getType() == 6 && _map[_map.length - 1][_map[0].length - 1].getTopSpace().getType() == 6) {
            spaces.push([_map[_map.length - 1][_map[0].length - 1]]);
        }
    }
    if (_map[0][_map[0].length - 1].getType() == 0) {
        if (_map[0][_map[0].length - 1].getRightSpace().getType() == 6 && _map[0][_map[0].length - 1].getTopSpace().getType() == 6) {
            spaces.push([_map[0][_map[0].length - 1]]);
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

//
//Stage 2
//
function Rule8() {
    Rule.call(this, 8);
}

Rule8.prototype.match = function (_map) {
    if (!_map[0][0].isSideCorridor()) {
        var results = [];
        var rule = { name: this.name, color: this.color.rgb };
        var dist_x = Math.round(_map.length / 3);
        var dist_y = Math.round(_map[0].length / 2);

        var spaces = [];
        var space = [];

        for (var i = 0; i < _map.length; i += dist_x) {
            for (var j = 0; j < _map[0].length; j += dist_y) {
                for (var k = i; k < i + dist_x; k++){
                    for (var l = j; l < j + dist_y; l++) {
                        if (_map[k] && _map[k][l]) {
                            if (_map[k][l].getType() > 0 && _map[k][l].getType() < 8) {
                                space.push(_map[k][l]);
                            }
                        }
                    }
                }
                if (space.length > 0) {
                    spaces.push(space);
                    space = [];
                }
            }
        }
    }
    if (spaces && spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule9() {
    Rule.call(this, 9);
}

Rule9.prototype.match = function (_map) {
    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };
    var x = y = 0;
    var h_count = _map.length;
    //adjust original position
    if(_map[0][0].isSideCorridor()){
        x++;
        y++;
        h_count -= 2;
    }

    var record = [];
    for (var i = y; i < _map[0].length ; i++) {
        for (var j = x; j < _map.length; j++) {
            if (_map[j][i].getType() > 0) {
                //Not belongs stage 2
                if (_map[j][i].getType() > 7) {
                    record = [];
                    break;   
                } else {
                    if (_map[j][i].isSideCorridor()) continue;
                    record.push(_map[j][i]);
                }
            }
        }
        var space = [];
        if (record.length == h_count) {
            for (var j = 0; j < record.length; j++) {
                space.push(record[j]);
            }
            record = [];                                  //Avoid repeated access of data
            spaces.push(space);
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule10() {
    Rule.call(this, 10);
}

Rule10.prototype.match = function (_map) {
    var tra_pos_x = 0;
    var tra_pos_y = 0;
    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    for (var i = 0; i < _map.length; i++) {
        for (var j = 0; j < _map[0].length; j++) {
            if (!_map[i][j].isSideCorridor()) {
                if (_map[i][j].getType() > 0 && _map[i][j].getType() < 8) {             //Comfirm that spaces belong to stage one
                    var bot = _map[i][j].getBotSpace();
                    if (bot && !bot.isSideCorridor()) {
                        if (bot.getType() > 0 && bot.getType() < 8)                  //Comfirm that spaces belong to stage one
                            spaces.push([_map[i][j], bot]);
                    }
                }
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule11() {
    Rule.call(this, 11);
}

Rule11.prototype.match = function (_map) {
    var tra_pos_x = 0;
    var tra_pos_y = 0;
    var spaces = [];
    var w_count = 0;
    var h_count = 0;
    var rule = { name: this.name, color: this.color.rgb };

    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;
        tra_pos_y++;
    }

    if (_map[tra_pos_x][tra_pos_y].getType() != 9) {
        return null;
    } else {
        tra_pos_y++;
    }

    //檢查剩下的邊數是否為基數
    for (var i = tra_pos_x; i < _map.length; i++) { 
        if (_map[i][tra_pos_y].getType() < 6 && _map[i][tra_pos_y].getType() > 0) {
            if(!_map[i][tra_pos_y].isSideCorridor())
                w_count++;
        }
    }

    if (_map[tra_pos_x][tra_pos_y].getType() > 6) {
        tra_pos_x++;;
    } 

    //減查剩下的垂直邊數大於一
    for (var i = tra_pos_y; i < _map[0].length; i++) {
        if (_map[tra_pos_x][i].getType() < 6 && _map[tra_pos_x][i].getType() > 0) {
            if (!_map[i][tra_pos_y].isSideCorridor())
                h_count++;
        }
    }

    if(w_count % 2 != 1 || h_count <= 1) return null;
 
    var space = [];
    for (var i = tra_pos_x; i < _map.length; i++) {
        for (var j = tra_pos_y; j < _map[0].length; j++) {
            if (_map[i][j].getType() < 6 && _map[i][j].getType() > 0 ) {
                if(!_map[i][j].isSideCorridor()){
                    space.push(_map[i][j]);
                }
            }
        }
    }
    if (space.length > 0) {
        spaces.push(space);
        rule.spaces = spaces;
        return rule;
    }
    return false;

}

function Rule12() {
    Rule.call(this, 12);
}

Rule12.prototype.match = function (_map) {
    var tra_pos_x = 0;
    var tra_pos_y = 0;
    var dist_x = _map.length - 1;
    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;
        tra_pos_y++;
        dist_x -= 2;            //副階
    }

    //判斷符合規則,只需檢查上半部
    var meets_flag = false;
    while (tra_pos_y < Math.round(_map[0].length / 2)) {
        if (_map[tra_pos_x][tra_pos_y] && _map[tra_pos_x + dist_x][tra_pos_y + 2]) {
            if (_map[tra_pos_x][tra_pos_y].getType() == 10 && _map[tra_pos_x + dist_x][tra_pos_y + 2].getType() == 9) {
                if (_map[tra_pos_x + dist_x][tra_pos_y].getType() == 10) {
                    meets_flag = true;
                    break;
                } else {
                    tra_pos_y++;
                }
            } else {
                tra_pos_y++;
            }
        } else {
            break;
        }
    }
    

    var space = [];
    if (meets_flag) {
        for (var i = tra_pos_x; i <= tra_pos_x + dist_x; i++) {
            for (var j = tra_pos_y; j <= tra_pos_y + 2; j++) {
                if (_map[i][j].getType() == 10 || _map[i][j].getType() == 9) {
                    space.push(_map[i][j]);
                }
            }
        }
    }
    
    if (space.length > 0) {
        spaces.push(space);
        rule.spaces = spaces;
        return rule;
    }
    return false;
}

//
//Stage 3
//

function Rule13() {
    Rule.call(this, 13);
}

Rule13.prototype.match = function (_map) {

    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var info = {};
    for (var i = 0; i < _map.length; i++) {
        for (var j = 0; j < _map[0].length; j++) {
            if (_map[i][j].getType()> 0 && _map[i][j].getType() < 13) {
                var coors = [];
                var coor = {};
                if (_map[i][j].haveTopEdge()) {
                    coor.x = _map[i][j].getX();
                    coor.y = _map[i][j].getY();
                    coors.push(coor);
                    coor = {};
                    coor.x = _map[i][j].getX() + _map[i][j].getWidth();
                    coor.y = _map[i][j].getY();
                    coors.push(coor);
                    coor = {};
                }

                if (_map[i][j].haveBotEdge()) {
                    coor.x = _map[i][j].getX();
                    coor.y = _map[i][j].getY() + _map[i][j].getHeight();
                    coors.push(coor);
                    coor = {};
                    coor.x = _map[i][j].getX() + _map[i][j].getWidth();
                    coor.y = _map[i][j].getY() + _map[i][j].getHeight();
                    coors.push(coor);
                    coor = {};
                }
                if (!_map[i][j].haveBotEdge() || !_map[i][j].haveTopEdge()) {
                    if (_map[i][j].haveLeftEdge()) {
                        coor.x = _map[i][j].getX();
                        coor.y = _map[i][j].getY();
                        coors.push(coor);
                        coor = {};
                        coor.x = _map[i][j].getX();
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight();
                        coors.push(coor);
                        coor = {};
                    }
                    if (_map[i][j].haveRightEdge()) {
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth();
                        coor.y = _map[i][j].getY();
                        coors.push(coor);
                        coor = {};
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth();
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight();
                        coors.push(coor);
                        coor = {};
                    }
                }
                
                if (coors.length > 0) {
                    info = { space: _map[i][j], coors: coors };
                    spaces.push(info);
                    info = {};
                    coors = [];
                }
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule14() {
    Rule.call(this, 14);
}

Rule14.prototype.match = function(_map){

    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var info = {};
    for (var i = 0; i < _map.length; i++) {
        for (var j = 0; j < _map[0].length; j++) {
            if (_map[i][j].getType() == 13) {
                if (_map[i][j].getWidth() == _map[i][j].getHeight()) {
                    var coors = [];
                    var coor = {};
                    //Top
                    if (_map[i][j].getTopEdge() > 0 && _map[i][j].getTopEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth() / 3;
                        coor.y = _map[i][j].getY();
                        coors.push(coor);
                        coor = {};
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth() * 2 / 3;
                        coor.y = _map[i][j].getY();
                        coors.push(coor);
                        coor = {};
                    }
                    //Bot
                    if (_map[i][j].getBotEdge() > 0 && _map[i][j].getBotEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth() / 3;
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight();
                        coors.push(coor);
                        coor = {};
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth() * 2 / 3;
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight();
                        coors.push(coor);
                        coor = {};
                    }
                    //Left
                    if (_map[i][j].getLeftEdge() > 0 && _map[i][j].getLeftEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX();
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight() / 3;
                        coors.push(coor);
                        coor = {};
                        coor.x = _map[i][j].getX();
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight() * 2 / 3;
                        coors.push(coor);
                        coor = {};
                    }
                    //Right
                    if (_map[i][j].getRightEdge() > 0 && _map[i][j].getRightEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth();
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight() / 3;
                        coors.push(coor);
                        coor = {};
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth();
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight() * 2 / 3;
                        coors.push(coor);
                        coor = {};
                    }
                   
                    if (coors.length > 0) {
                        info = { space: _map[i][j], coors: coors };
                        spaces.push(info);
                        info = {};
                        coors = [];
                    }
                }
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule15() {
    Rule.call(this, 15);
}

Rule15.prototype.match = function (_map) {
    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var info = {};
    for (var i = 0; i < _map.length; i++) {
        for (var j = 0; j < _map[0].length; j++) {
            if (_map[i][j].getType() == 13) {
                if (_map[i][j].getWidth() == _map[i][j].getHeight()) {
                    var coors = [];
                    var coor = {};

                    //Top
                    if (_map[i][j].getTopEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth() / 2;
                        coor.y = _map[i][j].getY();
                        coors.push(coor);
                        coor = {};
                    }
                    //Bot
                    if (_map[i][j].getBotEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth() / 2;
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight();
                        coors.push(coor);
                        coor = {};
                    }
                    //Left
                    if (_map[i][j].getLeftEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX();
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight() / 2;
                        coors.push(coor);
                        coor = {};
                    }
                    //Right
                    if (_map[i][j].getRightEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth();
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight() / 2;
                        coors.push(coor);
                        coor = {};
                    }

                    if (coors.length > 0) {
                        info = { space: _map[i][j], coors: coors };
                        spaces.push(info);
                        info = {};
                        coors = [];
                    }
                }
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule16() {
    Rule.call(this, 16);
}

Rule16.prototype.match = function (_map) {
    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var info = {};
    for (var i = 0; i < _map.length; i++) {
        for (var j = 0; j < _map[0].length; j++) {
            if (_map[i][j].getType() == 13) {
                var coors = [];
                var coor = {};
                if (_map[i][j].getWidth() > _map[i][j].getHeight()) {
                    //Top
                    if (_map[i][j].getTopEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth() / 3;
                        coor.y = _map[i][j].getY();
                        coors.push(coor);
                        coor = {};
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth() * 2 / 3;
                        coor.y = _map[i][j].getY();
                        coors.push(coor);
                        coor = {};
                    }
                    //Bot
                    if (_map[i][j].getBotEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth() / 3;
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight();
                        coors.push(coor);
                        coor = {};
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth() * 2 / 3;
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight();
                        coors.push(coor);
                        coor = {};
                    }
                } else if (_map[i][j].getWidth() < _map[i][j].getHeight()) {
                    var coors = [];
                    var coor = {};
                        //Left
                    if (_map[i][j].getLeftEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX();
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight() / 3;
                        coors.push(coor);
                        coor = {};
                        coor.x = _map[i][j].getX();
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight() * 2 / 3;
                        coors.push(coor);
                        coor = {};
                    }
                        //Right
                    if (_map[i][j].getRightEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth();
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight() / 3;
                        coors.push(coor);
                        coor = {};
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth();
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight() * 2 / 3;
                        coors.push(coor);
                        coor = {};
                    }
                }
                if (coors.length > 0) {
                    info = { space: _map[i][j], coors: coors };
                    spaces.push(info);
                    info = {};
                    coors = [];
                }
            }   
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule17() {
    Rule.call(this, 17);
}

Rule17.prototype.match = function (_map) {
    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var info = {};
    for (var i = 0; i < _map.length; i++) {
        for (var j = 0; j < _map[0].length; j++) {
            if (_map[i][j].getType() == 13) {
                var coors = [];
                var coor = {};
                if (_map[i][j].getWidth() > _map[i][j].getHeight()) {
                    //Top
                    if (_map[i][j].getTopEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth() / 2;
                        coor.y = _map[i][j].getY();
                        coors.push(coor);
                        coor = {};
                    }
                    //Bot
                    if (_map[i][j].getBotEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth() / 2;
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight();
                        coors.push(coor);
                        coor = {};
                    }
                } else if (_map[i][j].getWidth() < _map[i][j].getHeight()) {
                    var coors = [];
                    var coor = {};
                    //Left
                    if (_map[i][j].getLeftEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX();
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight() / 2;
                        coors.push(coor);
                        coor = {};
                    }
                    //Right
                    if (_map[i][j].getRightEdge() == 13) {                     //確定有落柱鋪作
                        coor.x = _map[i][j].getX() + _map[i][j].getWidth();
                        coor.y = _map[i][j].getY() + _map[i][j].getHeight() / 2;
                        coors.push(coor);
                        coor = {};
                    }
                }

                if (coors.length > 0) {
                    info = { space: _map[i][j], coors: coors };
                    spaces.push(info);
                    info = {};
                    coors = [];
                }
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

//Stage 4 
function Rule18() {
    Rule.call(this, 18);
}

//Top way
Rule18.prototype.match = function(_map){
    var tra_pos_x = 0;
    var tra_pos_y = 0;

    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var end_pos_x = _map.length - 1;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;
        tra_pos_y++;
        end_pos_x--;
    }
    var coor = {};
    for (var i = tra_pos_x; i <= end_pos_x; i++) {
        if (_map[i][tra_pos_y].getType() > 0 && _map[i][tra_pos_y].getTopEdge() < 18) {
            if (_map[i][tra_pos_y].haveTopEdge()) {
                coor.x = _map[i][tra_pos_y].getX();
                coor.y = _map[i][tra_pos_y].getY();
                coor.w = _map[i][tra_pos_y].getWidth();
                coor.h = 20;
                spaces.push({ space: _map[i][tra_pos_y], coor: coor });
                coor = {};
            }
        } 
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule19(){
    Rule.call(this, 19);
}

//Right
Rule19.prototype.match = function (_map) {
    var tra_pos_x = _map.length - 1;
    var tra_pos_y = 0;

    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var end_pos_y = _map[0].length- 1;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x--;
        tra_pos_y++;
        end_pos_y--;
    }
    var coor = {};
    for (var i = tra_pos_y; i <= end_pos_y; i++) {
        if(_map[tra_pos_x][i].getType() > 0){
            if (_map[tra_pos_x][i].getType() > 0 ){
                if (_map[tra_pos_x][i].haveRightEdge() && _map[tra_pos_x][i].getRightEdge() < 18) {
                    coor.x = _map[tra_pos_x][i].getX() + _map[tra_pos_x][i].getWidth();
                    coor.y = _map[tra_pos_x][i].getY();
                    coor.w = 20;
                    coor.h = _map[tra_pos_x][i].getHeight();
                    spaces.push({ space: _map[tra_pos_x][i], coor: coor });
                    coor = {};
                }
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule20() {
    Rule.call(this, 20);
}

//Bot
Rule20.prototype.match = function (_map) {
    var tra_pos_x = _map.length - 1;
    var tra_pos_y = _map[0].length - 1;

    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var end_pos_x = 0;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x--;
        tra_pos_y--;
        end_pos_x++;
    }
    var coor = {};
    for (var i = tra_pos_x; i >= end_pos_x; i --) {
        if (_map[i][tra_pos_y].getType() > 0 && _map[i][tra_pos_y].getBotEdge() < 18) {
            if (_map[i][tra_pos_y].haveBotEdge()) {
                coor.x = _map[i][tra_pos_y].getX();
                coor.y = _map[i][tra_pos_y].getY() + _map[i][tra_pos_y].getHeight();
                coor.w = _map[i][tra_pos_y].getWidth();
                coor.h = 20;
                spaces.push({ space: _map[i][tra_pos_y], coor: coor });
                coor = {};
            }
        } 
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule21() {
    Rule.call(this, 21);
}

//Left
Rule21.prototype.match = function (_map) {
    var tra_pos_x = 0;
    var tra_pos_y = 0;

    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var end_pos_y =  _map[0].length - 1;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;
        tra_pos_y++;
        end_pos_y--;
    }
    var coor = {};
    for (var i = tra_pos_y; i <= end_pos_y; i++) {
        if (_map[tra_pos_x][i].getLeftEdge() < 18 && _map[tra_pos_x][i].getType() > 0) {
                if (_map[tra_pos_x][i].haveLeftEdge()) {
                    coor.x = _map[tra_pos_x][i].getX();
                    coor.y = _map[tra_pos_x][i].getY();
                    coor.w = 20;
                    coor.h = _map[tra_pos_x][i].getHeight();
                    spaces.push({ space: _map[tra_pos_x][i], coor: coor });
                    coor = {};
                }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

//Stage 5

function Rule22() {
    Rule.call(this, 22);
}

Rule22.prototype.match = function(_map){
    var tra_pos_x = 0;
    var tra_pos_y = 0;

    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var end_pos_x = _map.length - 1;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;
        tra_pos_y++;
        end_pos_x--;
    }
    var coor = {};
    for (var i = tra_pos_x; i <= end_pos_x; i++) {
        if (_map[i][tra_pos_y].getType() > 0) {
            if (_map[i][tra_pos_y].getTopEdge() == 14 || _map[i][tra_pos_y].getTopEdge() == 16) {
                if (_map[i][tra_pos_y].haveTopEdge()) {
                    coor.x = _map[i][tra_pos_y].getX();
                    coor.y = _map[i][tra_pos_y].getY();
                    coor.w = _map[i][tra_pos_y].getWidth();
                    coor.h = 10;
                    spaces.push({ space: _map[i][tra_pos_y], coor: coor });
                    coor = {};
                }
            } 
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule23() {
    Rule.call(this, 23);
}

//Left windows
Rule23.prototype.match = function (_map) {
    var tra_pos_x = 0;
    var tra_pos_y = 0;

    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var end_pos_y = _map[0].length - 1;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;
        tra_pos_y++;
        end_pos_y--;
    }
    var coor = {};
    for (var i = tra_pos_y; i <= end_pos_y; i++) {
        if (_map[tra_pos_x][i].getType() > 0) {
            if (_map[tra_pos_x][i].getLeftEdge() == 15 || _map[tra_pos_x][i].getLeftEdge() == 17) {
                coor.x = _map[tra_pos_x][i].getX();
                coor.y = _map[tra_pos_x][i].getY();
                coor.w = 8;
                coor.h = _map[tra_pos_x][i].getHeight();
                spaces.push({ space: _map[tra_pos_x][i], coor: coor });
                coor = {};
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule24() {
    Rule.call(this, 24);
}

//Right window 
Rule24.prototype.match = function (_map) {
    var tra_pos_x = _map.length - 1;
    var tra_pos_y = 0;

    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var end_pos_y = _map[0].length - 1;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x--;
        tra_pos_y++;
        end_pos_y--;
    }
    var coor = {};
    for (var i = tra_pos_y; i <= end_pos_y; i++) {
        if (_map[tra_pos_x][i].getType() > 0 ) {
            if (_map[tra_pos_x][i].getRightEdge() == 15 || _map[tra_pos_x][i].getRightEdge() == 17) {
                coor.x = _map[tra_pos_x][i].getX() + _map[tra_pos_x][i].getWidth();
                coor.y = _map[tra_pos_x][i].getY();
                coor.w = 8;
                coor.h = _map[tra_pos_x][i].getHeight();
                spaces.push({ space: _map[tra_pos_x][i], coor: coor });
                coor = {};
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule25() {
    Rule.call(this, 25);
}

//Bot side
Rule25.prototype.match = function (_map) {
    var tra_pos_x = _map.length - 1;
    var tra_pos_y = _map[0].length - 1;

    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var end_pos_x = 0;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x--;
        tra_pos_y--;
        end_pos_x++;
    }
    var coor = {};
    for (var i = tra_pos_x; i >= end_pos_x; i--) {
        if (_map[i][tra_pos_y].getType() > 0) {
            if (_map[i][tra_pos_y].getBotEdge() == 15 || _map[i][tra_pos_y].getBotEdge() == 17) {
                coor.x = _map[i][tra_pos_y].getX();
                coor.y = _map[i][tra_pos_y].getY() + _map[i][tra_pos_y].getHeight();
                coor.w = _map[i][tra_pos_y].getWidth();
                coor.h = 8;
                spaces.push({ space: _map[i][tra_pos_y], coor: coor });
                coor = {};
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule26() {
    Rule.call(this, 26);
}

//Bot door
Rule26.prototype.match = function (_map) {
    var tra_pos_x = _map.length - 1;
    var tra_pos_y = _map[0].length - 1;

    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var end_pos_x = 0;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x--;
        tra_pos_y--;
        end_pos_x++;
    }
    var coor = {};
    for (var i = tra_pos_x; i >= end_pos_x; i--) {
        if (_map[i][tra_pos_y].getType() > 0) {
            if (_map[i][tra_pos_y].getBotEdge() == 14 || _map[i][tra_pos_y].getBotEdge() == 16) {
                coor.x = _map[i][tra_pos_y].getX();
                coor.y = _map[i][tra_pos_y].getY() + _map[i][tra_pos_y].getHeight();
                coor.w = _map[i][tra_pos_y].getWidth();
                coor.h = 10;
                spaces.push({ space: _map[i][tra_pos_y], coor: coor });
                coor = {};
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

function Rule27() {
    Rule.call(this, 27);
}

Rule27.prototype.match = function (_map) {
    var tra_pos_x = 0;
    var tra_pos_y = 0;

    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var end_pos_x = _map.length - 1;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;
        tra_pos_y++;
        end_pos_x--;
    }
    var coor = {};
    for (var i = tra_pos_x; i <= end_pos_x; i++) {
        if (_map[i][tra_pos_y].getType() > 0) {
            if (_map[i][tra_pos_y].getTopEdge() == 15 || _map[i][tra_pos_y].getTopEdge() == 17) {
                if (_map[i][tra_pos_y].haveTopEdge()) {
                    coor.x = _map[i][tra_pos_y].getX();
                    coor.y = _map[i][tra_pos_y].getY();
                    coor.w = _map[i][tra_pos_y].getWidth();
                    coor.h = 8;
                    spaces.push({ space: _map[i][tra_pos_y], coor: coor });
                    coor = {};
                }
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

//Stage 6
function Rule28(){
    Rule.call(this, 28);
}

//Top
Rule28.prototype.match = function(_map){
    var tra_pos_x = 0;
    var tra_pos_y = 0;

    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var end_pos_x = _map.length - 1;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;
        end_pos_x--;
    }
    var coor = {};
    for (var i = tra_pos_x; i <= end_pos_x; i++) {
        if (_map[i][tra_pos_y].getType() > 0 && _map[i][tra_pos_y].getType() != this.name) {
            if (_map[i][tra_pos_y].getBotEdge() >= 22 && _map[i][tra_pos_y].getBotEdge() <= 27) {
                coor.x = _map[i][tra_pos_y].getX();
                coor.y = _map[i][tra_pos_y].getY();
                coor.w = _map[i][tra_pos_y].getWidth();
                coor.h = 50;
                spaces.push({ space: _map[i][tra_pos_y], coor: coor });
                coor = {};
            } else if (_map[i][tra_pos_y].getTopEdge() >= 22 && _map[i][tra_pos_y].getTopEdge() <= 27) {                                                             //Case for there have no side corridors
                coor.x = _map[i][tra_pos_y].getX();
                coor.y = _map[i][tra_pos_y].getY();
                coor.w = _map[i][tra_pos_y].getWidth();
                coor.h = 50;
                spaces.push({ space: _map[i][tra_pos_y], coor: coor });
                coor = {};
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

//Bot
function Rule29() {
    Rule.call(this, 29);
}

Rule29.prototype.match = function (_map) {
    var tra_pos_x = 0;
    var tra_pos_y = _map[0].length - 1;

    var spaces = [];
    var rule = { name: this.name, color: this.color.rgb };

    var end_pos_x = _map.length - 1;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;
        end_pos_x--;
    }
    var coor = {};
    for (var i = tra_pos_x; i <= end_pos_x; i++) {
        if (_map[i][tra_pos_y].getType() > 0 && _map[i][tra_pos_y].getType() != this.name) {
            if (_map[i][tra_pos_y].getTopEdge() >= 22 && _map[i][tra_pos_y].getTopEdge() <= 27) {
                coor.x = _map[i][tra_pos_y].getX();
                coor.y = _map[i][tra_pos_y].getY() + _map[i][tra_pos_y].getHeight();
                coor.w = _map[i][tra_pos_y].getWidth();
                coor.h = 50;
                spaces.push({ space: _map[i][tra_pos_y], coor: coor });
                coor = {};
            } else if (_map[i][tra_pos_y].getBotEdge() >= 22 && _map[i][tra_pos_y].getBotEdge() <= 27) {                //Case for there have no side corridors
                coor.x = _map[i][tra_pos_y].getX();
                coor.y = _map[i][tra_pos_y].getY() + _map[i][tra_pos_y].getHeight();
                coor.w = _map[i][tra_pos_y].getWidth();
                coor.h = 50;
                spaces.push({ space: _map[i][tra_pos_y], coor: coor });
                coor = {};
            }
        }
    }
    if (spaces.length > 0) {
        rule.spaces = spaces;
        return rule;
    }
    return null;
}

//Stage 7
function Rule30() {
    Rule.call(this, 30);
}

Rule30.prototype.match = function (_map) {
    if (_map[0][0].getType() != this.name) return { name: this.name, spaces: [_map] };
    return null;
}