/**********

Smartcore : L'empileuse

author: serge.vi / smartfriendz
licence : GPL
version: 0.9.0.1
date: 11 / 2014



TODO:
- slide y : systeme pour tenir les barres avec vis ? 
- head : double passage de courroie pour tenir
- motor xy right : support pour end x
- repasser endx sur head
- clips glass
- supports planche interieure 




***********/

// global vars - updated from interface but need to be avalaible in all functions
var _globalResolution; // used to speed up rendering. ugly for preview . use 24 or 32 for generating stl.
var _woodsupport; // option : we can screw the supports in through the wood or use support to just use wood screws.
var _globalWidth; // exernal dimension of the all printer
var _globalHeight; // exernal dimension of the all printer
var _globalDepth; // exernal dimension of the all printer
var _printableWidth;
var _printableDepth;
var _printableHeight;
var _wallThickness; // box wood thickness
var _XYrodsDiam; // usually 6 or 8 .. or 10? 
var _XYlmDiam; // lm6uu, lm8uu ... will be calculated from rods diam
var _ZrodsDiam; // usually 6 or 8 .. or 10? 
var _ZlmDiam; // lm6uu, lm8uu ... will be calculated from rods diam
var _nemaXYZ;  // nema 14 , nema 17 
var _XrodsWidth=40; //space between rods on X axis
var _ZrodsWidth=80; //space between rods on Z axis
var _extrusionType = 0; // 0 bowden 1 direct
var XrodLength = 300; // will be calculated in main from parameters.
var YrodLength = 300; // will be calculated in main from parameters.
var ZrodLength = 300; // will be calculated in main from parameters.
var _rodsSupportThickness = 3; // thickness around rods for all supports
var outputPlateWidth = 180; //used when output to printable plates for elements
var outputPlateDepth = 180;
var mk7Diam = 10;

// global for work
var _bearingsDepth = 35; // hack.need to be cleaned. 
var headoffset = -50; // used to place the head along X axis
var XaxisOffset = -80; // used to palce the X axis on Y
var _ZaxisOffset = -30; // used to place Z stage.
var endxJheadAttachHolesWidth = 32; // tempo.. 

var output; // show hide objects  from output choosen in the parameters.


// interactive parameters

function getParameterDefinitions() {
  return [
  { name: '_version', caption: 'Version', type: 'text', initial: "0.9.0.5 - 01/29/2015" },
  { 
        name: '_output', 
        caption: 'What to show :', 
        type: 'choice', 
        values: [0,1,2,3,4,5,6,7,8,9,10,11], 
        initial: 1, 
        captions: ["nothing","All printer assembly", "printed parts plate","motor xy","bearings xy","slide y","z top","z bottom","z slide","head","extruder","parts only"]
    },
       
  
    { name: '_printableWidth', caption: 'Print width:', type: 'int', initial: 200 },
    { name: '_printableHeight', caption: 'Print height :', type: 'int', initial: 150 },
    { name: '_printableDepth', caption: 'Print depth :', type: 'int', initial: 200 },
    { name: '_wallThickness', caption: 'Box wood thickness:', type: 'int', initial: 10 },
    { name: '_XYrodsDiam', caption: 'X Y Rods diameter (6 or 8 ):', type: 'int', initial: 6},
    { name: '_ZrodsDiam', caption: 'Z Rods diameter (6 or 8 ):', type: 'int', initial: 8},
    
    { name: '_globalResolution', caption: 'output resolution (16, 24, 32)', type: 'int', initial: 6 },
    {name: '_nemaXYZ', 
      type: 'choice',
      caption: 'Stepper motors type',
      values: [35, 42],
      captions: ["nema14","nema17"], 
      initial: 42
    }, 
    { 
        name: '_woodsupport', 
        caption: 'top Wood supports:', 
        type: 'choice', 
        values: [0,1], 
        initial: 1, 
        captions: ["no supports","with supports"]
    },
    {name: 'extrusionType', 
      type: 'choice',
      caption: 'Extrusion type',
      values: [0, 1],
      captions: ["direct","bowden"], 
      initial: 1
    }
    
  ]; 
}



// -----------------  printed elements 




function zTop(){
    var width = _ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2);
    var height = 12;
    var depth = 22;
    var insideWidth = 60;
     var bearings=cube({size:0});

    if(output==1){
        bearings = union(
            bearing608z().rotateX(90).translate([3,-2,0]).setColor(0.4,0.4,0.4)
        );
    }
    return union(
        difference(
            //main
            cube({size:[width,depth,height],center:true}).setColor(0.2,0.7,0.2),
            // inside form
            cube({size:[insideWidth,depth,height],center:true}).translate([0,-5,0]).setColor(0.2,0.7,0.2),
            //screw left
            slottedHole(4,8,depth).rotateX(90).rotateY(90).translate([-(insideWidth)/2+4,20,0]),
            //screw right
            slottedHole(4,8,depth).rotateX(90).rotateY(90).translate([(insideWidth)/2-9,20,0]),
            // z rod left
            cylinder({r:_ZrodsDiam/2,h:height,fn:_globalResolution}).translate([-_ZrodsWidth/2,-2,-height/2]),
            //z rod right
            cylinder({r:_ZrodsDiam/2,h:height,fn:_globalResolution}).translate([_ZrodsWidth/2,-2,-height/2]),
            // chamfer
            roundBoolean(10,10,20,height,"bl").rotateX(90).translate([-(insideWidth)/2-5,-7,-height/2]),
            roundBoolean(10,10,20,height,"bl").rotateX(90).rotateZ(-90).translate([(insideWidth)/2+5,-7,-height/2])

        ),
        
        bearingSupport(9).rotateX(90).translate([3,6,0]).setColor(0.2,0.7,0.2),
        bearings


        
    );
}

function zBottom(){
    var width = _ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2);
    var height = 10;
    var depth = 22;
    var attachdiam = 12;
    return difference(
        //main
        union(
            cube({size:[width,depth,height],center:true}).setColor(0.2,0.7,0.2),
            cube({size:[width/2,depth,10],center:true}).translate([0,-10,0]).setColor(0.2,0.7,0.2),
            // screws attach form right
            cylinder({r:attachdiam/2,h:5,fn:_globalResolution}).rotateX(-90).translate([width/4+attachdiam/2,depth/2-5,height]),
            cube({size:[attachdiam,5,attachdiam],center:true}).translate([width/4+attachdiam/2,depth/2-2.5,height-attachdiam/2]),
            // screws attach form left
            cylinder({r:attachdiam/2,h:5,fn:_globalResolution}).rotateX(-90).translate([-width/4-attachdiam/2,depth/2-5,height]),
            cube({size:[attachdiam,5,attachdiam],center:true}).translate([-width/4-attachdiam/2,depth/2-2.5,height-attachdiam/2])
            
            ),
        // inside form
        nemaHole(_nemaXYZ).rotateX(90).translate([0,0,_nemaXYZ/2-height/2]),
        cube({size:[width/2,depth,height],center:true}).translate([0,10,0]),
        // z rod left
        cylinder({r:_ZrodsDiam/2,h:height,fn:_globalResolution}).translate([-_ZrodsWidth/2,-2,-height/2]),
        //z rod right
        cylinder({r:_ZrodsDiam/2,h:height,fn:_globalResolution}).translate([_ZrodsWidth/2,-2,-height/2]),
        //screw holes
        // screws attach form
        cylinder({r:2,h:5,fn:_globalResolution}).rotateX(-90).translate([width/4+attachdiam/2,depth/2-5,height]),
        cylinder({r:2,h:5,fn:_globalResolution}).rotateX(-90).translate([-width/4-attachdiam/2,depth/2-5,height])
        
    );
}

function slideZ(){
    var width = _ZrodsWidth-5;
    var height = 50;
    var depth = 5;
    var insideWidth = 35;
    return difference(
        //main form
        union(
            cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),

            Gt2Holder2().rotateX(90).rotateY(90).translate([width/2-10,1,height-13]).setColor(0.2,0.7,0.2),
            
            //Gt2Holder(3).rotateX(90).rotateY(90).translate([width/2-10,1,10]).setColor(0.2,0.7,0.2),
            // lm8uu holes
            cylinder({r:_ZlmDiam/2+3,h:height,fn:_globalResolution}).translate([0,0,0]).setColor(0.2,0.7,0.2),
            cylinder({r:_ZlmDiam/2+3,h:height,fn:_globalResolution}).translate([_ZrodsWidth,0,0]).setColor(0.2,0.7,0.2),
            // side forms for lm8 attach
            cube({size:[10,10,height]}).translate([_ZrodsWidth+7,-4,0]).setColor(0.2,0.7,0.2),
            cube({size:[10,10,height]}).translate([-17,-4,0]).setColor(0.2,0.7,0.2),

            // extra forms front bearings holes
            cube([10,80,height]).translate([-5,-75,0]).setColor(0.2,0.7,0.2),
            cube([10,80,height]).translate([_ZrodsWidth-5,-75,0]).setColor(0.2,0.7,0.2)
            
        ),
        // big hole middle
        cylinder({r:10,h:50,fn:_globalResolution}).rotateX(90).translate([width/2+15,40,height/2+10]),
        cylinder({r:10,h:50,fn:_globalResolution}).rotateX(90).translate([width/2-10,40,height/2-10]),
        //  boolean front horizontal
        cylinder({r:80,h:width+40,fn:_globalResolution}).rotateY(90).translate([-20,-80,-35]),
        cylinder({r:5,h:width+40,fn:_globalResolution}).rotateY(90).translate([-20,-15,height-10]),
        cylinder({r:3,h:width+40,fn:_globalResolution}).rotateY(90).translate([-20,-35,height-13]),
        // z rod left linear bearing lm
        cylinder({r:_ZlmDiam/2,h:height,fn:_globalResolution}).translate([0,0,0]),
        //z rod right linear bearing lm
        cylinder({r:_ZlmDiam/2,h:height,fn:_globalResolution}).translate([_ZrodsWidth,0,0]),
        // side holes for lm8 attach
        cube({size:[12,2,height]}).translate([_ZrodsWidth+5,0,0]),
        cube({size:[12,2,height]}).translate([-18,0,0]),
        // side holes for lm8 screws
        cylinder({r:1.4,h:30,fn:_globalResolution}).rotateX(90).translate([_ZrodsWidth+12,20,height-10]),
        cylinder({r:1.4,h:30,fn:_globalResolution}).rotateX(90).translate([_ZrodsWidth+12,20,10]),
        cylinder({r:1.4,h:30,fn:_globalResolution}).rotateX(90).translate([-12,20,height-10]),
        cylinder({r:1.4,h:30,fn:_globalResolution}).rotateX(90).translate([-12,20,10]),
        //bottom holes
        cylinder({r:2.4,h:10,fn:_globalResolution}).rotateX(83).rotateZ(5).translate([0,-7,10]),
        cylinder({r:2.4,h:10,fn:_globalResolution}).rotateX(83).rotateZ(-5).translate([_ZrodsWidth,-7,10]),
        // top holes
        cylinder({r:1.4,h:30,fn:_globalResolution}).translate([0,-20,height-30]),
        cylinder({r:1.4,h:30,fn:_globalResolution}).translate([_ZrodsWidth,-20,height-30]),
        cylinder({r:1.4,h:30,fn:_globalResolution}).translate([0,-65,height-30]),
        cylinder({r:1.4,h:30,fn:_globalResolution}).translate([_ZrodsWidth,-65,height-30]),
        // special hole in gt2 holder to be able to get the belt out .. but still printable vertically.
            linear_extrude({height:20},polygon({points:[[0,0],[6,0],[4,10],[2,10]]})).rotateY(-90).translate([width/2+5,-10,height-15])

        
    );
}


function slideZ2(){
    var width=12;
    var height = 50;
    var depth = 80;
    return difference(
        cube({size:[width,depth,height]}),
        // form under big round
        cylinder({r:60,h:width+5,fn:_globalResolution}).rotateY(90).translate([-1,-5,-20]),
        // extra holes horizontal
        cylinder({r:8,h:width+5,fn:_globalResolution}).rotateY(90).translate([-1,45,height-15]),
        cylinder({r:4,h:width+5,fn:_globalResolution}).rotateY(90).translate([-1,50,height-35]),
        cylinder({r:4,h:width+5,fn:_globalResolution}).rotateY(90).translate([-1,23,height-12]),
        // lmuu for Z hole
        cylinder({r:_ZlmDiam/2,h:height,fn:_globalResolution}).translate([1,depth-_ZlmDiam/2-5,0]),
        // screws holes for lmxuu support
        cylinder({r:1.4,h:width+5,fn:_globalResolution}).rotateY(90).translate([-1,depth-3.4,height-5]),
        cylinder({r:1.4,h:width+5,fn:_globalResolution}).rotateY(90).translate([-1,depth-3.4,5]),
        cylinder({r:1.4,h:width+5,fn:_globalResolution}).rotateY(90).translate([-1,depth-_ZlmDiam-6.8,height-5]),
        cylinder({r:1.4,h:width+5,fn:_globalResolution}).rotateY(90).translate([-1,depth-_ZlmDiam-6.8,5]),
        // top holes
        cylinder({r:1.4,h:20,fn:_globalResolution}).translate([width/2+2,50,height-20]),
        cylinder({r:1.4,h:20,fn:_globalResolution}).translate([width/2+2,15,height-20]),
        // reduction width on the support 
        cube({size:[width/2,depth-_ZlmDiam-10,height]}).translate([0,0,-5])

    );


}

function slideZBearingsSupport(){
    var width=10;
    var height = 50;
    var depth = 25;
    return difference(
        cube({size:[width,depth,height]}),
        // lmuu for Z hole
        cylinder({r:_ZlmDiam/2,h:height,fn:_globalResolution}).translate([-1.1,depth-_ZlmDiam/2-5,0]),
        // screws holes for lmxuu support
        cylinder({r:1.6,h:width+5,fn:_globalResolution}).rotateY(90).translate([-1,depth-3.4,height-5]),
        cylinder({r:1.6,h:width+5,fn:_globalResolution}).rotateY(90).translate([-1,depth-3.4,5]),
        cylinder({r:1.6,h:width+5,fn:_globalResolution}).rotateY(90).translate([-1,depth-_ZlmDiam-6.8,height-5]),
        cylinder({r:1.6,h:width+5,fn:_globalResolution}).rotateY(90).translate([-1,depth-_ZlmDiam-6.8,5])

    );
}

function slideZBeltAttach(){
    var width=5;
    var height = 50;
    var depth = 15;
    return difference(
        union(
        cube({size:[width,depth,height]}),
        cube({size:[20,10,20]}).translate([width,5,15])
        ),
        Gt2HolderBool(0,10).rotateX(90).rotateY(90).translate([20,15,35]),
        Gt2HolderBool(0,10).rotateX(90).rotateY(90).translate([20,15,24]),
        // screws holes for lmxuu support
        cylinder({r:1.6,h:width+5,fn:_globalResolution}).rotateY(90).translate([-1,3.4,height-5]),
        cylinder({r:1.6,h:width+5,fn:_globalResolution}).rotateY(90).translate([-1,3.4,5])
    );
}


function slideY(side){
    var width = 45;
    var height = (_XYlmDiam/2)+(2*_rodsSupportThickness)+3;
    var depth = _XrodsWidth+(_XYrodsDiam)+(_rodsSupportThickness*2);
    var heightSecondBearing = 2;
    var offsetHeightXrods = 3;
    if(side=="right"){heightSecondBearing = 9;}
    
    var mesh = difference(
        union(
            // main
            cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),
            // extra for bearing support
            //cube({size:[10,depth,height+3]}).setColor(0.2,0.7,0.2),
            bearingSupport(2).translate([34,depth/2-15,height]).setColor(0.2,0.8,0.4),
            bearingSupport(heightSecondBearing).translate([32,depth/2+15,height]).setColor(0.2,0.8,0.4)
            
        ),
        // rod x front
        cylinder({r:_XYrodsDiam/2,h:15,fn:_globalResolution}).rotateY(90).translate([width-15,_rodsSupportThickness+_XYrodsDiam/2,height/2+offsetHeightXrods]),
        // rod x back
        cylinder({r:_XYrodsDiam/2,h:15,fn:_globalResolution}).rotateY(90).translate([width-15,depth-_rodsSupportThickness-_XYrodsDiam/2,height/2+offsetHeightXrods]),
         // rods fixation holes under
         cylinder({r:1.4,h:10,fn:_globalResolution}).translate([width-5,_rodsSupportThickness+_XYrodsDiam/2,0]),
         cylinder({r:1.4,h:10,fn:_globalResolution}).translate([width-5,depth-_rodsSupportThickness-_XYrodsDiam/2,0]),
        // bearing support
        cylinder({r:_XYlmDiam/2,h:depth+1,fn:_globalResolution}).rotateX(-90).translate([12,-1,_XYlmDiam/2+_rodsSupportThickness+3]),
        //hole  between rods - to gain weight and print time
        cylinder({r:10,h:height,fn:_globalResolution}).translate([width,depth/2,0]),
        // endstop x hole
        cylinder({r:1.4,h:10,fn:_globalResolution}).rotateX(-90).translate([width-4,depth-10,5]),
        //extra holes through all for bearing supports
        cylinder({r:1.4,h:height,fn:_globalResolution}).translate([34,depth/2-15,0]),
        cylinder({r:1.4,h:height,fn:_globalResolution}).translate([32,depth/2+15,0])  
    );
    var bearings = union(
            bearing608z().translate([34,depth/2-15,height+1]),
            bearing608z().translate([32,depth/2+15,height+heightSecondBearing]),
            // bearing hat
            bearingTop(3).translate([34,depth/2-15,height+7]).setColor(0.2,0.7,0.2),
            bearingTop(3).translate([32,depth/2+15,height+heightSecondBearing+7]).setColor(0.2,0.7,0.2)
        );
    if(output==1){
        mesh = union (mesh,bearings);
    }

    return mesh;

}

function head(){
    var width = 53;
    var height = (_XYlmDiam/2)+(2*_rodsSupportThickness)+2;
    var depth = _XrodsWidth+(_XYlmDiam)+(_rodsSupportThickness*4);
    var extDiam=15.1;
    var intDiam=12.1;
    var intDiamHeight=5;
    var jheadsupportheight = 25;
    return difference(
        union(
        //main
        cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),
        //gt2 holders 
        Gt2Holder(3).translate([0,depth/2+3,height]),
        Gt2Holder(3).translate([0,depth/2-11,height]),
        Gt2Holder3(3,16).translate([width-16,depth/2+3,height]),
        Gt2Holder(3).translate([width-10,depth/2-11,height])
        // rsupport for jhead
        //cube({size:[40,10,jheadsupportheight]}).translate([width/2-20,depth-8,height])
        
        ),
        // x bearing front
        cylinder({r:_XYlmDiam/2,h:width,fn:_globalResolution}).rotateY(90).translate([0,_XYlmDiam/2+(_rodsSupportThickness*2),_XYlmDiam/2+_rodsSupportThickness+1]),
        // x bearing back
        cylinder({r:_XYlmDiam/2,h:width,fn:_globalResolution}).rotateY(90).translate([0,_XYlmDiam/2+(_rodsSupportThickness*2)+_XrodsWidth,_XYlmDiam/2+_rodsSupportThickness+1]),
        // tooling hole
        cylinder({r:13,h:30,fn:_globalResolution}).translate([width/2,depth/2,0]),
        // jhead holes behind
         cylinder({r:extDiam/2+0.6,h:height+jheadsupportheight-10,fn:_globalResolution}).translate([width/2,depth+2,0]),
         //cylinder({r:extDiam/2+0.1,h:5,fn:_globalResolution}).translate([width/2,depth+2,height+jheadsupportheight-5]),
         //cylinder({r:intDiam/2+0.1,h:intDiamHeight,fn:_globalResolution}).translate([width/2,depth+2,height+jheadsupportheight]),
                 
         // jhead attach holes 
         cylinder({r:1.4,h:30,fn:_globalResolution}).translate([width/2-endxJheadAttachHolesWidth/2,depth-5,0]),
         cylinder({r:1.4,h:30,fn:_globalResolution}).translate([width/2+endxJheadAttachHolesWidth/2,depth-5,0])
         


    );
}

function HeadSupportJhead(){
    var width = 40;
    var height = 15;
    var depth = 8;
    var extDiam=15.1;
    var intDiam=12.1;
    var intDiamHeight=5;
    return difference(
        union(
            //base
            cube({size:[width,depth,5]}),
            // middle
            cube({size:[width/2,depth,height-7]}).translate([width/4,0,5]),
            // top
            cube({size:[width,depth,8]}).translate([0,0,height-8])
        ),
        // jhead holes 
         cylinder({r:extDiam/2+0.1,h:height-5,fn:_globalResolution}).translate([width/2,depth+1,0]),
         cylinder({r:intDiam/2+0.1,h:intDiamHeight,fn:_globalResolution}).translate([width/2,depth+1,height-5]),
         // jhead attach holes 
         cylinder({r:1.3,h:30,fn:_globalResolution}).rotateX(-90).translate([width/2-endxJheadAttachHolesWidth/2,0,height-4]),
         cylinder({r:1.3,h:30,fn:_globalResolution}).rotateX(-90).translate([width/2+endxJheadAttachHolesWidth/2,0,height-4]),
         // head attach holes 
         cylinder({r:1.3,h:8,fn:_globalResolution}).translate([width/2-endxJheadAttachHolesWidth/2,depth/2,0]),
         cylinder({r:1.3,h:8,fn:_globalResolution}).translate([width/2+endxJheadAttachHolesWidth/2,depth/2,0])

    );
}

function JheadAttach(){
    var extDiam=16;
    var intDiam=12;
    var intDiamHeight=5;
    var depth = 12;
    var width = 75;
    var barHeight = 6;

    return difference(
        union(
            cube([endxJheadAttachHolesWidth-5,8,8]).translate([width/2-((endxJheadAttachHolesWidth-5)/2),-10,barHeight]),
            tube(3.2,10,8).rotateX(-90).translate([width/2-endxJheadAttachHolesWidth/2,-10,barHeight+4]),
            tube(3.2,10,8).rotateX(-90).translate([width/2+endxJheadAttachHolesWidth/2,-10,barHeight+4])
        ),
         cylinder({r:extDiam/2,h:10,fn:_globalResolution}).translate([width/2,0,0]),
         cylinder({r:intDiam/2,h:intDiamHeight,fn:_globalResolution}).translate([width/2,0,10])
         

    );  
    }

function InductiveSensorSupport(){
    var width = 40;
    var height = 7;
    var depth = 8;
    var extDiam=15.1;
    var intDiam=12.1;
    var intDiamHeight=5;
    return difference(
        union(
            //base
            cube({size:[width/2+10,depth,height]}).translate([width/2,0,0]),
            // extra join for cylinder
            cube({size:[20,10,height]}).rotateZ(45).translate([width+10,0,0]),
            cube({size:[20,10,height]}).rotateZ(45).translate([width+3,0,0]),
            // inductive support
            cylinder({r:13,h:height,fn:_globalResolution}).translate([width+16,depth+8,0])
        ),
        // jhead holes 
         //cylinder({r:extDiam/2+0.1,h:height,fn:_globalResolution}).translate([width/2,depth+1,0]),
         //cylinder({r:intDiam/2+0.1,h:intDiamHeight,fn:_globalResolution}).translate([width/2,depth+1,height-5]),
         
         // head attach holes 
         //cylinder({r:1.3,h:8,fn:_globalResolution}).translate([width/2-endxJheadAttachHolesWidth/2,depth/2,0]),
         cylinder({r:1.3,h:8,fn:_globalResolution}).translate([25,depth/2,0]),

         // inductive support hole
         cylinder({r:9,h:height,fn:_globalResolution}).translate([width+16,depth+8,0]),
         // hole screw to attach the sensor faster
         cylinder({r:1.3,h:10,fn:_globalResolution}).rotateX(-90).translate([55,20,height/2])

    );
}

function motorXY(){
    var thickness = 5;
    return difference(
    union(
        // base
        cube({size:[_nemaXYZ/2+5,_nemaXYZ,thickness]}).setColor(0.2,0.7,0.2),
        // wall support
        cube({size:[9,_nemaXYZ,20]}).setColor(0.2,0.7,0.2),
        //top and back fix
        //cube({size:[_wallThickness+9,_nemaXYZ,thickness]}).translate([-_wallThickness,0,20]).setColor(0.2,0.7,0.2),
        //cube({size:[thickness,_nemaXYZ,20+thickness]}).translate([-_wallThickness-thickness,0,0]).setColor(0.2,0.7,0.2),
        // rod support - half slotted hole
        cylinder({r:_XYrodsDiam/2+2.5,h:15,fn:_globalResolution}).rotateX(90).translate([15,_nemaXYZ,thickness+3]).setColor(0.2,0.7,0.2)


    ),
    nemaHole(_nemaXYZ).translate([_nemaXYZ/2,_nemaXYZ/2,0]),
    // rod support hole
    cylinder({r:_XYrodsDiam/2,h:5,fn:_globalResolution}).rotateX(90).translate([15,_nemaXYZ,thickness+3]).setColor(0.2,0.7,0.2),
    // slotted holes to fix on the wood side - version simple
    slottedHole(3.2,8,10).rotateX(-90).rotateZ(90).translate([9,10,15]),
    slottedHole(3.2,8,13).rotateX(-90).rotateZ(90).translate([12,25,15])
    );
}

function motorXYSupport(){
    var thickness = 5;
    return difference(
    union(
        // base
        //cube({size:[_nemaXYZ/2,_nemaXYZ,thickness]}).setColor(0.2,0.7,0.2),
        // wall support
        //cube({size:[9,_nemaXYZ,20]}).setColor(0.2,0.7,0.2),
        //top and back fix
        cube({size:[_wallThickness+9,_nemaXYZ,thickness]}).translate([-_wallThickness,0,20]).setColor(0.2,0.7,0.2),
        cube({size:[thickness,_nemaXYZ,10+thickness]}).translate([-_wallThickness-thickness,0,10]).setColor(0.2,0.7,0.2)
        // rod support - half slotted hole
        //cylinder({r:_XYrodsDiam/2+2.5,h:15}).rotateX(90).translate([15,_nemaXYZ,thickness+2.5]).setColor(0.2,0.7,0.2)


    ),
    nemaHole(_nemaXYZ).translate([_nemaXYZ/2,_nemaXYZ/2,0]),
    cylinder({r:1.6,h:10,fn:_globalResolution}).rotateY(90).translate([-_wallThickness-thickness,10,15]),
    cylinder({r:1.6,h:10,fn:_globalResolution}).rotateY(90).translate([-_wallThickness-thickness,_nemaXYZ-10,15])
    // rod support hole
    //cylinder({r:_XYrodsDiam/2,h:5}).rotateX(90).translate([15,_nemaXYZ,thickness+2.5]).setColor(0.2,0.7,0.2)
    // slotted holes to fix on the wood side - version simple
    //slottedHole(3.2,8,10).rotateX(-90).rotateZ(90).translate([9,10,15]),
    //slottedHole(3.2,8,13).rotateX(-90).rotateZ(90).translate([12,25,15])
    );
}




function bearingsXY(){
    width = 42;
    var thickness = 5;
    var bearings=cube({size:0});
    
    var mesh = difference(
        union(
            //base
            cube({size:[width,_bearingsDepth,thickness]}).setColor(0.2,0.7,0.2).translate([0,0,3]),
           
            //wall support
            cube({size:[thickness,_bearingsDepth,17]}).setColor(0.2,0.7,0.2).translate([0,0,3]),
            cube({size:[30,thickness,17]}).setColor(0.2,0.7,0.2).translate([0,_bearingsDepth-thickness,3]),

            bearingSupport2(4).translate([35,10,thickness+2]).setColor(0.2,0.8,0.4),
            
            difference(
            // rod support -
            cylinder({r:_XYrodsDiam/2+2.5,h:13}).rotateX(90).translate([15,13,thickness+4]).setColor(0.2,0.7,0.2),
            // back round 
            cylinder({r:9,h:30}).rotateY(90).translate([7,18,16])
            
            )
        ),

         // screw holes top
        cylinder({r:1.6,h:30,fn:_globalResolution}).translate([thickness/2,5,0]),
        cylinder({r:1.6,h:30,fn:_globalResolution}).translate([thickness/2,_bearingsDepth-5,0]),
        // slotted holes to fix on the wood side
        slottedHole(3.2,8,10).rotateX(-90).rotateZ(90).translate([9,20,15]),
        slottedHole(3.2,8,10).rotateX(-90).translate([22,_bearingsDepth-7,15]),

        // rod support hole
        cylinder({r:_XYrodsDiam/2,h:5,fn:_globalResolution}).rotateX(90).translate([15,5,thickness+3]).setColor(0.2,0.7,0.2),
        //extra holes through all for bearing supports
        cylinder({r:1.4,h:thickness+3,fn:_globalResolution}).translate([35,10,0])
    );
        var bearings = union(
            //low bearing
            bearing608z().translate([35,10,thickness+6]).setColor(0.4,0.4,0.4),
            // middle hat
            bearingMiddle(8).translate([35,10,thickness+13]).setColor(0.2,0.7,0.2),
            // high bearing
            bearing608z().translate([35,10,thickness+16]).setColor(0.4,0.4,0.4),
            // hat
            bearingTop(3).translate([35,10,thickness+23]).setColor(0.2,0.7,0.2)
        );
    if(output==1){
        mesh = union(mesh,bearings);
    }
    return mesh;
}



function bearingsXYSupport(){
    width = 42;
    var thickness = 5;
    
    return difference(
        union(
            //top and back fix
            cube({size:[_wallThickness+thickness,_bearingsDepth,thickness]}).translate([-_wallThickness,0,20]).setColor(0.2,0.7,0.2),
            cube({size:[thickness,_bearingsDepth,10+thickness]}).translate([-_wallThickness-thickness,0,10]).setColor(0.2,0.7,0.2)
            ),
        // screw holes back
        cylinder({r:2,h:10,fn:_globalResolution}).rotateY(90).translate([-_wallThickness-thickness,5,15]),
        cylinder({r:2,h:10,fn:_globalResolution}).rotateY(90).translate([-_wallThickness-thickness,_bearingsDepth-5,15]),
        // screw holes top
        cylinder({r:1.6,h:30,fn:_globalResolution}).translate([thickness/2,5,0]),
        cylinder({r:1.6,h:30,fn:_globalResolution}).translate([thickness/2,_bearingsDepth-5,0])
        
    );
}


// -------------------------------- extruder

function extruder(bowden,part){
    var X = 50;
    var Z = 9;
    var Y = 60; 
    var bearingoffsetX = 16.8;
    
    var jheadOffsetX = 5;
    //elastic part
    var epoffsetX = 3;
    var epoffsetY = 45;
    // this is to adjust how elastic will the bearing be.
    var elasticpartlength = 10;
    return difference(
        union(
            extruderPart(part,X,Y,Z),
            // extra support in case of bowden
            extruderSupport(bowden,part)
        ),
        nemaHole2().translate([0,0,-Z/2]),
        
        // 608 place 
        difference(
            cylinder({r:12,h:9,fn:_globalResolution}).translate([bearingoffsetX,0,0]),
            cylinder({r:4,h:9,fn:_globalResolution}).translate([bearingoffsetX,0,0]),
            cylinder({r:5,h:1,fn:_globalResolution}).translate([bearingoffsetX,0,0]),
            cylinder({r:5,h:1,fn:_globalResolution}).translate([bearingoffsetX,0,8])
        ),
        // 608 screw hole to reinforce
        cylinder({r:1.6,h:10,fn:_globalResolution}).translate([bearingoffsetX,0,Z/2]),
        cylinder({r:1.3,h:10,fn:_globalResolution}).translate([bearingoffsetX,0,-Z/2]),
        // jhead or pressfit
        extruderOut(bowden,jheadOffsetX,Y,Z),
         
         // jhead holes : 2 parts. up to pass screws, bottom to fix
         cylinder({r:1.6,h:10,fn:_globalResolution}).translate([jheadOffsetX-15,Y/2-5,Z/2]),
         cylinder({r:1.6,h:10,fn:_globalResolution}).translate([jheadOffsetX+15,Y/2-5,Z/2]),
         cylinder({r:1.3,h:10,fn:_globalResolution}).translate([jheadOffsetX-15,Y/2-5,-Z/2]),
         cylinder({r:1.3,h:10,fn:_globalResolution}).translate([jheadOffsetX+15,Y/2-5,-Z/2]),
         

        // filament
        extruderFilament(bowden,jheadOffsetX,Y,Z),

        
        // elastic part with two holes
        cube({size:[2,epoffsetY,2*Z+1]}).translate([jheadOffsetX+epoffsetX,-Y/2,-Z/2]),
        cube({size:[elasticpartlength,2,2*Z+1]}).translate([jheadOffsetX+epoffsetX,-Y/2+epoffsetY,-Z/2]),
        // solidify corner
        cylinder({r:1.5,h:2*Z+2,fn:_globalResolution}).translate([17,-Y/2+epoffsetY+1,-Z/2]),

        
        // attach holes
         cylinder({r:1.3,h:10,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX+15,Y/2-3,0]),
         cylinder({r:1.3,h:10,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX-15,Y/2-3,0]),

         // holes to add screw to maintain the iddle
         cylinder({r:1.6,h:15,fn:_globalResolution}).rotateY(-90).translate([X/2,-Y/2+10,9]),
         cylinder({r:1.6,h:15,fn:_globalResolution}).rotateY(-90).translate([X/2,-Y/2+10,0]),
         cylinder({r:1.3,h:15,fn:_globalResolution}).rotateY(-90).translate([X/2-15,-Y/2+10,9]),
         cylinder({r:1.3,h:15,fn:_globalResolution}).rotateY(-90).translate([X/2-15,-Y/2+10,0])
       
    )

}
function extruderPart(part,X,Y,Z){
    // lower part only
    if(part==0){
        return cube({size:[X,Y,Z],center:true}).translate([0,5,0])
    }
    // uppper part only
    else if(part==1){
        return cube({size:[X,Y,Z],center:true}).translate([0,5,Z+0.05])
    }
    else {
        return union(
            //main bottom
            cube({size:[X,Y,Z],center:true}).translate([0,5,0]),
            // main top
            cube({size:[X,Y,Z],center:true}).translate([0,5,Z+0.05])
        )
    }
}

function extruderSupport(bowden,part){
    var X = 20;
    var Z = 15;
    var Y = 9;
    if((bowden==1)&&(part!=1)){
        return difference(
                //main
                slottedHole(9,80,5).rotateY(-90).translate([-20,-30,0]),
                // screws for walls
                cylinder({r:2.1,h:10,fn:_globalResolution}).rotateY(-90).translate([-20,-29,0]),
                cylinder({r:2.1,h:10,fn:_globalResolution}).rotateY(-90).translate([-20,40,0])
            
        )
    }
    else{
        return cube(1)
    }
}

function extruderOut(bowden,jheadOffsetX,Y,Z){
    var jheadExtDiam = 15.5;
    var jheadIntDiam = 12.5;
    if(bowden==0){
        return union(
        cylinder({r:jheadExtDiam/2,h:6,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,Y/2,Z/2]),
        cylinder({r:jheadIntDiam/2,h:4,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,Y/2-4,Z/2]),
        cylinder({r:jheadExtDiam/2,h:5.5,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,Y/2-9.5,Z/2])
        )
    }
    else if(bowden==1){
        return cylinder({r:2.7,h:5,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,Y/2,Z/2])
    }

}
function extruderFilament(bowden,jheadOffsetX,Y,Z){
if(bowden==0){
        return union(
        cylinder({r:1,h:Y,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,-Y/2,Z/2]),
        cylinder({r1:3,r2:1,h:5,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,8,Z/2]),
        cylinder({r:1.5,h:3,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,19,Z/2])
        )
    }
    else if(bowden==1){
        return union(
        cylinder({r:1,h:Y,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,-Y/2,Z/2]),
        cylinder({r1:3,r2:1,h:5,fn:_globalResolution}).rotateX(-90).translate([jheadOffsetX,8,Z/2])
        )
    }
}



function clipGlassBack(){
    var glassThickness = 3;
    var mesh = difference(
        cube({size:[18,18,5+glassThickness]}),
        cube({size:[14,14,glassThickness]}).translate([4,4,0]),
        cube({size:[10,10,5]}).translate([8,8,glassThickness]),
        cylinder({r1:1.6,r2:3,h:2,fn:_globalResolution}).translate([2.5,2.5,6]),
        cylinder({r:1.6,h:6,fn:_globalResolution}).translate([2.5,2.5,0])

    );
    mesh.properties.connect1 = new CSG.Connector([0,0, 0], [1, 0, 0], [0, 0, 1]);
    return mesh;
}

function clipGlassFront(){
    var glassThickness = 3;
    var bedSupportThickness = 10;
    var mesh = difference(
        cube({size:[20,8,bedSupportThickness+glassThickness+10]})
    )
    mesh.properties.connect1 = new CSG.Connector([0,0, 0], [1, 0, 0], [0, 0, 1]);
    return mesh;
}

//  ----------   non printed elements ------------

function fakeJhead(){
    return union(
        cylinder({r:2,h:15,fn:_globalResolution}),
        cube({size:[20,15,8],center:true}).translate([0,0,8]),
        cylinder({r:7.5,h:30,fn:_globalResolution}).translate([0,0,15]),
        cylinder({r:6,h:5,fn:_globalResolution}).translate([0,0,45]),
        cylinder({r:7.5,h:5,fn:_globalResolution}).translate([0,0,50])
        
    );
}

function fake_switch(){
    return cube([40,8,15]);
}



function _walls(){
    return union(
        //left 
        cube({size:[_wallThickness,_globalDepth+_wallThickness,_globalHeight]}).translate([-_globalWidth/2,-_globalDepth/2,0]).setColor(1,0.5,0.3),
        // back
        cube({size:[_globalWidth-_wallThickness*2,_wallThickness,_globalHeight]}).translate([-_globalWidth/2+_wallThickness,_globalDepth/2,0]).setColor(0.9,0.4,0.3),
        // right
        cube({size:[_wallThickness,_globalDepth+_wallThickness,_globalHeight]}).translate([_globalWidth/2-_wallThickness,-_globalDepth/2,0]).setColor(0.8,0.3,0.3),
        // bottom
        cube({size:[_globalWidth-_wallThickness*2,_globalDepth,_wallThickness]}).translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,0]).setColor(0.4,0.4,0.4).setColor(0.5,0.2,0.1)
        );
}

function _rods(){
    var offsetFromTopY = 12;
    var offsetFromTopX = 12;
    return union(
        // rod X front
        cylinder({r:_XYrodsDiam/2,h:XrodLength,fn:_globalResolution}).rotateY(90).translate([-_globalWidth/2+30,XaxisOffset,_globalHeight-offsetFromTopX]).setColor(0.3,0.3,0.3),
        // rod x front bearing
        cylinder({r:_XYlmDiam/2,h:50,fn:_globalResolution}).rotateY(90).translate([headoffset,XaxisOffset,_globalHeight-offsetFromTopX]).setColor(0.6,0.6,0.6),
        // rod x back
        cylinder({r:_XYrodsDiam/2,h:XrodLength,fn:_globalResolution}).rotateY(90).translate([-_globalWidth/2+30,_XrodsWidth+XaxisOffset,_globalHeight-offsetFromTopX]).setColor(0.3,0.3,0.3),
        // rod y left
        cylinder({r:_XYrodsDiam/2,h:YrodLength,fn:_globalResolution}).rotateX(90).translate([-_globalWidth/2+_wallThickness+15,_globalDepth/2-_bearingsDepth+5,_globalHeight-offsetFromTopY]).setColor(0.3,0.3,0.3),
        // rod y left bearing
        cylinder({r:_XYlmDiam/2,h:50,fn:_globalResolution}).rotateX(90).translate([-_globalWidth/2+_wallThickness+15,0,_globalHeight-offsetFromTopY]).setColor(0.6,0.6,0.6),
        // rod y right
        cylinder({r:_XYrodsDiam/2,h:YrodLength,fn:_globalResolution}).rotateX(90).translate([_globalWidth/2-_wallThickness-15,_globalDepth/2-_bearingsDepth+5,_globalHeight-offsetFromTopY]).setColor(0.3,0.3,0.3),
        //rod Z left
        cylinder({r:_ZrodsDiam/2,h:ZrodLength,fn:_globalResolution}).translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,10]).setColor(0.3,0.3,0.3),
        //rod Z left bearing
        cylinder({r:_ZlmDiam/2,h:50,fn:_globalResolution}).translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,_globalHeight/2-40]).setColor(0.5,0.5,0.5),
        // rod z right
        cylinder({r:_ZrodsDiam/2,h:ZrodLength,fn:_globalResolution}).translate([_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,10]).setColor(0.3,0.3,0.3),
        // rod z right bearing
        cylinder({r:_ZlmDiam/2,h:50,fn:_globalResolution}).translate([_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,_globalHeight/2-40]).setColor(0.5,0.5,0.5)
        // support bed *4
        //cylinder({r:_ZrodsDiam/2,h:_printableDepth}).rotateX(90).translate([-_ZrodsWidth/2,_globalDepth/2-25,_globalHeight/2]).setColor(0.5,0.5,0.5),
        //cylinder({r:_ZrodsDiam/2,h:_printableDepth}).rotateX(90).translate([_ZrodsWidth/2,_globalDepth/2-25,_globalHeight/2]).setColor(0.5,0.5,0.5),
        //cylinder({r:_ZrodsDiam/2,h:_printableDepth}).rotateX(83).rotateZ(5).translate([-_ZrodsWidth/2,_globalDepth/2-25,_globalHeight/2-30]).setColor(0.5,0.5,0.5),
        //cylinder({r:_ZrodsDiam/2,h:_printableDepth}).rotateX(83).rotateZ(-5).translate([_ZrodsWidth/2,_globalDepth/2-25,_globalHeight/2-30]).setColor(0.5,0.5,0.5)
    );
}


function _nema(){
    return union(
        cube({size:_nemaXYZ}).setColor(0.3,0.3,1.0),
        cylinder({r:11,h:2,fn:_globalResolution}).translate([_nemaXYZ/2,_nemaXYZ/2,_nemaXYZ]),
        cylinder({r:2.5,h:25,fn:_globalResolution}).translate([_nemaXYZ/2,_nemaXYZ/2,_nemaXYZ+2])
    );
}

function _bed(){
    var mesh = difference(
        cube({size:[_printableWidth,_printableDepth,3]}).setColor(0.8,0.8,0.4,0.5),
        // holes in bed support
        cylinder({r:20,h:10,fn:_globalResolution}).translate([40,40,0]),
        cylinder({r:20,h:10,fn:_globalResolution}).translate([_printableWidth/2,40,0]),
        cylinder({r:20,h:10,fn:_globalResolution}).translate([_printableWidth-40,40,0]),
        cylinder({r:20,h:10,fn:_globalResolution}).translate([40,_printableDepth-40,0]),
        cylinder({r:20,h:10,fn:_globalResolution}).translate([_printableWidth/2,_printableDepth-40,0]),
        cylinder({r:20,h:10,fn:_globalResolution}).translate([_printableWidth-40,_printableDepth-40,0])

    );
    mesh.properties.clipbackleft = new CSG.Connector([0, _printableDepth, 0], [1, 0, 0], [0, 0, 1]);
    mesh.properties.clipbackright = new CSG.Connector([_printableWidth, _printableDepth, 0], [1, 0, 0], [0, 0, 1]);
    mesh.properties.clipfrontleft = new CSG.Connector([0,0, 0], [1, 0, 0], [0, 0, 1]);
    mesh.properties.clipfrontright = new CSG.Connector([_printableWidth,0, 0], [1, 0, 0], [0, 0, 1]);

    return mesh;
}









// -----------------------  lib

function tube(dint,dext,length){
    return difference(
            cylinder({r:dext/2,h:length,fn:_globalResolution}),
            cylinder({r:dint/2,h:length,fn:_globalResolution})
        );
}

function _axis(){
    return union(
        cube({size:[10,1,1]}).setColor(1,0,0),
        cube({size:[1,10,1]}).setColor(0,1,0),
        cube({size:[1,1,10]}).setColor(0,0,1)
        );
}

function nemaHole(){
    var offset = (_nemaXYZ==35)?13:15.5;
        return union(
            cylinder({r:11.3,h:40,fn:_globalResolution}),
            cylinder({r:1.6,h:40,fn:_globalResolution}).translate([-offset,-offset,0]),
            cylinder({r:1.6,h:40,fn:_globalResolution}).translate([offset,-offset,0]),
            cylinder({r:1.6,h:40,fn:_globalResolution}).translate([-offset,offset,0]),
            cylinder({r:1.6,h:40,fn:_globalResolution}).translate([offset,offset,0])
        );
}

// only 2 screw holes
function nemaHole2(){
    var offset = (_nemaXYZ==35)?13:15.5;
        return union(
            cylinder({r:11.3,h:40,fn:_globalResolution}),
            cylinder({r:1.6,h:40,fn:_globalResolution}).translate([-offset,-offset,0]),
            //cylinder({r:1.6,h:40,fn:_globalResolution}).translate([offset,-offset,0]),
            cylinder({r:1.6,h:40,fn:_globalResolution}).translate([-offset,offset,0])
            //cylinder({r:1.6,h:40,fn:_globalResolution}).translate([offset,offset,0])
        );
}

function slottedHole(diam,length,height){
    return union(
        cylinder({r:diam/2,h:height,fn:_globalResolution}),
        cube([diam,length-diam,height]).translate([-diam/2,0,0]),
        cylinder({r:diam/2,h:height,fn:_globalResolution}).translate([0,length-diam,0])
    );
}

function bearingSupport(baseHeight){
    return difference(
        union(
            cylinder({r:5,h:baseHeight,fn:_globalResolution}),
            cylinder({r:4,h:6,fn:_globalResolution}).translate([0,0,baseHeight])
        ),
        cylinder({r:1.4,h:baseHeight+7,fn:_globalResolution})
    );
}

function bearingSupport2(baseHeight){
    return difference(
        union(
            cylinder({r:5,h:baseHeight,fn:_globalResolution}),
            cylinder({r:4,h:16,fn:_globalResolution}).translate([0,0,baseHeight])
        ),
        cylinder({r:1.4,h:baseHeight+16,fn:_globalResolution})
    );
}

function bearingTop(hole){
    return difference(
        union(
            cylinder({r:5,h:1,fn:_globalResolution}),
            cylinder({r:13,h:1.5,fn:_globalResolution}).translate([0,0,1])
        ),
        cylinder({r:hole/2+0.1,h:6,fn:_globalResolution})
    );
}

function bearingMiddle(hole){
    return difference(
        union(
            cylinder({r:5,h:1,fn:_globalResolution}),
            cylinder({r:13,h:1,fn:_globalResolution}).translate([0,0,1])
        ),
        cylinder({r:hole/2+0.1,h:6,fn:_globalResolution})
    );
}

function bearing608z(){
    return difference(
        cylinder({r:11,h:7,fn:_globalResolution}).setColor(0.4,0.4,0.4),
        cylinder({r:4,h:7,fn:_globalResolution})
    );
}

function Gt2Holder(boolOffset,height){
    var h = 10;
    var beltThickness = 0.9;
    if(height){h=height;}
    return difference(
        linear_extrude({height:10},polygon({points:[[0,0],[16,0],[12,h],[4,h]]})).translate([-12,0,-h]).rotateY(-90).rotateX(90),
        union(
            cube([10,1,h-3]).translate([h-10,boolOffset,3]),
            cube([1,1,h-3]).translate([h-9,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-7,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-5,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-3,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-1,boolOffset+beltThickness,3])

        )
    )
}

function Gt2HolderBool(boolOffset,height){
    var h = 10;
    var beltThickness = 0.9;
    if(height){h=height;}
    return union(
            cube([10,1,h-3]).translate([h-10,boolOffset,3]),
            cube([1,1,h-3]).translate([h-9,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-7,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-5,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-3,boolOffset+beltThickness,3]),
            cube([1,1,h-3]).translate([h-1,boolOffset+beltThickness,3])
        )
}

function Gt2Holder3(boolOffset,height){
    var h = 10;
    if(height){h=height;}
    return difference(
        linear_extrude({height:10},polygon({points:[[0,0],[16,0],[12,h],[4,h]]})).translate([-12,0,-h]).rotateY(-90).rotateX(90),
        union(
            cube([10,1,h-3]).translate([h-10,boolOffset,6]),
            cube([1,1,h-3]).translate([h-9,boolOffset+1,6]),
            cube([1,1,h-3]).translate([h-7,boolOffset+1,6]),
            cube([1,1,h-3]).translate([h-5,boolOffset+1,6]),
            cube([1,1,h-3]).translate([h-3,boolOffset+1,6]),
            cube([1,1,h-3]).translate([h-1,boolOffset+1,6])

        )
    )
}
function Gt2Holder2(){
    var beltThickness = 0.9;
    return difference(

        linear_extrude({height:23},polygon({points:[[0,0],[16,0],[12,10],[4,10]]})).translate([-12,0,-10]).rotateY(-90).rotateX(90),
        union(
            cube([23,1,7]).translate([-13,3,3]),
            cube([1,1,7]).translate([-11,3+beltThickness,3]),
            cube([1,1,7]).translate([-9,3+beltThickness,3]),
            cube([1,1,7]).translate([-7,3+beltThickness,3]),
            cube([1,1,7]).translate([-5,3+beltThickness,3]),
            cube([1,1,7]).translate([-3,3+beltThickness,3]),
            cube([1,1,7]).translate([-1,3+beltThickness,3]),
            cube([1,1,7]).translate([1,3+beltThickness,3]),
            cube([1,1,7]).translate([3,3+beltThickness,3]),
            cube([1,1,7]).translate([5,3+beltThickness,3]),
            cube([1,1,7]).translate([7,3+beltThickness,3]),
            cube([1,1,7]).translate([9,3+beltThickness,3]),
            cube([1,1,7]).translate([11,3+beltThickness,3])

        )
    )
}

function endstop_meca(){
    return difference(
        cube([40,15,7]),
        cylinder({r:1.5,h:8,fn:_globalResolution}).translate([2.5,2.5,0]),
        cylinder({r:1.5,h:8,fn:_globalResolution}).translate([2.5+14,2.5,0]),
        cylinder({r:1.5,h:8,fn:_globalResolution}).translate([40-2.5,2.5,0])

    );
}

function roundBoolean(diam,w,d,h,edge){
    var bool;
    if(edge=="bl"){bool = cylinder({r:diam/2,h:d,fn:_globalResolution}).rotateX(-90).translate([0,0,0]);}
    if(edge=="tl"){bool = cylinder({r:diam/2,h:d,fn:_globalResolution}).rotateX(-90).translate([0,0,h]);}
    if(edge=="br"){bool = cylinder({r:diam/2,h:d,fn:_globalResolution}).rotateX(-90).translate([w,0,0]);}
    if(edge=="tr"){bool = cylinder({r:diam/2,h:d,fn:_globalResolution}).rotateX(-90).translate([w,0,h]);}
    return difference(
        cube([w,d,h]),
        bool
    );
}











// -----------------------  start here 

function main(params){

    // -------- sandbox ------- 
    //return _walls();
    //var infos = document.getElementById("dimensionsInfos");
    //infos.innerHTML = "hello there";


    // assign globals from interface parameters
    _printableWidth=params._printableWidth; 
    _printableHeight=params._printableHeight; 
    _printableDepth=params._printableDepth; 
    _wallThickness=params._wallThickness; 
    _XYrodsDiam = params._XYrodsDiam;
    _ZrodsDiam = params._ZrodsDiam;
    _globalResolution = params._globalResolution;
    _woodsupport = params._woodsupport;
    _nemaXYZ=parseInt(params._nemaXYZ);
    output=parseInt(params._output); 
    _extrusionType = params.extrusionType;
    
    // update calculated values 
    if(_XYrodsDiam==6){ _XYlmDiam = 12;}
    if(_XYrodsDiam==8){ _XYlmDiam = 15;}
    if(_ZrodsDiam==6){ _ZlmDiam = 12;}
    if(_ZrodsDiam==8){ _ZlmDiam = 15;}


    _globalDepth = _printableDepth + 120; // = motor support depth + bearings depth + head depth /2
    _globalWidth = _printableWidth + 120; // = motor uspport width + bearings width + head width /2
    _globalHeight = _printableHeight + 100; // bottom = 40mm head = 40 mm + extra loose.

    XrodLength = _globalWidth - 2*(40 + 3); // 40: slideY width , 3: offset slideY from wall.
    YrodLength = _globalDepth - (_nemaXYZ -5) - (_bearingsDepth -5); // 5: rod support inside parts.
    ZrodLength = _globalHeight -40;


    echo("wood depth:"+_globalDepth + " width:"+_globalWidth+" height:"+_globalHeight);
    echo("X rod length:"+XrodLength + " Y rod length:"+YrodLength+" Zrodlength:"+ZrodLength);
    // calculate some usefull vars
    var ztopbottomX = (_ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2))/2;
    var zslideX = (_ZrodsWidth+_ZlmDiam+(_rodsSupportThickness*2))/2;

    
    
var res=null;


//"nothing","All printer assembly", "printed parts plate","motor xy","bearings xy","slide y","z top","z bottom","z slide","head","bed support"
switch(output){
    case 0:
    // connections
        var bed = _bed().translate([-_printableWidth/2,-_printableDepth/2+35,_globalHeight/2+10]); 
        var clipGlassBackleft = clipGlassBack();
        var clipGlassBackright = clipGlassBack();
        var clipGlassFrontLeft = clipGlassFront();
        var clipGlassFrontRight = clipGlassFront();
        clipGlassBackleft = clipGlassBackleft.connectTo(clipGlassBackleft.properties.connect1,bed.properties.clipbackleft,false,0);
        clipGlassBackright = clipGlassBackright.connectTo(clipGlassBackright.properties.connect1,bed.properties.clipbackright,true,0);
        clipGlassFrontLeft = clipGlassFrontLeft.connectTo(clipGlassFrontLeft.properties.connect1,bed.properties.clipfrontleft,false,0);
        clipGlassFrontRight = clipGlassFrontRight.connectTo(clipGlassFrontRight.properties.connect1,bed.properties.clipfrontright,true,0);

        res = [ bed,clipGlassBackleft,clipGlassBackright,clipGlassFrontLeft,clipGlassFrontRight ];
    break;
    case 1:
        
        res = [
            _walls(),
            _rods(),
            
            //nema left
            _nema().translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-_nemaXYZ-20]),
            // nema right
            _nema().translate([_globalWidth/2-+_wallThickness-_nemaXYZ,-_globalDepth/2,_globalHeight-_nemaXYZ-20]),

            motorXY().translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-20]),
            //motorXYSupport().translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-20]),)
            motorXY().mirroredX().translate([_globalWidth/2-_wallThickness,-_globalDepth/2,_globalHeight-20]),
            //motorXYSupport().mirroredX().translate([_globalWidth/2-_wallThickness,-_globalDepth/2,_globalHeight-20]),
            bearingsXY().translate([-_globalWidth/2+_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]),
            //bearingsXYSupport_2().translate([-_globalWidth/2+_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]),
            bearingsXY().mirroredX().translate([_globalWidth/2-_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]),
            //bearingsXYSupport_2().mirroredX().translate([_globalWidth/2-_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]),
            slideY().translate([-_globalWidth/2+_wallThickness+3,-_rodsSupportThickness-_XYrodsDiam/2+XaxisOffset,_globalHeight-22]),
            //endstop x
            endstop_meca().rotateZ(90).rotateX(-90).translate([-_globalWidth/2+_wallThickness+42,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset+55,_globalHeight-10]),
            //endstop y
            endstop_meca().translate([_globalWidth/2-_wallThickness-_nemaXYZ-20,-_globalDepth/2+_nemaXYZ-10,_globalHeight-18]),
            
            slideY("right").mirroredX().translate([_globalWidth/2-_wallThickness-3,-_rodsSupportThickness-_XYrodsDiam/2+XaxisOffset,_globalHeight-22]),

            head().translate([headoffset,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset,_globalHeight-22]),
            // Z stage 
            _nema().rotateX(-90).translate([-_nemaXYZ/2,_globalDepth/2-_wallThickness-_nemaXYZ-20,_wallThickness+_nemaXYZ]),
            zTop().translate([0,_globalDepth/2-_wallThickness,_globalHeight-35]),
            zBottom().translate([0,_globalDepth/2-_wallThickness,_wallThickness]),
            slideZ().translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,_globalHeight/2-40]),
            /*
            slideZ2().translate([_ZrodsWidth/2-1,_globalDepth/2-_wallThickness-70,_globalHeight/2-40]),
            slideZBearingsSupport().mirroredX().translate([_ZrodsWidth/2-2,_globalDepth/2-_wallThickness-15,_globalHeight/2-40]),
            slideZ2().mirroredX().translate([-_ZrodsWidth/2+1,_globalDepth/2-_wallThickness-70,_globalHeight/2-40]),
            slideZBearingsSupport().translate([-_ZrodsWidth/2+2,_globalDepth/2-_wallThickness-15,_globalHeight/2-40]),
            slideZBeltAttach().translate([-_ZrodsWidth/2+13,_globalDepth/2-_wallThickness-15,_globalHeight/2-40]),
            */
            _bed().translate([-_printableWidth/2,-_printableDepth/2+35,_globalHeight/2+10])
                ];
            if(_woodsupport==1){
                res.push(motorXYSupport().translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-20]));
                res.push(motorXYSupport().mirroredX().translate([_globalWidth/2-_wallThickness,-_globalDepth/2,_globalHeight-20]));
                res.push(bearingsXYSupport().translate([-_globalWidth/2+_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]));
                res.push(bearingsXYSupport().mirroredX().translate([_globalWidth/2-_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]));
            }
            //bowden
            if(_extrusionType==1){
                res.push(JheadAttach().rotateZ(180).translate([headoffset+64,XaxisOffset+53,_globalHeight]));
                res.push(HeadSupportJhead().translate([headoffset+6,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset+57,_globalHeight-6]));
                // nema extruder
                res.push(_nema().rotateX(90).translate([_globalWidth/2+3,-_globalDepth/2+_nemaXYZ+55,_globalHeight-_nemaXYZ-25]));
                res.push(extruder(_extrusionType).rotateX(90).translate([_globalWidth/2+_wallThickness+14,-_globalDepth/2+50,_globalHeight-50]));

            }
            // direct
            if(_extrusionType==0){
                res.push(InductiveSensorSupport().translate([headoffset+6,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset+57,_globalHeight-28]));
                // nema extruder
                res.push(_nema().rotateX(-90).translate([headoffset+2,XaxisOffset,_globalHeight+50]));
                res.push(extruder(_extrusionType).rotateX(-90).translate([headoffset+22,XaxisOffset+47,_globalHeight+30]));
            }
    break;
    case 2:
        res = [

            motorXY().lieFlat().translate([-100,-100,0]),
            motorXY().mirroredX().lieFlat().translate([-100,-50,0]),

            bearingsXY().lieFlat().translate([-100,-5,0]),
            bearingsXY().lieFlat().mirroredX().translate([-100,35,0]),

            slideY().lieFlat().translate([-60,-100,0]),
            slideY("right").mirroredX().lieFlat().translate([-50,-40,0]),

            head().lieFlat().translate([-50,40,0]),

            
            zTop().rotateX(-90).lieFlat().translate([30,-100,0]),
            zBottom().lieFlat().translate([30,-60,0]),
            slideZ().rotateX(180).lieFlat().translate([35,10,0]),

            
            bearingTop(3).rotateX(180).lieFlat().translate([-100,100,0]),
            bearingTop(3).rotateX(180).lieFlat().translate([-70,100,0]),
            bearingTop(3).rotateX(180).lieFlat().translate([-40,100,0]),
            bearingTop(3).rotateX(180).lieFlat().translate([-10,100,0]),
            bearingTop(3).rotateX(180).lieFlat().translate([20,100,0]),
            bearingTop(3).rotateX(180).lieFlat().translate([50,100,0]),
            bearingTop(3).rotateX(180).lieFlat().translate([80,100,0]),

            bearingMiddle(8).rotateX(180).lieFlat().translate([110,100,0]),
            bearingMiddle(8).rotateX(180).lieFlat().translate([110,70,0]),
            bearingMiddle(8).rotateX(180).lieFlat().translate([80,70,0]),
            bearingMiddle(8).rotateX(180).lieFlat().translate([50,70,0])
            
                ];
            //bowden
            
            if(_extrusionType==1){
                res.push(JheadAttach().rotateX(90).lieFlat().translate([30,20,0]));
                res.push(HeadSupportJhead().rotateX(90).lieFlat().translate([30,40,0]));
                // nema extruder
                res.push(extruder(_extrusionType,0).lieFlat().translate([110,-100,0]));
                res.push(extruder(_extrusionType,1).rotateX(180).lieFlat().translate([120,-20,0]));

            }
            // direct
            if(_extrusionType==0){
                res.push(InductiveSensorSupport().lieFlat().translate([30,20,0]));
                // nema extruder
                res.push(extruder(_extrusionType,0).lieFlat().translate([110,-100,0]));
                res.push(extruder(_extrusionType,1).rotateX(180).lieFlat().translate([120,-20,0]));
            }
            // wood support
            if(_woodsupport==1){
                res.push(motorXYSupport().rotateX(180).lieFlat().translate([-100,-150,0]));
                res.push(motorXYSupport().rotateX(180).lieFlat().mirroredX().translate([-60,-150,0]));
                res.push(bearingsXYSupport().rotateX(180).lieFlat().translate([-20,-135,0]));
                res.push(bearingsXYSupport().rotateX(180).lieFlat().mirroredX().translate([20,-135,0]));
            }
            

    break;
    case 3:
        res = [motorXY()];
    break;
    case 4:
        res = [bearingsXY(),bearingsXYSupport()];
    break;
    case 5:
        res = [slideY(),slideY("right").mirroredX().translate([100,0,0])];
    break;
    case 6:
        res = [zTop().translate([0,0,80]),slideZ().translate([-_ZrodsWidth/2,0,20]),zBottom()];
    break;
    case 7:
        res = zBottom();
    break;
    case 8:
        res = [slideZ()
            ];
    break;
    case 9:
        res = head();
    break;
    case 10:
        res = [ extruder(_extrusionType)
        ];
    break;
    case 11:
        res = [
            motorXY().translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-20]),
            motorXY().mirroredX().translate([_globalWidth/2-_wallThickness,-_globalDepth/2,_globalHeight-20]),
            bearingsXY().translate([-_globalWidth/2+_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]),
            bearingsXY().mirroredX().translate([_globalWidth/2-_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]),
            slideY().translate([-_globalWidth/2+_wallThickness+3,-_rodsSupportThickness-_XYrodsDiam/2+XaxisOffset,_globalHeight-22]),
            slideY("right").mirroredX().translate([_globalWidth/2-_wallThickness-3,-_rodsSupportThickness-_XYrodsDiam/2+XaxisOffset,_globalHeight-22]),
            head().translate([-80,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset,_globalHeight-22]),
            zTop().translate([0,_globalDepth/2-_wallThickness,_globalHeight-35]),
            zBottom().translate([0,_globalDepth/2-_wallThickness,_wallThickness]),
            slideZ().translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,_globalHeight/2-40])
            /*
            slideZ2().translate([_ZrodsWidth/2-1,_globalDepth/2-_wallThickness-70,_globalHeight/2-40]),
            slideZBearingsSupport().mirroredX().translate([_ZrodsWidth/2-2,_globalDepth/2-_wallThickness-15,_globalHeight/2-40]),
            slideZ2().mirroredX().translate([-_ZrodsWidth/2+1,_globalDepth/2-_wallThickness-70,_globalHeight/2-40]),
            slideZBearingsSupport().translate([-_ZrodsWidth/2+2,_globalDepth/2-_wallThickness-15,_globalHeight/2-40]),
            slideZBeltAttach().translate([-_ZrodsWidth/2+13,_globalDepth/2-_wallThickness-15,_globalHeight/2-40]),
            */
                ];
            if(_woodsupport==1){
                res.push(motorXYSupport().translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-20]));
                res.push(motorXYSupport().mirroredX().translate([_globalWidth/2-_wallThickness,-_globalDepth/2,_globalHeight-20]));
                res.push(bearingsXYSupport().translate([-_globalWidth/2+_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]));
                res.push(bearingsXYSupport().mirroredX().translate([_globalWidth/2-_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]));
            }
            //bowden
            if(_extrusionType==1){
                res.push(JheadAttach().rotateZ(180).translate([-16,XaxisOffset+53,_globalHeight]));
                res.push(HeadSupportJhead().translate([-74,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset+57,_globalHeight-6]));
                res.push(extruder(_extrusionType).rotateX(90).translate([_globalWidth/2+_wallThickness+14,-_globalDepth/2+40,_globalHeight-50]));
                res.push(extruderSupport().translate([_globalWidth/2,-_globalDepth/2+35,_globalHeight-15]));

            }
            // direct
            if(_extrusionType==0){
                res.push(InductiveSensorSupport().translate([-74,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset+57,_globalHeight-28]));
                res.push(extruder(_extrusionType).rotateX(-90).translate([-58,XaxisOffset+47,_globalHeight+30]));
            }
    break;
    default:

    break;
}

return res;


}

