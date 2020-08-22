// Width and height
var chartWidth     =   800;
var chartHeight    =   600;
var color = d3.scaleQuantize().range([
    'rgb(255,245,240)','rgb(254,224,210)','rgb(252,187,161)',
    'rgb(252,146,114)','rgb(251,106,74)','rgb(239,59,44)',
    'rgb(203,24,29)','rgb(165,15,21)','rgb(103,0,13)']);

//Projection

var projection= d3.geoAlbersUsa()
    .scale([ chartWidth ])
    .translate([ chartWidth / 2, chartHeight / 2 ]);
var path= d3.geoPath(projection);
    //.projection(projection);

// Create SVG
var svg             =   d3.select("#chart")
    .append("svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight);

//Data
d3.json('zombie-attacks.json').then(function(zombieData){
    color.domain([
        d3.min(zombieData, function(d){
            return d.num;
        }),
        d3.max(zombieData, function(d){
            return d.num;
        })
    ]);

d3.json('us.json').then(function(usData){
    usData.features.forEach(function(us_e, us_i){
        zombieData.forEach(function(z_e,z_i){
            if(us_e.properties.name !== z_e.state){
                return null;
            }
            usData.features[us_i].properties.num = parseFloat(z_e.num)
        });
    });

    //    console.log(usData);

        svg.selectAll('path')
            .data(usData.features)
            .enter()
            .append('path')
            .attr('d', path)
            //.attr('fill', '#58CCE1')
            .attr('fill', function(d){
                var num = d.properties.num;
                return num ? color(num) : '#ddd';
            })
            .attr('stroke', '#fff')
            .attr('stroke-width', 1);

         drawCities();   
    });   
});

function drawCities(){
    d3.json('us-cities.json').then(function(cityData){
        svg.selectAll('circle')
            .data(cityData)
            .enter()
            .append('circle')
            .style('fill', '#9D497A')
            .style('opacity', 0.8)
            .attr('cx', function(d){
                return projection ([ d.lon, d.lat])[0];
            })
            .attr('cy', function(d){
                return projection ([ d.lon, d.lat])[1];
            })
            .attr('r', function(d){
                return Math.sqrt( parseInt (d.population) * 0.00005);
            })
            .append('title')
            .text(function(d){
                return d.city;
            });

    });
}

