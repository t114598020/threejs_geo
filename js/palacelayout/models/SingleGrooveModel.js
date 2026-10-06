function Model() {
    this.map = [];
    this.stages = [];

    this.getStageNum = function () { return this.stages.length; }

    this.initModel = function (_side_corr_flag, _w, _h) {
        if (_side_corr_flag) {
            for (var i = 0; i < _w; i++) {
                this.map[i] = [];
                for (var j = 0; j < _h - 1; j++) {
                    if (i == 0 || i == _w - 1)
                        this.map[i][j] = new SideCorridor();
                    else if (j == 0 || j == _h - 2)
                        this.map[i][j] = new SideCorridor();
                    else
                        this.map[i][j] = new MainSpace();
                }
            }
        }
        else {
            for (var i = 0; i < _w; i++) {
                this.map[i] = [];
                for (var j = 0; j < _h - 1; j++)
                    this.map[i][j] = new MainSpace();
            }
        }
    }

    this.drawMap = function (_svg, _cmd_mgr) {
        var offset = 100;

        for (var i = 0; i < this.map.length; i++) {
            for (var j = 0; j < this.map[0].length; j++) {
                //Set connection
                if (i != 0)
                    this.map[i][j].setLeftSpace(this.map[i - 1][j]);
                if (i != this.map.length - 1)
                    this.map[i][j].setRightSpace(this.map[i + 1][j]);
                if (j != 0)
                    this.map[i][j].setTopSpace(this.map[i][j - 1]);
                if (j != this.map[0].length - 1)
                    this.map[i][j].setBotSpace(this.map[i][j + 1]);

                //Set Width/Length
                if (this.map[i][j].isSideCorridor()) {
                    //set width
                    if (i == 0 || i == this.map.length - 1)
                        this.map[i][j].setWidth(offset / 2);
                    else
                        this.map[i][j].setWidth(offset);
                    //set height
                    if (j == 0 || j == this.map[0].length - 1)
                        this.map[i][j].setHeight(offset / 2);
                    else
                        this.map[i][j].setHeight(offset);
                } else
                    this.map[i][j].setBound(offset, offset);

                //Set index
                this.map[i][j].setIndex(i, j);

                //Set Coordinates
                if (this.map[i][j].getTopSpace())
                    this.map[i][j].y = this.map[i][j].getTopSpace().getY() + this.map[i][j].getTopSpace().getHeight();
                if (this.map[i][j].getLeftSpace())
                    this.map[i][j].x = this.map[i][j].getLeftSpace().getX() + this.map[i][j].getLeftSpace().getWidth();
            }
        }
        _cmd_mgr.execute(new DrawMapCommand(_svg, this.map));
    }

    this.initStages = function () {
        //Stage 1 
        var stg1 = new Stage();
        stg1.setRule(new Rule1());
        stg1.setRule(new Rule2());
        stg1.setRule(new Rule3());
        stg1.setRule(new Rule4());
        stg1.setRule(new Rule5());
        stg1.setRule(new Rule6());
        stg1.setRule(new Rule7());
        this.stages.push(stg1);

        //Stage 2
        var stg2 = new Stage();
        stg2.setRule(new Rule9());
        stg2.setRule(new Rule11());
        
        this.stages.push(stg2);

        //Stage 3
        var stg3 = new Stage();
        stg3.setRule(new Rule13());
        stg3.setRule(new Rule14());
        stg3.setRule(new Rule15());
        stg3.setRule(new Rule16());
        stg3.setRule(new Rule17());
        stg3.setRule(new Rule18());
        this.stages.push(stg3);

        //Stage 4
        var stg4 = new Stage();
        stg4.setRule(new Rule19());
        stg4.setRule(new Rule20());
        stg4.setRule(new Rule21());
        stg4.setRule(new Rule22());
        this.stages.push(stg4);

        //Stage 5
        var stg5 = new Stage();
        stg5.setRule(new Rule23());
        stg5.setRule(new Rule24());
        stg5.setRule(new Rule25());
        stg5.setRule(new Rule26());
        this.stages.push(stg5);

        //Stage 6
        var stg6 = new Stage();
        stg6.setRule(new Rule27());
        stg6.setRule(new Rule28());
        this.stages.push(stg6);

        //Stage 7
        var stg7 = new Stage();
        stg7.setRule(new Rule29());
        this.stages.push(stg7);
    }

    this.analyze = function (_cur_stg) {
        //Get rules
        return this.stages[_cur_stg - 1].findRule(this.map);
    }

    this.getMidLine = function () {
        return {
            virtical: this.map[Math.round(this.map.length / 2) - 1][0].getX() + this.map[Math.round(this.map.length / 2) - 1][0].getWidth() / 2,
            horizontal: this.map[0][Math.round(this.map[0].length / 2) - 1].getY() + this.map[0][Math.round(this.map[0].length / 2) - 1].getHeight() / 2
        };
    }
}