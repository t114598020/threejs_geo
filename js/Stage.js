function Stage(_name)
{
	this.name = _name;
    this.rules = [];
}

Stage.prototype.setRule = function(_rule){
    this.rules.push(_rule);
}

Stage.prototype.getName = function(){return this.name;}

Stage.prototype.findRule = function (_map) {
    var match_rules = [];

    for (var i = 0; i < this.rules.length; i++) {
        match_rule = this.rules[i].match(_map);
        if (match_rule)
            match_rules.push(match_rule);
    }
    return match_rules;
}

