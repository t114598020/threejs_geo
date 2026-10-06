function Space() {
    this.type = 0; 
    this.x = 50;
    this.y = 200;
    this.w = 0;
    this.h = 0;
    this.edges = { top: 1, right: 1, bot: 1, left: 1 };
    this.top_space = null;
    this.right_space = null;
    this.bot_space = null;
    this.left_space = null;
    this.index = {};
}

Space.prototype.setIndex = function (_i, _j) {
    this.index.i = _i;
    this.index.j = _j;
}

Space.prototype.setTopEdge = function (_val) { this.edges.top = _val; }

Space.prototype.setLeftEdge = function (_val) { this.edges.left = _val; }

Space.prototype.setBotEdge = function (_val) { this.edges.bot = _val; }

Space.prototype.setRightEdge = function (_val) { this.edges.right = _val; }

Space.prototype.setType = function (_type) {
    this.type = _type;
}

Space.prototype.setEdges = function (_edges) {
    this.edges.top = _edges.top;
    this.edges.right = _edges.right;
    this.edges.bot = _edges.bot;
    this.edges.left = _edges.left;
}

Space.prototype.setTopSpace = function (_space) {
    this.top_space = _space;
}

Space.prototype.setRightSpace = function (_space) {
    this.right_space = _space;
}

Space.prototype.setBotSpace = function (_space) {
    this.bot_space = _space;
}

Space.prototype.setLeftSpace = function (_space) {
    this.left_space = _space;
}

Space.prototype.setCoordinate = function (_x, _y) {
    this.x = _x;
    this.y = _y;

}

Space.prototype.setWidth = function (_w) {
    this.w = _w;
}

Space.prototype.setHeight = function (_h) {
    this.h = _h;
}

Space.prototype.setBound = function (_w, _h) {
    this.w = _w;
    this.h = _h;
}

Space.prototype.getIndexI = function () { return this.index.i; }

Space.prototype.getIndexJ = function () { return this.index.j; }

Space.prototype.getType = function () {
    return this.type;
}

Space.prototype.getX = function () {
    return this.x;
}

Space.prototype.getY = function () {
    return this.y;
}

Space.prototype.getWidth = function () {
    return this.w;
}

Space.prototype.getHeight = function () {
    return this.h;
}

Space.prototype.getTopSpace = function () {
    return this.top_space;
}

Space.prototype.getRightSpace = function () {
    return this.right_space;
}

Space.prototype.getBotSpace = function () {
    return this.bot_space;
}

Space.prototype.getLeftSpace = function () {
    return this.left_space;
}

Space.prototype.haveTopEdge = function () {
    if (this.edges.top > 0) return true;
    return false;
}

Space.prototype.haveRightEdge = function () {
    if (this.edges.right > 0) return true;
    return false;
}

Space.prototype.haveBotEdge = function () {
    if (this.edges.bot > 0) return true;
    return false;
}

Space.prototype.haveLeftEdge = function () {
    if (this.edges.left > 0) return true;
    return false;
}

Space.prototype.getEdges = function () {
    return this.edges;
}

Space.prototype.getTopEdge = function () { return this.edges.top; }

Space.prototype.getLeftEdge = function () { return this.edges.left; }

Space.prototype.getBotEdge = function () { return this.edges.bot; }

Space.prototype.getRightEdge = function () { return this.edges.right; }

Space.prototype.isSideCorridor = function () {}

function MainSpace() {
    Space.call(this);

    this.isSideCorridor = function () { return false; }
}

MainSpace.prototype = new Space(0);

function SideCorridor() {
    Space.call(this);

    this.isSideCorridor = function () { return true; }
}

SideCorridor.prototype = new Space();

