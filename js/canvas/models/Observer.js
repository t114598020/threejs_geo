function Observer()
{
    this.initBondsObserver = function(_sidecorridor_flag, _w, _h){
        document.getElementById('viewer').contentWindow.initBonds(_sidecorridor_flag, _w, _h);
    }

	this.gridObserver = function(_infos)
	{
		document.getElementById('viewer').contentWindow.drawNewLayoutGrid(_infos);
	}
	
	this.columnObersver = function(_space, _dots)
	{
	    document.getElementById('viewer').contentWindow.drawNewColumn(_space, _dots);
	}
	
	this.undoObserver = function()
	{
		document.getElementById('viewer').contentWindow.actUndo();
	}
	
	this.cancelColumnObserver = function(_data)
	{
		document.getElementById('viewer').contentWindow.actCnacelColumns(_data);
	}

	this.AddBracketsObserver = function (_space, _points) {
	    document.getElementById('viewer').contentWindow.actAddBrackets(_space, _points);
	}

	this.AddWallObserver = function (_data) {
	    document.getElementById('viewer').contentWindow.actAddWall(_data);
	}

	this.AddDoorandWindowObserver = function (_data) {
	    document.getElementById('viewer').contentWindow.actAddDoorandWindow(_data);
	}

	this.AddStairObserver = function (_data) {
	    document.getElementById('viewer').contentWindow.actAddStair(_data);
	}

	this.AddRoofObserver = function (_data) {
	    document.getElementById('viewer').contentWindow.actAddRoof(_data);
	}

	this.exportSTLObserver = function () {
	    document.getElementById('viewer').contentWindow.actExportSTL();
	}

	this.exportX3DObserver = function (_useDEF) {
	    document.getElementById('viewer').contentWindow.actExportX3D(_useDEF);
	}

	this.setPartColorObserver = function (_group, _color) {
	    document.getElementById('viewer').contentWindow.actSetPartColor(_group, _color);
	}

	this.setPartPatternObserver = function (_group, _url) {
	    document.getElementById('viewer').contentWindow.actSetPartPattern(_group, _url);
	}

	this.setViewObserver = function (_direction) {
	    document.getElementById('viewer').contentWindow.actSetView(_direction);
	}

	this.showBackgroundObserver = function (_show) {
	    document.getElementById('viewer').contentWindow.actShowBackground(_show);
	}

	this.setParallelProjectionObserver = function (_parallel) {
	    document.getElementById('viewer').contentWindow.actSetParallelProjection(_parallel);
	}

	this.setStraightObserver = function () {
	    document.getElementById('viewer').contentWindow.actSetStraight();
	}

	this.setLightObserver = function (_direction) {
	    document.getElementById('viewer').contentWindow.actSetLight(_direction);
	}
}