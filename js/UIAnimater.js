function UIAnimater() {

    this.hrightLight = function (_id) {
        $('#' + _id).removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass();
            $('#' + _id).css("color", "red");
        });
    }
}