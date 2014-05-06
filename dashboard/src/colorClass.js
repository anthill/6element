(function(global){
    
    global.color = d3.scale.quantize()
        .domain([50, 600])
        .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));
    
})(this);