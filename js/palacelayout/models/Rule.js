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

	if (_map[tra_pos_x][tra_pos_y].isSideCorridor())
		tra_pos_y++;

    var results = [];
	    var result = { name: this.name, color : this.color.rgb};
	if(_map[tra_pos_x][tra_pos_y].getType() == 0){
	    result.space = _map[tra_pos_x][tra_pos_y];
	    results.push(result);
	    return results;
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

    var results = [];
    var result = { name: this.name, color: this.color.rgb };
    if (_map[tra_pos_x][tra_pos_y].getType() == 1) {
        var bot = _map[tra_pos_x][tra_pos_y].getBotSpace();
        while (bot.getType() != 0 && !bot.isSideCorridor()) {
            bot = bot.getBotSpace();
            if (!bot)
                return null;
        }
        if (bot.getType() == 0 && !bot.isSideCorridor()) {
            result.space = bot;
            results.push(result);
            return results;
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

    var results = [];
    var result = { name: this.name, color: this.color.rgb };
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
            result.space = left;
            results.push(result);
        }

        result = { name: this.name, color: this.color.rgb };
        //Analyze to right
        while (right.getType() > 0 && right.getType() <= 3) {
            right = right.getRightSpace();
            if (!right || right.isSideCorridor())
                return null;
        }
        if (right.getType() == 0) {
            result.space = right;
            results.push(result);
        }

        return results;
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

    var results = [];
    var result = { name: this.name, color: this.color.rgb };
    for (var i = 0; i < end_point_x; i++) {
        for (var j = tra_pos_y + 1; j < _map[0].length; j++) {
            if (_map[i][j].getType() > 0) continue;
            if (_map[i][j].getRightSpace().getType() > 0 && _map[i][j].getTopSpace().getType() > 0) {
                if (_map[i][j].getRightSpace().getTopSpace().getType() > 0) {
                    if (!_map[i][j].isSideCorridor()) {
                        result.space = _map[i][j];
                        results.push(result);
                        return results;
                    }
                    else return null;
                }
            }
        }
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

    var results = [];
    var result = { name: this.name, color: this.color.rgb };
    for (var i = start_point_x; i < _map.length; i++) {
        for (var j = tra_pos_y + 1; j < _map[0].length; j++) {
            if (_map[i][j].getType() > 0) continue;
            if (_map[i][j].getLeftSpace().getType() > 0 && _map[i][j].getTopSpace().getType() > 0) {
                if (_map[i][j].getLeftSpace().getTopSpace().getType() > 0) {
                    if (!_map[i][j].isSideCorridor()) {
                        result.space = _map[i][j];
                        results.push(result);
                        return results;
                    }
                    else return null;
                }
            }
        }
    }
    return null;
}

function Rule6() {
    Rule.call(this, 6);
}

Rule6.prototype.match = function (_map) {
    var results = [];
    var result = { name: this.name, color: this.color.rgb };
    for (var i = 0; i < _map.length; i++) {
        for (var j = 0; j < _map[0].length; j++) {
            if (!_map[i][j].isSideCorridor()) continue;
            if (_map[i][j].getWidth() != _map[i][j].getHeight()) {
                if (_map[i][j].getType() == 0) {
                    if (_map[i][j].getBotSpace() && _map[i][j].getBotSpace().getType() > 0) {
                        if (!_map[i][j].getBotSpace().isSideCorridor()) {
                            result.space = _map[i][j];
                            results.push(result);
                            return results;
                        }
                    }
                    if (_map[i][j].getTopSpace() && _map[i][j].getTopSpace().getType() > 0) {
                        if (!_map[i][j].getTopSpace().isSideCorridor()) {
                            result.space = _map[i][j];
                            results.push(result);
                            return results;
                        }
                    }
                    if (_map[i][j].getRightSpace() && _map[i][j].getRightSpace().getType() > 0) {
                        if (!_map[i][j].getRightSpace().isSideCorridor()) {
                            result.space = _map[i][j];
                            results.push(result);
                            return results;
                        }
                    }
                    if (_map[i][j].getLeftSpace() && _map[i][j].getLeftSpace().getType() > 0) {
                        if (!_map[i][j].getLeftSpace().isSideCorridor()) {
                            result.space = _map[i][j];
                            results.push(result);
                            return results;
                        }
                    }
                } 
            }
        }
    }
    return null;
}

function Rule7() {
    Rule.call(this, 7);
}

Rule7.prototype.match = function (_map) {
    var results = [];
    var result = { name: this.name, color: this.color.rgb };
    if (_map[0][0].getType() == 0) {
        if (_map[0][0].getRightSpace().getType() == 6 && _map[0][0].getBotSpace().getType() == 6) {
            result.space = _map[0][0];
            results.push(result);
            return results;
        }
    }
    if (_map[_map.length - 1][0].getType() == 0) {
        if (_map[_map.length - 1][0].getLeftSpace().getType() == 6 && _map[_map.length - 1][0].getBotSpace().getType() == 6) {
            result.space = _map[_map.length - 1][0];
            results.push(result);
            return results;
        }
    }
    if (_map[_map.length - 1][_map[0].length - 1].getType() == 0) {
        if (_map[_map.length - 1][_map[0].length - 1].getLeftSpace().getType() == 6 && _map[_map.length - 1][_map[0].length - 1].getTopSpace().getType() == 6) {
            result.space = _map[_map.length - 1][_map[0].length - 1];
            results.push(result);
            return results;
        }
    }
    if (_map[0][_map[0].length - 1].getType() == 0) {
        if (_map[0][_map[0].length - 1].getRightSpace().getType() == 6 && _map[0][_map[0].length - 1].getTopSpace().getType() == 6) {
            result.space = _map[0][_map[0].length - 1];
            results.push(result);
            return results;
        }
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
        var result = { name: this.name, color: this.color.rgb };
        var dist_x = Math.round(_map.length / 3);
        var dist_y = Math.round(_map[0].length / 2);

        for (var i = 0; i < _map.length; i += dist_x) {
            for (var j = 0; j < _map[0].length; j += dist_y) {
                if (_map[i][j].getType() > 0 && _map[i][j].getType() < 8) {
                    if (_map[i + dist_x - 1][j + dist_y - 1].getType() < 8) {
                        for (var k = i; k < i + dist_x; k++) {
                            for (var l = j; l < j + dist_y; l++) {
                                result.space = _map[k][l];
                                results.push(result);
                                result = {};
                            }
                        }
                        return results;
                    }
                }
            }
        }
    }
    return null;
}

function Rule9() {
    Rule.call(this, 9);
}

Rule9.prototype.match = function (_map) {
    var results = [];
    var result = { name: this.name, color: this.color.rgb };
    var x = y = 0;
    var dist = _map[0].length - 1;
    var h_count = _map.length;
    //adjust original position
    if(_map[0][0].isSideCorridor()){
        x++;
        y++;
        dist -= 2;                         //副階
        h_count -= 2;
    }

    var record = [];
    for (var i = y; i < _map[0].length ; i+= dist) {
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
        if (record.length == h_count) {
            for (var j = 0; j < record.length; j++) {
                result.space = record[j];
                results.push(result);
                result = {};
            }
            return results;
        }
        if (dist <= 2) return null;
    }
    return null;
}

function Rule10() {
    Rule.call(this, 10);
}

Rule10.prototype.match = function (_map) {
    var tra_pos_x = 0;
    var tra_pos_y = 0;
    var dist_x = _map.length - 1;
    var dist_y = _map[0].length - 1;
    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;
        tra_pos_y++;
        dist_x -= 2;            //副階
        dist_y -= 2;            //副階
    }

    if (_map[tra_pos_x][tra_pos_y].getType() != 9 || _map[tra_pos_x + dist_x][tra_pos_y + dist_y].getType() != 9) {
        return null;
    } else {
        tra_pos_y++;
        dist_y--;
    }

    for (var i = tra_pos_x; i <= tra_pos_x + dist_x; i += dist_x) {
        for (var j = tra_pos_y; j < tra_pos_y + dist_y; j++) {
            if (_map[i][j].getType() < 6) {
                result.space = _map[i][j];
                results.push(result);
                result = {};
            }
        }
        if(results.length != 0) return results;
    }
    return null;
}

function Rule11() {
    Rule.call(this, 11);
}

Rule11.prototype.match = function (_map) {
    var tra_pos_x = 0;
    var tra_pos_y = 0;
    var results = [];
    var w_count = 0;
    var h_count = 0;
    var result = { name: this.name, color: this.color.rgb };

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

    //減查剩下的垂直邊數大於一
    for (var i = tra_pos_y; i < _map[0].length; i++) {
        if (_map[tra_pos_x][i].getType() < 6 && _map[tra_pos_x][i].getType() > 0) {
            if (!_map[i][tra_pos_y].isSideCorridor())
                h_count++;
        }
    }

    if(w_count % 2 != 1 && h_count <= 1) return null;
 
    for (var i = tra_pos_x; i < _map.length; i++) {
        for (var j = tra_pos_y; j < _map[0].length; j++) {
            if (_map[i][j].getType() < 6 && _map[i][j].getType() > 0 ) {
                if(!_map[i][j].isSideCorridor()){
                    result.space = _map[i][j];
                    results.push(result);
                    result = {};
                }
            
            }
        }
    }
    return results;

}

function Rule12() {
    Rule.call(this, 12);
}

Rule12.prototype.match = function (_map) {
    var tra_pos_x = 0;
    var tra_pos_y = 0;
    var dist_x = _map.length - 1;
    var dist_y = _map[0].length - 1;
    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;
        tra_pos_y++;
        dist_x -= 2;            //副階
        dist_y -= 2;            //副階
    }

    //判斷符合規則
    if (_map[tra_pos_x][tra_pos_y + 1].getType() == 10 && _map[tra_pos_x + dist_x][tra_pos_y + dist_y].getType() == 9) {
        if (_map[tra_pos_x + dist_x][tra_pos_y + 1].getType() == 10) {
            tra_pos_y++;
        } else {
            return null;
        }
    }else{   
        return null;
    } 

    for (var i = tra_pos_x; i <= tra_pos_x + dist_x; i ++) {
        for (var j = tra_pos_y; j < tra_pos_y + dist_y; j++) {
            if (_map[i][j].getType() == 10 || _map[i][j].getType() == 9) {
                result.space = _map[i][j];
                results.push(result);
                result = {};
            }
        }
    }
    return results;
}

//
//Stage 3
//

function Rule13() {
    Rule.call(this, 13);
}

Rule13.prototype.match = function (_map) {

    var mid_pos_x = Math.round(_map.length / 2) - 1;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    for (var i = 0; i < _map[0].length; i++) {
        if (_map[mid_pos_x][i].getType() > 0 && _map[mid_pos_x][i].getType() < 13) {
            result.space = _map[mid_pos_x][i];
            var tmp_x = _map[mid_pos_x][i].getX();
            var tmp_y = _map[mid_pos_x][i].getY();
            if (_map[mid_pos_x][i].haveTopEdge()) {
                
                    result.x = tmp_x;
                    result.y = tmp_y;
                    results.push(result);
                    result = {};
                    result.x = tmp_x + _map[mid_pos_x][i].getWidth();
                    result.y = tmp_y;
                    results.push(result);
                    result = {};
            }

            if (_map[mid_pos_x][i].haveBotEdge()) {
                
                    result.x = tmp_x;
                    result.y = tmp_y + _map[mid_pos_x][i].getHeight();
                    results.push(result);
                    result = {};
                    result.x = tmp_x + _map[mid_pos_x][i].getWidth();
                    result.y = tmp_y + _map[mid_pos_x][i].getHeight();
                    results.push(result);
                    result = {};
                
            }
            if (!_map[mid_pos_x][i].haveTopEdge() && !_map[mid_pos_x][i].haveBotEdge()) continue;
            return results;
        }
    }
       
    return null;
}

function Rule14() {
    Rule.call(this, 14);
}

Rule14.prototype.match = function (_map) {

    var mid_pos_x = Math.round(_map.length / 2) - 1;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };


    for (var i = 0; i < _map[0].length; i++) {
        for (var j = mid_pos_x - 1; j >= 0; j--) {
            if (_map[j][i].getType() > 0 && _map[j][i].getType() < 14) {
                result.space = _map[j][i];
                var tmp_x = _map[j][i].getX();
                var tmp_y = _map[j][i].getY();
                if (_map[j][i].haveLeftEdge()) {
                    
                    result.x = tmp_x;
                    result.y = tmp_y;
                    results.push(result);
                    result = {};
                    result.x = tmp_x;
                    result.y = tmp_y + _map[j][i].getHeight();
                    results.push(result);
                    result = {};
                }
                if (_map[j][i].haveTopEdge()) {
                    
                    result.x = tmp_x + _map[j][i].getWidth();
                    result.y = tmp_y;
                    results.push(result);
                    result = {};
                }
                if (_map[j][i].haveBotEdge()) {
                  
                    result.x = tmp_x + _map[j][i].getWidth();
                    result.y = tmp_y + _map[j][i].getHeight();
                    results.push(result);
                    result = {};
                }
                if (results.length == 0) continue;
                return results;
            }
        }
    }
        
    return null;
}

function Rule15() {
    Rule.call(this, 15);
}

Rule15.prototype.match = function (_map) {

    var mid_pos_x = Math.round(_map.length / 2) - 1;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    for (var i = 0; i < _map[0].length; i++){
        //if (_map[mid_pos_x][i].getType() != 13 && _map[mid_pos_x][i].getType() != 16) continue;
        for (var j = mid_pos_x + 1; j < _map.length  ; j++) {
            if (_map[j][i].getType() > 0 && _map[j][i].getType() < 15) {
                result.space = _map[j][i];
                var tmp_x = _map[j][i].getX();
                var tmp_y = _map[j][i].getY();
                if (_map[j][i].haveRightEdge()) {
                        
                    result.x = tmp_x + _map[j][i].getWidth();
                    result.y = tmp_y;
                    results.push(result);
                    result = {};
                    result.x = tmp_x + _map[j][i].getWidth();
                    result.y = tmp_y + _map[j][i].getHeight();
                    results.push(result);
                    result = {};
                    
                }
                if (_map[j][i].haveTopEdge()) {
                    
                    result.x = tmp_x;
                    result.y = tmp_y;
                    results.push(result);
                    result = {};
                    
                }
                if (_map[j][i].haveBotEdge()) {
                    
                    result.x = tmp_x;
                    result.y = tmp_y + _map[j][i].getHeight();
                    results.push(result);
                    result = {};
                   
                }
                if (results.length == 0) continue;
                return results;
            }
        }
    }

    return null;
}

function Rule16() {
    Rule.call(this, 16);
}

Rule16.prototype.match = function(_map){

    var mid_pos_x = Math.round(_map.length / 2) - 1;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    for (var i = 0; i < _map[0].length; i++) {
        if (_map[mid_pos_x][i].getType() >= 13 && _map[mid_pos_x][i].getType() < 16) {
            result.space = _map[mid_pos_x][i];
            var dist = _map[mid_pos_x][i].getWidth() / 3;
            var tmp_x = _map[mid_pos_x][i].getX() + dist;
            var tmp_y = _map[mid_pos_x][i].getY();
            if (_map[mid_pos_x][i].haveTopEdge()) {
               
                    result.x = tmp_x;
                    result.y = tmp_y;
                    results.push(result);
                    result = {};
                    result.x = tmp_x + dist;
                    result.y = tmp_y;
                    results.push(result);
                    result = {};

            }

            if (_map[mid_pos_x][i].haveBotEdge()) {
                result.x = tmp_x;
                result.y = tmp_y + _map[mid_pos_x][i].getHeight();
                results.push(result);
                result = {};
                result.x = tmp_x + dist;
                result.y = tmp_y + _map[mid_pos_x][i].getHeight();
                results.push(result);
                result = {};
            }
            if (results.length == 0) continue;
            return results;
        }
    }
    return null;
}

function Rule17() {
    Rule.call(this, 17);
}

Rule17.prototype.match = function (_map) {

    var mid_pos_x = Math.round(_map.length / 2) - 1;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };


    for (var i = 0; i < _map[0].length; i++) {
        for (var j = mid_pos_x - 1; j >= 0; j--) {
            if (_map[j][i].getType() > 0 && _map[j][i].getType() < 17) {
                if (_map[j][i].getType() == 14) {
                    result.space = _map[j][i];
                    var tmp_x = _map[j][i].getX();
                    var tmp_y = _map[j][i].getY();
                    if (_map[j][i].getWidth() == _map[j][i].getHeight()) {
                        if (i < Math.round(_map[0].length / 2)) {
                            if (_map[j][i].haveTopEdge()) {
                                result.x = tmp_x + _map[i][j].getWidth() / 2;
                                result.y = tmp_y;
                                results.push(result);
                                result = {};
                            }

                            if (_map[j][i].haveBotEdge() && !_map[j][i].isSideCorridor()) {
                                result.x = tmp_x + _map[j][i].getWidth() / 2;
                                result.y = tmp_y + _map[j][i].getHeight();
                                results.push(result);
                                result = {};
                            }
                        }
                        else {
                            if (_map[j][i].haveBotEdge()) {
                                result.x = tmp_x + _map[j][i].getWidth() / 2;
                                result.y = tmp_y + _map[j][i].getHeight();
                                results.push(result);
                                result = {};
                            }
                        }
                        if (_map[j][i].haveLeftEdge()) {
                            result.x = tmp_x;
                            result.y = tmp_y + _map[j][i].getHeight() / 2;
                            results.push(result);
                            result = {};
                        }
                        if (results.length == 0) continue;
                        return results;
                    } else {
                        if (_map[j][i].getWidth() > _map[j][i].getHeight()) {
                            if (_map[j][i].haveTopEdge()) {
                                result.x = tmp_x + _map[j][i].getWidth() / 2;
                                result.y = tmp_y;
                                results.push(result);
                                result = {};
                            }
                            if (_map[j][i].haveBotEdge()) {
                                result.x = tmp_x + _map[j][i].getWidth() / 2;
                                result.y = tmp_y + _map[j][i].getHeight();
                                results.push(result);
                                result = {};
                            }
                            return results;
                        }
                        if (_map[j][i].haveLeftEdge()) {
                            result.x = tmp_x;
                            result.y = tmp_y + _map[j][i].getHeight() / 2;
                            results.push(result);
                            result = {};
                        }
                        if (_map[j][i].haveRightEdge()) {
                            result.x = tmp_x + _map[j][i].getWidth();
                            result.y = tmp_y + _map[j][i].getHeight() / 2;
                            results.push(result);
                            result = {};
                        }
                    }
                }
                if (results.length == 0) continue;
                return results;
            }
        }
    }

    return null;
}

function Rule18() {
    Rule.call(this, 18);
}

Rule18.prototype.match = function (_map) {

    var mid_pos_x = Math.round(_map.length / 2) - 1;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };


    for (var i = 0; i < _map[0].length; i++) {
        for (var j = mid_pos_x + 1; j < _map.length; j++) {
            if (_map[j][i].getType() > 0 && _map[j][i].getType() < 18) {
                if (_map[j][i].getType() == 15) {
                    result.space = _map[j][i];
                    var tmp_x = _map[j][i].getX();
                    var tmp_y = _map[j][i].getY();
                    if (_map[j][i].getWidth() == _map[j][i].getHeight()) {
                        if (i < Math.round(_map[0].length / 2)) {
                            if (_map[j][i].haveTopEdge()) {
                                result.x = tmp_x + _map[j][i].getWidth() / 2;
                                result.y = tmp_y;
                                results.push(result);
                                result = {};
                            }

                            if (_map[j][i].haveBotEdge() && !_map[j][i].isSideCorridor()) {
                                result.x = tmp_x + _map[j][i].getWidth() / 2;
                                result.y = tmp_y + _map[j][i].getHeight();
                                results.push(result);
                                result = {};
                            }

                        } else {
                            if (_map[j][i].haveBotEdge()) {
                                result.x = tmp_x + _map[j][i].getWidth() / 2;
                                result.y = tmp_y + _map[j][i].getHeight();
                                results.push(result);
                                result = {};
                            }
                        }
                        if (_map[j][i].haveRightEdge()) {
                            result.x = tmp_x + _map[j][i].getWidth();
                            result.y = tmp_y + _map[j][i].getHeight() / 2;
                            results.push(result);
                            result = {};
                        }
                        if (results.length == 0) continue;
                        return results;
                    } else {
                        if (_map[j][i].getWidth() > _map[j][i].getHeight()) {
                            if (_map[j][i].haveTopEdge()) {
                                result.x = tmp_x + _map[j][i].getWidth() / 2;
                                result.y = tmp_y;
                                results.push(result);
                                result = {};
                            }
                            if (_map[j][i].haveBotEdge()) {
                                result.x = tmp_x + _map[j][i].getWidth() / 2;
                                result.y = tmp_y + _map[j][i].getHeight();
                                results.push(result);
                                result = {};
                            }
                            return results;
                        }
                        if (_map[j][i].haveLeftEdge()) {
                            result.x = tmp_x;
                            result.y = tmp_y + _map[j][i].getHeight() / 2;
                            results.push(result);
                            result = {};
                        }
                        if (_map[j][i].haveRightEdge()) {
                            result.x = tmp_x + _map[j][i].getWidth();
                            result.y = tmp_y + _map[j][i].getHeight() / 2;
                            results.push(result);
                            result = {};
                        }
                    }
                }
                if (results.length == 0) continue;
                return results;
            }  
        }
    }
    return null;
}

//Stage 4 
function Rule19() {
    Rule.call(this, 19);
}

//Top way
Rule19.prototype.match = function (_map) {
    var tra_pos_x = 0;
    var tra_pos_y = 0;
    var h_offset = 20;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    var end_pos_x = _map.length - 1;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;
        tra_pos_y++;
        end_pos_x--;
    }
    for (var i = tra_pos_x; i <= end_pos_x; i++) {
        if (_map[i][tra_pos_y].getType() > 0 && _map[i][tra_pos_y].getTopEdge() < 19) {
            if (_map[i][tra_pos_y].haveTopEdge() && i != Math.round(_map.length / 2) - 1) {
                result.space = _map[i][tra_pos_y];
                result.x = _map[i][tra_pos_y].getX();
                result.y = _map[i][tra_pos_y].getY();
                result.w = _map[i][tra_pos_y].getWidth();
                result.h = h_offset;
                results.push(result);
                result = {};
                return results;
            }
        }
    }
    return null;
}

function Rule20() {
    Rule.call(this, 20);
}

//Right
Rule20.prototype.match = function (_map) {
    var tra_pos_x = _map.length - 1;
    var tra_pos_y = 0;
    var w_offset = 20;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    var end_pos_y = Math.round(_map[0].length / 2) - 1;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x--;
        tra_pos_y++;
    }
    for (var i = tra_pos_y; i <= end_pos_y; i++) {
        if (_map[tra_pos_x][i].getType() > 0) {
            if (_map[tra_pos_x][i].getType() > 0) {
                if (_map[tra_pos_x][i].haveRightEdge() && _map[tra_pos_x][i].getRightEdge() < 19) {
                    result.space = _map[tra_pos_x][i];
                    result.x = _map[tra_pos_x][i].getX() + _map[tra_pos_x][i].getWidth();
                    result.y = _map[tra_pos_x][i].getY();
                    result.w = w_offset;
                    result.h = _map[tra_pos_x][i].getHeight();
                    results.push(result);
                    result = {};
                    return results;
                }
            }
        }

    }
    return null;
}

function Rule21() {
    Rule.call(this, 21);
}

//Bot
Rule21.prototype.match = function (_map) {
    var tra_pos_x = _map.length - 1;
    var tra_pos_y = _map[0].length - 1;
    var h_offset = 20;
    var y_dist = _map.length - 1;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    var end_pos_x = 0;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x--;
        tra_pos_y--;
        end_pos_x++;
        y_dist -= 2;    //副階
    }
    for (var i = tra_pos_x; i >= end_pos_x; i -= y_dist) {
        if (_map[i][tra_pos_y].getType() > 0 && _map[i][tra_pos_y].getBotEdge() < 19) {
            if (_map[i][tra_pos_y].haveBotEdge()) {
                result.space = _map[i][tra_pos_y];
                result.x = _map[i][tra_pos_y].getX();
                result.y = _map[i][tra_pos_y].getY() + _map[i][tra_pos_y].getHeight();
                result.w = _map[i][tra_pos_y].getWidth();
                result.h = h_offset;
                results.push(result);
                result = {};
                return results;
            }
        }
    }
    return null;
}

function Rule22() {
    Rule.call(this, 22);
}

//Left
Rule22.prototype.match = function (_map) {
    var tra_pos_x = 0;
    var tra_pos_y = 0;
    var w_offset = 20;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    var end_pos_y = Math.round(_map[0].length / 2) - 1;
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;
        tra_pos_y++;
    }
    for (var i = tra_pos_y; i <= end_pos_y; i++) {
        if (_map[tra_pos_x][i].getLeftEdge() < 19 && _map[tra_pos_x][i].getType() > 0) {
            if (_map[tra_pos_x][i].haveLeftEdge()) {
                result.space = _map[tra_pos_x][i];
                result.x = _map[tra_pos_x][i].getX();
                result.y = _map[tra_pos_x][i].getY();
                result.w = w_offset;
                result.h = _map[tra_pos_x][i].getHeight();
                results.push(result);
                result = {};
                return results;
            }
        }
    }
    return null;
}

//Stage 5

function Rule23() {
    Rule.call(this, 23);
}

Rule23.prototype.match = function(_map){
    var h_offset = 10;
    var mid_pos_x = Math.round(_map.length / 2) - 1;
    var tra_pos_y = 0;
    var dist_y = _map[0].length - 1;
    
    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    //Justfy position
    if (_map[mid_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_y++;
        dist_y -= 2;   //副階
    }

    if (_map[mid_pos_x][tra_pos_y].getType() != this.name && _map[mid_pos_x][tra_pos_y].getType() > 0) {
        result.space = _map[mid_pos_x][tra_pos_y];
        result.x = _map[mid_pos_x][tra_pos_y].getX();
        result.y = _map[mid_pos_x][tra_pos_y].getY();
        result.w = _map[mid_pos_x][tra_pos_y].getWidth();
        result.h = h_offset;
        results.push(result);
        result = {};
        return results;
    }
    tra_pos_y += dist_y;
    if (_map[mid_pos_x][tra_pos_y].getType() != this.name && _map[mid_pos_x][tra_pos_y].getType() > 0) {
        result.space = _map[mid_pos_x][tra_pos_y];
        result.x = _map[mid_pos_x][tra_pos_y].getX();
        result.y = _map[mid_pos_x][tra_pos_y].getY() + _map[mid_pos_x][tra_pos_y].getHeight();
        result.w = _map[mid_pos_x][tra_pos_y].getWidth();
        result.h = h_offset;
        results.push(result);
        result = {};
        return results;
    }
    return null;
}

function Rule24() {
    Rule.call(this, 24);
}

//Left windows
Rule24.prototype.match = function (_map) {
    var w_offset = 8;
    var tra_pos_x = 0;
    var tra_pos_y = Math.round(_map[0].length / 2);
    var end_pos_y = _map[0].length - 1;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    //Justfy position
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;
        end_pos_y--;   //副階
    }

    for (var i = tra_pos_y; i <= end_pos_y; i++) {
        if (_map[tra_pos_x][i].getType() != this.name && _map[tra_pos_x][i].getType() > 0) {
            result.space = _map[tra_pos_x][i];
            result.x = _map[tra_pos_x][i].getX();
            result.y = _map[tra_pos_x][i].getY();
            result.w = w_offset;
            result.h = _map[tra_pos_x][i].getHeight();
            results.push(result);
            result = {};
            return results;
        }
    }
    return null;
}

function Rule25() {
    Rule.call(this, 25);
}

//Right window 
Rule25.prototype.match = function (_map) {
    var w_offset = 8;
    var tra_pos_x = _map.length - 1;
    var tra_pos_y = Math.round(_map[0].length / 2);
    var end_pos_y = _map[0].length - 1;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    //Justfy position
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x--;
        end_pos_y--;   //副階
    }

    for (var i = tra_pos_y; i <= end_pos_y; i++) {
        if (_map[tra_pos_x][i].getType() != this.name && _map[tra_pos_x][i].getType() > 0) {
            result.space = _map[tra_pos_x][i];
            result.x = _map[tra_pos_x][i].getX() + _map[tra_pos_x][i].getWidth();
            result.y = _map[tra_pos_x][i].getY();
            result.w = w_offset;
            result.h = _map[tra_pos_x][i].getHeight();
            results.push(result);
            result = {};
            return results;
        }
    }
    return null;
}

function Rule26() {
    Rule.call(this, 26);
}

//Bot side
Rule26.prototype.match = function (_map) {
    var h_offset = 8;
    var tra_pos_x = 1;
    var tra_pos_y = _map[0].length - 1;
    var end_pos_x = _map.length - 2;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    //Justfy position
    if (_map[tra_pos_x][tra_pos_y].isSideCorridor()) {
        tra_pos_x++;   //副階     
        tra_pos_y--;   //副階
        end_pos_x--;   //副階
    }

    for (var i = tra_pos_x; i <= end_pos_x; i++) {
        if (i != Math.round(_map.length /2) - 1) {
            if (_map[i][tra_pos_y].getType() != this.name && _map[i][tra_pos_y].getType() > 0) {
                result.space = _map[i][tra_pos_y];
                result.x = _map[i][tra_pos_y].getX();
                result.y = _map[i][tra_pos_y].getY() + _map[i][tra_pos_y].getHeight();
                result.w = _map[i][tra_pos_y].getWidth();
                result.h =h_offset;
                results.push(result);
                result = {};
                return results;
            }
        }
    }
    return null;
}

//Stage 6
function Rule27(){
    Rule.call(this, 27);
}

//Top
Rule27.prototype.match = function(_map){
    var mid_pos_x = Math.round(_map.length / 2) - 1;
    var tra_pos_y = 0;
    var deapth = 50;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    if (_map[mid_pos_x][tra_pos_y].getType() > 0 && _map[mid_pos_x][tra_pos_y].getType() != this.name) {
        result.space = _map[mid_pos_x][tra_pos_y];
        result.x = _map[mid_pos_x][tra_pos_y].getX();
        result.y = _map[mid_pos_x][tra_pos_y].getY();
        result.w = _map[mid_pos_x][tra_pos_y].getWidth();
        result.h = deapth;
        results.push(result);
        result = {};
        return results;
    }
    return null;
}

//Bot
function Rule28() {
    Rule.call(this, 28);
}

Rule28.prototype.match = function (_map) {
    var mid_pos_x = Math.round(_map.length / 2) - 1;
    var tra_pos_x = mid_pos_x - 2;
    var tra_pos_y = _map[0].length - 1;
    var dist_x = 2;

    var results = [];
    var result = { name: this.name, color: this.color.rgb };

    for (var i = tra_pos_x; i <= mid_pos_x + 2; i += dist_x) {
        if (_map[i][tra_pos_y]) {
            if (_map[i][tra_pos_y].getType() > 0 && _map[i][tra_pos_y].getType() != this.name) {
                result.space = _map[i][tra_pos_y];
                result.x = _map[i][tra_pos_y].getX();
                result.y = _map[i][tra_pos_y].getY() + _map[i][tra_pos_y].getHeight();
                result.w = _map[i][tra_pos_y].getWidth();
                result.h = 50;
                results.push(result);
                result = {};
                return results;
            }
        }
    }
    return null;
}

//Stage 7
function Rule29() {
    Rule.call(this, 29);
}

Rule29.prototype.match = function (_map) {
    if (_map[0][0].getType() != this.name) return { name: this.name, spaces: [_map] };
    return null;
}