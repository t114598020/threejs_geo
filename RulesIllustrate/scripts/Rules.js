var stages = [
    {
        stage: '一 : 殿 身 間 架 模 數',
        rules: [
           {
               no: 1,
               description: '依據中軸線向左右衍生'
           },
           {
               no: 2,
               description: '依垂直方向向上方衍生'
           },
           {
               no: 3,
               description: '依據中軸線隔前一次衍生的間向左右衍生'
           },
           {
               no: 4,
               description: '缺角圖形衍生至方正'
           },
           {
               no: 5,
               description: '缺角圖形衍生至方正'
           },
           {
               no: 6,
               description: '副階生成方式'
           },
           {
               no: 7,
               description: '副階生成方式'
           },
           {
               no: 8,
               description: '副階生成方式'
           }
        ]
    },
    {
        stage: '二 : 分 槽',
        rules: [
            {
                no: 9,
                description: '分槽原則'
            },
            {
                no: 10,
                description: '分槽原則'
            },
            {
                no: 11,
                description: '分槽原則'
            },
            {
                no: 12,
                description: ''
            },
            {
                no: 13,
                description: '分槽原則'
            },
            {
                no: 14,
                description: ''
            }
        ]
    },
    {
        stage: '三 : 鋪 作 與 落 住 位 置',
        rules: [
            {
                no: 15,
                description: '當心間補間鋪作數二朵'
            },
            {
                no: 16,
                description: '定義柱頭鋪作'
            },
            {
                no: 17,
                description: '定義補間鋪作位置'
            },
            {
                no: 18,
                description: '定義梢間補間鋪作位置'
            },
            {
                no: 19,
                description: '定義柱頭鋪作即是落柱位置'
            },
            {
                no: 20,
                description: '定義鋪間鋪作位置'
            },
            {
                no: 21,
                description: ''
            }
        ]
    },
    {
        stage: '四 ： 牆 身',
        rules: [
            {
                no: 22,
                description: '定義一般牆身'
            },
            {
                no: 23,
                description: '定義開口在a側的牆身'
            },
            {
                no: 24,
                description: '定義開口在a側的牆身'
            },
            {
                no: 25,
                description: '定義開口在a側的牆身'
            },
            {
                no: 26,
                description: '定義縱向的牆身'
            },
            {
                no: 27,
                description: '定義縱向的牆身'
            },
            {
                no: 28,
                description: '定義方向與wd平行的牆身'
            }
        ]
    },
    {
        stage: '五 : 門 、 窗 位 置',
        rules: [
            {
                no: 29,
                description: '定義開口在a右側的牆身為門'
            },
            {
                no: 30,
                description: '定義開口在a側的牆身為窗'
            },
            {
                no: 31,
                description: '定義當心間門'
            },
            {
                no: 32,
                description: '定義一般間門在a另一側'
            },
            {
                no: 33,
                description: '定義開口在a側的牆身為窗'
            },
            {
                no: 34,
                description: '定義一般牆身為門'
            },
            {
                no: 35,
                description: '定義一般牆身為窗'
            },
            {
                no: 36,
                description: '定義門兩側為窗'
            },
            {
                no: 37,
                description: '定義當心間兩側為門'
            },
            {
                no: 38,
                description: '定義縱向牆兩側為窗'
            },
            {
                no: 39,
                description: '定義中央門為可開啟的門'
            },
            {
                no: 40,
                description: '定義窗戶為可開啟的形態'
            },
            {
                no: 41,
                description: '定義門左為柱子'
            },
            {
                no: 42,
                description: '定義門右為柱子'
            },
            {
                no: 43,
                description: '定義一般門為可開啟狀態'
            },
		]
	},
	{
		stage: '六  :  階 梯 位 置',
        rules: [
             {
                 no: 44,
                 description: '前方階梯定義'
             },
             {
                 no: 45,
                 description: '後方階梯定義'
             }
        ]
    }
];



$(document).ready(function ()
{
    var str = '';
    $.each(stages, function (key, row)
    {
        console.log(row.rules.length);
        //Start from zero
        var span_num = row.rules.length + 1;
        //Stage level
        str += '<tr><td rowspan="' + span_num + '">' + row.stage + '</td></tr>';
        row.rules.forEach(function (element, index, array) {
            //Rule level
            str += '<tr>'
                + '<td>' + element.no + '</td>'
                + '<td>' + element.description + '</td>'
                + '<td><img src="images/2D/org/rule' + element.no + '.png" title="rule' +  element.no + '"></td>'
                + '<td><img src="images/2D/transf/rule' + element.no + '.PNG" title="rule"' + element.no + '"></td>'
                + '<td><img src="images/3D_v3/org/rule' + element.no + '.png" alt="title' + element.no + '"></td>'
                + '<td><img src="images/3D_v3/transf/rule' + element.no + '.png" title="rule' + element.no + '"></td>'
                + '</tr>'
        });
    });

    $('#ruleTable tbody').append(
            str
        );
});