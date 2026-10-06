//CommandManager Object
function CommandManager() {
	var m_undoCmds = [];	//undo command stack
	var m_redoCmds = [];	//redo command stack
	
	//Execute
	this.execute = function(cmd) {
		cmd.execute();
		m_undoCmds.push(cmd);
		//console.log("Success : new command be added to m_undoCmds!");
		
		if(m_redoCmds.length)		//cleanup redo stack
			m_redoCmds = [];
	}
	
	//Undo
	this.undo = function() {
		if(!m_undoCmds.length) {
			alert("There no privous step!");
		}
		else {
			var cmd = m_undoCmds.pop();
			cmd.undo();
			m_redoCmds.push(cmd);
		}
	}
	
	//Redo
	this.redo = function() {
		if(!m_redoCmds.length) {
			alert("There are no next step to redo!");
		}
		else {
			var cmd = m_redoCmds.pop();
			cmd.execute();
			m_undoCmds.push(cmd);
		}
	}
	
	//Clear
	this.undo_clear = function() {
		while(m_undoCmds.length > 0) {
			m_undoCmds.pop();
		}
	}
	
	this.redo_clear = function() {
		while(m_redoCmds.length > 0) {
			m_redoCmds.pop();
		}
	}
}