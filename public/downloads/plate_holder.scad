// This file belongs to the pipette-show.de web service


$fs = 0.01;
outerLength = 148;
outerWidth = 95;
height = 4;
plateLength = 129; 
plateWidth = 86;
nipplesDiameter = 4;
nipplesHeight = 9;
nipplesSmooth = 2;

module donut(r1, r2){
    rotate_extrude($fn=50)
    translate([r1, 0, 0])
    circle(r = r2);    
}


difference(){
cube([outerLength,outerWidth,height],center=true);
cube([plateLength,plateWidth,height+1],center=true);
}

offset = (outerLength-plateLength)/4;
cylinderHeight = nipplesHeight;


for (i = [-(plateWidth/2-nipplesDiameter),-(plateWidth/4),0,(plateWidth/4),(plateWidth/2-nipplesDiameter)]){    
// Height -0.1 to prevent rounding errors.
translate([outerLength/2-offset,i,height/2-0.1]){
cylinder(r= nipplesDiameter / 2, h = cylinderHeight);
    difference(){
       cylinder(r= nipplesDiameter / 2 + nipplesSmooth, h = nipplesSmooth);
       translate([0,0,nipplesSmooth])
donut(nipplesDiameter/2 + nipplesSmooth,nipplesSmooth);}
}
}

for (i = [-(plateWidth/2-nipplesDiameter),-(plateWidth/4),0,(plateWidth/4),(plateWidth/2-nipplesDiameter)]){ 
translate([-(outerLength/2-offset),i,height/2-0.1]){
cylinder(r= nipplesDiameter / 2, h = cylinderHeight);
    difference(){
       cylinder(r= nipplesDiameter / 2 + nipplesSmooth, h = nipplesSmooth);
       translate([0,0,nipplesSmooth])
donut(nipplesDiameter/2 + nipplesSmooth,nipplesSmooth);}
}
}
