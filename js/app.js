var w=1100,
h=680;
var margin={
  top:40,
  right:40,
  bottom:140,
  left:110
};
var width=w-margin.right-margin.left,
height=h-margin.top-margin.bottom;
var svg=d3.select(".chart")
.append("svg")
.attr({
  width:w,
  height:h,
  id:"chart"
});
var chart=svg.append("g")
.attr({transform:"translate("+margin.left+","+margin.top+")"});

var div=d3.select("body")
.append("div")
.classed("tooltip",true)
.style("opacity",0);

var months=[];
d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json",function(error,data){
  if(error) throw error;
  var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  //yScale
  var yScale=d3.scale.ordinal()
  .domain(months)
  .rangeRoundBands([0,height]);

  //xScale
  var xScale=d3.scale.linear()
  .domain([d3.min(data.monthlyVariance,function(d){return d.year;}),d3.max(data.monthlyVariance,function(d){return d.year;})])
  .range([0,width]);
  //yAxis
  var yAxis=d3.svg.axis()
  .scale(yScale)
  .orient("left");

  var xAxis=d3.svg.axis()
  .scale(xScale)
  .orient("bottom")
  .tickFormat(d3.format("d"));

  chart.append("g")
  .classed("y axis",true)
  .attr("transform","translate(0,0)")
  .call(yAxis)
  .append("text")
  .attr({
    dx:-height/2,
    dy:-75,
    transform:"translate(0,0) rotate(-90)",
    "font-weight":900
  })
  .text("Months");

  chart.append("g")
  .classed("x axis",true)
  .attr("transform","translate(0,"+height+")")
  .call(xAxis)
  .append("text")
  .attr({
    dx:width/2,
    dy:50,
    transform:"translate(0,0)",
    "font-weight":900
  })
  .text("Years");

  chart.selectAll(".temp")
  .data(data.monthlyVariance)
  .enter()
  .append("rect")
  .classed("temp",true);
  var baseTemp=data.baseTemperature;
  var lowVariance=d3.min((data.monthlyVariance),function(d){return d.variance;})
  var highVariance=d3.max((data.monthlyVariance),function(d){return d.variance;})
  var colors=["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"];
  
  var colorScale=d3.scale.quantile()
  .domain([baseTemp+lowVariance,baseTemp+highVariance])
  .range(colors);

  chart.selectAll(".temp")
  .attr({
    x:function(d){return xScale(d.year);},
    y:function(d){
      return yScale(months[d.month-1]);
    },
    width:width/((data.monthlyVariance).length/12),
    height:height/months.length
  })

  .on("mouseover",function(d){
    div.transition()
    .duration(50)
    .style("opacity","0.75");
    div.html("<span>"+(d.year)+" - "+months[d.month-1]+"<br>"+
     (baseTemp+d.variance)+"<br>"+
     d.variance)
    .style("left",(d3.event.pageX-75)+ "px")
    .style("top",(d3.event.pageY-65)+ "px");
  })
  .on("mouseout", function(d) {
    div.transition()
    .duration(50)
    .style("opacity", 0);
  })
  .style("fill",function(d,i){return colorScale(baseTemp+d.variance)});

  chart.selectAll(".temp")
  .data(data.monthlyVariance)
  .exit()
  .remove();
  
  chart.selectAll(".legend")
  .data([0].concat(colorScale.quantiles()))
  .enter()
  .append("rect")
  .classed("legend",true);
  
  chart.selectAll(".legend")
  .attr({
    x:function(d,i){
      return (width/1.5)+i*30;
    },
    y:height+70,
    width:30,
    height:15,
    fill:function(d){return colorScale(d);}
  });
  
  chart.selectAll(".legend")
  .data(colors)
  .exit()
  .remove();
  
  chart.selectAll(".legend-label")
  .data([0].concat(colorScale.quantiles()))
  .enter()
  .append("text")
  .classed("legend-label",true);
  var format=d3.format(".1f");
  chart.selectAll(".legend-label")
  .attr({
    x:function(d,i){
      return (width/1.52)+i*30;
    },
    y:height+103,
    "font-size":"12px"
  })
  .text(function(d){
    return format(d);
  });
  
  chart.selectAll(".legend-label")
  .data([0].concat(colorScale.quantiles()))
  .exit()
  .remove();
})