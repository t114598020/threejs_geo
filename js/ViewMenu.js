// View menu of the layout pages: turns the camera of the preview to the front, back, left or right
// of the building, and shows or hides the background (sky, ground and fog), through Observer.js
// and Canvas.js. The check before "Background" shows whether it is on.
var background_shown = true;

function setView(_direction) {
    new Observer().setViewObserver(_direction);
}

function toggleBackground() {
    background_shown = !background_shown;
    new Observer().showBackgroundObserver(background_shown);
    $('#BackgroundCheck').css('visibility', background_shown ? 'visible' : 'hidden');
}
