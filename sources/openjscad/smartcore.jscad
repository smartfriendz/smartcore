/**********

Smartcore : L'empileuse

author: serge.vi / smartfriendz
licence : GPL
version: 0.1
date: 11 / 2014

***********/

// global vars - updated from interface but need to be avalaible in all functions
var _globalResolution;
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
var XrodLength = 300; // will be calculated in main from parameters.
var YrodLength = 300; // will be calculated in main from parameters.
var ZrodLength = 300; // will be calculated in main from parameters.
var _rodsSupportThickness = 3; // thickness around rods for all supports
var outputPlateWidth = 180; //used when output to printable plates for elements
var outputPlateDepth = 180;
var mk7Diam = 10;

// global for work
var _bearingsDepth = 27; 
var XaxisOffset = 80;
var endxJheadAttachHolesWidth = 32;

var output;


// interactive parameters

function getParameterDefinitions() {
  return [
    {name: '_nemaXYZ', 
      type: 'choice',
      caption: 'Stepper motors type',
      values: [35, 42],
      captions: ["nema14","nema17"], 
      initial: 42
    },    
  
    { name: '_printableWidth', caption: 'Print width:', type: 'int', initial: 200 },
    { name: '_printableHeight', caption: 'Print height :', type: 'int', initial: 150 },
    { name: '_printableDepth', caption: 'Print depth :', type: 'int', initial: 200 },
    { name: '_wallThickness', caption: 'Box wood thickness:', type: 'int', initial: 16 },
    { name: '_XYrodsDiam', caption: 'X Y Rods diameter (6 or 8 ):', type: 'int', initial: 6},
    { name: '_ZrodsDiam', caption: 'Z Rods diameter (6 or 8 ):', type: 'int', initial: 8},
    { 
        name: '_output', 
        caption: 'Show:', 
        type: 'choice', 
        values: [0,1,2,3,4,5,6,7,8,9,10], 
        initial: 1, 
        captions: ["nothing","All printer assembly", "printed parts plate","motor xy","bearings xy","slide y","z top","z bottom","z slide","head","extruder"]
    },
    { name: '_globalResolution', caption: 'resolution (16, 24, 32 for export)', type: 'int', initial: 8 }
    
  ]; 
}



// -----------------  printed elements 




function zTop(){
    var width = _ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2);
    var height = 12;
    var depth = 20;
    var insideWidth = 60;
     var bearings=cube({size:0});

    if(output==1){
        bearings = union(
            bearing608z().rotateX(90).translate([0,0,0]).setColor(0.4,0.4,0.4)
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
            cylinder({r:_ZrodsDiam/2,h:height,fn:_globalResolution}).translate([-_ZrodsWidth/2,0,-height/2]),
            //z rod right
            cylinder({r:_ZrodsDiam/2,h:height,fn:_globalResolution}).translate([_ZrodsWidth/2,0,-height/2]),
            // chamfer
            roundBoolean(10,10,20,height,"bl").rotateX(90).translate([-(insideWidth)/2-5,-5,-height/2]),
            roundBoolean(10,10,20,height,"bl").rotateX(90).rotateZ(-90).translate([(insideWidth)/2+5,-5,-height/2])

        ),
        
        bearingSupport(5).rotateX(90).translate([0,6,0]).setColor(0.2,0.7,0.2),
        bearings


        
    );
}

function zBottom(){
    var width = _ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2);
    var height = 10;
    var depth = 20;
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
        cylinder({r:_ZrodsDiam/2,h:height,fn:_globalResolution}).translate([-_ZrodsWidth/2,0,-height/2]),
        //z rod right
        cylinder({r:_ZrodsDiam/2,h:height,fn:_globalResolution}).translate([_ZrodsWidth/2,0,-height/2]),
        //screw holes
        // screws attach form
        cylinder({r:2,h:5,fn:_globalResolution}).rotateX(-90).translate([width/4+attachdiam/2,depth/2-5,height]),
        cylinder({r:2,h:5,fn:_globalResolution}).rotateX(-90).translate([-width/4-attachdiam/2,depth/2-5,height])
        
    );
}

function slideZ(){
    var width = _ZrodsWidth-5;
    var height = 50;
    var depth = 4;
    var insideWidth = 35;
    return difference(
        //main form
        union(
            cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),

            Gt2Holder2().rotateX(90).rotateY(90).translate([width/2-10,1,height-10]).setColor(0.2,0.7,0.2),
            
            //Gt2Holder(3).rotateX(90).rotateY(90).translate([width/2-10,1,10]).setColor(0.2,0.7,0.2),
            // lm8uu holes
            cylinder({r:_ZlmDiam/2+2,h:height,fn:_globalResolution}).translate([0,0,0]).setColor(0.2,0.7,0.2),
            cylinder({r:_ZlmDiam/2+2,h:height,fn:_globalResolution}).translate([_ZrodsWidth,0,0]).setColor(0.2,0.7,0.2),
            // extra forms front bearings holes
            cube([10,50,height]).translate([-5,-45,0]).setColor(0.2,0.7,0.2),
            cube([10,50,height]).translate([_ZrodsWidth-5,-45,0]).setColor(0.2,0.7,0.2)
        ),
        // big hole middle
        cylinder({r:10,h:50,fn:_globalResolution}).rotateX(90).translate([width/2+15,40,height/2+10]),
        cylinder({r:10,h:50,fn:_globalResolution}).rotateX(90).translate([width/2-10,40,height/2-10]),
        //  boolean front horizontal
        cylinder({r:50,h:width+40,fn:_globalResolution}).rotateY(90).translate([-20,-55,-5]),
        cylinder({r:5,h:width+40,fn:_globalResolution}).rotateY(90).translate([-20,-15,height-10]),

        // z rod left linear bearing lm
        cylinder({r:_ZlmDiam/2,h:height,fn:_globalResolution}).translate([0,0,0]),
        //z rod right linear bearing lm
        cylinder({r:_ZlmDiam/2,h:height,fn:_globalResolution}).translate([_ZrodsWidth,0,0]),
        //bottom holes
        cylinder({r:2.4,h:10,fn:_globalResolution}).rotateX(83).rotateZ(5).translate([0,-7,10]),
        cylinder({r:2.4,h:10,fn:_globalResolution}).rotateX(83).rotateZ(-5).translate([_ZrodsWidth,-7,10]),
        // top holes
        cylinder({r:1.4,h:30,fn:_globalResolution}).translate([0,-12,height-30]),
        cylinder({r:1.4,h:30,fn:_globalResolution}).translate([_ZrodsWidth,-12,height-30]),
        cylinder({r:1.4,h:30,fn:_globalResolution}).translate([0,-42,height-30]),
        cylinder({r:1.4,h:30,fn:_globalResolution}).translate([_ZrodsWidth,-42,height-30])
        
    );
}



function supportBed(){
    var width = _ZrodsWidth;
    var height = 25;
    var depth = 10;
    return difference(
        cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),
        // support rods holes 
        cylinder({r:2.6,h:30,fn:_globalResolution}).rotateX(83).rotateZ(5).translate([17,21,8]),
        cylinder({r:2.6,h:30,fn:_globalResolution}).rotateX(83).rotateZ(-5).translate([_ZrodsWidth-17,21,8]),
        // top holes
        cylinder({r:1.4,h:30,fn:_globalResolution}).translate([5,depth/2,height/2]),
        cylinder({r:1.4,h:30,fn:_globalResolution}).translate([width-5,depth/2,height/2]),
        //rounded
        roundBoolean(20,20,20,20,"tl").translate([width-10,0,-10]),
        roundBoolean(20,20,20,20,"tr").translate([-10,0,-10]),
        // hole to win material and print time 
            cylinder({r:15,h:30,fn:_globalResolution}).rotateX(90).translate([width/2,depth,height])

    );
}


function slideY(side){
    var width = 40;
    var height = (_XYlmDiam/2)+(2*_rodsSupportThickness)+3;
    var depth = _XrodsWidth+(_XYrodsDiam)+(_rodsSupportThickness*2);
    var bearings=cube({size:0});
    var heightSecondBearing = 2;
    var offsetHeightXrods = 3;
    if(side=="right"){heightSecondBearing = 5;}
    // will render only if not printed only.
    if(output==1){
        bearings = union(
            bearing608z().translate([width-8,depth/2-15,height+2]).setColor(0.4,0.4,0.4),
            bearing608z().translate([width-8,depth/2+15,height+heightSecondBearing]).setColor(0.4,0.4,0.4),
            // bearing hat
            bearingTop(3).translate([width-8,depth/2-15,height+10]).setColor(0.2,0.7,0.2),
            bearingTop(3).translate([width-8,depth/2+15,height+heightSecondBearing+10]).setColor(0.2,0.7,0.2)
        );
    }
    
    return difference(
        union(
            bearings,
            // main
            cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),
            // extra for bearing support
            cube({size:[10,depth,height+3]}).setColor(0.2,0.7,0.2),
            bearingSupport(2).translate([32,depth/2-15,height-1]).setColor(0.2,0.8,0.4),
            bearingSupport(heightSecondBearing).translate([32,depth/2+15,height-1]).setColor(0.2,0.8,0.4)
            
        ),
        // rod x front
        cylinder({r:_XYrodsDiam/2,h:10,fn:_globalResolution}).rotateY(90).translate([width-10,_rodsSupportThickness+_XYrodsDiam/2,height/2+offsetHeightXrods]),
        // rod x back
        cylinder({r:_XYrodsDiam/2,h:10,fn:_globalResolution}).rotateY(90).translate([width-10,depth-_rodsSupportThickness-_XYrodsDiam/2,height/2+offsetHeightXrods]),
        // bearing support
        cylinder({r:_XYlmDiam/2,h:depth+1,fn:_globalResolution}).rotateX(-90).translate([12,-1,_XYlmDiam/2+_rodsSupportThickness+3]),
        //hole  between rods - to gain weight and print time
        cylinder({r:10,h:height,fn:_globalResolution}).translate([width,depth/2,0])
        
        
    );
}

function head(){
    var width = 50;
    var height = (_XYlmDiam/2)+(2*_rodsSupportThickness)+2;
    var depth = _XrodsWidth+(_XYlmDiam)+(_rodsSupportThickness*4);
    return difference(
        union(
        //main
        cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),
        //gt2 holders 
        Gt2Holder(3).translate([0,depth/2+3,height]),
        Gt2Holder(3).translate([0,depth/2-11,height]),
        Gt2Holder3(3,14).translate([width-14,depth/2+3,height]),
        Gt2Holder(3).translate([width-10,depth/2-11,height])
        ),
        // x bearing front
        cylinder({r:_XYlmDiam/2,h:50,fn:_globalResolution}).rotateY(90).translate([0,_XYlmDiam/2+(_rodsSupportThickness*2),_XYlmDiam/2+_rodsSupportThickness+1]),
        // x bearing back
        cylinder({r:_XYlmDiam/2,h:50,fn:_globalResolution}).rotateY(90).translate([0,_XYlmDiam/2+(_rodsSupportThickness*2)+_XrodsWidth,_XYlmDiam/2+_rodsSupportThickness+1]),
        // tooling hole
        cylinder({r:10,h:30,fn:_globalResolution}).translate([width/2-5,depth/2],0),
        // screw to fix tooling in hole
        cylinder({r:1.4,h:50,fn:_globalResolution}).rotateY(90).translate([-width/2,depth/2,8]),
        // hole screw for jhead support
        cylinder({r:1.2,h:30,fn:_globalResolution}).translate([13,depth-21,0]),
        cylinder({r:1.2,h:30,fn:_globalResolution}).translate([37,depth-21,0])        
    );
}

function motorXY(){
    var thickness = 5;
    return difference(
    union(
        // base
        cube({size:[_nemaXYZ/2,_nemaXYZ,thickness]}).setColor(0.2,0.7,0.2),
        // wall support
        cube({size:[9,_nemaXYZ,20]}).setColor(0.2,0.7,0.2),
        //top and back fix
        //cube({size:[_wallThickness+9,_nemaXYZ,thickness]}).translate([-_wallThickness,0,20]).setColor(0.2,0.7,0.2),
        //cube({size:[thickness,_nemaXYZ,20+thickness]}).translate([-_wallThickness-thickness,0,0]).setColor(0.2,0.7,0.2),
        // rod support - half slotted hole
        cylinder({r:_XYrodsDiam/2+2.5,h:15,fn:_globalResolution}).rotateX(90).translate([15,_nemaXYZ,thickness+3]).setColor(0.2,0.7,0.2)


    ),
    nemaHole(_nemaXYZ).translate([_nemaXYZ/2,_nemaXYZ/2,0]),
    cylinder({r:1.6,h:10,fn:_globalResolution}).rotateY(90).translate([-_wallThickness-thickness,10,10]),
    cylinder({r:1.6,h:10,fn:_globalResolution}).rotateY(90).translate([-_wallThickness-thickness,_nemaXYZ-10,10]),
    // rod support hole
    cylinder({r:_XYrodsDiam/2,h:5,fn:_globalResolution}).rotateX(90).translate([15,_nemaXYZ,thickness+3]).setColor(0.2,0.7,0.2)
    // slotted holes to fix on the wood side - version simple
    //slottedHole(3.2,8,10).rotateX(-90).rotateZ(90).translate([9,10,15]),
    //slottedHole(3.2,8,13).rotateX(-90).rotateZ(90).translate([12,25,15])
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
    _bearingsDepth = _nemaXYZ+(_rodsSupportThickness*2);
    var thickness = 7;
    var bearings=cube({size:0});
    if(output==1){
        bearings = union(
            bearing608z().translate([25,33,thickness+8]).setColor(0.4,0.4,0.4),
            bearing608z().translate([35,7,thickness+8]).setColor(0.4,0.4,0.4),
            // hat
            bearingTop(3).translate([25,33,thickness+20]).setColor(0.2,0.7,0.2),
            bearingTop(3).translate([35,7,thickness+20]).setColor(0.2,0.7,0.2)
        );
    }
    return difference(
        union(
            bearings,
            //base
            cube({size:[width,_bearingsDepth,thickness]}).setColor(0.2,0.7,0.2).translate([0,0,3]),
           
            //wall support
            cube({size:[thickness,_bearingsDepth,15]}).setColor(0.2,0.7,0.2).translate([0,0,3]),


            //top and back fix
            //cube({size:[_wallThickness+thickness,_bearingsDepth,thickness]}).translate([-_wallThickness,0,20]).setColor(0.2,0.7,0.2),
            //cube({size:[thickness,_bearingsDepth,20+thickness]}).translate([-_wallThickness-thickness,0,0]).setColor(0.2,0.7,0.2),
            //version 2 bearings
            //bearingSupport(5).translate([25,33,thickness+2]).setColor(0.2,0.8,0.4),
            //bearingSupport(5).translate([35,7,thickness+2]).setColor(0.2,0.8,0.4),
            //version 1 bearing
            bearingSupport2(2).translate([35,33,thickness+2]).setColor(0.2,0.8,0.4),
            
 
            difference(
            // rod support -
            cylinder({r:_XYrodsDiam/2+2.5,h:13}).rotateX(90).translate([15,13,thickness+2.5]).setColor(0.2,0.7,0.2),
            // back round 
            cylinder({r:9,h:30}).rotateY(90).translate([7,18,15])
            
            )
        ),
        // bearing holes
        //cylinder({r:4,h:10}).translate([25,33,0]),
        //cylinder({r:4,h:10}).translate([35,10,0]),
        // screw holes
        cylinder({r:1.6,h:10,fn:_globalResolution}).rotateY(90).translate([-_wallThickness-thickness,10,10]),
        cylinder({r:1.6,h:10,fn:_globalResolution}).rotateY(90).translate([-_wallThickness-thickness,_bearingsDepth-10,10]),
         // screw holes top
        cylinder({r:1.6,h:30,fn:_globalResolution}).translate([thickness/2,5,0]),
        cylinder({r:1.6,h:30,fn:_globalResolution}).translate([thickness/2,_bearingsDepth-5,0]),

        // rod support hole
        cylinder({r:_XYrodsDiam/2,h:5,fn:_globalResolution}).rotateX(90).translate([15,5,thickness+2.5]).setColor(0.2,0.7,0.2)
                   // slotted holes to fix on the wood side
        //slottedHole(3.2,8,10).rotateX(-90).rotateZ(90).translate([9,15,15]),
        //slottedHole(3.2,8,10).rotateX(-90).rotateZ(90).translate([9,40,15])
        // win some printing 
        //roundBoolean(50,30,30,30,"bl").rotateX(90).rotateZ(90).translate([width-25,_bearingSupportDepth-25,0])
        
    );
}

function bearingsXY_2(){
    width = 42;
    var thickness = 7;
    var bearings=cube({size:0});
    if(output==1){
        bearings = union(
            //low bearing
            bearing608z().translate([35,_bearingsDepth/2,thickness+4]).setColor(0.4,0.4,0.4),
            // middle hat
            bearingMiddle(8).translate([35,_bearingsDepth/2,thickness+11]).setColor(0.2,0.7,0.2),
            // high bearing
            bearing608z().translate([35,_bearingsDepth/2,thickness+14]).setColor(0.4,0.4,0.4),
            // hat
            bearingTop(3).translate([35,_bearingsDepth/2,thickness+21]).setColor(0.2,0.7,0.2)
        );
    }
    return difference(
        union(
            bearings,
            //base
            cube({size:[width,_bearingsDepth,thickness]}).setColor(0.2,0.7,0.2).translate([0,0,3]),
           
            //wall support
            cube({size:[thickness,_bearingsDepth,15]}).setColor(0.2,0.7,0.2).translate([0,0,3]),

            bearingSupport2(2).translate([35,_bearingsDepth/2,thickness+2]).setColor(0.2,0.8,0.4),
            
            difference(
            // rod support -
            cylinder({r:_XYrodsDiam/2+2.5,h:13}).rotateX(90).translate([15,13,thickness+1]).setColor(0.2,0.7,0.2),
            // back round 
            cylinder({r:9,h:30}).rotateY(90).translate([7,18,15])
            
            )
        ),

         // screw holes top
        cylinder({r:1.6,h:30,fn:_globalResolution}).translate([thickness/2,5,0]),
        cylinder({r:1.6,h:30,fn:_globalResolution}).translate([thickness/2,_bearingsDepth-5,0]),

        // rod support hole
        cylinder({r:_XYrodsDiam/2,h:5,fn:_globalResolution}).rotateX(90).translate([15,5,thickness+1]).setColor(0.2,0.7,0.2)
    );
}

function bearingsXYSupport(){
    width = 42;
    var thickness = 7;
    var bearings=cube({size:0});
    
    return difference(
        union(
            //bearings,
            //base
            //cube({size:[width,_bearingsDepth,thickness]}).setColor(0.2,0.7,0.2),
            //wall support
            //cube({size:[thickness,_bearingsDepth,20]}).setColor(0.2,0.7,0.2),
            //top and back fix
            cube({size:[_wallThickness+thickness,_bearingsDepth,thickness]}).translate([-_wallThickness,0,20]).setColor(0.2,0.7,0.2),
            cube({size:[thickness,_bearingsDepth,10+thickness]}).translate([-_wallThickness-thickness,0,10]).setColor(0.2,0.7,0.2)
            //bearingSupport(3).translate([25,33,thickness]).setColor(0.2,0.8,0.4),
           // bearingSupport(3).translate([35,10,thickness]).setColor(0.2,0.8,0.4),
 
            //difference(
            // rod support -
            //cylinder({r:_XYrodsDiam/2+2.5,h:13}).rotateX(90).translate([15,13,thickness+2.5]).setColor(0.2,0.7,0.2),
            //cylinder({r:9,h:30}).rotateY(90).translate([7,18,15])
            
            //)
        ),
        // bearing holes
        //cylinder({r:4,h:10}).translate([25,33,0]),
        //cylinder({r:4,h:10}).translate([35,10,0]),
        // screw holes back
        cylinder({r:1.6,h:10,fn:_globalResolution}).rotateY(90).translate([-_wallThickness-thickness,10,15]),
        cylinder({r:1.6,h:10,fn:_globalResolution}).rotateY(90).translate([-_wallThickness-thickness,_bearingsDepth-10,15]),
        // screw holes top
        cylinder({r:1.6,h:30,fn:_globalResolution}).translate([thickness/2,5,0]),
        cylinder({r:1.6,h:30,fn:_globalResolution}).translate([thickness/2,_bearingsDepth-5,0])
        // rod support hole
        //cylinder({r:_XYrodsDiam/2,h:5}).rotateX(90).translate([15,5,height+2.5]).setColor(0.2,0.7,0.2),
                   // slotted holes to fix on the wood side
        //slottedHole(3.2,8,10).rotateX(-90).rotateZ(90).translate([9,15,15]),
        //slottedHole(3.2,8,10).rotateX(-90).rotateZ(90).translate([9,40,15])
        
    );
}

function bearingsXYSupport_2(){
    width = 42;
    var thickness = 7;
    
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


function extruder_ddrive_body(){
    var base_height = 7;
    var support_width = 15;
    var support_height = 20;
    var support_offset = 8;
    return difference(
        union(
            cube({size:[_nemaXYZ,_nemaXYZ,base_height]}),
            cube({size:[support_width,13,support_height]}).translate([12,0,base_height]),
            cube({size:[support_width,13,15]}).translate([12,_nemaXYZ-13,base_height])
            
        ),
        nemaHole().translate([_nemaXYZ/2,_nemaXYZ/2,0]),
        // main hole
        cylinder({r:1,h:_nemaXYZ+5}).rotateX(-90).translate([_nemaXYZ/2-mk7Diam/2+2,-1,base_height+support_height/2]),
        cylinder({r1:3,r2:1,h:5}).rotateX(-90).translate([_nemaXYZ/2-mk7Diam/2+2,-1,base_height+support_height/2]),
        cylinder({r1:4,r2:1,h:5}).rotateX(-90).translate([_nemaXYZ/2-mk7Diam/2+2,_nemaXYZ-13,base_height+support_height/2])
        
    );
}

function extruder_ddrive_idle(){
    return difference(
        union(
            cube({size:[10,_nemaXYZ-5,3]}).translate([0,0,8]),
            cylinder({r:5,h:8}).translate([5,_nemaXYZ-5,8]),
            cube({size:[10,10,8]}).translate([0,0,8])
        ),
        cylinder({r:1.6,h:8}).translate([5,_nemaXYZ-5,8])
    );
}

function jhead_support(){
    var width=30;
    var height = 40;
    var depth = 5;
    var spaceZstopHoles = 19;

    return difference(
        union(
            //main low
            cube({size:[width,depth,height],center:true}).translate([-5,2.5,height/2]),
            // support on head
            cube({size:[width,15,4]}).translate([-width/2-5,-10,0]),
            // renfort support arm
            cube({size:[5,15,10]}).translate([-2,-10,4]),    
            //arm support
            slottedHole(16,30,10).rotateX(-90).rotateY(90).translate([20,-5,22])


  
        ),
        //zstop holes with slotted 
        slottedHole(3.2,6,20).rotateX(-90).translate([-width/2,-10,height-3]),
        slottedHole(3.2,6,20).rotateX(-90).translate([-width/2+spaceZstopHoles,-10,height-3]), 
        //arm support hle
        cylinder({r:1.4,h:2*depth+1,fn:_globalResolution}).rotateX(-90).translate([20,-6,22]),
        // hole for jhead
        cylinder({r:8,h:10,fn:_globalResolution}).translate([-10,-12,0]),
        // screw support on head
        cylinder({r:1.6,h:8,fn:_globalResolution}).translate([-width/2-2,-3,0]),
        cylinder({r:1.6,h:8,fn:_globalResolution}).translate([7,-3,0]),
        // remove some part
        roundBoolean(10,15,18,10,"tr").rotateX(-90).translate([-3,-10,30])

    );

}

function jhead_arm(){
    var extDiam=15;
    var intDiam=12;
    var intDiamHeight=5;
    var depth = 10;
    var width = 60;
    var barHeight = 6;

    return difference(
        union(
            //main
            cube([width-16,depth,barHeight]).translate([16,0,0]),
            //right cyl
            cylinder({r:8,h:depth,fn:_globalResolution}).rotateX(-90).translate([width,0,8]),
            //middle form
            cube([endxJheadAttachHolesWidth-5,depth,6]).translate([width/2-((endxJheadAttachHolesWidth-5)/2),0,barHeight]),
            //for 2 screws attach
            tube(2.8,10,depth).rotateX(-90).translate([width/2-endxJheadAttachHolesWidth/2,0,barHeight+2]),
            tube(2.8,10,depth).rotateX(-90).translate([width/2+endxJheadAttachHolesWidth/2,0,barHeight+2])
        ),
        // screw hole right
        cylinder({r:1.6,h:depth,fn:_globalResolution}).rotateX(-90).translate([width,0,8]),
        // jhead holes *3
         cylinder({r:extDiam/2,h:10,fn:_globalResolution}).translate([width/2,0,5]),
         cylinder({r:intDiam/2,h:intDiamHeight,fn:_globalResolution}).translate([width/2,0,0])
         //cylinder({r:extDiam/2,h:8,fn:_globalResolution}).translate([width/2,0,10+intDiamHeight])
    );  
    
}

function jhead_attach(){
    var extDiam=16;
    var intDiam=12;
    var intDiamHeight=5;
    var depth = 12;
    var width = 75;
    var barHeight = 6;

    return difference(
        union(
            cube([endxJheadAttachHolesWidth-5,8,12]).translate([width/2-((endxJheadAttachHolesWidth-5)/2),-10,2]),
            tube(3.2,10,8).rotateX(-90).translate([width/2-endxJheadAttachHolesWidth/2,-10,barHeight+4]),
            tube(3.2,10,8).rotateX(-90).translate([width/2+endxJheadAttachHolesWidth/2,-10,barHeight+4])
        ),
         //cylinder({r:extDiam/2,h:10,fn:_globalResolution}).translate([width/2,-1,0]),
         cylinder({r:intDiam/2,h:intDiamHeight,fn:_globalResolution}).translate([width/2,-1,2]),
         cylinder({r:extDiam/2,h:10,fn:_globalResolution}).translate([width/2,-1,intDiamHeight+2])

    );  
    
}

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

//  ----------   non printed elements ------------

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
    var offsetFromTopY = 10;
    var offsetFromTopX = 12;
    return union(
        // rod X front
        cylinder({r:_XYrodsDiam/2,h:XrodLength,fn:_globalResolution}).rotateY(90).translate([-_globalWidth/2+30,XaxisOffset,_globalHeight-offsetFromTopX]).setColor(0.3,0.3,0.3),
        // rod x front bearing
        cylinder({r:_XYlmDiam/2,h:50,fn:_globalResolution}).rotateY(90).translate([-25,XaxisOffset,_globalHeight-offsetFromTopX]).setColor(0.6,0.6,0.6),
        // rod x back
        cylinder({r:_XYrodsDiam/2,h:XrodLength,fn:_globalResolution}).rotateY(90).translate([-_globalWidth/2+30,_XrodsWidth+XaxisOffset,_globalHeight-offsetFromTopX]).setColor(0.3,0.3,0.3),
        // rod y left
        cylinder({r:_XYrodsDiam/2,h:YrodLength,fn:_globalResolution}).rotateX(90).translate([-_globalWidth/2+_wallThickness+15,_globalDepth/2-_bearingsDepth+5,_globalHeight-offsetFromTopY]).setColor(0.3,0.3,0.3),
        // rod y left bearing
        cylinder({r:_XYlmDiam/2,h:50,fn:_globalResolution}).rotateX(90).translate([-_globalWidth/2+_wallThickness+15,0,_globalHeight-offsetFromTopY]).setColor(0.6,0.6,0.6),
        // rod y right
        cylinder({r:_XYrodsDiam/2,h:YrodLength,fn:_globalResolution}).rotateX(90).translate([_globalWidth/2-_wallThickness-15,_globalDepth/2-_bearingsDepth+5,_globalHeight-offsetFromTopY]).setColor(0.3,0.3,0.3),
        //rod Z left
        cylinder({r:_ZrodsDiam/2,h:_globalHeight-40,fn:_globalResolution}).translate([-_ZrodsWidth/2,_globalDepth/2-10,10]).setColor(0.3,0.3,0.3),
        //rod Z left bearing
        cylinder({r:_ZlmDiam/2,h:50,fn:_globalResolution}).translate([-_ZrodsWidth/2,_globalDepth/2-10,_globalHeight/2-10]).setColor(0.5,0.5,0.5),
        // rod z right
        cylinder({r:_ZrodsDiam/2,h:_globalHeight-40,fn:_globalResolution}).translate([_ZrodsWidth/2,_globalDepth/2-10,10]).setColor(0.3,0.3,0.3),
        // rod z right bearing
        cylinder({r:_ZlmDiam/2,h:50,fn:_globalResolution}).translate([_ZrodsWidth/2,_globalDepth/2-10,_globalHeight/2-10]).setColor(0.5,0.5,0.5)
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
    return difference(
        cube({size:[_printableWidth,_printableDepth,3]}).setColor(0.8,0.8,0.4,0.5),
        // holes in bed support
        cylinder({r:20,h:10,fn:_globalResolution}).translate([40,40,0]),
        cylinder({r:20,h:10,fn:_globalResolution}).translate([_printableWidth/2,40,0]),
        cylinder({r:20,h:10,fn:_globalResolution}).translate([_printableWidth-40,40,0]),
        cylinder({r:20,h:10,fn:_globalResolution}).translate([40,_printableDepth-40,0]),
        cylinder({r:20,h:10,fn:_globalResolution}).translate([_printableWidth/2,_printableDepth-40,0]),
        cylinder({r:20,h:10,fn:_globalResolution}).translate([_printableWidth-40,_printableDepth-40,0])

    );
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
            cylinder({r:13,h:2,fn:_globalResolution}).translate([0,0,1])
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
        cylinder({r:11,h:7,fn:_globalResolution}),
        cylinder({r:4,h:7,fn:_globalResolution})
    );
}

function Gt2Holder(boolOffset,height){
    var h = 10;
    if(height){h=height;}
    return difference(
        linear_extrude({height:10},polygon({points:[[0,0],[16,0],[12,h],[4,h]]})).translate([-12,0,-h]).rotateY(-90).rotateX(90),
        union(
            cube([10,1,h-3]).translate([h-10,boolOffset,3]),
            cube([1,1,h-3]).translate([h-9,boolOffset+1,3]),
            cube([1,1,h-3]).translate([h-7,boolOffset+1,3]),
            cube([1,1,h-3]).translate([h-5,boolOffset+1,3]),
            cube([1,1,h-3]).translate([h-3,boolOffset+1,3]),
            cube([1,1,h-3]).translate([h-1,boolOffset+1,3])

        )
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
    return difference(

        linear_extrude({height:20},polygon({points:[[0,0],[16,0],[12,10],[4,10]]})).translate([-12,0,-10]).rotateY(-90).rotateX(90),
        union(
            cube([20,1,7]).translate([-10,3,3]),
            cube([1,1,7]).translate([-9,3+1,3]),
            cube([1,1,7]).translate([-7,3+1,3]),
            cube([1,1,7]).translate([-5,3+1,3]),
            cube([1,1,7]).translate([-3,3+1,3]),
            cube([1,1,7]).translate([-1,3+1,3]),
            cube([1,1,7]).translate([1,3+1,3]),
            cube([1,1,7]).translate([3,3+1,3]),
            cube([1,1,7]).translate([5,3+1,3]),
            cube([1,1,7]).translate([7,3+1,3]),
            cube([1,1,7]).translate([9,3+1,3])

        )
    )
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
    _nemaXYZ=parseInt(params._nemaXYZ);
    output=parseInt(params._output); 
    
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
    //ZrodLength = 


    echo("wood depth:"+_globalDepth + " width:"+_globalWidth+" height:"+_globalHeight);
    echo("X rod length:"+XrodLength + " Y rod length:"+YrodLength+" Zrodlength:"+ZrodLength);
    // calculate some usefull vars
    var ztopbottomX = (_ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2))/2;
    var zslideX = (_ZrodsWidth+_ZlmDiam+(_rodsSupportThickness*2))/2;

    // builds here. 
   
    
var res=null;


//"nothing","All printer assembly", "printed parts plate","motor xy","bearings xy","slide y","z top","z bottom","z slide","head","bed support"
switch(output){
    case 0:
        res = [//head().translate([-30,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset,_globalHeight-22]),
            //fakeJhead().translate([-10,18+XaxisOffset,_globalHeight-39]).setColor(0.3,0.3,0.3,0.5),
            jhead_support().translate([0,34+XaxisOffset,_globalHeight-5]),
            //fake_switch().translate([-20,26+XaxisOffset,_globalHeight+22]).setColor(0.3,0.3,0.3,0.5),
            jhead_arm().translate([-40,10+XaxisOffset,_globalHeight+6]),
            jhead_attach().translate([-47.5,XaxisOffset,_globalHeight+4])];
    break;
    case 1:
        res = [
            _walls(),
            _rods(),
            _bed().translate([-_printableWidth/2,-_printableDepth/2+40,_globalHeight/2+10]),
            //nema left
            _nema().translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-_nemaXYZ-18]),
            // nema right
            _nema().translate([_globalWidth/2-+_wallThickness-_nemaXYZ,-_globalDepth/2,_globalHeight-_nemaXYZ-18]),
            // nema bottom ..z
            _nema().rotateX(-90).translate([-_nemaXYZ/2,_globalDepth/2-_nemaXYZ-30,_wallThickness+_nemaXYZ]),
            // nema extruder
            _nema().rotateX(90).translate([-_globalWidth/2+_wallThickness,-_globalDepth/2+_nemaXYZ,_globalHeight-_nemaXYZ-18-_nemaXYZ-5]),
            motorXY().translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-18]),
            motorXYSupport().translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-18]),
            motorXY().mirroredX().translate([_globalWidth/2-_wallThickness,-_globalDepth/2,_globalHeight-20]),
            motorXYSupport().mirroredX().translate([_globalWidth/2-_wallThickness,-_globalDepth/2,_globalHeight-20]),
            bearingsXY_2().translate([-_globalWidth/2+_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-18]),
            bearingsXYSupport_2().translate([-_globalWidth/2+_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]),
            bearingsXY_2().mirroredX().translate([_globalWidth/2-_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-18]),
            bearingsXYSupport_2().mirroredX().translate([_globalWidth/2-_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]),
            slideY().translate([-_globalWidth/2+_wallThickness+3,-_rodsSupportThickness-_XYrodsDiam/2+XaxisOffset,_globalHeight-22]),
            slideY("right").mirroredX().translate([_globalWidth/2-_wallThickness-3,-_rodsSupportThickness-_XYrodsDiam/2+XaxisOffset,_globalHeight-22]),
            head().translate([-30,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset,_globalHeight-22]),
            fakeJhead().translate([-10,18+XaxisOffset,_globalHeight-38]).setColor(0.3,0.3,0.3,0.5),
            jhead_support().translate([0,34+XaxisOffset,_globalHeight-8]),
            fake_switch().translate([-20,26+XaxisOffset,_globalHeight+22]).setColor(0.3,0.3,0.3,0.5),
            jhead_arm().translate([-40,19+XaxisOffset,_globalHeight+6]),
            jhead_attach().translate([-47.5,20+XaxisOffset,_globalHeight+4]),
            zTop().translate([0,_globalDepth/2-10,_globalHeight-35]),
            zBottom().translate([0,_globalDepth/2-10,_wallThickness]),
            slideZ().translate([-_ZrodsWidth/2,_globalDepth/2-10,_globalHeight/2-40])
            //supportBed().translate([-_ZrodsWidth/2,-_printableDepth/2+30,_globalHeight/2-15])
                ];
    break;
    case 2:
        res = [

            motorXY().translate([-90,-160,0]),
            motorXY().mirroredX().translate([90,-160,0]),
            motorXYSupport().rotateX(180).translate([-90,-20,0]),
            motorXYSupport().rotateX(180).translate([-90,-70,0]),
            bearingsXYSupport_2().rotateX(180).translate([50,-30,0]),
            bearingsXYSupport_2().rotateX(180).translate([50,-80,0]),
            bearingsXY_2().translate([-90,50,0]),
            bearingsXY_2().mirroredX().translate([60,-20,0]),
            slideY().translate([-90,-10,0]),
            slideY().mirroredX().translate([0,-130,0]),
            head().translate([-45,-33,0]),
            zTop().rotateX(-90).translate([10,40,20]),
            zBottom().translate([10,70,0]),
            slideZ().rotateX(180).translate([-20,110,50]),
            //supportBed().rotateX(90).translate([-30,-138,0]),
            bearingTop(3).rotateX(180).translate([-75,-180,4]).setColor(0.2,0.7,0.2),
            bearingTop(3).rotateX(180).translate([-50,-180,4]).setColor(0.2,0.7,0.2),
            bearingTop(3).rotateX(180).translate([-25,-180,4]).setColor(0.2,0.7,0.2),
            bearingTop(3).rotateX(180).translate([0,-180,4]).setColor(0.2,0.7,0.2),
            bearingTop(3).rotateX(180).translate([25,-180,4]).setColor(0.2,0.7,0.2),
            bearingTop(3).rotateX(180).translate([50,-180,4]).setColor(0.2,0.7,0.2),
            bearingMiddle(8).rotateX(180).translate([75,-180,4]).setColor(0.2,0.7,0.2),
            bearingMiddle(8).rotateX(180).translate([-50,-150,4]).setColor(0.2,0.7,0.2)
                ];

    break;
    case 3:
        res = [motorXY(),
                motorXYSupport().translate([0,0,3])];
    break;
    case 4:
        res = [bearingsXY_2(),bearingsXYSupport_2()];
    break;
    case 5:
        res = [slideY(),bearingsXY().translate([-3,80,4])];
    break;
    case 6:
        res = [zTop().translate([0,0,80]),slideZ().translate([-_ZrodsWidth/2,0,20]),zBottom()];
    break;
    case 7:
        res = zBottom();
    break;
    case 8:
        res = slideZ();
    break;
    case 9:
        res = head();
    break;
    case 10:
        res = [ extruder_ddrive_body().translate([0,0,_nemaXYZ]),extruder_ddrive_idle().translate([0,0,_nemaXYZ])];
    break;
    default:

    break;
}

return res;


}

