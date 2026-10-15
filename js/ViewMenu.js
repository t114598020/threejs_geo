// View menu of the layout pages: turns the camera of the preview to the front, back, left or right
// of the building, shows or hides the background (sky, ground and fog) and switches between
// perspective and parallel projection, through Observer.js and Canvas.js. The checks before
// "Background" and "Parallel Projection" show whether they are on.
var background_shown = true;
var parallel_projection = false;

function setView(_direction) {
    new Observer().setViewObserver(_direction);
}

function toggleBackground() {
    background_shown = !background_shown;
    new Observer().showBackgroundObserver(background_shown);
    $('#BackgroundCheck').css('visibility', background_shown ? 'visible' : 'hidden');
}

function toggleParallelProjection() {
    parallel_projection = !parallel_projection;
    new Observer().setParallelProjectionObserver(parallel_projection);
    $('#ParallelCheck').css('visibility', parallel_projection ? 'visible' : 'hidden');
}
