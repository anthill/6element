(function(global){
    
    global.color = d3.scale.quantize()
        .domain([0, 1000])
        .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));
    
})(this);