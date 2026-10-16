// View menu of the layout pages: turns the camera of the preview to the front, back, left or right
// of the building, levels it (Straight) or looks down from above (Top), shows or hides the background (sky, ground and fog),
// switches between perspective and parallel projection, and lets the light shine from the front,
// the left or the right with or without shadows, through Observer.js and Canvas.js. The checks show what is on.
var background_shown = true;
var parallel_projection = false;
var shadow_shown = true;

function setView(_direction) {
    new Observer().setViewObserver(_direction);
}

function toggleBackground() {
    background_shown = !background_shown;
    new Observer().showBackgroundObserver(background_shown);
    $('#BackgroundCheck').css('visibility', background_shown ? 'visible' : 'hidden');
}

function setStraight() {
    new Observer().setStraightObserver();
}

function setTop() {
    new Observer().setTopObserver();
}

function setLight(_direction) {
    new Observer().setLightObserver(_direction);
    $('.light-check').css('visibility', 'hidden');
    $('#LightCheck_' + _direction).css('visibility', 'visible');
}

function toggleShadow() {
    shadow_shown = !shadow_shown;
    new Observer().showShadowObserver(shadow_shown);
    $('#ShadowCheck').css('visibility', shadow_shown ? 'visible' : 'hidden');
}

function toggleParallelProjection() {
    parallel_projection = !parallel_projection;
    new Observer().setParallelProjectionObserver(parallel_projection);
    $('#ParallelCheck').css('visibility', parallel_projection ? 'visible' : 'hidden');
}
