//
// Autor: Michael Unsoeld
// (c)    Keine Einschraenkungen
//
//
// Archiviert den Look aus 3 aufgenommenen Messpunkten
// ----------------------------------------------------
// - Es muessen mndestens 3 Messounkte vorhanden sein
//   (Schwarzpunkt, Graupunkt und Weisspunkt)
// - Die ersten 3 Messpunkte werden beruecksichtigt
// - Reihenfolge der Messpunkte its egal, sie werden
//   sowieso nach Helligkeit angeordnet.
// 
//   Aus den 3 Messpunkten wird eine kleine Farbpalette
//   mit Vorschaubild generiert und in ein SmartObject
//   verpackt.
// ======================================================
// KONSTANTEN
// Breite (und Hoehe) eines Farbquadrats (in Px)
var BREITE=100;
// ======================================================
//  HILFSFUNKTIONEN
// ======================================================
// Erzeugt eine Fuellebene mit vorgegebenem Namen
// und vorgegebener Farbe
// Rueckgabewert: Die neu erzeugte Ebene
function fuellEbene(p_name, p_farbe){
    var r = p_farbe.rgb.red;
    var g = p_farbe.rgb.green;
    var b = p_farbe.rgb.blue;
    // Abgekupfert vom ScriptingListener...
    var idMk = charIDToTypeID( "Mk  " );
        var desc212 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref123 = new ActionReference();
            var idcontentLayer = stringIDToTypeID( "contentLayer" );
            ref123.putClass( idcontentLayer );
        desc212.putReference( idnull, ref123 );
        var idUsng = charIDToTypeID( "Usng" );
            var desc213 = new ActionDescriptor();
            var idType = charIDToTypeID( "Type" );
                var desc214 = new ActionDescriptor();
                var idClr = charIDToTypeID( "Clr " );
                    var desc215 = new ActionDescriptor();
                    var idRd = charIDToTypeID( "Rd  " );
                    desc215.putDouble( idRd, r );
                    var idGrn = charIDToTypeID( "Grn " );
                    desc215.putDouble( idGrn, g );
                    var idBl = charIDToTypeID( "Bl  " );
                    desc215.putDouble( idBl, b );
                var idRGBC = charIDToTypeID( "RGBC" );
                desc214.putObject( idClr, idRGBC, desc215 );
            var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
            desc213.putObject( idType, idsolidColorLayer, desc214 );
        var idcontentLayer = stringIDToTypeID( "contentLayer" );
        desc212.putObject( idUsng, idcontentLayer, desc213 );
    executeAction( idMk, desc212, DialogModes.NO );
    var idsetd = charIDToTypeID( "setd" );
        var desc216 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref124 = new ActionReference();
            var idLyr = charIDToTypeID( "Lyr " );
            var idOrdn = charIDToTypeID( "Ordn" );
            var idTrgt = charIDToTypeID( "Trgt" );
            ref124.putEnumerated( idLyr, idOrdn, idTrgt );
        desc216.putReference( idnull, ref124 );
        var idT = charIDToTypeID( "T   " );
            var desc217 = new ActionDescriptor();
            var idNm = charIDToTypeID( "Nm  " );
            desc217.putString( idNm, p_name );
        var idLyr = charIDToTypeID( "Lyr " );
        desc216.putObject( idT, idLyr, desc217 );
    executeAction( idsetd, desc216, DialogModes.NO );  
    return activeDocument.activeLayer; 
}

// Sichbare Ebenen zusammenfassen
// p_name : Name der neuen Ebene
// return : Die neue Ebene
function ctrlShiftAltE(p_name){
    var aktiveEbene=activeDocument.activeLayer;
    
    var leer=activeDocument.artLayers.add();
    leer.name=p_name;
    // =======================================================
    var idMrgV = charIDToTypeID( "MrgV" );
        var desc46 = new ActionDescriptor();
        var idDplc = charIDToTypeID( "Dplc" );
        desc46.putBoolean( idDplc, true );
    executeAction( idMrgV, desc46, DialogModes.NO );
    return activeDocument.activeLayer;
}

// Aktive Ebene oder Gruppe in ein SmartObject konvertieren
// p_name : Name der Ebene
function smartObject(p_name){
    var idnewPlacedLayer = stringIDToTypeID( "newPlacedLayer" );
    executeAction( idnewPlacedLayer, undefined, DialogModes.NO );
    var layer=activeDocument.activeLayer;
    layer.name=p_name;
    return layer;
}


/////////////////////////////////////////////////////////////////////////
// MAIN
// ----

// Drei Farben aus den Messpunkten bestimmen
if( activeDocument.colorSamplers.length<3 ){
    throw "Mindestens 3 Messpunkte sind notwendig.";
} 

// Maßeinheiten auf Pixel setzen (alten Wert sichern)
var einheiten=preferences.rulerUnits;
preferences.rulerUnits=Units.PIXELS;


var farben=[];
for( var j=0; j<3; j++ ){
    farben.push(activeDocument.colorSamplers[j].color);
}

// Aufgenommene Farben nach Helligkeit sortieren
farben.sort(function(f1,f2){
    return f1.hsb.brightness-f2.hsb.brightness;
});

// Abmessungen bestimmen
var mitteX=activeDocument.width/2;
var mitteY=activeDocument.height/2;
// Obere linke Ecke des 1. Quadrats
var x=mitteX-3*BREITE/2;
var y=mitteY;

// Eine neue Gruppe erzeugen
var gruppe=activeDocument.layerSets.add();
gruppe.name="Aufgenommene Farben";
// 3 Farbquadrate aus Fuellebenen erstellen und in die Gruppe packen
for( var j=0; j<3; j++){
    // Name der Fuellebene
    var ffName="Farbe#"+(j+1);
    // Vier Eckpunke:
    var ecke0=[x,y];
    var ecke1=[x+BREITE,y];
    var ecke2=[x+BREITE,y+BREITE];
    var ecke3=[x,y+BREITE];
    // Selektion erstellen
    activeDocument.selection.select([ecke0,ecke1,ecke2,ecke3,ecke0]);
    // Fuellebene erstellen
    var fuell = fuellEbene(ffName,farben[j]);
    // Ab in die Gruppe
    fuell.move(gruppe,ElementPlacement.INSIDE);
    // Koordinaten fuer die linke obere Ecke weiterschieben
    x+=BREITE;
}

// Gruppe aktivieren (und ausblenden)
activeDocument.activeLayer=gruppe;
gruppe.visible=false;

// Vorschaubild generieren
var vorschau = ctrlShiftAltE("Vorschau");
// Auf 3*BREITE skalieren
var prozent=3*BREITE*100/activeDocument.width;
vorschau.resize(prozent,prozent,AnchorPosition.MIDDLECENTER);
// An die richtige Position schieben
var dx=mitteX-3*BREITE/2-vorschau.bounds[0];
var dy=mitteY-vorschau.bounds[3];
vorschau.translate(dx,dy);

// Gruppe wieder einblenden
gruppe.visible=true;

// Vorschubild in dieGruppe
vorschau.move(gruppe, ElementPlacement.PLACEATEND);

// Gruppe aktivieren und ein Smart Object erzeugen
activeDocument.activeLayer=gruppe;
// Name -> aus dem Dokumentnamen
var soName="Look:"+activeDocument.name;
smartObject(soName);


// Alten Wert fuer die Maßeinheiten restaurieren
preferences.rulerUnits=einheiten;
