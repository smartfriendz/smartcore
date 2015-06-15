// OpenSCAD Herringbone Wade's Gears Script
// (c) 2015, Frans-Willem Hardijzer
//
// Thanks to Christopher "ScribbleJ" Jansen for the inspiration and most of the calculations
// Thanks to Greg Frost for the "Involute Gears" script.

include <MCAD/involute_gears.scad> 
include <MCAD/teardrop.scad> 

/*************************\
 * General Configuration *
\*************************/

/* Set to 1 to render gears as cylinders instead,
 * Will speed up rendering for experimenting with decorations.
 */
debug = 1;

/* Set to 0 to render the gears interlocked,
 * or 1 to render them seperately for easy printing.
 */
printing = 0;
 
/* Distance between the midpoints of the two gears
 * Copy this from your extruders' information.
 */
distance_between_axles = 41.7055;

/* Height of the actual gear teeth
 */
gear_height = 10; //Height of the actual gears

/* Gear "twist": how slanted the gears are.
 * A value of 1 means each tooth will slant up one additional tooth.
 */
teeth_twist = 1;

/* Chamfer gradient, tan(45) degrees works nicely.
 * Use -1 to disable chamferred edges.
 */
chamfer_gradient = tan(45);

/****************************\
 * Small gear configuration *
\****************************/

/* Number of teeth on the gear */
gear1_teeth = 9;

/* Height of the base (for the setscrew) */
gear1_base_height = 8;

/* Shaft diameter
 * Be sure to add some tolerance for printer error
 */
gear1_shaft_diameter = 5 + 0.4;
/* Set-screw diameter, mind tolerance */
gear1_setscrew_diameter = 3 + 0.4;
/* Set-nut width, measured across the flat sides,
 * mind tolerance
 */
gear1_setnut_width = 5.5 + 0.4;
/* Set-nut height, mind tolerance */
gear1_setnut_height = 2.4 + 0.2;

/**************************\
 * Big gear configuration *
\**************************/
/* Number of teeth */
gear2_teeth = 47;
/* Extra size of the outer rim */
gear2_outer_thickness = 5;

/* Shaft diameter
 * Be sure to add some tolerance for printer error
 */
gear2_shaft_diameter = 8 + 0.4;

/* Height of the shaft embedded in the gear.
 * Measure
 *   X:
 *     Distance from the bottom of the nut on the hobbed bolt,
 *     to the middle of the hobbed part.
 *   Y:
 *     Distance from outside of gear-side of extruder,
 *     Including bearing, rings, and spacers,
 *     to the middle of the filament path.
 * This parameter should be equal to:
 *   X - Y
 */
/*
 * Some example measurements:
 * Silver hobbed bolt part of my Replikeo Prusa i3 kit:
 *   X: 24.5mm
 * Black hobbed bolt bought at aliexpress
 *   X: 28mm
 * Jonas Kuehling's Greg's Wade Reloaded,
 * with two M8 spacing rings:
 *   Y: 18.5mm
 */
gear2_shaft_height = 9.5;

/* Diameter of shaft holder */
gear2_middle_diameter = 25;

/* Height of shaft holder rounding */
gear2_middle_rounding = 3;

/* Shaft nut width, measured across the flat sides,
 * mind tolerance
 */
gear2_nut_diameter = 13 + 0.4;

/* Depth that the nut should be sunk inside the holder */
gear2_nut_sunk = 6.5;

/* Which decorations to use */
gear2_decoration_solid = false;
gear2_decoration_spokes = 0; //Set to number of desired spokes
gear2_decoration_arcs = 0; //Set to number of desired arcs
gear2_decoration_spiral1 = 0; //Set to number of desired spirals (style 1)
gear2_decoration_spiral2 = 0; //Set to number of desired spirals (style 2)
gear2_decoration_arrows = 0; //Set to number of desired arrows
gear2_decoration_drops = 0; //Set to number of desired drops
gear2_decoration_holes = 0; //Set to number of desired holes
gear2_decoration_flower = 0; //Set to number of petals (7 is nice)
gear2_decoration_segments = 0; //Set to number of desired segments
gear2_decoration_extra_margin = 0; //Number of millimeters

/* Height of decoration */
gear2_decoration_height = gear_height/3;

/********************\
 * Pre-calculations *
\********************/
circular_pitch = 360*distance_between_axles/(gear1_teeth+gear2_teeth);

/********************\
 * Helper functions *
\********************/
//Distance to overlap things that should be joined.
epsilon = 0.01;

function gear_radius(number_of_teeth, circular_pitch) = number_of_teeth * circular_pitch / 360;

function gear_outer_radius(number_of_teeth, circular_pitch) = gear_radius(number_of_teeth=number_of_teeth, circular_pitch=circular_pitch) + (circular_pitch/180);

function gear_inner_radius(number_of_teeth, circular_pitch) = gear_radius(number_of_teeth=number_of_teeth, circular_pitch=circular_pitch) - (circular_pitch/180);

module mirrordupe(p) {
    children();
    mirror(p) children();
}

module chamfered_herring_gear(height, chamfer_gradient, teeth_twist, number_of_teeth, circular_pitch) {
    radius = gear_radius(number_of_teeth=number_of_teeth, circular_pitch=circular_pitch);
    outer_radius = gear_outer_radius(number_of_teeth=number_of_teeth, circular_pitch=circular_pitch);
    twist = 360 * teeth_twist / number_of_teeth / 2;

    edge = (outer_radius - radius) / chamfer_gradient;
    intersection() {
        union() {
            if (debug == 1) {
                cylinder(h=height, r=outer_radius);
            } else {
                translate([0,0,height/2])
                    mirrordupe([0,0,1])
                        translate([0,0,-epsilon])
                            gear(
                                twist=twist,
                                number_of_teeth=number_of_teeth,
                                circular_pitch=circular_pitch,
                                gear_thickness = (height/2) + epsilon,
                                rim_thickness = (height/2) + epsilon,
                                hub_thickness = (height/2) + epsilon,
                                bore_diameter=0);
            }
        }
        //Cut edges
        union() {
            cylinder(h=edge + epsilon, r1=radius, r2=outer_radius + epsilon*chamfer_gradient);
            translate([0,0,edge])
                cylinder(h=height-2*edge, r=outer_radius);
            translate([0,0,height-edge-epsilon])
                cylinder(h=edge + epsilon, r2=radius, r1=outer_radius + epsilon*chamfer_gradient);
        }
    }
}

module hole(h,r,$fn=8,rot=0) {
    rotate([0,0,rot * (180/$fn)])
        cylinder(h=h, r=r / cos(180 / $fn), $fn=$fn);
}

module gear1() {
    //Variables
    radius = gear_radius(gear1_teeth, circular_pitch);
    inner_radius = gear_inner_radius(gear1_teeth, circular_pitch);
    outer_radius = gear_outer_radius(gear1_teeth, circular_pitch);
    base_chamfer = (outer_radius - radius) / chamfer_gradient;
    shaft_radius = gear1_shaft_diameter/2;
    setnut_distance = shaft_radius;//(shaft_radius + radius - gear1_setnut_height)/2;
    
    difference() {
        union() {
            //Actual gear
            chamfered_herring_gear(height = gear_height, chamfer_gradient = chamfer_gradient, teeth_twist=teeth_twist,     number_of_teeth=gear1_teeth, circular_pitch=circular_pitch);
            //Base
            translate([0,0,-gear1_base_height]) {
                cylinder(h=gear1_base_height + epsilon, r=inner_radius);
                cylinder(h=gear1_base_height - base_chamfer, r=outer_radius);
                translate([0,0,gear1_base_height - base_chamfer - epsilon]) {
                    intersection() {
                        cylinder(h=base_chamfer + epsilon, r2=radius, r1=outer_radius + chamfer_gradient * epsilon);
                        cylinder(h=base_chamfer + epsilon, r=outer_radius);
                    }
                }
            }
        }
        //Shaft
        translate([0,0,-gear1_base_height - epsilon])
            hole(h=gear_height + gear1_base_height + 2*epsilon, r=shaft_radius, $fn=24);
        //Setscrew shaft
        translate([0,0,-gear1_base_height/2]) {
            rotate([0,-90,0]) {
                hole(h=outer_radius + epsilon, r=gear1_setscrew_diameter/2, $fn=8, rot=1);
                translate([0,0,setnut_distance])
                    hole(h=gear1_setnut_height, r=gear1_setnut_width/2, $fn=6);
            }
        }
        //Setscrew insertion cube
        translate([-setnut_distance-gear1_setnut_height,-gear1_setnut_width/2,-gear1_base_height-epsilon])
            cube([gear1_setnut_height, gear1_setnut_width, gear1_base_height/2 + epsilon]);
        
    }
    
}

module gear2() {
    radius = gear_radius(gear2_teeth, circular_pitch);
    inner_radius = gear_inner_radius(gear2_teeth, circular_pitch);
    outer_radius = gear_outer_radius(gear2_teeth, circular_pitch);
    inner_chamfer_radius = (outer_radius - radius);
    inner_chamfer = inner_chamfer_radius / chamfer_gradient;
    
    //Outer gear
    difference() {
        chamfered_herring_gear(height = gear_height, chamfer_gradient = chamfer_gradient,teeth_twist=-teeth_twist, number_of_teeth=gear2_teeth, circular_pitch=circular_pitch);
        
        translate([0,0,-epsilon])
            cylinder(h=gear_height+ 2*epsilon, r=inner_radius - gear2_outer_thickness);
        
        translate([0,0,gear_height - inner_chamfer - epsilon])
            cylinder(h=inner_chamfer + 2*epsilon, r1=inner_radius - gear2_outer_thickness - chamfer_gradient*epsilon, r2 = inner_radius - gear2_outer_thickness + inner_chamfer_radius + chamfer_gradient*epsilon);
    }
    
    
    //Shaft holder
    difference() {
        union() {
            cylinder(h=gear2_shaft_height + gear2_nut_sunk -gear2_middle_rounding, r=gear2_middle_diameter/2);
            translate([0,0,gear2_shaft_height + gear2_nut_sunk-gear2_middle_rounding])
                scale([1,1,gear2_middle_rounding / gear2_middle_diameter * 2])
                    sphere(r=gear2_middle_diameter/2);
            intersection() {
                union() {
                    gear2_decoration(outer_radius = inner_radius - gear2_outer_thickness, inner_radius = gear2_middle_diameter/2, max_height = gear2_shaft_height + gear2_nut_sunk);
                    //Something that will be cut out anyway
                    cylinder(h=gear2_shaft_height + gear2_nut_sunk, r=gear2_shaft_diameter/4);
                }
                cylinder(h=gear2_shaft_height + gear2_nut_sunk, r=inner_radius);
            }
        }
        translate([0,0,-epsilon])
            hole(h=gear2_shaft_height + gear2_nut_sunk + 2*epsilon, r=gear2_shaft_diameter/2, $fn=24);
        translate([0,0,gear2_shaft_height])
            hole(h=gear2_nut_sunk + epsilon, r=gear2_nut_diameter/2, $fn=6);
    }
}

module gear2_decoration(outer_radius, inner_radius, max_height) {
    if (gear2_decoration_solid)
        gear2_decorate_solid(outer_radius);
    if (gear2_decoration_spokes > 0)
        gear2_decorate_spokes(
            outer_radius,
            gear2_decoration_spokes);
    if (gear2_decoration_arcs > 0)
        gear2_decorate_arcs(
            inner_radius,
            outer_radius,
            gear2_decoration_arcs);
    if (gear2_decoration_spiral1 > 0)
        gear2_decorate_spiral1(
            inner_radius,
            outer_radius,
            gear2_decoration_spiral1);
    if (gear2_decoration_spiral2 > 0)
        gear2_decorate_spiral2(
            inner_radius,
            outer_radius,
            gear2_decoration_spiral2);
    if (gear2_decoration_arrows > 0)
        gear2_decorate_arrows(
            inner_radius,
            outer_radius,
            gear2_decoration_arrows);
    if (gear2_decoration_drops)
        gear2_decorate_drops(
            inner_radius,
            outer_radius,
            gear2_decoration_drops);
    if (gear2_decoration_holes)
        gear2_decorate_holes(
            inner_radius,
            outer_radius,
            gear2_decoration_holes);
    if (gear2_decoration_flower > 0)
        gear2_decorate_flower(
            inner_radius,
            outer_radius,
            gear2_decoration_flower);
    if (gear2_decoration_segments > 0)
        gear2_decorate_segments(
            inner_radius,
            outer_radius,
            gear2_decoration_segments);
    
    if (gear2_decoration_extra_margin > 0)
        gear2_decorate_extra_outer_margin(
            outer_radius,
            gear2_decoration_extra_margin);
}

module gear2_decorate_solid(outer_radius) {
    cylinder(h=gear2_decoration_height, r=outer_radius + epsilon);
}

module gear2_decorate_spokes(outer_radius, number) {
    for (r=[0:360/number:360])
        rotate([0,0,r])
            rotate([90,0,0])
                cylinder(h=outer_radius + epsilon, r=gear2_decoration_height);
}

module gear2_decorate_arcs(inner_radius, outer_radius, number) {
    height = gear2_decoration_height;
    width = 5;
    inner_diameter = outer_radius - inner_radius;
    outer_diameter = inner_diameter + width*2;
    for (r=[0:360/number:360])
        rotate([0,0,r])
            translate([inner_radius + (inner_diameter/2),0,0])
                difference() {
                    cylinder(h=height, r=outer_diameter/2);
                    translate([0,0,-epsilon])
                        cylinder(h=height + 2*epsilon, r=inner_diameter/2);
                    translate([-outer_diameter/2 - epsilon,0,-epsilon])
                        cube([outer_diameter+2*epsilon,outer_diameter+2*epsilon,height + 2*epsilon]);
                }
}

module gear2_decorate_spiral1(inner_radius, outer_radius, number) {
    height = gear2_decoration_height;
    width = 5;
    inner_diameter = outer_radius;
    outer_diameter = inner_diameter + width*2;
    for (r=[0:360/number:360])
        rotate([0,0,r])
            translate([(inner_diameter/2),0,0])
                difference() {
                    cylinder(h=height, r=outer_diameter/2);
                    translate([0,0,-epsilon])
                        cylinder(h=height + 2*epsilon, r=inner_diameter/2);
                    translate([-outer_diameter/2 - epsilon,0,-epsilon])
                        cube([outer_diameter+2*epsilon,outer_diameter+2*epsilon,height + 2*epsilon]);
                }
}

module gear2_decorate_spiral2(inner_radius, outer_radius, number) {
    height = gear2_decoration_height;
    width = 5;
    outer_diameter = inner_radius + outer_radius + width;
    inner_diameter = outer_diameter - (2*width);
    middle = (outer_radius + width - inner_radius)/2;
    for (r=[0:360/number:360])
        rotate([0,0,r])
            translate([middle,0,0])
                difference() {
                    cylinder(h=height, r=outer_diameter/2);
                    translate([0,0,-epsilon])
                        cylinder(h=height + 2*epsilon, r=inner_diameter/2);
                    translate([-outer_diameter/2 - epsilon,0,-epsilon])
                        cube([outer_diameter+2*epsilon,outer_diameter+2*epsilon,height + 2*epsilon]);
                }
}

module gear2_decorate_arrows(inner_radius, outer_radius, number) {
    height = gear2_decoration_height;
    width = 10;
    diff = outer_radius-inner_radius;
    inner_size = sqrt((diff*diff)/2);
    outer_size = inner_size + width;
    diagonal_size = sqrt(outer_size*outer_size*2);
    for (r=[0:360/number:360])
        rotate([0,0,r])
            translate([(inner_radius + outer_radius)/2,0,0])
                intersection() {
                    rotate([0,0,45])
                        translate([-outer_size/2,-outer_size/2,0])
                            difference() {
                                cube([outer_size,outer_size,height]);
                                translate([width/2,width/2,-epsilon])
                                    cube([outer_size,outer_size,height+2*epsilon]);
                            }
                }
}

module gear2_decorate_drops(inner_radius, outer_radius, number) {
    size = (outer_radius - inner_radius) - 2;
    height = gear2_decoration_height;
    difference() {
        gear2_decorate_solid(outer_radius);
        for (r=[0:360/number:360])
            rotate([0,0,r])
                translate([0,(inner_radius + outer_radius)/2,height/2])
                    rotate([0,90,0])
                        teardrop(size/2, height + epsilon*2, 90);
    }
}

module gear2_decorate_holes(inner_radius, outer_radius, number) {
    size = (outer_radius - inner_radius) - 2;
    height = gear2_decoration_height;
    difference() {
        gear2_decorate_solid(outer_radius);
        for (r=[0:360/number:360])
            rotate([0,0,r])
                translate([0,(inner_radius + outer_radius)/2,-epsilon])
                    cylinder(h=height+2*epsilon, r=size/2);
    }
}

module gear2_decorate_flower(inner_radius, outer_radius, number) {
    //Similar to triffid_hunters design
    spacing = 1;
    size = (outer_radius - inner_radius) - 2*spacing;
    radius = size * (sqrt(2) - 1);
    smallradius = 3;
    height = gear2_decoration_height;
    difference() {
        gear2_decorate_solid(outer_radius);
        //Petals
        for (r=[0:360/number:360])
            rotate([0,0,r])
                translate([inner_radius + spacing + radius,0,height/2])
                    rotate([0,90,0])
                        teardrop(radius, height + epsilon*2, 90);
        // Motor access holes
        for (r=[0:360/number:360])
            rotate([0,0,r + 180/number])
                translate([outer_radius - spacing - smallradius,0,height/2])
                    rotate([0,-90,90])
                        teardrop(smallradius, height + epsilon*2, 90);
    }
}

module gear2_decorate_segments(inner_radius, outer_radius, number) {
    degree = 180 / number;
    height = gear2_decoration_height;
    for (r=[0:360/number:360])
        rotate([0,0,r])
            intersection() {
                translate([0,-outer_radius-epsilon,0])
                    cube([outer_radius + epsilon,(outer_radius + epsilon)*2,height]);
                rotate([0,0,180 - degree])
                    translate([0,-outer_radius-epsilon,0])
                        cube([outer_radius + epsilon,(outer_radius + epsilon)*2,height]);
            }
}
module gear2_decorate_extra_outer_margin(outer_radius, width) {
    difference() {
        gear2_decorate_solid(outer_radius);
        translate([0,0,-epsilon])
            cylinder(r=outer_radius - width, h=gear2_decoration_height + 2*epsilon);
    }
    
}

if (printing == 1) {
    translate([distance_between_axles/2 + 5,0,gear_height])
        rotate([0,180,0])
            gear1();
    translate([-distance_between_axles/2 - 5,0,0])
        gear2();
} else {
    //Small gear (gear 1)
    gear1();

    //Big gear (gear 2)
    translate([distance_between_axles,0,0]) {
        gear2();
    }
}
