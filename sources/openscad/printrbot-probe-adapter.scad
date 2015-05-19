outer_dim=18.2;
probe_dim=12;
rim_dim=outer_dim+3;

length=8.31 + 56.28;

difference() {
  union() {
    cylinder(r=rim_dim/2, h=2);
    cylinder(r=outer_dim/2, h=length);
  }
  cylinder(r=probe_dim/2, h=length, $fs=0.1);
}
