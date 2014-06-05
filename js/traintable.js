var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var daysShort = days.map(function(s) { return s.substring(0,3); });
var data = [];
for (var i=0; i<7; i++) { data[i] = []; }

//A test function that doesn't rely on AJAX so I can test locally
//This will be replaces with $.ajax once the rest is working
function getData(callback) {
    console.log('fetching data')
    var info = '';
    for (i = 0; i < 100; i++) {
        info += daysShort[(Math.random()*7)|0] + ' '
              + ((Math.random()*24)|0) + ':' + ((Math.random()*60)|0)
              + '\n';
    }
    callback(info);
}

function parseData(info) {
    console.log('parsing');
    var index = {};
    for (i=0; i<7; i++) {
        index[daysShort[i]] = i;
    }

    var lines = info.split('\n');
    lines.pop();

    for (i=0; i<lines.length; i++) {
        var match = lines[i].match(/^(\S{3}) (\d\d?)\:(\d\d?)$/);
        data[index[match[1]]].push(+match[2]*60 + +match[3]);
    }
}

function displayData(){
    console.log('displaying');
    var $table = $('<table>');
    $('#content').append($table);

    var $firstRow = $('<tr>');
    for (i=0; i<7; i++) {
        $firstRow.append('<th>' + days[i] + '</th>');
    }
    $table.append($firstRow);

    var $dataRow = $('<tr id="dataRow">');
    for (i=0; i<7; i++) {
        var $dataCell = $('<td>');
        $dataRow.append($dataCell);
        var paper = Raphael($dataCell[0], 80, 500);
        $dataCell.append(paper);

        data[i].forEach(function(d) {
            var pos = d * 500 / 1440;
            paper.path('M0,' + pos + 'L80,' + pos);
        });
    }
    $table.append($dataRow);
}

function setupScale() {
    var $scale = $('#scale'),
        $time = $('#time'),
        $content = $('#content')
        $dataRow = $('#dataRow')
        svgHeight = $('svg').height();

    $scale.width($content.outerWidth()+45);
    $scale.offset({left:$content.offset().left-45});

    $('body').on('mousemove', function(e) { 
        $scale.offset({top:e.clientY-$scale.height()});
        $scale.offset({left:$content.offset().left-45});

        var pos = e.clientY - $dataRow.offset().top - ($dataRow.height()-svgHeight)/2;
        pos = ((pos|0) + 1)/svgHeight;
        if (pos < 0 || pos > 1) {
            $scale.hide();
        } else {
            $scale.show();
        }
        var hours = ((pos * 24) | 0) % 24;
        var minutes = ((pos*1440) | 0) % 60;
        hours = (hours < 10 ? '0' : '') + hours;
        minutes = (minutes < 10 ? '0' : '') + minutes;
        $time.text(hours + ':' + minutes);
    });
};

//choo choo, y'all
getData(function(info) {
    parseData(info);
    displayData();
    setupScale();
});