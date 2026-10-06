var stages = [
    {
        steps: [
           {
               no: 1,
               description: '安置乳榑、平基、十椽栿與八椽栿等底層部件'
           },
           {
               no: 2,
               description: '八椽栿上放置六椽栿與平槫等部件'
           },
           {
               no: 3,
               description: '六椽栿上放置四椽栿與平槫等部件'
           },
           {
               no: 4,
               description: '四椽栿上放置蜀柱、平樑與叉手等部件'
           },
           {
               no: 5,
               description: '角落安置軒與椽架等部件'
           },
           {
               no: 6,
               description: '左邊安置椽架集合'
           },
           {
               no: 7,
               description: '右邊安置椽架組'
           }
        ]
    }
];



$(document).ready(function ()
{
    var str = '';
    $.each(stages, function (key, row)
    {
        //Start from zero
        var span_num = row.steps.length + 1;
        //Stage level
        row.steps.forEach(function (element, index, array) {
            //Rule level
            str += '<tr>'
                + '<td>7.' + element.no + '</td>'
                + '<td>' + element.description + '</td>'
                + '<td><img src="images/org/step' + element.no + '.png" title="step' +  element.no + '"></td>'
                + '<td><img src="images/transf/step' + element.no + '.png" title="step"' + element.no + '"></td>'
                + '</tr>'
        });
    });
	str += '<tr>'
                + '<td>補充</td>'
                + '<td>矩折方法</td>'
                + '<td colspan="2"><img src="images/org/supplement.png" title="補充"></td>'
                + '</tr>'

    $('#ruleTable tbody').append(
            str
        );
});