// Painting templates (彩畫) of the layout pages: a bar of buttons between the stage labels and the
// plan (shown by updateCurrentStage of the page's controller once a layout has started), each
// setting the colors and patterns of the preview (Painting.js, through Observer.js). The buttons
// are made from the tables below, so a template only needs its entries there.

// Representative main colors of the painting styles of the Yingzao Fashi, per group of parts
// (see partGroups in Painting.js), sampled from Wu Mei's restoration (fig. 0.2): for each part the
// median of the pixels of the hue that covers most of it. The 鋪作 have two colors, for their 斗
// (dou, the bearing blocks) and for their 栱 and 昂 (bracket, the arms). The roof takes the color of
// the girders, unless the template gives its own.
// 青綠疊暈棱間裝 takes the lit green of the figure (the brighter quarter of its pixels) and a deep blue:
// 斗 green and 栱昂 blue, so that neighbors alternate (相間). The 疊暈 bands along the edges of every
// face are not drawn (they cannot be written as plain colors into the X3D export).
// The buttons follow the order of this table.
var paint_templates = {
    original: { column: "#ff5533", dou: "#ff5533", bracket: "#ff5533", girder: "#ff5533" },   // 原色
    wucai: { column: "#c52f2e", dou: "#aa1100", bracket: "#aa1100", girder: "#aa1100", roof: "#aa1100" },   // 五彩遍裝：紅底，花紋另有青綠；屋頂同鋪作
    nianyu: { column: "#2c2346", dou: "#3d4125", bracket: "#3d4125", girder: "#3d4125", roof: "#3d4125" },   // 碾玉裝：柱 青，鋪作與樑 綠，屋頂同鋪作
    lengjian: { column: "#547136", dou: "#59723d", bracket: "#0c0599", girder: "#0c0599", roof: "#547136" },   // 青綠疊暈棱間裝：柱 綠，鋪作青綠相間（斗 綠、栱昂 青，不畫棱的疊暈），樑 青，屋頂同柱
    jielu: { column: "#536436", dou: "#a01511", bracket: "#a01511", girder: "#a61a18" },   // 解綠裝：柱 綠，鋪作與樑 土朱
    danfen: { column: "#c5130f", dou: "#ab1c12", bracket: "#ab1c12", girder: "#bc1913" },   // 丹粉刷飾：全部 紅
    tuhuang: { column: "#ffd240", dou: "#fdbb3c", bracket: "#fdbb3c", girder: "#ffc73d" }   // 土黃刷飾：全部 黃
};

var paint_template_names = {
    original: "原色", wucai: "五彩遍裝", nianyu: "碾玉裝", lengjian: "青綠疊暈棱間裝",
    jielu: "解綠裝", danfen: "丹粉刷飾", tuhuang: "土黃刷飾"
};

// patterns (images in textures/, relative to Canvas.html) painted on the parts of a template;
// the groups without one show their color
var paint_patterns = {
    wucai: { column: "textures/wucai_pattern.jpg", girder: "textures/wucai_pattern.jpg" },   // 五彩遍裝：柱、樑貼彩畫圖
    nianyu: { column: "textures/nianyu_pattern.jpg", girder: "textures/nianyu_pattern.jpg" }   // 碾玉裝：柱、樑貼彩畫圖
};
var pattern_groups = ["column", "girder"];

function setPaintTemplate(_name, _button) {
    var colors = paint_templates[_name];
    var patterns = paint_patterns[_name] || {};

    for (var group in colors) {
        obs.setPartColorObserver(group, colors[group]);
    }

    // the roof follows the girders unless given
    obs.setPartColorObserver("roof", colors.roof || colors.girder);

    for (var i = 0; i < pattern_groups.length; i++) {
        obs.setPartPatternObserver(pattern_groups[i], patterns[pattern_groups[i]] || null);
    }

    $("#PartColors button").removeClass("active");
    $(_button).addClass("active");
}

// One button per template: its name and three swatches, for the columns, the 鋪作 (top half 斗,
// bottom half 栱昂 when they differ) and the girders; the tooltip gives the colors.
function makePaintTemplateButtons() {
    var bar = $('<div id="PartColors" class="part-colors" style="display: none;">彩畫：</div>');

    $.each(paint_templates, function (name, colors) {
        var patterns = paint_patterns[name] || {};
        var puzuo = colors.dou === colors.bracket ? colors.bracket : "linear-gradient(" + colors.dou + " 50%, " + colors.bracket + " 50%)";
        var title = "柱 " + colors.column + "／鋪作 " +
            (colors.dou === colors.bracket ? colors.bracket : "斗 " + colors.dou + "、栱昂 " + colors.bracket) +
            "／樑 " + colors.girder + (colors.roof ? "／屋頂 " + colors.roof : "") +
            (patterns.column || patterns.girder ? "（柱、樑貼彩畫圖）" : "");

        var button = $('<button type="button" class="btn btn-default btn-xs"></button>')
            .attr("title", title)
            .toggleClass("active", name === "original")
            .click(function () { setPaintTemplate(name, this); });

        $.each([colors.column, puzuo, colors.girder], function (i, color) {
            button.append($('<span class="swatch"></span>').css("background", color));
        });

        bar.append(" ", button.append(" " + paint_template_names[name]));
    });

    $("#space").append(bar);
}

$(document).ready(makePaintTemplateButtons);
