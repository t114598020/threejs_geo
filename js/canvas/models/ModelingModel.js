//Global
var space_length = 0.15;
var org_pos_x = 0.0;
var org_pos_z = 0.0;

function ModelingModel()
{
    var undo_stack = [];
	var columns = [];
    var fac = new Factory();
    var i_num = 0;
    var j_num = 0;
	
    this.doInitBounds = function (_scene, _sidecorridor_flag, _w, _h) {

        if (i_num != 0 && j_num != 0) {
	        removeLines(_scene, "LayoutMap");
	        fac.removeMesh(_scene, "BaseSpace");
	        org_pos_x = 0.0;
	        org_pos_z = 0.0;
	        clearScene(_scene);
        }
        if(_sidecorridor_flag)
            fac.addBaseSpace(_w - 1, _h - 1);
        else
            fac.addBaseSpace(_w, _h);
	   
        //Calculate original position
        //x
            org_pos_x -= (space_length / 2);
            if (!_sidecorridor_flag) {
                for (var i = 0; i < Math.floor(_w / 2) ; i++) {
                    org_pos_x -= space_length;
                }
            } else {
                for (var i = 0; i < Math.floor(_w / 2) - 1 ; i++) {
                    org_pos_x -= space_length;
                }
                org_pos_x -= (space_length / 2);
            }
        //z
        if (_h % 2 == 0) {
            if (!_sidecorridor_flag) {
                for (var i = 0; i < Math.floor(_h / 2) ; i++) {
                    org_pos_z -= space_length;
                }
            } else {
                for (var i = 0; i < Math.floor(_h / 2) - 1 ; i++) {
                    org_pos_z -= space_length;
                }
                org_pos_z -= (space_length / 2);
            }
        } else {
            org_pos_z -= (space_length / 2);
            if (!_sidecorridor_flag) {
                for (var i = 0; i < Math.floor(_h / 2) ; i++) {
                    org_pos_z -= space_length;
                }
            } else {
                for (var i = 0; i < Math.floor(_h / 2) - 1 ; i++) {
                    org_pos_z -= space_length;
                }
                org_pos_z -= (space_length / 2);
            }
        }
	    i_num = _w;
	    j_num = _h;
	}
	
	this.createNewLayoutGrid = function(_scene, _infos)
	{
	    for (var i = 0; i < _infos.length - 1; i++) {
	        var coor1 = adjustCoor(_infos[i]);
	        var coor2 = adjustCoor(_infos[i + 1]);

	        var geometry = new THREE.Geometry();

	        geometry.vertices.push(new THREE.Vector3(coor1.x, 0.055, coor1.z));
	        geometry.vertices.push(new THREE.Vector3(coor2.x, 0.055, coor2.z));
	        

	        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x000000, opacity: 1 }));
	        line.name = "LayoutMap";

	        _scene.add(line);
	    }
	}	
	
	this.createNewColumn = function (_scene,_space, _dots)
	{
	    var coors = [];
	    for (var i = 0; i < _dots.length; i++)
	    {
	        //Adjusting offsets
	        var coor = adjustCoor(_dots[i]);
	        coors.push(coor);
	    }
	    var cmd = new ColumnCommand(_scene, fac, _space, coors);
	    cmd.execute();
				
		//Record the coordinates
	    undo_stack.push(cmd);

	    cmd = null;
	    delete cmd;
	}

	function adjustCoor(_info) {
	    var coor = {};
	    coor.x = org_pos_x+ space_length * (_info.x - 50) / 100;
	    coor.z = org_pos_z+ space_length * (_info.y - 200) / 100;
	    return coor;
	}
	
	this.undo = function()
	{
		if(undo_stack.length > 0)
		{
			var cmd = undo_stack.pop();
			
			cmd.undo();
		}
	}
	
	this.cancelColumns = function(_scene, _data)
	{
	    coors = [];
	    for (var i = 0; i < _data.length; i++) {
	        var coor = adjustCoor(_data[i]);
	        coors.push(coor);
	    }
	    var cmd = new CancelColumnsCommand(_scene, fac, coors);
	    cmd.execute();

	    undo_stack.push(cmd);

	    cmd = null;
	    delete cmd;
	}
	
	this.addBrackets = function (_scene, _space, _points) {

	    var cmd = new AddBracketsCommand(_scene, fac, _space,_points, i_num, j_num);
	    cmd.execute();

	    undo_stack.push(cmd);

	    cmd = null;
	    delete cmd;
	}

	this.addWall = function (_scene, _data) {

	    var info = { x: _data.space.x, y: _data.space.y };

	    var cmd = new AddWallCommand(_scene, fac, _data, adjustCoor(info), i_num, j_num);
	    cmd.execute();

	    undo_stack.push(cmd);

	    cmd = null;
	    delete cmd;
	}

	this.addDoorandWindow = function (_scene, _data) {

	    var info = { x: _data.space.x, y: _data.space.y };

	    var cmd = new AddDoorandWindowCommand(_scene, fac, _data, adjustCoor(info), i_num, j_num);
	    cmd.execute();

	    undo_stack.push(cmd);

	    cmd = null;
	    delete cmd;
	}

	this.addStair = function (_scene, _data) {

	    var info = { x: _data.space.x, y: _data.space.y };

	    var cmd = new AddStairCommand(_scene, fac, _data, adjustCoor(info), i_num, j_num);
	    cmd.execute();

	    undo_stack.push(cmd);

	    cmd = null;
	    delete cmd;
	}

	this.addRoof = function (_scene, _data) {
	    var cmd = new AddRoofCommand(_scene, fac, _data);
	    cmd.execute();

	    undo_stack.push(cmd);

	    cmd = null;
	    delete cmd;
	}
	
	function init2DArray(array, row, col)
	{
		var i, j;
		
		for(i = 0; i < row; i++)
		{
			array[i] = [];
			for(j = 0; j < col; j++)
				array[i][j] = 0;
		}
	}

	function removeLines(_scene, id) {
	    while (_scene.getObjectByName(id)) {
	        var line = _scene.getObjectByName(id);
	        if (line instanceof THREE.Line) {
	            _scene.remove(line);

	            //Release memory spaces
	            if (line.geometry) {
	                line.geometry.dispose();
	                line.geometry = null;
	            }

	            line = null;
	        }
	    }
	}

	function clearScene(_scene) {
	    clearPlacements();	// every part is removed below (see placePart in Factory.js)

	    for (var i = _scene.children.length - 1; i >= 0; i--) {

	        var obj = _scene.children[i];
	        if (obj instanceof THREE.Mesh) {
	            if (obj.name != "Ground" && obj.name != "Plane") {
	                _scene.remove(obj);

	                //Release memory spaces
	                if (obj.material.map) {
	                    obj.material.map.dispose();
	                    obj.material.map = null;
	                }
	                if (obj.material) {
	                    obj.material.dispose();
	                    obj.material = null;
	                }
	                if (obj.geometry) {
	                    obj.geometry.dispose();
	                    obj.geometry = null;
	                }

	                obj = null;
	            } 
	        }
	    }
	}
	
}
