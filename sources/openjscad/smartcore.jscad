/**********

Smartcore : L'empileuse

author: serge.vi / smartfriendz
licence : GPL
version: 0.1
date: 11 / 2014

***********/

// global vars - updated from interface but need to be avalaible in all functions

var globalWidth; // exernal dimension of the all printer
var globalHeight; // exernal dimension of the all printer
var globalDepth; // exernal dimension of the all printer
var wallThickness; // box wood thickness
var rodsDiam; // usually 6 or 8 .. or 10? 
var lmDiam; // lm6uu, lm8uu ... will be calculated from rods diam
var nemaXYZ;  // nema 14 , nema 17 
var supportXYDepth; // global , calculated from nema size.. used to place supports agaisnt walls
var YrodsWidth=40; //space between rods on Y axis
var rodsSupportThickness = 3; // thickness around rods for all supports


var printedOnly=false;


// interactive parameters

function getParameterDefinitions() {
  return [
    {
      name: 'nemaXYZ', 
      type: 'choice',
      caption: 'Stepper motors type',
      values: [14, 17],
      captions: ["nema14","nema17"], 
      initial: 17
    },    
  
    { name: 'globalWidth', caption: 'External width of the printer:', type: 'int', initial: 300 },
    { name: 'globalHeight', caption: 'External height of the printer:', type: 'int', initial: 250 },
    { name: 'globalDepth', caption: 'External depth of the printer:', type: 'int', initial: 300 },
    { name: 'wallThickness', caption: 'Box wood thickness:', type: 'int', initial: 10 },
    { name: 'rodsDiam', caption: 'Rods diameter:', type: 'int', initial: 6}
    
  ];
}



// -----------------  printed elements 


function slideY(){
    var bearings=cube({size:0});
    if(!printedOnly){
        bearings = union(
            cylinder({r:11,h:7}).translate([22,5,18]),
            cylinder({r:11,h:7}).translate([22,35,18])
        );
    }
    var width = 30;
    var height = lmDiam+2*rodsSupportThickness;
    var depth = YrodsWidth+(rodsDiam)+(rodsSupportThickness*2);
    return difference(
        union(
            bearings,
            cube({size:[width,depth,height]})
            
        ),
        cylinder({r:rodsDiam/2,h:15}).rotateY(90).translate([15,rodsSupportThickness+rodsDiam/2,height/2]),
        cylinder({r:rodsDiam/2,h:15}).rotateY(90).translate([15,depth-rodsSupportThickness-rodsDiam/2,height/2]),
        cylinder({r:lmDiam/2,h:42}).rotateX(-90).translate([10,-1,height/2])
        
        
    );
}

function head(){
    var width = 30;
    var height = lmDiam+2*rodsSupportThickness;
    var depth = YrodsWidth+(rodsDiam)+(rodsSupportThickness*2);
    return difference(
        cube({size:[width,depth,height]})
    );
}

function zTop(){
    return difference(
        cube({size:[70,20,20]}).setColor(0.2,0.8,0.2)
    );
}

function zBottom(){
    return difference(
        cube({size:[70,20,20]}).setColor(0.2,0.8,0.2)
    );
}

function slideZ(){
    return difference(
        cube({size:[80,20,40]})
    );
}

function motorZ(){
    return difference(
        cube({size:[40,10,20]})
    );
}

function motorXY(){
    supportXYDepth = (nemaXYZ==14)?40:50;
    var thickness = 7;
    return difference(
    union(
        cube({size:[supportXYDepth-8,supportXYDepth,thickness]}).setColor(0.5,0.5,0),
        cube({size:[thickness,supportXYDepth,20]})
    ),
    nemaHole(nemaXYZ).translate([20,23,0]),
    slottedHole(3.2,8,12).rotateY(90).rotateX(90).translate([-1,3,12]),
    slottedHole(3.2,8,12).rotateY(90).rotateX(90).translate([-1,supportXYDepth-3,12])
    );
}



function bearingsXY(){
    supportXYDepth = (nemaXYZ==14)?40:48;
    var thickness = 7;
    var bearings=cube({size:0});
    if(!printedOnly){
        bearings = union(
            cylinder({r:11,h:7}).translate([25,35,15]),
            cylinder({r:11,h:7}).translate([35,10,15])
        );
    }
    return difference(
        union(
            bearings,
            cube({size:[supportXYDepth,supportXYDepth,thickness]}).setColor(0.7,0.3,0),
            cube({size:[thickness,supportXYDepth,20]})
        ),
        slottedHole(3.2,8,12).rotateY(90).rotateX(90).translate([-1,6,12]),
        slottedHole(3.2,8,12).rotateY(90).rotateX(90).translate([-1,34,12])
    );
}

//  ----------   non printed elements ------------

function _walls(){
    return union(
        cube({size:[wallThickness,globalDepth,globalHeight]}).translate([-globalWidth/2,-globalDepth/2,0]).setColor(1,0.5,0.3),
        cube({size:[globalWidth,wallThickness,globalHeight]}).translate([-globalWidth/2,globalDepth/2,0]),
        cube({size:[wallThickness,globalDepth,globalHeight]}).translate([globalWidth/2-wallThickness,-globalDepth/2,0])
        );
}

function _rods(){
    return union(
        cylinder({r:rodsDiam/2,h:globalWidth-80}).rotateY(90).translate([-globalWidth/2+30,0,globalHeight-10]),
        cylinder({r:rodsDiam/2,h:globalWidth-80}).rotateY(90).translate([-globalWidth/2+30,YrodsWidth,globalHeight-10]),
        cylinder({r:rodsDiam/2,h:globalDepth-80}).rotateX(90).translate([-globalWidth/2+wallThickness+20,globalDepth/2-40,globalHeight-10]),
        cylinder({r:rodsDiam/2,h:globalDepth-80}).rotateX(90).translate([globalWidth/2-20-wallThickness,globalDepth/2-40,globalHeight-10]),
        cylinder({r:rodsDiam/2,h:globalHeight-20}).translate([-30,globalDepth/2-15,10]),
        cylinder({r:rodsDiam/2,h:globalHeight-20}).translate([30,globalDepth/2-15,10])
    );
}

function _linearBearings(){

}

function _nemas(){
    
}

function _bed(){
    return cube({size:[200,200,3]}).setColor(0.5,0.5,0.5);
}
// -----------------------  lib

function _axis(){
    return union(
        cube({size:[10,1,1]}).setColor(1,0,0),
        cube({size:[1,10,1]}).setColor(0,1,0),
        cube({size:[1,1,10]}).setColor(0,0,1)
        );
}

function nemaHole(size){
    var offset = (nemaXYZ==14)?13:15.5;
        return union(
            cylinder({r:11.1,h:25}),
            cylinder({r:1.6,h:25}).translate([-offset,-offset,0]),
            cylinder({r:1.6,h:25}).translate([offset,-offset,0]),
            cylinder({r:1.6,h:25}).translate([-offset,offset,0]),
            cylinder({r:1.6,h:25}).translate([offset,offset,0])
        );
}

function slottedHole(diam,length,height){
    return union(
        cylinder({r:diam/2,h:height}),
        cube([diam,length-diam,height]).translate([-diam/2,0,0]),
        cylinder({r:diam/2,h:height}).translate([0,length-diam,0])
    );
}

function bearingHole(){
    return union(
        cylinder({r:4,h:25}),
        cylinder({r:11,h:7}).translate([0,0,17])
    );
}

// -----------------------  start here 

function main(params){

    // assign globals from interface parameters
    globalWidth=params.globalWidth; 
    globalHeight=params.globalHeight; 
    globalDepth=params.globalDepth; 
    wallThickness=params.wallThickness; 
    rodsDiam = params.rodsDiam;
    nemaXYZ=params.nemaXYZ; 
    
    // update calculated values 
    if(rodsDiam==6){ lmDiam = 12;}
    if(rodsDiam==8){ lmDiam = 15;}

    var res = [];
    if(!printedOnly){ 
        res.push(_axis());
        res.push(_walls());
        res.push(_rods());
        res.push(_bed().translate([-100,-100,globalHeight/2]));
    }
    res.push(motorXY().translate([-globalWidth/2+wallThickness,-globalDepth/2,globalHeight-20]));
    res.push(motorXY().mirroredX().translate([globalWidth/2-wallThickness,-globalDepth/2,globalHeight-20]));
    res.push(bearingsXY().translate([-globalWidth/2+wallThickness,globalDepth/2-supportXYDepth,globalHeight-20]));
    res.push(bearingsXY().mirroredX().translate([globalWidth/2-wallThickness,globalDepth/2-supportXYDepth,globalHeight-20]));
    res.push(slideY().translate([-globalWidth/2+wallThickness+10,-rodsSupportThickness-rodsDiam/2,globalHeight-20]));
    res.push(slideY().mirroredX().translate([globalWidth/2-wallThickness-10,-rodsSupportThickness-rodsDiam/2,globalHeight-20]));
    res.push(head().translate([0,-rodsSupportThickness-rodsDiam/2,globalHeight-20])); // num = head dims
    res.push(zTop().translate([-35,globalDepth/2-20,globalHeight-20])); // num = ztop dims
    res.push(zBottom().translate([-35,globalDepth/2-20,0])); // num = zbottom dims
    res.push(slideZ().translate([-40,globalDepth/2-25,globalHeight/2-40])); // num = zbottom dims
    return res;

    //return motorXY();

}

