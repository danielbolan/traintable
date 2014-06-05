var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var daysShort = days.map(function(s) { return s.substring(0,3); });
var data = [];
for (var i=0; i<7; i++) { data[i] = []; }

getData(function(info) {
    parseData(info);
    displayData();
});

//A test function that doesn't rely on AJAX so I can test locally
//This will be replaces with $.ajax once the rest is working
function getData(callback) {
    console.log('fetching data')
    $.ajax('data.txt', {
        success: callback,
        error: function(e) { throw e; }
    })
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

    var $dataRow = $('<tr id="data">');
    for (i=0; i<7; i++) {
        var $dataCell = $('<td>');
        $dataRow.append($dataCell);
        var paper = Raphael($dataCell[0], 75, 500);
        $dataCell.append(paper);

        data[i].forEach(function(d) {
            var pos = d * 500 / 1440;
            paper.path('M0,' + pos + 'L75,' + pos);
        });
    }
    $table.append($dataRow);
}
