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
var printWidth;
var printDepth;
var printHeight;
var wallThickness; // box wood thickness
var XYrodsDiam; // usually 6 or 8 .. or 10? 
var XYlmDiam; // lm6uu, lm8uu ... will be calculated from rods diam
var ZrodsDiam; // usually 6 or 8 .. or 10? 
var ZlmDiam; // lm6uu, lm8uu ... will be calculated from rods diam
var nemaXYZ;  // nema 14 , nema 17 
var supportXYDepth; // global , calculated from nema size.. used to place supports agaisnt walls
var YrodsWidth=40; //space between rods on Y axis
var ZrodsWidth=60; //space between rods on Z axis
var rodsSupportThickness = 3; // thickness around rods for all supports


var printedOnly=0;


// interactive parameters

function getParameterDefinitions() {
  return [
    {name: 'nemaXYZ', 
      type: 'choice',
      caption: 'Stepper motors type',
      values: [35, 42],
      captions: ["nema14","nema17"], 
      initial: 42
    },    
  
    { name: 'globalWidth', caption: 'External width of the printer:', type: 'int', initial: 300 },
    { name: 'globalHeight', caption: 'External height of the printer:', type: 'int', initial: 250 },
    { name: 'globalDepth', caption: 'External depth of the printer:', type: 'int', initial: 300 },
    { name: 'wallThickness', caption: 'Box wood thickness:', type: 'int', initial: 10 },
    { name: 'XYrodsDiam', caption: 'X Y Rods diameter (6 or 8 ):', type: 'int', initial: 6},
    { name: 'ZrodsDiam', caption: 'Z Rods diameter (6 or 8 ):', type: 'int', initial: 8},
    { name: 'printedOnly', caption: 'Show printed parts only:', type: 'choice', values: [0, 1], initial: 0, captions: ["No", "Yes"]}
    
  ];
}



// -----------------  printed elements 


function slideY(){
    var width = 40;
    var height = (XYlmDiam/2)+(2*rodsSupportThickness);
    var depth = YrodsWidth+(XYrodsDiam)+(rodsSupportThickness*2);
    var bearings=cube({size:0});
    
    if(printedOnly==0){
        bearings = union(
            bearing608z().translate([width-8,7,height+2]).setColor(0.4,0.4,0.4),
            bearing608z().translate([width-8,depth-7,height+2]).setColor(0.4,0.4,0.4)
        );
    }
    
    return difference(
        union(
            bearings,
            cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),
            cube({size:[10,depth,height+3]}).setColor(0.2,0.7,0.2),
            bearingSupport(3).translate([32,7,height-1]).setColor(0.2,0.8,0.4),
            bearingSupport(3).translate([32,depth-7,height-1]).setColor(0.2,0.8,0.4)
            
        ),
        cylinder({r:XYrodsDiam/2,h:15}).rotateY(90).translate([15,rodsSupportThickness+XYrodsDiam/2,height/2]),
        cylinder({r:XYrodsDiam/2,h:15}).rotateY(90).translate([15,depth-rodsSupportThickness-XYrodsDiam/2,height/2]),
        cylinder({r:XYlmDiam/2,h:depth+1}).rotateX(-90).translate([12,-1,XYlmDiam/2+rodsSupportThickness+3])
        
        
    );
}

function head(){
    var width = 40;
    var height = XYlmDiam+2*rodsSupportThickness;
    var depth = YrodsWidth+(XYrodsDiam)+(rodsSupportThickness*2);
    return difference(
        cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2)
    );
}

function zTop(){
    var width = ZrodsWidth+ZrodsDiam+(rodsSupportThickness*2);
    var height = 20;
    var depth = 20;
    var insideWidth = 35;
     var bearings=cube({size:0});

    if(printedOnly==0){
        bearings = union(
            bearing608z().rotateX(90).translate([((width-insideWidth)/2)+(insideWidth/2),5,height/2]).setColor(0.4,0.4,0.4)
        );
    }
    return union(
        difference(
            //main
            cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),
            // inside form
            cube({size:[insideWidth,depth,height]}).translate([(width-insideWidth)/2,-10,0]).setColor(0.2,0.7,0.2),
            //screw left
            slottedHole(3,8,22).rotateX(90).rotateY(90).translate([5,21,height-5]),
            //screw right
            slottedHole(3,8,22).rotateX(90).rotateY(90).translate([width-10,21,height-5]),
            // z rod left
            cylinder({r:ZrodsDiam/2,h:15}).translate([rodsSupportThickness+ZrodsDiam/2,10,0]),
            //z rod right
            cylinder({r:ZrodsDiam/2,h:15}).translate([rodsSupportThickness+ZrodsDiam/2+ZrodsWidth,10,0])

        ),
        bearingSupport(5).rotateX(90).translate([((width-insideWidth)/2)+(insideWidth/2),10,height/2]).setColor(0.2,0.7,0.2),
        bearings

        
    );
}

function zBottom(){
    return difference(
        cube({size:[70,20,20]}).setColor(0.2,0.7,0.2)
    );
}

function slideZ(){
    var width = ZrodsWidth+ZlmDiam+(rodsSupportThickness*2);
    var height = 40;
    var depth = ZlmDiam+(rodsSupportThickness*2)+5;
    var insideWidth = 35;
    return difference(
        //main form
        cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),
        // inside form
        cube({size:[insideWidth,depth,height]}).translate([(width-insideWidth)/2,-8,0]).setColor(0.2,0.7,0.2),
        // z rod left linear bearing lm
        cylinder({r:ZlmDiam/2,h:height}).translate([rodsSupportThickness+ZlmDiam/2,13,0]),
        //z rod right linear bearing lm
        cylinder({r:ZlmDiam/2,h:height}).translate([rodsSupportThickness+ZlmDiam/2+ZrodsWidth,13,0]),
        // bed support rods holes (*4)
        // top holes
        cylinder({r:ZrodsDiam/2,h:10}).rotateX(90).translate([rodsSupportThickness+ZlmDiam/2,9,height-5]),
        cylinder({r:ZrodsDiam/2,h:10}).rotateX(90).translate([rodsSupportThickness+ZlmDiam/2+ZrodsWidth,9,height-5]),
        //bottom holes
        cylinder({r:ZrodsDiam/2,h:10}).rotateX(85).translate([rodsSupportThickness+ZlmDiam/2,9,5]),
        cylinder({r:ZrodsDiam/2,h:10}).rotateX(85).translate([rodsSupportThickness+ZlmDiam/2+ZrodsWidth,9,5])
    );
}

function supportBed(){
    return difference(
        cube({size:[80,20,20]}).setColor(0.2,0.7,0.2)
    );
}

function motorZ(){
    return difference(
        cube({size:[40,10,10]}).setColor(0.2,0.7,0.2)
    );
}

function motorXY(){
    supportXYDepth = nemaXYZ+(rodsSupportThickness*2);
    var thickness = 7;
    return difference(
    union(
        cube({size:[supportXYDepth-8,supportXYDepth,thickness]}).setColor(0.2,0.7,0.2),
        cube({size:[thickness,supportXYDepth,20]}).setColor(0.2,0.5,0.2)
    ),
    nemaHole(nemaXYZ).translate([20,23,0]),
    slottedHole(3.2,8,12).rotateY(90).rotateX(90).translate([-1,3,12]),
    slottedHole(3.2,8,12).rotateY(90).rotateX(90).translate([-1,supportXYDepth-15,12])
    );
}



function bearingsXY(){
    supportXYDepth = nemaXYZ+(rodsSupportThickness*2);
    var height = 7;
    var bearings=cube({size:0});
    if(printedOnly==0){
        bearings = union(
            bearing608z().translate([25,33,16]).setColor(0.4,0.4,0.4),
            bearing608z().translate([35,10,10]).setColor(0.4,0.4,0.4)
        );
    }
    return difference(
        union(
            bearings,
            cube({size:[supportXYDepth,supportXYDepth,height]}).setColor(0.7,0.3,0),
            cube({size:[height,supportXYDepth,20]}),
            bearingSupport(10).translate([25,33,height-1]).setColor(0.2,0.8,0.4),
            bearingSupport(4).translate([35,10,height-1]).setColor(0.2,0.8,0.4)
        ),
        slottedHole(3.2,8,12).rotateY(90).rotateX(90).translate([-1,20,12]),
        slottedHole(3.2,8,12).rotateY(90).rotateX(90).translate([-1,supportXYDepth-5,12])
    );
}

//  ----------   non printed elements ------------

function _walls(){
    return union(
        //left 
        cube({size:[wallThickness,globalDepth+wallThickness,globalHeight]}).translate([-globalWidth/2,-globalDepth/2,0]).setColor(1,0.5,0.3),
        // back
        cube({size:[globalWidth-wallThickness*2,wallThickness,globalHeight]}).translate([-globalWidth/2+wallThickness,globalDepth/2,0]).setColor(0.9,0.4,0.3),
        // right
        cube({size:[wallThickness,globalDepth+wallThickness,globalHeight]}).translate([globalWidth/2-wallThickness,-globalDepth/2,0]).setColor(0.8,0.3,0.3),
        // bottom
        cube({size:[globalWidth-wallThickness*2,globalDepth,wallThickness]}).translate([-globalWidth/2+wallThickness,-globalDepth/2,0]).setColor(0.4,0.4,0.4).setColor(0.5,0.2,0.1)
        );
}

function _rods(){
    var offsetFromTopY = 10;
    var offsetFromTopX = 15;
    return union(
        // rod X front
        cylinder({r:XYrodsDiam/2,h:globalWidth-80}).rotateY(90).translate([-globalWidth/2+30,0,globalHeight-offsetFromTopX]).setColor(0.3,0.3,0.3),
        // rod x front bearing
        cylinder({r:XYlmDiam/2,h:50}).rotateY(90).translate([-25,0,globalHeight-offsetFromTopX]).setColor(0.6,0.6,0.6),
        // rod x back
        cylinder({r:XYrodsDiam/2,h:globalWidth-80}).rotateY(90).translate([-globalWidth/2+30,YrodsWidth,globalHeight-offsetFromTopX]).setColor(0.3,0.3,0.3),
        // rod y left
        cylinder({r:XYrodsDiam/2,h:globalDepth-80}).rotateX(90).translate([-globalWidth/2+wallThickness+15,globalDepth/2-40,globalHeight-offsetFromTopY]).setColor(0.3,0.3,0.3),
        // rod y left bearing
        cylinder({r:XYlmDiam/2,h:50}).rotateX(90).translate([-globalWidth/2+wallThickness+15,0,globalHeight-offsetFromTopY]).setColor(0.6,0.6,0.6),
        // rod y right
        cylinder({r:XYrodsDiam/2,h:globalDepth-80}).rotateX(90).translate([globalWidth/2-wallThickness-15,globalDepth/2-40,globalHeight-offsetFromTopY]).setColor(0.3,0.3,0.3),
        //rod Z left
        cylinder({r:ZrodsDiam/2,h:globalHeight-40}).translate([-ZrodsWidth/2,globalDepth/2-10,10]).setColor(0.3,0.3,0.3),
        //rod Z left bearing
        cylinder({r:ZlmDiam/2,h:50}).translate([-ZrodsWidth/2,globalDepth/2-10,globalHeight/2-10]).setColor(0.5,0.5,0.5),
        // rod z right
        cylinder({r:ZrodsDiam/2,h:globalHeight-40}).translate([ZrodsWidth/2,globalDepth/2-10,10]).setColor(0.3,0.3,0.3),
        // rod z right bearing
        cylinder({r:ZlmDiam/2,h:50}).translate([ZrodsWidth/2,globalDepth/2-10,globalHeight/2-10]).setColor(0.5,0.5,0.5),
        // support bed *4
        cylinder({r:ZrodsDiam/2,h:globalDepth-80}).rotateX(90).translate([-30,globalDepth/2-40,globalHeight/2-5]).setColor(0.5,0.5,0.5),
        cylinder({r:ZrodsDiam/2,h:globalDepth-80}).rotateX(90).translate([30,globalDepth/2-40,globalHeight/2-5]).setColor(0.5,0.5,0.5),
        cylinder({r:ZrodsDiam/2,h:globalDepth-80}).rotateX(85).rotateZ(5).translate([-30,globalDepth/2-40,globalHeight/2-30]).setColor(0.5,0.5,0.5),
        cylinder({r:ZrodsDiam/2,h:globalDepth-80}).rotateX(85).rotateZ(-5).translate([30,globalDepth/2-40,globalHeight/2-30]).setColor(0.5,0.5,0.5)
    );
}


function _nema(){
    return union(
        cube({size:nemaXYZ}).setColor(0.3,0.3,1.0),
        cylinder({r:11,h:2}).translate([nemaXYZ/2,nemaXYZ/2,nemaXYZ]),
        cylinder({r:2.5,h:25}).translate([nemaXYZ/2,nemaXYZ/2,nemaXYZ+2])
    );
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

function nemaHole(){
    var offset = (nemaXYZ==35)?13:15.5;
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

function bearingSupport(baseHeight){
    return union(
        cylinder({r:5,h:baseHeight}),
        cylinder({r:4,h:6}).translate([0,0,baseHeight])
    );
}

function bearing608z(){
    return difference(
        cylinder({r:11,h:7}),
        cylinder({r:4,h:7})
    );
}

// -----------------------  start here 

function main(params){

    // assign globals from interface parameters
    globalWidth=params.globalWidth; 
    globalHeight=params.globalHeight; 
    globalDepth=params.globalDepth; 
    wallThickness=params.wallThickness; 
    XYrodsDiam = params.XYrodsDiam;
    ZrodsDiam = params.ZrodsDiam;
    nemaXYZ=parseInt(params.nemaXYZ);
    printedOnly=params.printedOnly; 
    
    // update calculated values 
    if(XYrodsDiam==6){ XYlmDiam = 12;}
    if(XYrodsDiam==8){ XYlmDiam = 15;}
    if(ZrodsDiam==6){ ZlmDiam = 12;}
    if(ZrodsDiam==8){ ZlmDiam = 15;}

    var res = [];
    if(printedOnly==0){ 
        res.push(_axis());
        res.push(_walls());
        res.push(_rods());
        res.push(_bed().translate([-100,-100,globalHeight/2]));
        //nema left
        res.push(_nema().translate([-globalWidth/2+wallThickness,-globalDepth/2,globalHeight-nemaXYZ-22]));
        // nema right
        res.push(_nema().translate([globalWidth/2-+wallThickness-nemaXYZ,-globalDepth/2,globalHeight-nemaXYZ-22]));
        // nema bottom ..z
        res.push(_nema().rotateX(-90).translate([-nemaXYZ/2,globalDepth/2-nemaXYZ-30,wallThickness+nemaXYZ]));
    }
    res.push(motorXY().translate([-globalWidth/2+wallThickness,-globalDepth/2,globalHeight-20]));
    res.push(motorXY().mirroredX().translate([globalWidth/2-wallThickness,-globalDepth/2,globalHeight-20]));
    res.push(bearingsXY().translate([-globalWidth/2+wallThickness,globalDepth/2-supportXYDepth,globalHeight-20]));
    res.push(bearingsXY().mirroredX().translate([globalWidth/2-wallThickness,globalDepth/2-supportXYDepth,globalHeight-20]));
    res.push(slideY().translate([-globalWidth/2+wallThickness+3,-rodsSupportThickness-XYrodsDiam/2,globalHeight-22]));
    res.push(slideY().mirroredX().translate([globalWidth/2-wallThickness-3,-rodsSupportThickness-XYrodsDiam/2,globalHeight-22]));
    res.push(head().translate([-40,-rodsSupportThickness-XYrodsDiam/2,globalHeight-25])); // num = head dims
    res.push(zTop().translate([-35,globalDepth/2-20,globalHeight-40])); // num = ztop dims
    res.push(zBottom().translate([-35,globalDepth/2-20,wallThickness])); // num = zbottom dims
    res.push(slideZ().translate([-39,globalDepth/2-23,globalHeight/2-40])); // num = zbottom dims
    res.push(supportBed().translate([-40,globalDepth/2-270,globalHeight/2-15])); // num = zbottom dims
    return res;

    //return _walls();



}

