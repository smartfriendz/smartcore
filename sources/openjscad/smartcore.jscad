/**********

Smartcore : L'empileuse

author: serge.vi / smartfriendz
licence : GPL
version: 0.1
date: 11 / 2014

***********/

// global vars - updated from interface but need to be avalaible in all functions

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
var _bearingSupportDepth; // global , calculated from nema size.. used to place supports agaisnt walls
var _XrodsWidth=40; //space between rods on X axis
var _ZrodsWidth=80; //space between rods on Z axis
var _rodsSupportThickness = 3; // thickness around rods for all supports
var outputPlateWidth = 180; //used when output to printable plates for elements
var outputPlateDepth = 180;


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
        initial: 8, 
        captions: ["nothing","All printer assembly", "printed parts plate","motor xy","bearings xy","slide y","z top","z bottom","z slide","head","bed support"]}
    
  ]; 
}



// -----------------  printed elements 




function zTop(){
    var width = _ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2);
    var height = 20;
    var depth = 20;
    var insideWidth = 40;
     var bearings=cube({size:0});

    if(output==1){
        bearings = union(
            bearing608z().rotateX(90).translate([((width-insideWidth)/2)+(insideWidth/2),13,height/2]).setColor(0.4,0.4,0.4)
        );
    }
    return union(
        difference(
            //main
            cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),
            // inside form
            cube({size:[insideWidth,depth,height]}).translate([(width-insideWidth)/2,-5,0]).setColor(0.2,0.7,0.2),
            //screw left
            slottedHole(3,8,22).rotateX(90).rotateY(90).translate([5,21,height-5]),
            //screw right
            slottedHole(3,8,22).rotateX(90).rotateY(90).translate([width-10,21,height-5]),
            // z rod left
            cylinder({r:_ZrodsDiam/2,h:15}).translate([_rodsSupportThickness+_ZrodsDiam/2,10,0]),
            //z rod right
            cylinder({r:_ZrodsDiam/2,h:15}).translate([_rodsSupportThickness+_ZrodsDiam/2+_ZrodsWidth,10,0])

        ),
        bearingSupport(3).rotateX(90).translate([((width-insideWidth)/2)+(insideWidth/2),15,height/2]).setColor(0.2,0.7,0.2),
        bearings

        
    );
}

function zBottom(){
    var width = _ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2);
    var height = 20;
    var depth = 20;
    return difference(
        //main
        union(
            cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),
            cube({size:[width/2,depth,10]}).translate([width/4,-10,0]).setColor(0.2,0.7,0.2)
            
            ),
        // inside form
        nemaHole(_nemaXYZ).rotateX(90).translate([width/2,20,_nemaXYZ/2]),
        cube({size:[width/2,15,20]}).translate([width/4,10,0]),
        // z rod left
        cylinder({r:_ZrodsDiam/2,h:15}).translate([_rodsSupportThickness+_ZrodsDiam/2,10,6]),
        //z rod right
        cylinder({r:_ZrodsDiam/2,h:15}).translate([_rodsSupportThickness+_ZrodsDiam/2+_ZrodsWidth,10,6]),
        //screw left
        slottedHole(3,8,22).rotateX(90).rotateY(90).translate([5,21,5]),
        //screw right
        slottedHole(3,8,22).rotateX(90).rotateY(90).translate([width-10,21,5])
        
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
            difference(
                Gt2Holder2().rotateX(90).rotateY(-90).translate([width/2-8,1,height-10]).setColor(0.2,0.7,0.2),
                // specal bool for gt2 holder on top ( to be able to print standing)
                cube({size:[20,20,20]}).rotateX(45).translate([width/2-22,-10,height-38])
            ),
            Gt2Holder(3).rotateX(90).rotateY(90).translate([width/2-16,1,10]).setColor(0.2,0.7,0.2),
            cylinder({r:_ZlmDiam/2+4,h:height}).translate([0,0,0]).setColor(0.2,0.7,0.2),
            cylinder({r:_ZlmDiam/2+4,h:height}).translate([_ZrodsWidth,0,0]).setColor(0.2,0.7,0.2),
            cube([14,12,height]).translate([-7,-15,0]).setColor(0.2,0.7,0.2),
            cube([14,12,height]).translate([_ZrodsWidth-7,-15,0]).setColor(0.2,0.7,0.2)
        ),
        // big hole middle
        cylinder({r:15,h:50}).rotateX(90).translate([width/2+10,40,height/2]),

        // z rod left linear bearing lm
        cylinder({r:_ZlmDiam/2,h:height}).translate([0,0,0]),
        //z rod right linear bearing lm
        cylinder({r:_ZlmDiam/2,h:height}).translate([_ZrodsWidth,0,0]),
        //bottom holes
        cylinder({r:_ZrodsDiam/2,h:10}).rotateX(83).rotateZ(5).translate([0,-7,10]),
        cylinder({r:_ZrodsDiam/2,h:10}).rotateX(83).rotateZ(-5).translate([_ZrodsWidth,-7,10])
        
    );
}

function supportBed(){
    var width = _ZrodsWidth;
    var height = 25;
    var depth = 20;
    return difference(
        cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),
        // support rods holes 
        cylinder({r:_ZrodsDiam/2,h:10}).rotateX(83).rotateZ(5).translate([17,21,8]),
        cylinder({r:_ZrodsDiam/2,h:10}).rotateX(83).rotateZ(-5).translate([_ZrodsWidth-17,21,8]),
        //rounded
        roundBoolean(20,20,20,20,"tl").translate([width-10,0,-10]),
        roundBoolean(20,20,20,20,"tr").translate([-10,0,-10])

    );
}


function slideY(){
    var width = 40;
    var height = (_XYlmDiam/2)+(2*_rodsSupportThickness)+3;
    var depth = _XrodsWidth+(_XYrodsDiam)+(_rodsSupportThickness*2);
    var bearings=cube({size:0});
    
    // will render only if not printed only.
    if(output==1){
        bearings = union(
            bearing608z().translate([width-8,depth/2-15,height+2]).setColor(0.4,0.4,0.4),
            bearing608z().translate([width-8,depth/2+15,height+2]).setColor(0.4,0.4,0.4),
            // bearing hat
            bearingTop(3).translate([width-8,depth/2-15,height+10]).setColor(0.2,0.7,0.2),
            bearingTop(3).translate([width-8,depth/2+15,height+10]).setColor(0.2,0.7,0.2)
        );
    }
    
    return difference(
        union(
            bearings,
            // main
            cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),
            // extra for bearing support
            cube({size:[10,depth,height+3]}).setColor(0.2,0.7,0.2),
            bearingSupport(3).translate([32,depth/2-15,height-1]).setColor(0.2,0.8,0.4),
            bearingSupport(3).translate([32,depth/2+15,height-1]).setColor(0.2,0.8,0.4)
            
        ),
        // rod x front
        cylinder({r:_XYrodsDiam/2,h:10}).rotateY(90).translate([width-10,_rodsSupportThickness+_XYrodsDiam/2,height/2]),
        // rod x back
        cylinder({r:_XYrodsDiam/2,h:10}).rotateY(90).translate([width-10,depth-_rodsSupportThickness-_XYrodsDiam/2,height/2]),
        // bearing support
        cylinder({r:_XYlmDiam/2,h:depth+1}).rotateX(-90).translate([12,-1,_XYlmDiam/2+_rodsSupportThickness+3])
        
        
    );
}

function head(){
    var width = 50;
    var height = (_XYlmDiam/2)+(2*_rodsSupportThickness)+3;
    var depth = _XrodsWidth+(_XYlmDiam)+(_rodsSupportThickness*4);
    return difference(
        union(
        //main
        cube({size:[width,depth,height]}).setColor(0.2,0.7,0.2),
        //gt2 holders 
        Gt2Holder(3).translate([0,depth/2+3,height]),
        Gt2Holder(3).translate([0,depth/2-11,height]),
        Gt2Holder(3).translate([width-10,depth/2+3,height]),
        Gt2Holder(3).translate([width-10,depth/2-11,height])


        ),
        // x bearing front
        cylinder({r:_XYlmDiam/2,h:50}).rotateY(90).translate([0,_XYlmDiam/2+(_rodsSupportThickness*2),_XYlmDiam/2+_rodsSupportThickness+3]),
        // x bearing back
        cylinder({r:_XYlmDiam/2,h:50}).rotateY(90).translate([0,_XYlmDiam/2+(_rodsSupportThickness*2)+_XrodsWidth,_XYlmDiam/2+_rodsSupportThickness+3]),
        // tooling hole
        cylinder({r:9,h:30}).translate([width/2,depth/2],0),
        // screw to fix tooling in hole
        cylinder({r:1.4,h:50}).rotateY(90).translate([-width/2,depth/2,8])
    );
}

function motorXY(){
    var thickness = 7;
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
        cylinder({r:_XYrodsDiam/2+2.5,h:15}).rotateX(90).translate([15,_nemaXYZ,thickness+2.5]).setColor(0.2,0.7,0.2)


    ),
    nemaHole(_nemaXYZ).translate([_nemaXYZ/2,_nemaXYZ/2,0]),
    cylinder({r:1.6,h:10}).rotateY(90).translate([-_wallThickness-thickness,10,10]),
    cylinder({r:1.6,h:10}).rotateY(90).translate([-_wallThickness-thickness,_nemaXYZ-10,10]),
    // rod support hole
    cylinder({r:_XYrodsDiam/2,h:5}).rotateX(90).translate([15,_nemaXYZ,thickness+2.5]).setColor(0.2,0.7,0.2),
    // slotted holes to fix on the wood side
    slottedHole(3.2,8,10).rotateX(-90).rotateZ(90).translate([9,10,15]),
    slottedHole(3.2,8,13).rotateX(-90).rotateZ(90).translate([12,25,15])
    );
}



function bearingsXY(){
    width = 42;
    _bearingSupportDepth = _nemaXYZ+(_rodsSupportThickness*2);
    var height = 7;
    var bearings=cube({size:0});
    if(output==1){
        bearings = union(
            bearing608z().translate([25,33,16]).setColor(0.4,0.4,0.4),
            bearing608z().translate([35,10,10]).setColor(0.4,0.4,0.4),
            // hat
            bearingTop(8).translate([25,33,20]).setColor(0.2,0.7,0.2),
            bearingTop(8).translate([35,10,15]).setColor(0.2,0.7,0.2)
        );
    }
    return difference(
        union(
            bearings,
            //base
            cube({size:[width,_bearingSupportDepth,height]}).setColor(0.2,0.7,0.2),
            //wall support
            cube({size:[height,_bearingSupportDepth,20]}).setColor(0.2,0.7,0.2),
            //top and back fix
            //cube({size:[_wallThickness+height,_bearingSupportDepth,height]}).translate([-_wallThickness,0,20]).setColor(0.2,0.7,0.2),
            //cube({size:[height,_bearingSupportDepth,20+height]}).translate([-_wallThickness-height,0,0]).setColor(0.2,0.7,0.2),
            bearingSupport(3).translate([25,33,height]).setColor(0.2,0.8,0.4),
            bearingSupport(3).translate([35,10,height]).setColor(0.2,0.8,0.4),
 
            difference(
            // rod support -
            cylinder({r:_XYrodsDiam/2+2.5,h:13}).rotateX(90).translate([15,13,height+2.5]).setColor(0.2,0.7,0.2),
            cylinder({r:9,h:30}).rotateY(90).translate([7,18,15])
            
            )
        ),
        // bearing holes
        //cylinder({r:4,h:10}).translate([25,33,0]),
        //cylinder({r:4,h:10}).translate([35,10,0]),
        // screw holes
        cylinder({r:1.6,h:10}).rotateY(90).translate([-_wallThickness-height,10,10]),
        cylinder({r:1.6,h:10}).rotateY(90).translate([-_wallThickness-height,_bearingSupportDepth-10,10]),
        // rod support hole
        cylinder({r:_XYrodsDiam/2,h:5}).rotateX(90).translate([15,5,height+2.5]).setColor(0.2,0.7,0.2),
                   // slotted holes to fix on the wood side
        slottedHole(3.2,8,10).rotateX(-90).rotateZ(90).translate([9,15,15]),
        slottedHole(3.2,8,10).rotateX(-90).rotateZ(90).translate([9,40,15])
        
    );
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
    var offsetFromTopX = 15;
    return union(
        // rod X front
        cylinder({r:_XYrodsDiam/2,h:_globalWidth-80}).rotateY(90).translate([-_globalWidth/2+30,0,_globalHeight-offsetFromTopX]).setColor(0.3,0.3,0.3),
        // rod x front bearing
        cylinder({r:_XYlmDiam/2,h:50}).rotateY(90).translate([-25,0,_globalHeight-offsetFromTopX]).setColor(0.6,0.6,0.6),
        // rod x back
        cylinder({r:_XYrodsDiam/2,h:_globalWidth-80}).rotateY(90).translate([-_globalWidth/2+30,_XrodsWidth,_globalHeight-offsetFromTopX]).setColor(0.3,0.3,0.3),
        // rod y left
        cylinder({r:_XYrodsDiam/2,h:_globalDepth-80}).rotateX(90).translate([-_globalWidth/2+_wallThickness+15,_globalDepth/2-40,_globalHeight-offsetFromTopY]).setColor(0.3,0.3,0.3),
        // rod y left bearing
        cylinder({r:_XYlmDiam/2,h:50}).rotateX(90).translate([-_globalWidth/2+_wallThickness+15,0,_globalHeight-offsetFromTopY]).setColor(0.6,0.6,0.6),
        // rod y right
        cylinder({r:_XYrodsDiam/2,h:_globalDepth-80}).rotateX(90).translate([_globalWidth/2-_wallThickness-15,_globalDepth/2-40,_globalHeight-offsetFromTopY]).setColor(0.3,0.3,0.3),
        //rod Z left
        cylinder({r:_ZrodsDiam/2,h:_globalHeight-40}).translate([-_ZrodsWidth/2,_globalDepth/2-10,10]).setColor(0.3,0.3,0.3),
        //rod Z left bearing
        cylinder({r:_ZlmDiam/2,h:50}).translate([-_ZrodsWidth/2,_globalDepth/2-10,_globalHeight/2-10]).setColor(0.5,0.5,0.5),
        // rod z right
        cylinder({r:_ZrodsDiam/2,h:_globalHeight-40}).translate([_ZrodsWidth/2,_globalDepth/2-10,10]).setColor(0.3,0.3,0.3),
        // rod z right bearing
        cylinder({r:_ZlmDiam/2,h:50}).translate([_ZrodsWidth/2,_globalDepth/2-10,_globalHeight/2-10]).setColor(0.5,0.5,0.5),
        // support bed *4
        //cylinder({r:_ZrodsDiam/2,h:_printableDepth}).rotateX(90).translate([-_ZrodsWidth/2,_globalDepth/2-25,_globalHeight/2]).setColor(0.5,0.5,0.5),
        //cylinder({r:_ZrodsDiam/2,h:_printableDepth}).rotateX(90).translate([_ZrodsWidth/2,_globalDepth/2-25,_globalHeight/2]).setColor(0.5,0.5,0.5),
        cylinder({r:_ZrodsDiam/2,h:_printableDepth}).rotateX(83).rotateZ(5).translate([-_ZrodsWidth/2,_globalDepth/2-25,_globalHeight/2-30]).setColor(0.5,0.5,0.5),
        cylinder({r:_ZrodsDiam/2,h:_printableDepth}).rotateX(83).rotateZ(-5).translate([_ZrodsWidth/2,_globalDepth/2-25,_globalHeight/2-30]).setColor(0.5,0.5,0.5)
    );
}


function _nema(){
    return union(
        cube({size:_nemaXYZ}).setColor(0.3,0.3,1.0),
        cylinder({r:11,h:2}).translate([_nemaXYZ/2,_nemaXYZ/2,_nemaXYZ]),
        cylinder({r:2.5,h:25}).translate([_nemaXYZ/2,_nemaXYZ/2,_nemaXYZ+2])
    );
}

function _bed(){
    return cube({size:[_printableWidth,_printableDepth,3]}).setColor(0.5,0.5,0.5);
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
    var offset = (_nemaXYZ==35)?13:15.5;
        return union(
            cylinder({r:11.1,h:40}),
            cylinder({r:1.6,h:40}).translate([-offset,-offset,0]),
            cylinder({r:1.6,h:40}).translate([offset,-offset,0]),
            cylinder({r:1.6,h:40}).translate([-offset,offset,0]),
            cylinder({r:1.6,h:40}).translate([offset,offset,0])
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
    return difference(
        union(
            cylinder({r:5,h:baseHeight}),
            cylinder({r:4,h:6}).translate([0,0,baseHeight])
        ),
        cylinder({r:1.4,h:baseHeight+7})
    );
}

function bearingTop(hole){
    return difference(
        union(
            cylinder({r:5,h:1}),
            cylinder({r:12,h:3}).translate([0,0,1])
        ),
        cylinder({r:hole/2+0.1,h:6})
    );
}

function bearing608z(){
    return difference(
        cylinder({r:11,h:7}),
        cylinder({r:4,h:7})
    );
}

function Gt2Holder(boolOffset){
    return difference(
       // polyhedron({points:[[10,10,10],[10,0,10],[0,0,10],[0,10,10],
       //                     [13,13,0],[13,0,0],[0,0,0],[0,13,0]],
       //                     polygons:[[0,1,2,3],[4,5,6,7],[0,1,5,4],[3,0,4,7],[1,2,6,5],[2,3,7,6]]}),
        //cube([10,10,10]),
        linear_extrude({height:10},polygon({points:[[0,0],[16,0],[12,10],[4,10]]})).translate([-12,0,-10]).rotateY(-90).rotateX(90),
        union(
            cube([10,1,7]).translate([0,boolOffset,3]),
            cube([1,1,7]).translate([1,boolOffset+1,3]),
            cube([1,1,7]).translate([3,boolOffset+1,3]),
            cube([1,1,7]).translate([5,boolOffset+1,3]),
            cube([1,1,7]).translate([7,boolOffset+1,3]),
            cube([1,1,7]).translate([9,boolOffset+1,3])

        )
    )
}
function Gt2Holder2(){
    return difference(
       // polyhedron({points:[[10,10,10],[10,0,10],[0,0,10],[0,10,10],
       //                     [13,13,0],[13,0,0],[0,0,0],[0,13,0]],
       //                     polygons:[[0,1,2,3],[4,5,6,7],[0,1,5,4],[3,0,4,7],[1,2,6,5],[2,3,7,6]]}),
        //cube([10,10,10]),
        linear_extrude({height:20},polygon({points:[[0,0],[16,0],[12,10],[4,10]]})).translate([-12,0,-10]).rotateY(-90).rotateX(90),
        union(
            cube([20,1,7]).translate([-10,3,3]),
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
    if(edge=="bl"){bool = cylinder({r:diam/2,h:d}).rotateX(-90).translate([0,0,0]);}
    if(edge=="tl"){bool = cylinder({r:diam/2,h:d}).rotateX(-90).translate([0,0,h]);}
    if(edge=="br"){bool = cylinder({r:diam/2,h:d}).rotateX(-90).translate([w,0,0]);}
    if(edge=="tr"){bool = cylinder({r:diam/2,h:d}).rotateX(-90).translate([w,0,h]);}
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

    // calculate some usefull vars
    var ztopbottomX = (_ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2))/2;
    var zslideX = (_ZrodsWidth+_ZlmDiam+(_rodsSupportThickness*2))/2;

    // builds here. 
   
    
var res=null;


//"nothing","All printer assembly", "printed parts plate","motor xy","bearings xy","slide y","z top","z bottom","z slide","head","bed support"
switch(output){
    case 0:
        res = cube([1,1,1]);
    break;
    case 1:
        res = [
            _walls(),
            _rods(),
            _bed().translate([-_printableWidth/2,-_printableDepth/2+40,_globalHeight/2+10]),
            //nema left
            _nema().translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-_nemaXYZ-22]),
            // nema right
            _nema().translate([_globalWidth/2-+_wallThickness-_nemaXYZ,-_globalDepth/2,_globalHeight-_nemaXYZ-22]),
            // nema bottom ..z
            _nema().rotateX(-90).translate([-_nemaXYZ/2,_globalDepth/2-_nemaXYZ-30,_wallThickness+_nemaXYZ]),
            motorXY().translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-20]),
            motorXY().mirroredX().translate([_globalWidth/2-_wallThickness,-_globalDepth/2,_globalHeight-20]),
            bearingsXY().translate([-_globalWidth/2+_wallThickness,_globalDepth/2-_bearingSupportDepth,_globalHeight-20]),
            bearingsXY().mirroredX().translate([_globalWidth/2-_wallThickness,_globalDepth/2-_bearingSupportDepth,_globalHeight-20]),
            slideY().translate([-_globalWidth/2+_wallThickness+3,-_rodsSupportThickness-_XYrodsDiam/2,_globalHeight-22]),
            slideY().mirroredX().translate([_globalWidth/2-_wallThickness-3,-_rodsSupportThickness-_XYrodsDiam/2,_globalHeight-22]),
            head().translate([-40,-(_XYlmDiam/2+(_rodsSupportThickness*2)),_globalHeight-25]),
            zTop().translate([-ztopbottomX,_globalDepth/2-20,_globalHeight-40]),
            zBottom().translate([-ztopbottomX,_globalDepth/2-20,_wallThickness]),
            slideZ().translate([-(_ZrodsWidth)/2,_globalDepth/2-10,_globalHeight/2-40]),
            supportBed().translate([-ztopbottomX,-_printableDepth/2+30,_globalHeight/2-15])
                ];
    break;
    case 2:
        res = [

            motorXY().translate([-90,-60,0]),
            motorXY().mirroredX().translate([90,-60,0]),
            bearingsXY().translate([-90,50,0]),
            bearingsXY().mirroredX().translate([100,-10,0]),
            slideY().translate([-90,-10,0]),
            slideY().mirroredX().translate([55,-30,0]),
            head().translate([-45,-33,0]),
            zTop().rotateX(-90).translate([-40,35,20]),
            zBottom().translate([0,66,0]),
            slideZ().translate([-20,100,0]),
            supportBed().translate([-30,-60,0]),
            bearingTop(3).rotateX(180).translate([-75,-80,4]).setColor(0.2,0.7,0.2),
            bearingTop(3).rotateX(180).translate([-50,-80,4]).setColor(0.2,0.7,0.2),
            bearingTop(3).rotateX(180).translate([-25,-80,4]).setColor(0.2,0.7,0.2),
            bearingTop(3).rotateX(180).translate([0,-80,4]).setColor(0.2,0.7,0.2),
            bearingTop(8).rotateX(180).translate([25,-80,4]).setColor(0.2,0.7,0.2),
            bearingTop(8).rotateX(180).translate([50,-80,4]).setColor(0.2,0.7,0.2),
            bearingTop(8).rotateX(180).translate([75,-80,4]).setColor(0.2,0.7,0.2),
            bearingTop(8).rotateX(180).translate([-50,-50,4]).setColor(0.2,0.7,0.2)
                ];

    break;
    case 3:
        res = motorXY();
    break;
    case 4:
        res = bearingsXY();
    break;
    case 5:
        res = slideY();
    break;
    case 6:
        res = zTop();
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
        res = supportBed();
    break;
    default:

    break;
}

return res;


}

