(function(){ // http://bl.ocks.org/mbostock/4063318
    'use strict';

    /*
    the original CSV had these columns:
    Date,Open,High,Low,Close,Volume,Adj Close
    2010-10-01,10789.72,10907.41,10759.14,10829.68,4298910000,10829.68
    */

    var width = 960,
        height = 136,
        cellSize = 17; // cell size

    var day = d3.time.format("%w"),
        week = d3.time.format("%U"),
        percent = d3.format(".1%"),
        format = d3.time.format("%Y-%m-%d");

    var color = d3.scale.quantize()
        .domain([250, 400])
        .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));

    // one yearly calendar object per year
    var svg = d3.select("body").selectAll("svg")
        .data(d3.range(2010, 2015)) // TODO change this range to reflect garbage contributions
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "RdYlGn")
        .append("g")
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")"); // wtf? 53, 7 ?

    // infobulle?
    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .text(function(d) { return d; });

    // each day
    var rect = svg.selectAll(".day")
        .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) { return week(d) * cellSize; }) // week and day positioning (smart idea)
        .attr("y", function(d) { return day(d) * cellSize; })
        .datum(format);

    rect.append("title") // ?
        .text(function(d) { return d; });

    svg.selectAll(".month")
        .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);


    d3.csv("../predict/data/predictions.csv", function(error, csv) {
        console.log('csv', csv);

        // doing only one decheterie for now
        var oneDechData = csv[0];
        var dech = oneDechData.decheterie;
        delete oneDechData.decheterie;

        var data = oneDechData;

        /*var data = d3.nest()
            .key(function(d) { return d.Date; })
            .rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
            .map(csv);

        console.log('data', data);*/

        rect.filter(function(d) { return d in data; })
            .attr("class", function(d) { return "day " + color(data[d]); })
            .select("title")
            .text(function(d) { return d + ": " + Number(data[d]).toFixed(2) });
    });

    function monthPath(t0) {
        var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
            d0 = +day(t0), w0 = +week(t0),
            d1 = +day(t1), w1 = +week(t1);
        return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
            + "H" + w0 * cellSize + "V" + 7 * cellSize
            + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
            + "H" + (w1 + 1) * cellSize + "V" + 0
            + "H" + (w0 + 1) * cellSize + "Z";
    }

    d3.select(self.frameElement).style("height", "2910px");
})();
