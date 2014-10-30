var globalWidth=200; // exernal dimension of the all printer
var globalHeight=160; // exernal dimension of the all printer
var globalDepth=200; // exernal dimension of the all printer
var wallThickness=10; 
var rodsDiam = 6;
var nemaXYZ=17; // nema14 nema17
var supportXYDepth = 1;

var printedOnly=false;

// -----------------  elements 

function walls(){
    return union(
        cube({size:[wallThickness,globalDepth,globalHeight]}).translate([-globalWidth/2,-globalDepth/2,0]).setColor(1,0.5,0.3),
        cube({size:[globalWidth,wallThickness,globalHeight]}).translate([-globalWidth/2,globalDepth/2,0]),
        cube({size:[wallThickness,globalDepth,globalHeight]}).translate([globalWidth/2,-globalDepth/2,0])
        );
}



function slideY(){
    return difference(
        cube({size:[30,40,16]})
    );
}

function head(){

}

function zTop(){

}

function zBottom(){

}

function slideZ(){

}

function motorZ(){

}

function motorXY(){
    supportXYDepth = (nemaXYZ==14)?40:48;
    var thickness = 7;
    return difference(
    union(
        cube({size:[supportXYDepth,supportXYDepth,thickness]}).setColor(0.5,0.5,0),
        cube({size:[thickness,supportXYDepth,20]})
    ),
    nemaHole(nemaXYZ).translate([28,23,0]),
    slottedHole(3.2,8,12).rotateY(90).rotateX(90).translate([-1,6,12]),
    slottedHole(3.2,8,12).rotateY(90).rotateX(90).translate([-1,34,12])
    );
}

function bearingsXY(){
    supportXYDepth = (nemaXYZ==14)?40:48;
    var thickness = 7;
    return difference(
        union(
            cube({size:[supportXYDepth,supportXYDepth,thickness]}).setColor(0.7,0.3,0),
            cube({size:[thickness,supportXYDepth,20]})
        ),
        slottedHole(3.2,8,12).rotateY(90).rotateX(90).translate([-1,6,12]),
        slottedHole(3.2,8,12).rotateY(90).rotateX(90).translate([-1,34,12])
    );
}

function _rods(){
    return union(
        cylinder({r:rodsDiam/2,h:globalWidth-40}).rotateY(90).translate([-globalWidth/2+20,-15,globalHeight-10]),
        cylinder({r:rodsDiam/2,h:globalWidth-40}).rotateY(90).translate([-globalWidth/2+20,15,globalHeight-10]),
        cylinder({r:rodsDiam/2,h:globalDepth-40}).rotateX(90).translate([-globalWidth/2+10,globalDepth/2,globalHeight-10]),
        cylinder({r:rodsDiam/2,h:globalDepth-40}).rotateX(90).translate([globalWidth/2-10,globalDepth/2,globalHeight-10]),
        cylinder({r:rodsDiam/2,h:globalHeight-40}).translate([-15,globalDepth/2,0]),
        cylinder({r:rodsDiam/2,h:globalHeight-40}).translate([15,globalDepth/2,0])
    );
}

function _linearBearings(){

}

function _nemas(){
    
}
// -----------------------  lib

function axis(){
    return union(
        cube({size:[10,1,1]}).setColor(1,0,0),
        cube({size:[1,10,1]}).setColor(0,1,0),
        cube({size:[1,1,10]}).setColor(0,0,1)
        );
}

function nemaHole(size){
    var offset = (nemaXYZ==14)?13:15.5;
        return union(
            cylinder({r:11.1,h:15}),
            cylinder({r:1.6,h:15}).translate([-offset,-offset,0]),
            cylinder({r:1.6,h:15}).translate([offset,-offset,0]),
            cylinder({r:1.6,h:15}).translate([-offset,offset,0]),
            cylinder({r:1.6,h:15}).translate([offset,offset,0])
        );
}

function slottedHole(diam,length,height){
    return union(
        cylinder({r:diam/2,h:height}),
        cube([diam,length-diam,height]).translate([-diam/2,0,0]),
        cylinder({r:diam/2,h:height}).translate([0,length-diam,0])
    );
}

// -----------------------  start here 

function main(){
    var res = [];
    if(!printedOnly){ 
        res.push(axis());
        res.push(walls());
        res.push(_rods());
    }
    res.push(motorXY().translate([-globalWidth/2+wallThickness,-globalDepth/2,globalHeight-20]));
    res.push(motorXY().mirroredX().translate([globalWidth/2,-globalDepth/2,globalHeight-20]));
    res.push(bearingsXY().translate([-globalWidth/2+wallThickness,globalDepth/2-supportXYDepth,globalHeight-20]));
    res.push(bearingsXY().mirroredX().translate([globalWidth/2,globalDepth/2-supportXYDepth,globalHeight-20]));
    res.push(slideY().translate([-globalWidth/2+wallThickness,-20,globalHeight-20]));
    res.push(slideY().mirroredX().translate([globalWidth/2,-20,globalHeight-20]));

    return res;
    /*
    return [axis(),
            if(!printedOnly){ walls(),}
            motorXY().translate([-globalWidth/2+wallThickness,-globalDepth/2,globalHeight-20]),
            motorXY().mirroredX().translate([globalWidth/2,-globalDepth/2,globalHeight-20]) ,
            bearingsXY().translate([-globalWidth/2+wallThickness,globalDepth/2-supportXYDepth,globalHeight-20]),
            bearingsXY().mirroredX().translate([globalWidth/2,globalDepth/2-supportXYDepth,globalHeight-20]) 
            ];
    */
}

