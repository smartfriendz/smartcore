/**********

Smartcore : L'empileuse

author= serge.vi / smartfriendz
licence : GPL
version: 0.1
date: 11 / 2014



TODO:





***********/

// global s - updated from interface but need to be avalaible in all modules
_globalResolution=8;
_woodsupport=false;
_globalWidth=300; // exernal dimension of the all printer
_globalHeight=300; // exernal dimension of the all printer
_globalDepth=300; // exernal dimension of the all printer
_printableWidth=200;
_printableDepth=200;
_printableHeight=150;
_wallThickness=10; // box wood thickness
_XYrodsDiam=6; // usually 6 or 8 .. or 10? 
_XYlmDiam=12; // lm6uu, lm8uu ... will be calculated from rods diam
_ZrodsDiam=8; // usually 6 or 8 .. or 10? 
_ZlmDiam=15; // lm6uu, lm8uu ... will be calculated from rods diam
_nemaXYZ=42;  // nema 14 , nema 17 
_XrodsWidth=40; //space between rods on X axis
_ZrodsWidth=80; //space between rods on Z axis
_extrusionType = 0; // 0 bowden 1 direct
 XrodLength = 300; // will be calculated in main from parameters.
 YrodLength = 300; // will be calculated in main from parameters.
 ZrodLength = 300; // will be calculated in main from parameters.
 _rodsSupportThickness = 3; // thickness around rods for all supports
 outputPlateWidth = 180; //used when output to printable plates for elements
 outputPlateDepth = 180;
 mk7Diam = 10;

// global for work
 _bearingsDepth = 35; 
 XaxisOffset = -80;
 _ZaxisOffset = -30;
 endxJheadAttachHolesWidth = 32;




/*
    _globalDepth = _printableDepth + 120; // = motor support depth + bearings depth + head depth /2
    _globalWidth = _printableWidth + 120; // = motor uspport width + bearings width + head width /2
    _globalHeight = _printableHeight + 100; // bottom = 40mm head = 40 mm + extra loose.

    XrodLength = _globalWidth - 2*(40 + 3); // 40: slideY width , 3: offset slideY from wall.
    YrodLength = _globalDepth - (_nemaXYZ -5) - (_bearingsDepth -5); // 5: rod support inside parts.
    ZrodLength = _globalHeight -40;


    echo("wood depth="+_globalDepth + " width="+_globalWidth+" height:"+_globalHeight);
    echo("X rod length="+XrodLength + " Y rod length="+YrodLength+" Zrodlength="+ZrodLength);
    // calculate some usefull s
     ztopbottomX = (_ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2))/2;
     zslideX = (_ZrodsWidth+_ZlmDiam+(_rodsSupportThickness*2))/2;
*/
// -----------------  printed elements 

assembly();
//zBottom();

module zTop(){
     width = _ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2);
     height = 12;
     depth = 22;
     insideWidth = 60;

    if(output==1){
        union(){
            rotate([90,0,0])
            translate([3,0,0])
            bearing608z();
        };
    }
    union(){
        difference(){
            //main
            cube([width,depth,height],center=true);
            // inside form
            translate([0,-5,0])
            cube([insideWidth,depth,height],center=true);
            //screw left
            rotate([90,90,0])
            translate([-(insideWidth)/2+4,20,0])
            slottedHole(4,8,depth);
            //screw right
		rotate([90,90,0])
		translate([(insideWidth)/2-9,20,0])
            slottedHole(4,8,depth);
            // z rod left
		translate([-_ZrodsWidth/2,-2,-height/2])
            cylinder(r= _ZrodsDiam/2,h=height,fn=_globalResolution);
            //z rod right
		translate([_ZrodsWidth/2,-2,-height/2])
            cylinder(r=_ZrodsDiam/2,h=height,fn=_globalResolution);
            // chamfer
		rotate([90,0,0])
		translate([-(insideWidth)/2-5,-7,-height/2])
            roundBoolean(10,10,20,height,"bl");
		rotate([90,0,-90])
		translate([(insideWidth)/2+5,-7,-height/2])
            roundBoolean(10,10,20,height,"bl");

        };
		rotate([90,0,0])
		translate([3,6,0])
        bearingSupport(7);
    };
}

module zBottom(){
     width = _ZrodsWidth+_ZrodsDiam+(_rodsSupportThickness*2);
     height = 10;
     depth = 22;
     attachdiam = 12;
    difference(){
        //main
        union(){
            cube([width,depth,height],center=true);
            translate([0,-10,0])
            cube([width/2,depth,10],center=true);
            // screws attach form right
		rotate([-90,0,0])
		translate([width/4+attachdiam/2,depth/2-5,height])
            cylinder(r=attachdiam/2,h=5,fn=_globalResolution);
		translate([width/4+attachdiam/2,depth/2-2.5,height-attachdiam/2])
            cube([attachdiam,5,attachdiam],center=true);
            // screws attach form left
		rotate([-90,0,0])
		translate([-width/4-attachdiam/2,depth/2-5,height])
            cylinder(r=attachdiam/2,h=5,fn=_globalResolution);
		translate([-width/4-attachdiam/2,depth/2-2.5,height-attachdiam/2])
            cube([attachdiam,5,attachdiam],center=true);
            
	};
        // inside form
	rotate([90,0,0])
	translate([0,0,_nemaXYZ/2-height/2])
        nemaHole(_nemaXYZ);
	translate([0,10,0])
        cube([width/2,depth,height],center=true);
        // z rod left
	translate([-_ZrodsWidth/2,-2,-height/2])
        cylinder(r=_ZrodsDiam/2,h=height,fn=_globalResolution);
        //z rod right
	translate([_ZrodsWidth/2,-2,-height/2])
        cylinder(r=_ZrodsDiam/2,h=height,fn=_globalResolution);
        //screw holes
        // screws attach form
	rotate([-90,0,0])
	translate([width/4+attachdiam/2,depth/2-5,height])
        cylinder(r=2,h=5,fn=_globalResolution);
	rotate([-90,0,0])
	translate([-width/4-attachdiam/2,depth/2-5,height])
        cylinder(r=2,h=5,fn=_globalResolution);
        
};
}

module slideZ(){
     width = _ZrodsWidth-5;
     height = 50;
     depth = 5;
     insideWidth = 35;
    difference(){
        //main form
        union(){
            cube([width,depth,height]);
		rotate([90,0,0])
        translate([width/2-10,1,height-13])
            Gt2Holder2();
        
            // lm8uu holes
            translate([0,0,0])
            cylinder(r=_ZlmDiam/2+3,h=height,fn=_globalResolution);
            translate([_ZrodsWidth,0,0])
            cylinder(r=_ZlmDiam/2+3,h=height,fn=_globalResolution);

            // side forms for lm8 attach
            translate([_ZrodsWidth+7,-4,0])
            cube([10,10,height]);
            translate([-17,-4,0])
            cube([10,10,height]);

            // extra forms front bearings holes
            translate([-5,-75,0])
            cube([10,80,height]);
            translate([_ZrodsWidth-5,-75,0])
            cube([10,80,height]);
            
        };
        // big hole middle
        rotate([90,0,0])
        translate([width/2+15,40,height/2+10])
        cylinder(r=10,h=50,fn=_globalResolution);
        rotate([90,0,0])
        translate([width/2-10,40,height/2-10])
        cylinder(r=10,h=50,fn=_globalResolution);
        //  boolean front horizontal
        rotate([0,90,0])
        translate([-20,-80,-35])
        cylinder(r=80,h=width+40,fn=_globalResolution);
        rotate([0,90,0])
        translate([-20,-15,height-10])
        cylinder(r=5,h=width+40,fn=_globalResolution);
        rotate([0,90,0])
        translate([-20,-35,height-13])
        cylinder(r=3,h=width+40,fn=_globalResolution);
        // z rod left linear bearing lm
        cylinder(r=_ZlmDiam/2,h=height,fn=_globalResolution);
        //z rod right linear bearing lm
        translate([_ZrodsWidth,0,0])
        cylinder(r=_ZlmDiam/2,h=height,fn=_globalResolution);
        // side holes for lm8 attach
        translate([_ZrodsWidth+5,0,0])
        cube([12,2,height]);
        translate([-18,0,0])
        cube([12,2,height]);
        // side holes for lm8 screws
        rotate([90,0,0])
        translate([_ZrodsWidth+12,20,height-10])
        cylinder(r=1.4,h=30,fn=_globalResolution);
        rotate([90,0,0])
        translate([_ZrodsWidth+12,20,10])
        cylinder(r=1.4,h=30,fn=_globalResolution);
        rotate([90,0,0])
        translate([-12,20,height-10])
        cylinder(r=1.4,h=30,fn=_globalResolution);
        rotate([90,0,0])
        translate([-12,20,10])
        cylinder(r=1.4,h=30,fn=_globalResolution);
        //bottom holes

        //cylinder(r=2.4,h=10,fn=_globalResolution).rotateX(83).rotateZ(5).translate([0,-7,10]);
        //cylinder(r=2.4,h=10,fn=_globalResolution).rotateX(83).rotateZ(-5).translate([_ZrodsWidth,-7,10]);
        // top holes
        translate([0,-20,height-30])
        cylinder(r=1.4,h=30,fn=_globalResolution);
        translate([_ZrodsWidth,-20,height-30])
        cylinder(r=1.4,h=30,fn=_globalResolution);
        translate([0,-65,height-30])
        cylinder(r=1.4,h=30,fn=_globalResolution);
        translate([_ZrodsWidth,-65,height-30])
        cylinder(r=1.4,h=30,fn=_globalResolution);
        // special hole in gt2 holder to be able to get the belt out .. but still printable vertically.
        rotate([0,-90,0])
        translate([width/2+5,-10,height-15])
        linear_extrude(height=20,polygon([[0,0],[6,0],[4,10],[2,10]]));

        
    };
}


module slideZBearingsSupport(){
     width=10;
     height = 50;
     depth = 25;
    difference(){
        cube([width,depth,height]);
        // lmuu for Z hole
        translate([-1.1,depth-_ZlmDiam/2-5,0])
        cylinder(r=_ZlmDiam/2,h=height,fn=_globalResolution);
        // screws holes for lmxuu support
        rotate([0,90,0])
        translate([-1,depth-3.4,height-5])
        cylinder(r=1.6,h=width+5,fn=_globalResolution);
        rotate([0,90,0])
        translate([-1,depth-3.4,5])
        cylinder(r=1.6,h=width+5,fn=_globalResolution);
        rotate([0,90,0])
        translate([-1,depth-_ZlmDiam-6.8,height-5])
        cylinder(r=1.6,h=width+5,fn=_globalResolution);
        rotate([0,90,0])
        translate([-1,depth-_ZlmDiam-6.8,5])
        cylinder(r=1.6,h=width+5,fn=_globalResolution);

    };
}

module slideZBeltAttach(){
     width=5;
     height = 50;
     depth = 15;
    difference(){
        union(){
            cube([width,depth,height]);
            translate([width,5,15])
            cube([20,10,20]);
        };
        rotate([90,90,0])
        translate([20,15,35])
        Gt2HolderBool(0,10);
        rotate([90,90,0])
        translate([20,15,24])
        Gt2HolderBool(0,10);
        // screws holes for lmxuu support
        rotate([0,90,0])
        translate([-1,3.4,height-5])
        cylinder(r=1.6,h=width+5,fn=_globalResolution);
        rotate([0,90,0])
        translate([-1,3.4,5])
        cylinder(r=1.6,h=width+5,fn=_globalResolution);
    };
}


module slideY(side){
     width = 45;
     height = (_XYlmDiam/2)+(2*_rodsSupportThickness)+3;
     depth = _XrodsWidth+(_XYrodsDiam)+(_rodsSupportThickness*2);
     
     heightSecondBearing = (side=="right")? 9: 2;
     offsetHeightXrods = 3;
	
    
    difference(){
        union(){
            translate([32,depth/2-15,height+1])
            bearing608z();
            translate([32,depth/2+15,height+heightSecondBearing])
            bearing608z();
            // bearing hat
            translate([32,depth/2-15,height+7])
            bearingTop(3);
            translate([32,depth/2+15,height+heightSecondBearing+7])
            bearingTop(3);
            // main
            cube([width,depth,height]);
            // extra for bearing support
            translate([32,depth/2-15,height])
            bearingSupport(2);
            translate([32,depth/2+15,height])
            bearingSupport(heightSecondBearing);
            
        };
        // rod x front
        rotate([0,90,0])
        translate([width-15,_rodsSupportThickness+_XYrodsDiam/2,height/2+offsetHeightXrods])
        cylinder(r=_XYrodsDiam/2,h=15,fn=_globalResolution);
        // rod x back
        rotate([0,90,0])
        translate([width-15,depth-_rodsSupportThickness-_XYrodsDiam/2,height/2+offsetHeightXrods])
        cylinder(r=_XYrodsDiam/2,h=15,fn=_globalResolution);
         // rods fixation holes under
         translate([width-5,_rodsSupportThickness+_XYrodsDiam/2,0])
         cylinder(r=1.4,h=10,fn=_globalResolution);
         translate([width-5,depth-_rodsSupportThickness-_XYrodsDiam/2,0])
         cylinder(r=1.4,h=10,fn=_globalResolution);
        // bearing support
        rotate([-90,0,0])
        translate([12,-1,_XYlmDiam/2+_rodsSupportThickness+3])
        cylinder(r=_XYlmDiam/2,h=depth+1,fn=_globalResolution);
        //hole  between rods - to gain weight and print time
        translate([width,depth/2,0])
        cylinder(r=10,h=height,fn=_globalResolution);
        // endstop x hole
        rotate([-90,0,0])
        translate([width-4,depth-10,5])
        cylinder(r=1.4,h=10,fn=_globalResolution);
        //extra holes through all for bearing supports
        translate([32,depth/2-15,0])
        cylinder(r=1.4,h=height,fn=_globalResolution);
        translate([32,depth/2+15,0])
        cylinder(r=1.4,h=height,fn=_globalResolution);

    };
}

module head(){
     width = 53;
     height = (_XYlmDiam/2)+(2*_rodsSupportThickness)+2;
     depth = _XrodsWidth+(_XYlmDiam)+(_rodsSupportThickness*4);
     extDiam=15.1;
     intDiam=12.1;
     intDiamHeight=5;
     jheadsupportheight = 25;
    difference(){
        union(){
        //main
        cube([width,depth,height]);
        //gt2 holders 
        translate([0,depth/2+3,height])
        Gt2Holder(3);
        translate([0,depth/2-11,height])
        Gt2Holder(3);
        translate([width-16,depth/2+3,height])
        Gt2Holder3(3,16);
        translate([width-10,depth/2-11,height])
        Gt2Holder(3);
        
        };
        // x bearing front
        rotate([0,90,0])
        translate([0,_XYlmDiam/2+(_rodsSupportThickness*2),_XYlmDiam/2+_rodsSupportThickness+1])
        cylinder(r=_XYlmDiam/2,h=width,fn=_globalResolution);
        // x bearing back
        rotate([0,90,0])
        translate([0,_XYlmDiam/2+(_rodsSupportThickness*2)+_XrodsWidth,_XYlmDiam/2+_rodsSupportThickness+1])
        cylinder(r=_XYlmDiam/2,h=width,fn=_globalResolution);
        // tooling hole
        translate([width/2,depth/2,0])
        cylinder(r=9.1,h=30,fn=_globalResolution);
        // jhead holes behind
        translate([width/2,depth+2,0])
         cylinder(r=extDiam/2+0.6,h=height+jheadsupportheight-10,fn=_globalResolution);
                 
         // jhead attach holes 
         translate([width/2-endxJheadAttachHolesWidth/2,depth-5,0])
         cylinder(r=1.4,h=30,fn=_globalResolution);
         translate([width/2+endxJheadAttachHolesWidth/2,depth-5,0])
         cylinder(r=1.4,h=30,fn=_globalResolution);
    };
}

module HeadSupportJhead(){
     width = 40;
     height = 15;
     depth = 8;
     extDiam=15.1;
     intDiam=12.1;
     intDiamHeight=5;
    difference(){
        union(){
            //base
            cube([width,depth,5]);
            // middle
            translate([width/4,0,5])
            cube([width/2,depth,height-7]);
            // top
            translate([0,0,height-8])
            cube([width,depth,8]);
        };
        // jhead holes 
        translate([width/2,depth+1,0])
         cylinder(r=extDiam/2+0.1,h=height-5,fn=_globalResolution);
         translate([width/2,depth+1,height-5])
         cylinder(r=intDiam/2+0.1,h=intDiamHeight,fn=_globalResolution);
         // jhead attach holes 
         rotate([-90,0,0])
         translate([width/2-endxJheadAttachHolesWidth/2,0,height-4])
         cylinder(r=1.3,h=30,fn=_globalResolution);
         rotate([-90,0,0])
         translate([width/2+endxJheadAttachHolesWidth/2,0,height-4])
         cylinder(r=1.3,h=30,fn=_globalResolution);
         // head attach holes 
         translate([width/2-endxJheadAttachHolesWidth/2,depth/2,0])
         cylinder(r=1.3,h=8,fn=_globalResolution);
         translate([width/2+endxJheadAttachHolesWidth/2,depth/2,0])
         cylinder(r=1.3,h=8,fn=_globalResolution);

};
}

module HeadheadAttach(){
     extDiam=16;
     intDiam=12;
     intDiamHeight=5;
     depth = 12;
     width = 75;
     barHeight = 6;

    difference(){
        union(){
            translate([width/2-((endxJheadAttachHolesWidth-5)/2),-10,barHeight])
            cube([endxJheadAttachHolesWidth-5,8,8]);
            rotate([-90,0,0])
            translate([width/2-endxJheadAttachHolesWidth/2,-10,barHeight+4])
            tube(3.2,10,8);
            rotate([-90,0,0])
            translate([width/2+endxJheadAttachHolesWidth/2,-10,barHeight+4])
            tube(3.2,10,8);
        };
        translate([width/2,0,0])
         cylinder(r=extDiam/2,h=10,fn=_globalResolution);
         translate([width/2,0,10])
         cylinder(r=intDiam/2,h=intDiamHeight,fn=_globalResolution);
    };  
    }

module InductiveSensorSupport(){
     width = 40;
     height = 7;
     depth = 8;
     extDiam=15.1;
     intDiam=12.1;
     intDiamHeight=5;
    difference(){
        union(){
            //base
            translate([width/2,0,0])
            cube([width/2+10,depth,height]);
            // extra join for cylinder
            rotate([0,0,45])
            translate([width+10,0,0])
            cube([20,10,height]);
            rotate([0,0,45])
            translate([width+3,0,0])
            cube([20,10,height]);
            // inductive support
            translate([width+16,depth+8,0])
            cylinder(r=13,h=height,fn=_globalResolution);
        };

         // head attach holes 
         translate([25,depth/2,0])
         cylinder(r=1.3,h=8,fn=_globalResolution);

         // inductive support hole
         translate([width+16,depth+8,0])
         cylinder(r=9,h=height,fn=_globalResolution);
         // hole screw to attach the sensor faster
         rotate([-90,0,0])
         translate([55,20,height/2])
         cylinder(r=1.3,h=10,fn=_globalResolution);

    };
}

module motorXY(){
     thickness = 5;
    difference(){
    union(){
        // base
        cube([_nemaXYZ/2+5,_nemaXYZ,thickness]);
        // wall support
        cube([9,_nemaXYZ,20]);
        // rod support - half slotted hole
        rotate([90,0,0])
        translate([15,_nemaXYZ,thickness+3])
        cylinder(r=_XYrodsDiam/2+2.5,h=15,fn=_globalResolution);


    };
    translate([_nemaXYZ/2,_nemaXYZ/2,0])
    nemaHole(_nemaXYZ);
    // rod support hole
    rotate([90,0,0])
    translate([15,_nemaXYZ,thickness+3])
    cylinder(r=_XYrodsDiam/2,h=5,fn=_globalResolution);
    // slotted holes to fix on the wood side - version simple
    rotate([-90,0,90])
    translate([9,10,15])
    slottedHole(3.2,8,10);
    rotate([-90,0,90])
    slottedHole(3.2,8,13);
    };
}

module motorXYSupport(){
     thickness = 5;
    difference(){
    union(){
        // base
        //top and back fix
        translate([-_wallThickness,0,20])
        cube([_wallThickness+9,_nemaXYZ,thickness]);
        translate([-_wallThickness-thickness,0,10])
        cube([thickness,_nemaXYZ,10+thickness]);

    };
    translate([_nemaXYZ/2,_nemaXYZ/2,0])
    nemaHole(_nemaXYZ);
    rotate([0,90,0])
    translate([-_wallThickness-thickness,10,15])
    cylinder(r=1.6,h=10,fn=_globalResolution);
    rotate([0,90,0])
    translate([-_wallThickness-thickness,_nemaXYZ-10,15])
    cylinder(r=1.6,h=10,fn=_globalResolution);
    };
}




module bearingsXY(){
    width = 42;
     thickness = 5;

    difference(){
        union(){
            //low bearing
            translate([35,10,thickness+6])
            bearing608z();
            // middle hat
            translate([35,10,thickness+13])
            bearingMiddle(8);
            // high bearing
            translate([35,10,thickness+16])
            bearing608z();
            // hat
            translate([35,10,thickness+23])
            bearingTop(3);
            //base
            translate([0,0,3])
            cube([width,_bearingsDepth,thickness]);
           
            //wall support
            translate([0,0,3])
            cube([thickness,_bearingsDepth,17]);
            translate([0,_bearingsDepth-thickness,3])
            cube([30,thickness,17]);
            translate([35,10,thickness+2])
            bearingSupport2(4);
            
            difference(){
            // rod support -
            rotate([90,0,0])
            translate([15,13,thickness+4])
            cylinder(r=_XYrodsDiam/2+2.5,h=13);
            // back round 
            rotate([0,90,0])
            translate([7,18,16])
            cylinder(r=9,h=30);
            
            }
        };

         // screw holes top
         translate([thickness/2,5,0])
        cylinder(r=1.6,h=30,fn=_globalResolution);
        translate([thickness/2,_bearingsDepth-5,0])
        cylinder(r=1.6,h=30,fn=_globalResolution);
        // slotted holes to fix on the wood side
        rotate([-90,0,90])
        translate([9,20,15])
        slottedHole(3.2,8,10);
        rotate([-90,0,0])
        translate([22,_bearingsDepth-7,15])
        slottedHole(3.2,8,10);

        // rod support hole
        rotate([90,0,0])
        translate([15,5,thickness+3])
        cylinder(r=_XYrodsDiam/2,h=5,fn=_globalResolution);
    };
}



module bearingsXYSupport(){
    width = 42;
     thickness = 5;
    
    difference(){
        union(){
            //top and back fix
            translate([-_wallThickness,0,20])
            cube([_wallThickness+thickness,_bearingsDepth,thickness]);
            translate([-_wallThickness-thickness,0,10])
            cube([thickness,_bearingsDepth,10+thickness]);
            };
        // screw holes back
        rotate([0,90,0])
        translate([-_wallThickness-thickness,5,15])
        cylinder(r=2,h=10,fn=_globalResolution);
        rotate([0,90,0])
        translate([-_wallThickness-thickness,_bearingsDepth-5,15])
        cylinder(r=2,h=10,fn=_globalResolution);
        // screw holes top
        translate([thickness/2,5,0])
        cylinder(r=1.6,h=30,fn=_globalResolution);
        translate([thickness/2,_bearingsDepth-5,0])
        cylinder(r=1.6,h=30,fn=_globalResolution);
        
    };
}


module extruder(bowden){
     X = 50;
     Z = 9;
     Y = 60; 
     bearingoffsetX = 16.8;
    
     jheadOffsetX = 5;
    //elastic part
     epoffsetX = 3;
     epoffsetY = 45;
    // this is to adjust how elastic will the bearing be.
     elasticpartlength = 13;
    difference(){
        union(){
            //main bottom
            translate([0,5,0])
            cube([X,Y,Z],center=true);
            // main top
            translate([0,5,Z+0.05])
            cube([X,Y,Z],center=true);
        
           
        };
        translate([0,0,-Z/2])
        nemaHole2();
        
        // 608 place 
        difference(){
            translate([bearingoffsetX,0,0])
            cylinder(r=12,h=9,fn=_globalResolution);
            translate([bearingoffsetX,0,0])
            cylinder(r=4,h=9,fn=_globalResolution);
            translate([bearingoffsetX,0,0])
            cylinder(r=5,h=1,fn=_globalResolution);
            translate([bearingoffsetX,0,8])
            cylinder(r=5,h=1,fn=_globalResolution);
        };
        // 608 screw hole to reinforce
        translate([bearingoffsetX,0,Z/2])
        cylinder(r=1.6,h=10,fn=_globalResolution);
        translate([bearingoffsetX,0,-Z/2])
        cylinder(r=1.3,h=10,fn=_globalResolution);
        // jhead or pressfit
        extruderOut(bowden,jheadOffsetX,Y,Z);
         
         // jhead holes : 2 parts. up to pass screws, bottom to fix
         translate([jheadOffsetX-15,Y/2-5,Z/2])
         cylinder(r=1.6,h=10,fn=_globalResolution);
         translate([jheadOffsetX+15,Y/2-5,Z/2])
         cylinder(r=1.6,h=10,fn=_globalResolution);
         translate([jheadOffsetX-15,Y/2-5,-Z/2])
         cylinder(r=1.3,h=10,fn=_globalResolution);
         translate([jheadOffsetX+15,Y/2-5,-Z/2])
         cylinder(r=1.3,h=10,fn=_globalResolution);
         
        // filament
        extruderFilament(bowden,jheadOffsetX,Y,Z);

        
        // elastic part with two holes
        translate([jheadOffsetX+epoffsetX,-Y/2,-Z/2])
        cube([2,epoffsetY,2*Z+1]);
        translate([jheadOffsetX+epoffsetX,-Y/2+epoffsetY,-Z/2])
        cube([elasticpartlength,2,2*Z+1]);
        
        // attach holes
        rotate([-90,0,0])
        translate([jheadOffsetX+15,Y/2-3,0])
         cylinder(r=1.3,h=10,fn=_globalResolution);
         rotate([-90,0,0])
         translate([jheadOffsetX-15,Y/2-3,0])
         cylinder(r=1.3,h=10,fn=_globalResolution);


            // material win holes
            rotate([-90,0,0])
            translate([-X/2-3,-Y/2+2,Z*2-2])
        roundBoolean(15,10,22,10,"tr");
        //rotate([-90,0,0])
        //translate([-X/2-3,Y/2-2,Z*2-2])
        //roundBoolean(15,10,22,10,"br");
        rotate([-90,0,0])
        translate([X/2-7,-Y/2+2,Z*2-2])
        roundBoolean(15,10,22,10,"tl");
        //rotate([-90,0,0])
        //translate([X/2-7,Y/2-2,Z*2-2])
        //roundBoolean(15,10,22,10,"bl");
       
    };

}

module extruderOut(bowden,jheadOffsetX,Y,Z){
     jheadExtDiam = 15.5;
     jheadIntDiam = 12.5;
    if(bowden==0){
        union(){
            rotate([-90,0,0])
            translate([jheadOffsetX,Y/2,Z/2])
        cylinder(r=jheadExtDiam/2,h=6,fn=_globalResolution);
        rotate([-90,0,0])
        translate([jheadOffsetX,Y/2-4,Z/2])
        cylinder(r=jheadIntDiam/2,h=4,fn=_globalResolution);
        rotate([-90,0,0])
        translate([jheadOffsetX,Y/2-9.5,Z/2])
        cylinder(r=jheadExtDiam/2,h=5.5,fn=_globalResolution);
        };
    }
    else if(bowden==1){
        rotate([-90,0,0])
        translate([jheadOffsetX,Y/2,Z/2])
        cylinder(r=2.7,h=5,fn=_globalResolution);
    }

}

module extruderFilament(bowden,jheadOffsetX,Y,Z){
if(bowden==0){
        union(){
            rotate([-90,0,0])
            translate([jheadOffsetX,-Y/2,Z/2])
        cylinder(r=1,h=Y,fn=_globalResolution);
        rotate([-90,0,0])
        translate([jheadOffsetX,8,Z/2])
        cylinder(r1=3,r2=1,h=5,fn=_globalResolution);
            rotate([-90,0,0])
            translate([jheadOffsetX,19,Z/2])
        cylinder(r=1.5,h=3,fn=_globalResolution);
        };
    }
    else if(bowden==1){
        union(){
            rotate([-90,0,0])
            translate([jheadOffsetX,-Y/2,Z/2])
        cylinder(r=1,h=Y,fn=_globalResolution);
            rotate([-90,0,0])
            translate([jheadOffsetX,8,Z/2])
        cylinder(r1=3,r2=1,h=5,fn=_globalResolution);
        };
    }
}



//  ----------   non printed elements ------------

module _walls(){
    union(){
        //left 
        translate([-_globalWidth/2,-_globalDepth/2,0])
        cube([_wallThickness,_globalDepth+_wallThickness,_globalHeight]);
        // back
        translate([-_globalWidth/2+_wallThickness,_globalDepth/2,0])
        cube([_globalWidth-_wallThickness*2,_wallThickness,_globalHeight]);
        // right
        translate([_globalWidth/2-_wallThickness,-_globalDepth/2,0])
        cube([_wallThickness,_globalDepth+_wallThickness,_globalHeight]);
        // bottom
        translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,0])
        cube([_globalWidth-_wallThickness*2,_globalDepth,_wallThickness]);
        };
}

module _rods(){
     offsetFromTopY = 12;
     offsetFromTopX = 12;
    union(){
        // rod X front
        rotate([0,90,0])
        translate([-_globalWidth/2+30,XaxisOffset,_globalHeight-offsetFromTopX])
        cylinder(r=_XYrodsDiam/2,h=XrodLength,fn=_globalResolution);
        // rod x front bearing
        rotate([0,90,0])
        translate([-25,XaxisOffset,_globalHeight-offsetFromTopX])
        cylinder(r=_XYlmDiam/2,h=50,fn=_globalResolution);
        // rod x back
        rotate([0,90,0])
        translate([-_globalWidth/2+30,_XrodsWidth+XaxisOffset,_globalHeight-offsetFromTopX])
        cylinder(r=_XYrodsDiam/2,h=XrodLength,fn=_globalResolution);
        // rod y left
        rotate([90,0,0])
        translate([-_globalWidth/2+_wallThickness+15,_globalDepth/2-_bearingsDepth+5,_globalHeight-offsetFromTopY])
        cylinder(r=_XYrodsDiam/2,h=YrodLength,fn=_globalResolution);
        // rod y left bearing
        rotate([90,0,0])
        translate([-_globalWidth/2+_wallThickness+15,0,_globalHeight-offsetFromTopY])
        cylinder(r=_XYlmDiam/2,h=50,fn=_globalResolution);
        // rod y right
        rotate([90,0,0])
        translate([_globalWidth/2-_wallThickness-15,_globalDepth/2-_bearingsDepth+5,_globalHeight-offsetFromTopY])
        cylinder(r=_XYrodsDiam/2,h=YrodLength,fn=_globalResolution);
        //rod Z left
        translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,10])
        cylinder(r=_ZrodsDiam/2,h=ZrodLength,fn=_globalResolution);
        //rod Z left bearing
        translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,_globalHeight/2-40])
        cylinder(r=_ZlmDiam/2,h=50,fn=_globalResolution);
        // rod z right
        translate([_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,10])
        cylinder(r=_ZrodsDiam/2,h=ZrodLength,fn=_globalResolution);
        // rod z right bearing
        translate([_ZrodsWidth/2,_globalDepth/2-_wallThickness-2,_globalHeight/2-40])
        cylinder(r=_ZlmDiam/2,h=50,fn=_globalResolution);
    };
}


module _nema(){
    union(){
        cube(_nemaXYZ);
        translate([_nemaXYZ/2,_nemaXYZ/2,_nemaXYZ])
        cylinder(r=11,h=2,fn=_globalResolution);
        translate([_nemaXYZ/2,_nemaXYZ/2,_nemaXYZ+2])
        cylinder(r=2.5,h=25,fn=_globalResolution);
    };
}

module _bed(){
    difference(){
        cube([_printableWidth,_printableDepth,3]);
        // holes in bed support
        translate([40,40,0])
        cylinder(r=20,h=10,fn=_globalResolution);
        translate([_printableWidth/2,40,0])
        cylinder(r=20,h=10,fn=_globalResolution);
        translate([_printableWidth-40,40,0])
        cylinder(r=20,h=10,fn=_globalResolution);
        translate([40,_printableDepth-40,0])
        cylinder(r=20,h=10,fn=_globalResolution);
        translate([_printableWidth/2,_printableDepth-40,0])
        cylinder(r=20,h=10,fn=_globalResolution)
        translate([_printableWidth-40,_printableDepth-40,0])
        cylinder(r=20,h=10,fn=_globalResolution);

    };
}



// -----------------------  lib

module tube(dint,dext,length){
    difference(){
            cylinder(r=dext/2,h=length,fn=_globalResolution);
            cylinder(r=dint/2,h=length,fn=_globalResolution);
        };
}

module _axis(){
    union(){
        cube([10,1,1]);
        cube([1,10,1]);
        cube([1,1,10]);
        };
}

module nemaHole(){
     offset = (_nemaXYZ==35)?13:15.5;
        union(){

            cylinder(r=11.3,h=40,fn=_globalResolution);
            translate([-offset,-offset,0])
            cylinder(r=1.6,h=40,fn=_globalResolution);
            translate([offset,-offset,0])
            cylinder(r=1.6,h=40,fn=_globalResolution);
            translate([-offset,offset,0])
            cylinder(r=1.6,h=40,fn=_globalResolution)
            translate([offset,offset,0])
            cylinder(r=1.6,h=40,fn=_globalResolution);
        };
}

// only 2 screw holes
module nemaHole2(){
     offset = (_nemaXYZ==35)?13:15.5;
        union(){
            cylinder(r=11.3,h=40,fn=_globalResolution);
            translate([-offset,-offset,0])
            cylinder(r=1.6,h=40,fn=_globalResolution);
            translate([-offset,offset,0])
            cylinder(r=1.6,h=40,fn=_globalResolution);
       };
}

module slottedHole(diam,length,height){
    union(){
        cylinder(r=diam/2,h=height,fn=_globalResolution);
        translate([-diam/2,0,0])
        cube([diam,length-diam,height]);
        translate([0,length-diam,0])
        cylinder(r=diam/2,h=height,fn=_globalResolution);
    };
}

module bearingSupport(baseHeight){
    difference(){
        union(){
            cylinder(r=5,h=baseHeight,fn=_globalResolution);
            translate([0,0,baseHeight])
            cylinder(r=4,h=6,fn=_globalResolution);
        };
        cylinder(r=1.4,h=baseHeight+7,fn=_globalResolution);
    };
}

module bearingSupport2(baseHeight){
    difference(){
        union(){
            cylinder(r=5,h=baseHeight,fn=_globalResolution);
            translate([0,0,baseHeight])
            cylinder(r=4,h=16,fn=_globalResolution);
        };
        cylinder(r=1.4,h=baseHeight+16,fn=_globalResolution);
    };
}

module bearingTop(hole){
    difference(){
        union(){
            cylinder(r=5,h=1,fn=_globalResolution);
            translate([0,0,1])
            cylinder(r=13,h=1,fn=_globalResolution);
        };
        cylinder(r=hole/2+0.1,h=6,fn=_globalResolution);
    };
}

module bearingMiddle(hole){
    difference(){
        union(){
            cylinder(r=5,h=1,fn=_globalResolution);
                translate([0,0,1])
            cylinder(r=13,h=1,fn=_globalResolution);
        };
        cylinder(r=hole/2+0.1,h=6,fn=_globalResolution);
    };
}

module bearing608z(){
    difference(){
        cylinder(r=11,h=7,fn=_globalResolution);
        cylinder(r=4,h=7,fn=_globalResolution);
    };
}

module Gt2Holder(boolOffset,height){
     h = 10;
     beltThickness = 0.9;
    difference(){
	    rotate([90,-90,0])
	    translate([-12,0,-h])
        linear_extrude(height=10,polygon([[0,0],[16,0],[12,h],[4,h]]));
        union(){
            translate([h-10,boolOffset,3]);
            cube([10,1,h-3]);
            translate([h-9,boolOffset+beltThickness,3])
            cube([1,1,h-3]);
            translate([h-7,boolOffset+beltThickness,3])
            cube([1,1,h-3]);
            translate([h-5,boolOffset+beltThickness,3])
            cube([1,1,h-3]);
            translate([h-3,boolOffset+beltThickness,3])
            cube([1,1,h-3]);
            translate([h-1,boolOffset+beltThickness,3])
            cube([1,1,h-3]);

        };
    };
}

module Gt2HolderBool(boolOffset,height){
     h = 10;
     beltThickness = 0.9;
    union(){
        translate([h-10,boolOffset,3])
            cube([10,1,h-3]);
            translate([h-9,boolOffset+beltThickness,3])
            cube([1,1,h-3]);
            translate([h-7,boolOffset+beltThickness,3])
            cube([1,1,h-3]);
            translate([h-5,boolOffset+beltThickness,3])
            cube([1,1,h-3]);
            translate([h-3,boolOffset+beltThickness,3])
            cube([1,1,h-3]);
            translate([h-1,boolOffset+beltThickness,3])
            cube([1,1,h-3]);
    };
}

module Gt2Holder3(boolOffset,height){
     h = 10;
    difference(){
	    rotate([90,-90,0])
	    translate([-12,0,-h])
        linear_extrude(height=10,polygon([[0,0],[16,0],[12,h],[4,h]]));
        union(){
            translate([h-10,boolOffset,6])
            cube([10,1,h-3]);
            translate([h-9,boolOffset+1,6])
            cube([1,1,h-3]);
            translate([h-7,boolOffset+1,6])
            cube([1,1,h-3]);
            translate([h-5,boolOffset+1,6])
            cube([1,1,h-3]);
            translate([h-3,boolOffset+1,6])
            cube([1,1,h-3]);
            translate([h-1,boolOffset+1,6])
            cube([1,1,h-3]);

        }
    }
}
module Gt2Holder2(){
     beltThickness = 0.9;
    difference(){
	rotate([90,-90,0])
	translate([-12,0,-10])
        linear_extrude(height=23,polygon([[0,0],[16,0],[12,10],[4,10]]));
        union(){
            translate([-13,3,3])
            cube([23,1,7]);
            translate([-11,3+beltThickness,3])
            cube([1,1,7]);
            translate([-9,3+beltThickness,3])
            cube([1,1,7]);
            translate([-7,3+beltThickness,3])
            cube([1,1,7]);
            translate([-5,3+beltThickness,3])
            cube([1,1,7]);
            translate([-3,3+beltThickness,3])
            cube([1,1,7]);
            translate([-1,3+beltThickness,3])
            cube([1,1,7]);
            translate([1,3+beltThickness,3])
            cube([1,1,7]);
            translate([3,3+beltThickness,3])
            cube([1,1,7]);
            translate([5,3+beltThickness,3])
            cube([1,1,7]);
            translate([7,3+beltThickness,3])
            cube([1,1,7]);
            translate([9,3+beltThickness,3])
            cube([1,1,7]);
            translate([11,3+beltThickness,3])
            cube([1,1,7]);

        }
    }
}

module endstop_meca(){
    difference(){
        cube([40,15,7]);
        translate([2.5,2.5,0])
        cylinder(r=1.5,h=8,fn=_globalResolution);
        translate([2.5+14,2.5,0])
        cylinder(r=1.5,h=8,fn=_globalResolution);
        translate([40-2.5,2.5,0])
        cylinder(r=1.5,h=8,fn=_globalResolution);

    };
}

module roundBoolean(diam,w,d,h,edge){
    
    difference(){
        cube([w,d,h]);
        if(edge=="bl"){translate([0,0,0]) cylinder(r=diam/2,h=d,fn=_globalResolution);}
	if(edge=="tl"){rotate([-90,0,0]) translate([0,0,h]) cylinder(r=diam/2,h=d,fn=_globalResolution);}
	if(edge=="br"){rotate([-90,0,0]) translate([w,0,0]) cylinder(r=diam/2,h=d,fn=_globalResolution);}
	if(edge=="tr"){rotate([-90,0,0]) translate([w,0,h]) cylinder(r=diam/2,h=d,fn=_globalResolution);}
    };
}

// -----------------------  start here 

module assembly(params){

            _walls();
            _rods();
          
            //nema left
            translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-_nemaXYZ-20])
            _nema();
            // nema right
            translate([_globalWidth/2-+_wallThickness-_nemaXYZ,-_globalDepth/2,_globalHeight-_nemaXYZ-20])
            _nema();
            translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-20])
            motorXY();
            mirror([1,0,0])
            translate([_globalWidth/2-_wallThickness,-_globalDepth/2,_globalHeight-20])
            motorXY();
            translate([-_globalWidth/2+_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20])
            bearingsXY();
            mirror([1,0,0])
            translate([_globalWidth/2-_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-18])
            bearingsXY();
            translate([-_globalWidth/2+_wallThickness+3,-_rodsSupportThickness-_XYrodsDiam/2+XaxisOffset,_globalHeight-22])
            slideY();
            //endstop x
            rotate([-90,0,90])
            translate([-_globalWidth/2+_wallThickness+42,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset+55,_globalHeight-10])
            endstop_meca();
            //endstop y
            translate([_globalWidth/2-_wallThickness-_nemaXYZ-20,-_globalDepth/2+_nemaXYZ-10,_globalHeight-18])
            endstop_meca();
            mirror([1,0,0])
            translate([_globalWidth/2-_wallThickness-3,-_rodsSupportThickness-_XYrodsDiam/2+XaxisOffset,_globalHeight-22])
            slideY("right");
            translate([-80,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset,_globalHeight-22])
            head();
           
            // Z stage 
            rotate([-90,0,0])
            translate([-_nemaXYZ/2,_globalDepth/2-_wallThickness-_nemaXYZ-20,_wallThickness+_nemaXYZ])
            _nema();
            translate([0,_globalDepth/2-_wallThickness,_globalHeight-35])
            zTop();
            translate([0,_globalDepth/2-_wallThickness,_wallThickness])
            zBottom();
            translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness,_globalHeight/2-40])
            slideZ();
            translate([-_printableWidth/2,-_printableDepth/2+35,_globalHeight/2+10])
            _bed();
            if(_woodsupport==1){
                translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-20])
                motorXYSupport();
                mirror([1,0,0])
                translate([_globalWidth/2-_wallThickness,-_globalDepth/2,_globalHeight-20])
                motorXYSupport();
                translate([-_globalWidth/2+_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20])
                bearingsXYSupport();
                mirror([1,0,0])
                translate([_globalWidth/2-_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20])
                bearingsXYSupport();
            }
            //bowden
            if(_extrusionType==1){
                rotate([0,0,180])
                translate([-16,XaxisOffset+51,_globalHeight-2])
                HeadheadAttach();
                translate([-74,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset+57,_globalHeight-8])
                HeadSupportJhead();
                // nema extruder
                rotate([90,0,0])
                translate([_globalWidth/2+3,-_globalDepth/2+_nemaXYZ+45,_globalHeight-_nemaXYZ-20])
                _nema();
                rotate([90,0,0])
                translate([_globalWidth/2+_wallThickness+14,-_globalDepth/2+40,_globalHeight-40])
                extruder(_extrusionType);

            }
            // direct

            if(_extrusionType==0){
                translate([-74,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset+57,_globalHeight-28])
                InductiveSensorSupport();
                // nema extruder
                rotate([-90,0,0])
                translate([-78,XaxisOffset,_globalHeight+50])
                _nema();
                rotate([-90,0,0])
                translate([-58,XaxisOffset+47,_globalHeight+30])
                extruder(_extrusionType);

            }
	    
}

/*

    break;
    case 2:
        res = [

            motorXY().translate([-90,-160,0]};
            motorXY().mirroredX().translate([90,-160,0]};

            bearingsXY().translate([-90,50,0]};
            bearingsXY().mirroredX().translate([60,-20,0]};

            slideY().translate([-90,-10,0]};
            slideY("right").mirroredX().translate([0,-130,0]};
            head().translate([-80,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset,_globalHeight-22]};
            InductiveSensorSupport().translate([-74,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset+57,_globalHeight-8]};
            //xend_Jhead_attach().rotateZ(180).translate([-16,XaxisOffset+51,_globalHeight-2]};
            extruder(_extrusionType).rotate([-90,0,0]).translate([-58,XaxisOffset+47,_globalHeight+30]};
            zTop().rotate([-90,0,0]).translate([10,40,20]};
            zBottom().translate([10,70,0]};
            slideZ().translate([-_ZrodsWidth/2,_globalDepth/2-_wallThickness-70,_globalHeight/2-40]};

            
            bearingTop(3).rotateX(180).translate([-80,-180,4]).setColor(0.2,0.7,0.2};
            bearingTop(3).rotateX(180).translate([-50,-180,4]).setColor(0.2,0.7,0.2};
            bearingTop(3).rotateX(180).translate([-20,-180,4]).setColor(0.2,0.7,0.2};
            bearingTop(3).rotateX(180).translate([10,-180,4]).setColor(0.2,0.7,0.2};
            bearingTop(3).rotateX(180).translate([40,-180,4]).setColor(0.2,0.7,0.2};
            bearingTop(3).rotateX(180).translate([80,-180,4]).setColor(0.2,0.7,0.2};
            bearingMiddle(8).rotateX(180).translate([-40,-150,4]).setColor(0.2,0.7,0.2};
            bearingMiddle(8).rotateX(180).translate([0,-150,4]).setColor(0.2,0.7,0.2)
                ];

    break;
    case 3:
        res = [motorXY()];
    break;
    case 4:
        res = [bearingsXY(};bearingsXYSupport()];
    break;
    case 5:
        res = [slideY(};slideY("right").mirroredX().translate([100,0,0])];
    break;
    case 6:
        res = [zTop().translate([0,0,80]};slideZ().translate([-_ZrodsWidth/2,0,20]};zBottom()];
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
    //HeadSupportJhead()
        ];
    break;
    case 11:
        res = [
            motorXY().translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-20]};
            motorXY().mirroredX().translate([_globalWidth/2-_wallThickness,-_globalDepth/2,_globalHeight-20]};
            bearingsXY().translate([-_globalWidth/2+_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]};
            bearingsXY().mirroredX().translate([_globalWidth/2-_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]};
            slideY().translate([-_globalWidth/2+_wallThickness+3,-_rodsSupportThickness-_XYrodsDiam/2+XaxisOffset,_globalHeight-22]};
            
            slideY("right").mirroredX().translate([_globalWidth/2-_wallThickness-3,-_rodsSupportThickness-_XYrodsDiam/2+XaxisOffset,_globalHeight-22]};
            head().translate([-80,-(_XYlmDiam/2+(_rodsSupportThickness*2))+XaxisOffset,_globalHeight-22]};
            xend_Jhead_attach().rotateZ(180).translate([-16,XaxisOffset+52,_globalHeight-22]};
            
            // Z stage 
            zTop().translate([0,_globalDepth/2-_wallThickness,_globalHeight-35]};
            zBottom().translate([0,_globalDepth/2-_wallThickness,_wallThickness]};
            slideZ2().translate([_ZrodsWidth/2-1,_globalDepth/2-_wallThickness-70,_globalHeight/2-40]};
            slideZBearingsSupport().mirroredX().translate([_ZrodsWidth/2-2,_globalDepth/2-_wallThickness-15,_globalHeight/2-40]};
            slideZ2().mirroredX().translate([-_ZrodsWidth/2+1,_globalDepth/2-_wallThickness-70,_globalHeight/2-40]};
            slideZBearingsSupport().translate([-_ZrodsWidth/2+2,_globalDepth/2-_wallThickness-15,_globalHeight/2-40]};
            slideZBeltAttach().translate([-_ZrodsWidth/2+13,_globalDepth/2-_wallThickness-15,_globalHeight/2-40])
                ];
            if(_woodsupport==1){
                res.push(motorXYSupport().translate([-_globalWidth/2+_wallThickness,-_globalDepth/2,_globalHeight-20]));
                res.push(motorXYSupport().mirroredX().translate([_globalWidth/2-_wallThickness,-_globalDepth/2,_globalHeight-20]));
                res.push(bearingsXYSupport().translate([-_globalWidth/2+_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]));
                res.push(bearingsXYSupport().mirroredX().translate([_globalWidth/2-_wallThickness,_globalDepth/2-_bearingsDepth,_globalHeight-20]));
            }
    break;
    default:

    break;
}

res;
*/



