/**********

Smartcore : Support d'extruder

author: smartfriendz
licence : GPL

***********/

function main() {

var hauteur = 7, rayon = 10, vb = 2.5, tm3 = 3, m3 = 1.5, diam = rayon*2, largeur = diam;

return difference(

	union(

      cylinder({r:rayon,h:hauteur}),	//Demie cerle bas
      cube({size:[largeur,diam+54,hauteur]}).translate([-rayon,0,0]),	//Corps support moteur
      cube({size:[largeur/2,largeur+diam,hauteur]}).translate([rayon,(54+diam)/2-diam,0]),	//Patte cercle milieu
      cylinder({r:rayon,h:hauteur}).translate([0,diam+54,0]),	//Demie cercle haut
      cylinder({r:rayon,h:hauteur}).translate([largeur,(diam+54)/2,0])	//Demie cercle milieu

      ),

	cylinder({r:vb,h:hauteur}),	//Vis bois bas
	cylinder({r:vb,h:hauteur}).translate([diam,(diam+54)/2,0]),	//Vis bois milieu
	cylinder({r:vb,h:hauteur}).translate([0,diam+54,0]),	//Vis bois haut
	cylinder({r:tm3,h:2}).translate([0,(diam+54)/2-15.5,hauteur-2]),	//Trou tête m3 bas
	cylinder({r:tm3,h:2}).translate([0,(diam+54)/2+15.5,hauteur-2]),	//Trou tête m3 haut
	cylinder({r:m3,h:hauteur}).translate([0,(diam+54)/2-15.5,0]),	//Trou m3 bas
	cylinder({r:m3,h:hauteur}).translate([0,(diam+54)/2+15.5,0]),	//Trou m3 haut
	cylinder({r:rayon,h:hauteur}).translate([largeur,(diam+54)/2-diam,0]),	//Filet
	cylinder({r:rayon,h:hauteur}).translate([largeur,(diam+54)/2+diam,0])	//Filet

   );
}
