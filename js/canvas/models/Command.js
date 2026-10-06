function ColumnCommand(_scene, _fac, _space, _dots) {
    var my_id = [];
    this.execute = function () {
        for (var i = 0; i < _dots.length; i++) {
            var id = idInCode(_dots[i].x, _dots[i].z);
            my_id.push(id);
            if (_space.isSideCorridor()) {
                _fac.addSecondColumn(id, _dots[i].x, _dots[i].z);
            }
            else {
                _fac.addCenterColume(id, _dots[i].x, _dots[i].z);
            }
        }
    }

    this.undo = function () {
        for (var i = 0; i < my_id.length; i++) {
            _fac.removeMesh(_scene, my_id[i]);
        }
    }
}


function CancelColumnsCommand(_scene, _fac, _coors) {
    var my_coors = [];

    this.execute = function(){
        for (var i = 0; i < _coors.length; i++) {
            var id = idInCode(_coors[i].x, _coors[i].z);

            // remember the kind of column and how many placements it had, so undo puts all of them back
            var coor = { x: _coors[i].x, z: _coors[i].z, part: null, count: 0 };
            var mesh;
            while ((mesh = _scene.getObjectByName(id))) {
                coor.part = mesh.userData.part;
                _fac.removeMesh(_scene, id);
                coor.count++;
            }
            my_coors.push(coor);
        }
    }

    this.undo = function(){
        for (var i = 0; i < my_coors.length; i++) {
            var id = idInCode(my_coors[i].x, my_coors[i].z);
            for (var j = 0; j < my_coors[i].count; j++) {
                if (my_coors[i].part == 'SecondColumn') _fac.addSecondColumn(id, my_coors[i].x, my_coors[i].z);
                else _fac.addCenterColume(id, my_coors[i].x, my_coors[i].z);
            }
        }
    }
}

function AddBracketsCommand(_scene, _fac, _space, _points, _w, _h) {
    var mid_x = Math.round(_w / 2) - 1;
    var mid_y = Math.round(_h / 2) - 1;
    var my_id = [];

    this.execute = function () {
        
        if (!doGirderBracket(_space, _points)) { //樑上鋪作
            //樑
            var tmp_h;
            var l_h = 0.26; // 長柱樑高
            var s_h = 0.17;
            if (_space.haveTopEdge()) {
                
                var width = adjustWidth(_space.getWidth());
                
                if (_space.isSideCorridor() && _space.getIndexJ() == 0) tmp_h = s_h;
                else if (_space.getIndexI() == 0 || _space.getIndexI() == _w - 1){
                    if (_space.isSideCorridor()) tmp_h = s_h;
                    else tmp_h = l_h;
                } 
                else tmp_h = l_h;
               
                doAddGirder(adjustX(_space.getX(), _w) + width / 2, tmp_h, adjustZ(_space.getY(), _h), width, 0)
                
            }
            if (_space.haveBotEdge()) {
                var width = adjustWidth(_space.getWidth());
                var height = adjustHeight(_space.getHeight());
               
                if (_space.isSideCorridor() && _space.getIndexJ() == _h - 1) tmp_h = s_h;
                else if (_space.getIndexI() == 0 || _space.getIndexI() == _w - 1){
                    if (_space.isSideCorridor()) tmp_h = s_h;
                    else tmp_h = l_h;
                }
                else tmp_h = l_h;

                doAddGirder(adjustX(_space.getX(), _w) + width / 2, tmp_h, adjustZ(_space.getY(), _h) + height, width, 0)
            }
            if (_space.haveRightEdge()) {
                var width = adjustWidth(_space.getWidth());
                var height = adjustHeight(_space.getHeight());
               
                
                if (_space.isSideCorridor() && _space.getIndexI() == _w - 1) tmp_h = s_h;
                else if (_space.getIndexJ() == 0 || _space.getIndexJ() == _h - 1){
                    if (_space.isSideCorridor()) tmp_h = s_h;
                    else tmp_h = l_h;
                }
                else tmp_h = l_h;

                doAddGirder(adjustX(_space.getX(), _w) + width, tmp_h, adjustZ(_space.getY(), _h) + height / 2, height, Math.PI / 2);
               
            }
            if (_space.haveLeftEdge()) {
                var height = adjustHeight(_space.getHeight(), _h);
                var x = adjustX(_space.getX(), _w);
                
                if (_space.isSideCorridor() && _space.getIndexI() == 0) tmp_h = s_h;
                else if (_space.getIndexJ() == 0 || _space.getIndexJ() == _h - 1){
                    if (_space.isSideCorridor()) tmp_h = s_h;
                    else tmp_h = l_h;
                }
                else tmp_h = l_h;

                doAddGirder(adjustX(_space.getX(), _w), tmp_h, adjustZ(_space.getY(), _h) + height / 2, height, Math.PI / 2);
                
            }
        }
        //
        // 1 : 5等材水平鋪作 2:5等材角鋪作 3:7等材水平鋪作 4:7等材角鋪作
        //
        for (var i = 0; i < _points.length; i++) {
            //鋪作
            if (belongLeftTopHypot(_space)) {

                var type, rad;
                if (_points[i].x == _space.getX()) {                              //右下斜

                    if (_points[i].y == _space.getY()) {

                        if(_space.isSideCorridor()) type = 2;
                        else type = 4;

                        rad =  Math.PI / 2;

                    }else{
                        if(_space.isSideCorridor()) type = 1;
                        else type = 3;

                        rad = Math.PI / 2;
                    }
                } else if (_points[i].y == _space.getY() + _space.getHeight()) {
                    
                    if (_points[i].x == _space.getX() + _space.getWidth()) {
                        type = 4;
                        rad = Math.PI / 2;

                    }else{

                        if(_space.isSideCorridor()) type = 1;
                        else type = 3;

                        rad = Math.PI / 2;
                    }
                }else{

                    if(_space.isSideCorridor()) type = 1;
                    else type = 3;
                    rad = 0;
                }

                addBracket(type, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), rad);

            } else if (belongLeftBotHypot(_space, _h)) {

                var type, rad;

                if (_points[i].x == _space.getX() + _space.getWidth()) {
                    
                    if (_points[i].y == _space.getY()) {
                        type = 4;
                        rad = Math.PI;
                    }else{
                        if(_space.isSideCorridor()) type = 1;
                        else type = 3;
                        rad =  Math.PI;
                    }

                } else if (_points[i].y == _space.getY() + _space.getHeight()) {

                    if (_points[i].x == _space.getX()) {
                        if(_space.isSideCorridor()) type = 2;
                        else type = 4;
                        rad = Math.PI;
                    }else{
                        if(_space.isSideCorridor()) type = 1;
                        else type = 3;
                        rad =  Math.PI;
                    }

                }else{

                    if(_space.isSideCorridor()) type = 1;
                    else type = 3;
                    rad =  Math.PI / 2;

                }

                addBracket(type, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), rad);

               
            } else if (belongRightBotHypot(_space, _w, _h)) {

                var type, rad;
                if (_points[i].x == _space.getX()) {                              //右下斜

                    if (_points[i].y == _space.getY()) {
                        type = 4;
                        rad =  -Math.PI / 2;
                    }else{
                        if(_space.isSideCorridor()) type = 1;
                        else type = 3;
                        rad = Math.PI;
                    }
                } else if (_points[i].y == _space.getY() + _space.getHeight()) {
                    
                    if (_points[i].x == _space.getX() + _space.getWidth()) {
                        if(_space.isSideCorridor()) type = 2;
                        else type = 4;
                        rad = -Math.PI / 2;
                    }else{
                        if(_space.isSideCorridor()) type = 1;
                        else type = 3;
                        rad = Math.PI;
                    }
                }else{
                    if(_space.isSideCorridor()) type = 1;
                    else type = 3;
                    rad = -Math.PI / 2;
                }

                addBracket(type, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), rad);

            } else if (belongRightTopHypot(_space, _w)) {

                var type, rad;

                if (_points[i].x == _space.getX() + _space.getWidth()) {
                    
                    if (_points[i].y == _space.getY()) {
                        if(_space.isSideCorridor()) type = 2;
                        else type = 4;
                        rad = 0;
                    }else{
                        if(_space.isSideCorridor()) type = 1;
                        else type = 3;
                        rad = -Math.PI / 2;
                    }

                } else if (_points[i].y == _space.getY() + _space.getHeight()) {

                    if (_points[i].x == _space.getX()) {
                        type = 4;
                        rad = 0;
                    }else{
                        if(_space.isSideCorridor()) type = 1;
                        else type = 3;
                        rad = -Math.PI / 2;
                    }

                }else{

                    if(_space.isSideCorridor()) type = 1;
                    else type = 3;
                    rad =  0;

                }

                addBracket(type, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), rad);
              
            } else if (belongTopSide(_space, _w)) {
                if (belongLeftTopHypot(_space.getLeftSpace())) {
                    if (_points[i].x == _space.getX() && _points[i].y == _space.getY() + _space.getHeight()) {
                        addBracket(4, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), Math.PI / 2);
                        continue;
                    }
                } else if (belongRightTopHypot(_space.getRightSpace(), _w)) {
                    if (_points[i].x == _space.getX() + _space.getWidth() && _points[i].y == _space.getY() + _space.getHeight()) {
                        addBracket(4, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), 0);
                        continue;
                    }
                }

                if (_space.getIndexJ() == mid_y) {
                    if (_points[i].y == _space.getY() + _space.getHeight())
                    {
                        addBracket(3, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), Math.PI);
                        continue;
                    }
                }

                var type, rad = 0;
                if (_space.isSideCorridor() && _points[i].y == _space.getY()) type = 1
                else type = 3;

                addBracket(type, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), rad);
                
            } else if (belongBotSide(_space, _w, _h)) {
                if (belongLeftBotHypot(_space.getLeftSpace(), _h)) {
                    if (_points[i].x == _space.getX() && _points[i].y == _space.getY()) {
                        addBracket(4, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), Math.PI);
                        continue;
                    }
                } else if (belongRightBotHypot(_space.getRightSpace(), _w, _h)) {
                    if (_points[i].x == _space.getX() + _space.getWidth() && _points[i].y == _space.getY()) {
                        addBracket(4, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), -Math.PI / 2);
                        continue;
                    }
                }
                var type, rad = Math.PI;
                if (_space.isSideCorridor() && _points[i].y == _space.getY() + _space.getHeight()) type = 1
                else type = 3;

                addBracket(type, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), rad);

            } else if (belongLeftSide(_space, _h)) {
                if (belongLeftTopHypot(_space.getTopSpace())) {
                    if (_points[i].x == _space.getX() + _space.getWidth() && _points[i].y == _space.getY()) {
                        addBracket(4, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), Math.PI / 2);
                        continue;
                    }
                } else if (belongLeftBotHypot(_space.getBotSpace(), _h)) {
                    if (_points[i].x == _space.getX() + _space.getWidth() && _points[i].y == _space.getY() + _space.getHeight()) {
                        addBracket(4, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), Math.PI);
                        continue;
                    }
                }
                var type, rad = Math.PI / 2;
                if (_space.isSideCorridor() && _points[i].x == _space.getX()) type = 1
                else type = 3;

                addBracket(type, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), rad);

            } else if (belongRightSide(_space, _w, _h)) {
                if (belongRightTopHypot(_space.getTopSpace(), _w)) {
                    if (_points[i].x == _space.getX() && _points[i].y == _space.getY()) {
                        addBracket(4, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), 0);
                        continue;
                    }      
                } else if (belongRightBotHypot(_space.getBotSpace(), _w, _h)) {
                    if (_points[i].x == _space.getX() && _points[i].y == _space.getY() + _space.getHeight()) {
                        addBracket(4, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), -Math.PI / 2);
                        continue;
                    }
                }
                var type, rad = -Math.PI / 2;
                if (_space.isSideCorridor() && _points[i].x == _space.getX() + _space.getWidth()) type = 1
                else type = 3;

                addBracket(type, adjustX(_points[i].x, _w), adjustZ(_points[i].y, _h), rad);
            }
        }
    }

    this.undo = function(){
        for (var i = 0; i < my_id.length; i++) {
            _fac.removeMesh(_scene, my_id[i]);
        }
    }
 
    function belongLeftTopHypot(_space){
        var tmp_x = 0;
        var tmp_y = 0;
        while(tmp_x < mid_x && tmp_y <= mid_y ){
            if(_space.getIndexI() == tmp_x && _space.getIndexJ() == tmp_y){
                return true;
            } 
            tmp_x++;
            tmp_y++;
        }
        return false;
    }

    function belongLeftBotHypot(_space, _h){
        var tmp_x = 0;
        var tmp_y = _h - 1;
        while(tmp_x < mid_x && tmp_y > mid_y ){
            if(_space.getIndexI() == tmp_x && _space.getIndexJ() == tmp_y){
                return true;
            } 
            tmp_x++;
            tmp_y--;
        }
        return false;
    }

    function belongRightTopHypot(_space, _w){
        var tmp_x = _w - 1;
        var tmp_y = 0;
        while(tmp_x > mid_x && tmp_y <= mid_y ){
            if(_space.getIndexI() == tmp_x && _space.getIndexJ() == tmp_y){
                return true;
            } 
            tmp_x--;
            tmp_y++;
        }
        return false;
    }

    function belongRightBotHypot(_space, _w, _h){
        var tmp_x = _w - 1;
        var tmp_y = _h - 1;
        while(tmp_x > mid_x && tmp_y > mid_y ){
            if(_space.getIndexI() == tmp_x && _space.getIndexJ() == tmp_y){
                return true;
            } 
            tmp_x--;
            tmp_y--;
        }
        return false;
    }

    function belongTopSide(_space, _w){
        var tmp_x = 1;
        var tmp_y = 0;
        var count = _w - 2;           //扣掉最外面兩個
        while(tmp_y <= mid_y ){
            for(var i = tmp_x ; i <= count; i++){
                if(_space.getIndexI() == i && _space.getIndexJ() == tmp_y){
                    return true;
                }
            }
            count--;
            tmp_x++;
            tmp_y++;
        }
        return false;
    }

    function belongLeftSide(_space, _h){
        var tmp_x = 0;
        var tmp_y = 1;
        var count = _h - 2;           //扣掉最外面兩個
        while (tmp_x < mid_x) {
            for(var i = tmp_y ; i <= count; i++){
                if(_space.getIndexI() == tmp_x && _space.getIndexJ() == i){
                    return true;
                }
            }
            count--;
            tmp_x++;
            tmp_y++;
        }
        return false;
    }

    function belongRightSide(_space, _w, _h){
        var tmp_x = _w - 1;
        var tmp_y = 1;
        var count = _h - 2;           //扣掉最外面兩個
        while (tmp_x > mid_x) {
            for(var i = tmp_y ; i <= count; i++){
                if(_space.getIndexI() == tmp_x && _space.getIndexJ() == i){
                    return true;
                }
            }
            count--;
            tmp_x--;
            tmp_y++;
        }
        return false;
    }

    function belongBotSide(_space, _w, _h){
        var tmp_x = 1;
        var tmp_y = _h - 1;
        var count = _w - 2;           //扣掉最外面兩個
        while (tmp_y > mid_y) {
            for(var i = tmp_x ; i <= count; i++){
                if (_space.getIndexI() == i && _space.getIndexJ() == tmp_y) {
                    return true;
                }
            }
            count--;
            tmp_x++;
            tmp_y--;
        }
        return false;
    }

    function adjustX(_x, _w) {
        return org_pos_x + space_length * (_x - 50) / 100;
    }

    function adjustZ(_y, _h) {
        return org_pos_z + space_length * (_y - 200) / 100;
    }

    function addBracket(_val, _x, _z, _ray) {
        var id;
        switch (_val) {
            case 1:
                id = "Bracket" + _x.toString() + _z.toString();
                _fac.addFiveForwardBracket(id, _x, _z, _ray);
                my_id.push(id);
                break;
            case 2:
                id = "Bracket" + _x.toString() + _z.toString();
                _fac.addFiveObliquelyBracket(id, _x, _z, _ray);
                my_id.push(id);
                break;
            case 3:
                id = "Bracket" + _x.toString() + _z.toString();
                _fac.addSevenForwardBracket(id, _x, _z, _ray);
                my_id.push(id);
                break;
            case 4:
                id = "Bracket" + _x.toString() + _z.toString();
                _fac.addSevenObliquelyBracket(id, _x, _z, _ray);
                my_id.push(id);
                break;
        }
    }

    function doGirderBracket(_space, _points) {
        for (var i = 0; i < _points.length; i++) {

            if (_points[i].x > _space.getX() && _points[i].x < _space.getX() + _space.getWidth())
                return true;
            if (_points[i].y > _space.getY() && _points[i].y < _space.getY() + _space.getHeight())
                return true;
        }
        return false;
    }

    function doAddGirder(_x, _y, _z, _width, _rad_y) {
        id = "Girder" + _x.toString() + _z.toString();
        _fac.addGirder(id, _x, _y, _z, _width, _rad_y);
        my_id.push(id);
    }
}

function adjustWidth(_width) {
    return space_length * (_width / 100);
}

function adjustHeight(_height) {
    return space_length * (_height / 100);
}

function AddWallCommand(_scene, _fac, _data, _coor, _w, _h) {
    var my_id;
    var mid_x = Math.round(_w / 2) - 1;
    var mid_y = Math.round(_h / 2) - 1;

    this.execute = function () {
        var rad_y, width, x, z;
        if (_data.w > _data.h) {

            width = adjustWidth(_data.space.getWidth());
            deapth = adjustHeight(_data.space.getHeight());

            if (_data.space.getIndexJ() <= mid_y) {
                rad_y = Math.PI / 2
                z = _coor.z;
            } else {
                rad_y = -Math.PI / 2;
                z = _coor.z + deapth;
            }

            x = _coor.x + width / 2;

        }
        else {
            deapth = adjustWidth(_data.space.getWidth());
            width = adjustHeight(_data.space.getHeight());

            if (_data.space.getIndexI() < mid_x) {
                rad_y = 0;
                x = _coor.x;
            }
            else {
                rad_y = Math.PI;
                x = _coor.x + deapth;
            }

            z = _coor.z + width / 2;
        }

        var id = "Wall" + idInCode(x, z);
        _fac.addWall(id, x, z, rad_y);
        my_id = id;
    }
    
    this.undo = function () {
        _fac.removeMesh(_scene, my_id);
    }
}

function AddDoorandWindowCommand(_scene, _fac, _data, _coor, _w, _h) {
    var my_id;
    var mid_x = Math.round(_w / 2) - 1;
    var mid_y = Math.round(_h / 2) - 1;

    this.execute = function () {
        var rad_y, width, deapth, x, z;
        if (_data.w > _data.h) {

            width = adjustWidth(_data.space.getWidth());
            deapth = adjustHeight(_data.space.getHeight());
           
            if (_data.space.getIndexJ() <= mid_y){
                rad_y = Math.PI / 2
                z = _coor.z;
            } else {
                rad_y = -Math.PI / 2;
                z = _coor.z + deapth;
            } 
            
            x = _coor.x + width / 2;
            
        }
        else {
            deapth = adjustWidth(_data.space.getWidth());
            width = adjustHeight(_data.space.getHeight());

            if (_data.space.getIndexI() < mid_x) {
                rad_y = 0;
                x = _coor.x;
            }
            else {
                rad_y = Math.PI;
                x = _coor.x + deapth;
            } 
            
            z = _coor.z + width / 2;
        }

        if (_data.w == 10 || _data.h == 10) {
            var id = "Door" + idInCode(x, z);
            _fac.addDoor(id, x, z, rad_y);
            my_id = id;
        } else {
            var id = "Wondow" + idInCode(x, z);
            _fac.addWindow(id, x, z, rad_y);
            my_id = id;
        }
       
    }

    this.undo = function () {
        _fac.removeMesh(_scene, my_id);
    }
}

function AddStairCommand(_scene, _fac, _data,  _coor, _w, _h) {
    var my_id;
    var mid_y = Math.round(_h / 2) - 1;

    this.execute = function () {
        var width = adjustWidth(_data.space.getWidth());
        var deapth = adjustHeight(_data.space.getHeight());

        var box = new THREE.Box3().setFromObject(_scene.getObjectByName("BaseSpace"));
        //console.log(box.min, box.max, box.size());

        if (_data.space.getIndexJ() <= mid_y) {
            rad_y = Math.PI / 2
            z = box.min.z;
        } else {
            rad_y = -Math.PI / 2
            z = box.max.z;
        }

        x = _coor.x + width / 2;

        var id = "Stair" + idInCode(x, z);
        _fac.addStair(id, x, z, rad_y);
        my_id = id;
    }

    this.undo = function () {
        _fac.removeMesh(_scene, my_id);
    }
}

function AddRoofCommand(_scene, _fac, _data) {
    var spaces = _data.spaces;
    var my_ids = [];

    this.execute = function () {
        var id = 0;
        if (spaces[0][0].isSideCorridor()) {
            //sidecorridor part
            //top side
            for (var i = 0; i < spaces.length - 1; i++) {
                var coor = adjustCoor({ x: spaces[i][0].getX(), y: spaces[i][0].getY() });
                _fac.addSideCorridorTopPartVirtical("Roof" + id.toString(), Math.PI / 2, coor.x + space_length * spaces[i][0].getWidth() / 100, coor.z);
                my_ids.push(id++);
                if (i == 0) {
                    _fac.addSideCornerTile("Roof" + id.toString(), coor.x + space_length / 2, 0.2, coor.z + space_length / 2, Math.PI / 2);
                    my_ids.push(id++);
                } else {
                    _fac.addSideBaseTile("Roof" + id.toString(), coor.x + +space_length / 2, 0.2, coor.z + space_length / 2, Math.PI / 2);
                    my_ids.push(id++);
                }
            }
            //left side
            for (var i = 0; i < spaces[0].length - 1; i++) {
                var coor = adjustCoor({ x: spaces[0][i].getX(), y: spaces[0][i].getY() });
                _fac.addSideCorridorTopPartVirtical("Roof" + id.toString(), Math.PI, coor.x, coor.z + space_length * spaces[0][i].getHeight() / 100);
                my_ids.push(id++);
                if (i != 0) {
                    _fac.addSideBaseTile("Roof" + id.toString(), coor.x + +space_length / 2, 0.2, coor.z + space_length / 2, Math.PI);
                    my_ids.push(id++);
                }


            }
            var coor = adjustCoor({ x: spaces[0][spaces[0].length - 1].getX(), y: spaces[0][spaces[0].length - 1].getY() });
            _fac.addSideCornerTile("Roof" + id.toString(), coor.x + space_length / 2, 0.2, coor.z, Math.PI);
            my_ids.push(id++);
            //bot side
            for (var i = 0; i < spaces.length - 1; i++) {
                var coor = adjustCoor({ x: spaces[i][spaces[0].length - 1].getX(), y: spaces[i][spaces[0].length - 1].getY() });
                _fac.addSideCorridorTopPartVirtical("Roof" + id.toString(), -Math.PI / 2, coor.x + space_length * spaces[i][spaces[0].length - 1].getWidth() / 100, coor.z + space_length / 2);
                my_ids.push(id++);
                if (i != 0) {
                    _fac.addSideBaseTile("Roof" + id.toString(), coor.x + +space_length / 2, 0.2, coor.z, -Math.PI / 2);
                    my_ids.push(id++);
                }


            }
            var coor = adjustCoor({ x: spaces[spaces.length - 1][spaces[0].length - 1].getX(), y: spaces[spaces.length - 1][spaces[0].length - 1].getY() });
            _fac.addSideCornerTile("Roof" + id.toString(), coor.x, 0.2, coor.z, -Math.PI / 2);
            my_ids.push(id++);
            //right side
            for (var i = 0; i < spaces[spaces.length - 1].length - 1; i++) {
                var coor = adjustCoor({ x: spaces[spaces.length - 1][i].getX(), y: spaces[spaces.length - 1][i].getY() });
                _fac.addSideCorridorTopPartVirtical("Roof" + id.toString(), 0, coor.x + space_length / 2, coor.z + space_length * spaces[spaces.length - 1][i].getHeight() / 100);
                my_ids.push(id++);
                if (i == 0) {
                    _fac.addSideCornerTile("Roof" + id.toString(), coor.x, 0.2, coor.z + space_length / 2, 0);
                    my_ids.push(id++);
                } else {
                    _fac.addSideBaseTile("Roof" + id.toString(), coor.x, 0.2, coor.z + space_length / 2, 0);
                    my_ids.push(id++);
                }
            }
            //main space part       
            //橫向面左
            for (var i = 2; i < spaces[0].length - 2; i++) {
                var coor = {};
                var offset_y = 0.3;
                coor = adjustCoor({ x: spaces[1][i].getX(), y: spaces[1][i].getY() });
                if (spaces[0].length - 2 <= 3) {                                                        //except handle
                    _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.105, offset_y + 0.01, coor.z + space_length / 4, Math.PI);
                    my_ids.push(id++);
                    _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.105, offset_y + 0.01, coor.z + space_length, Math.PI);
                    my_ids.push(id++);
                } else {
                    if (i < spaces[0].length / 2) {
                        _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.105, offset_y + 0.01, coor.z + space_length / 2.5, Math.PI);
                    } else {
                        _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.105, offset_y + 0.01, coor.z + space_length / 1.5, Math.PI);
                    }


                    my_ids.push(id++);
                }
            }
            //橫向面中間
            for (var i = 2; i < spaces.length - 2; i++) {
                var coor = {};
                var offset_y = 0.3;
                var scale_rate = spaces[0].length - 2;
                if (spaces[0].length % 2 == 0) {
                    var tmp_coor = adjustCoor({ x: spaces[i][spaces[0].length / 2].getX(), y: spaces[i][spaces[0].length / 2].getY() });
                    coor = { x: tmp_coor.x, z: tmp_coor.z };
                } else {
                    var tmp_coor = adjustCoor({ x: spaces[i][Math.floor(spaces[0].length / 2)].getX(), y: spaces[i][Math.floor(spaces[0].length / 2)].getY() });
                    coor = { x: tmp_coor.x, z: tmp_coor.z + space_length / 2 };
                }
                //縱向面外
                if (i == 2) {
                    _fac.addBaseTileOutside("Roof" + id.toString(), coor.x + space_length, offset_y, coor.z, Math.PI, scale_rate);
                } else if (i == spaces.length - 3) {
                    _fac.addBaseTileOutside("Roof" + id.toString(), coor.x, offset_y, coor.z, 0, scale_rate);
                } else {
                    _fac.addBaseTile("Roof" + id.toString(), coor.x, offset_y, coor.z, scale_rate);
                }
                
                my_ids.push(id++);
                offset_y += 0.1;
                //縱向面中
                for (j = 2; j < Math.round(spaces[0].length / 2) ; j++) {
                    if (i == 2) {
                        _fac.addMidTileOutside("Roof" + id.toString(), coor.x + space_length, offset_y + 0.001, coor.z + 0.005, Math.PI, scale_rate);
                    } else if (i == spaces.length - 3) {
                        _fac.addMidTileOutside("Roof" + id.toString(), coor.x, offset_y + 0.001, coor.z - 0.005, 0, scale_rate);
                    } else {
                        _fac.addMidTileInside("Roof" + id.toString(), coor.x, offset_y, coor.z, scale_rate);
                    }
                    my_ids.push(id++);
                    offset_y += 0.032;
                    if (spaces[0].length % 2 == 0) {
                        scale_rate -= 2;
                    } else {

                        scale_rate -= 1.67;
                    }
                }

                //縱向面頂
                var sscale_rate = 1;
                if (spaces[0].length % 2 == 0) {
                    if (i == 2) {
                        _fac.addTopTileOutside("Roof" + id.toString(), coor.x, offset_y + 0.001, coor.z, Math.PI, sscale_rate);
                    } else if (i == spaces.length - 3) {
                        _fac.addTopTileOutside("Roof" + id.toString(), coor.x + space_length - 0.005, offset_y + 0.002, coor.z, 0, sscale_rate);
                    } else {
                        _fac.addTopTileInside("Roof" + id.toString(), coor.x, offset_y, coor.z, sscale_rate);
                    }           
                } else {
                    if (spaces[0].length <= 5) sscale_rate = 0.74;
                    else sscale_rate = 0.86;
                    if (i == 2) {
                        _fac.addTopTileOutside("Roof" + id.toString(), coor.x, offset_y + 0.001, coor.z, Math.PI, sscale_rate);
                    } else if (i == spaces.length - 3) {
                        _fac.addTopTileOutside("Roof" + id.toString(), coor.x + space_length - 0.005, offset_y + 0.002, coor.z, 0, sscale_rate);
                    } else {
                        _fac.addTopTileInside("Roof" + id.toString(), coor.x, offset_y, coor.z, sscale_rate);
                    }
                }
                
                my_ids.push(id++);
            }
            //橫向面右
            for (var i = 2; i < spaces[0].length - 2; i++) {
                var coor = {};
                var offset_y = 0.3;
                coor = adjustCoor({ x: spaces[spaces.length - 2][i].getX(), y: spaces[spaces.length - 2][i].getY() });
                if (spaces[0].length - 2 <= 3) {                                                        //except handle
                    _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.05, offset_y + 0.01, coor.z + space_length / 6, 0);
                    my_ids.push(id++);
                    _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.05, offset_y + 0.01, coor.z + space_length / 1.2, 0);
                    my_ids.push(id++);
                } else {
                    if (i < spaces[0].length / 2) {
                        _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.05, offset_y + 0.01, coor.z + space_length / 3, 0);
                    } else {
                        _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.05, offset_y + 0.01, coor.z + space_length / 1.7, 0);
                    }
                    my_ids.push(id++);
                }
            }

        } else {
            //main space part       
            //橫向面左
            for (var i = 1; i < spaces[0].length - 1; i++) {
                var coor = {};
                var offset_y = 0.3;
                coor = adjustCoor({ x: spaces[0][i].getX(), y: spaces[0][i].getY() });
                if (spaces[0].length <= 3) {                                                        //except handle
                    _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.105, offset_y + 0.01, coor.z + space_length / 4, Math.PI);
                    my_ids.push(id++);
                    _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.105, offset_y + 0.01, coor.z + space_length, Math.PI);
                    my_ids.push(id++);
                } else {
                    if (i < spaces[0].length / 2) {
                        _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.105, offset_y + 0.01, coor.z + space_length / 2.5, Math.PI);
                    } else {
                        _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.105, offset_y + 0.01, coor.z + space_length / 1.5, Math.PI);
                    }
                    my_ids.push(id++);
                }
            }
            //橫向面中間
            for (var i = 1; i < spaces.length - 1; i++) {
                var coor = {};
                var offset_y = 0.3;
                var scale_rate = spaces[0].length;
                if (spaces[0].length % 2 == 0) {
                    var tmp_coor = adjustCoor({ x: spaces[i][spaces[0].length / 2].getX(), y: spaces[i][spaces[0].length / 2].getY() });
                    coor = { x: tmp_coor.x, z: tmp_coor.z };
                } else {
                    var tmp_coor = adjustCoor({ x: spaces[i][Math.floor(spaces[0].length / 2)].getX(), y: spaces[i][Math.floor(spaces[0].length / 2)].getY() });
                    coor = { x: tmp_coor.x, z: tmp_coor.z + space_length / 2 };
                }
                //縱向面外
                if (i == 1) {
                    _fac.addBaseTileOutside("Roof" + id.toString(), coor.x + space_length, offset_y, coor.z, Math.PI, scale_rate);
                } else if (i == spaces.length - 2) {
                    _fac.addBaseTileOutside("Roof" + id.toString(), coor.x, offset_y, coor.z, 0, scale_rate);
                } else {
                    _fac.addBaseTile("Roof" + id.toString(), coor.x, offset_y, coor.z, scale_rate);
                }
                
                my_ids.push(id++);
                offset_y += 0.1;
                //縱向面中
                for (j = 1; j < Math.round(spaces[0].length / 2) ; j++) {
                    if (i == 1) {
                        _fac.addMidTileOutside("Roof" + id.toString(), coor.x + space_length, offset_y + 0.001, coor.z + 0.005, Math.PI, scale_rate);
                    } else if (i == spaces.length - 2) {
                        _fac.addMidTileOutside("Roof" + id.toString(), coor.x, offset_y + 0.001, coor.z - 0.005, 0, scale_rate);
                    } else {
                        _fac.addMidTileInside("Roof" + id.toString(), coor.x, offset_y, coor.z, scale_rate);
                    }
                    my_ids.push(id++);
                    offset_y += 0.032;
                    if (spaces[0].length % 2 == 0) {
                        scale_rate -= 2;
                    } else {

                        scale_rate -= 1.67;
                    }
                }

                //縱向面頂
                var sssscale_rate = 1
                if (spaces[0].length % 2 == 0) {
                    if (i == 1) {
                        _fac.addTopTileOutside("Roof" + id.toString(), coor.x, offset_y + 0.001, coor.z, Math.PI, sssscale_rate);
                    } else if (i == spaces.length - 2) {
                        _fac.addTopTileOutside("Roof" + id.toString(), coor.x + space_length - 0.005, offset_y + 0.002, coor.z, 0, sssscale_rate);
                    } else {
                        _fac.addTopTileInside("Roof" + id.toString(), coor.x, offset_y, coor.z, sssscale_rate);
                    }           
                } else {
                    if (spaces[0].length <= 3) sscale_rate = 0.74;
                    else sscale_rate = 0.86;
                    if (i == 1) {
                        _fac.addTopTileOutside("Roof" + id.toString(), coor.x, offset_y + 0.001, coor.z, Math.PI, sscale_rate);
                    } else if (i == spaces.length - 2) {
                        _fac.addTopTileOutside("Roof" + id.toString(), coor.x + space_length - 0.005, offset_y + 0.002, coor.z, 0, sscale_rate);
                    } else {
                        _fac.addTopTileInside("Roof" + id.toString(), coor.x, offset_y, coor.z, sscale_rate);
                    }
                }
                
                my_ids.push(id++);
            }
            //橫向面右
            for (var i = 1; i < spaces[0].length - 1; i++) {
                var coor = {};
                var offset_y = 0.3;
                coor = adjustCoor({ x: spaces[spaces.length - 1][i].getX(), y: spaces[spaces.length - 1][i].getY() });
                if (spaces[0].length <= 3) {                                                        //except handle
                    _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.05, offset_y + 0.01, coor.z + space_length / 6, 0);
                    my_ids.push(id++);
                    _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.05, offset_y + 0.01, coor.z + space_length / 1.2, 0);
                    my_ids.push(id++);
                } else {
                    if (i < spaces[0].length / 2) {
                        _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.05, offset_y + 0.01, coor.z + space_length / 3, 0);
                    } else {
                        _fac.addCornerSideTile("Roof" + id.toString(), coor.x + 0.05, offset_y + 0.01, coor.z + space_length / 1.7, 0);
                    }
                    my_ids.push(id++);
                }
            }
        }
    }

    this.undo = function () {
        for (var i = 0; i < my_ids.length; i++) {
            _fac.removeMesh(_scene, "Roof" + my_ids[i].toString());
        }
        
    }

    function adjustCoor(_info) {
        var coor = {};
        coor.x = org_pos_x + space_length * (_info.x - 50) / 100;
        coor.z = org_pos_z + space_length * (_info.y - 200) / 100;
        return coor;
    }
}

function idInCode(_x, _z) {
    return _x.toString() + _z.toString();
}

