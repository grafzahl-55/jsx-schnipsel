//
// Autor: Michael Unsoeld
// (c)    Keine Einschraenkungen
//
//
// Einen archivierten Look auf das aktuelle Dokument anwenden
// ----------------------------------------------------------
//
// - Es muessen drei Messpunkte im aktuellen Dokument vorliegen
//   (Schwarzpunkt, Graupunkt, Weisspunkt )
// - Reihenfolge ist egal (wird automatisch nach Helligkeit
//   sortiert)
// - Die Ebene mit dem archivierten Look muss als aktiv markiert sein
//    
//////////////////////////////////////////////////////////////////////
// HILFSFUNKTIONEN
//
function GradationsKurve(p_gcLayer){
    var MINDESTABSTAND=5;
    var gcLayer;

    if(typeof(p_gcLayer)==='string'){
        __newCurvesLayer(p_gcLayer);
        gcLayer=activeDocument.activeLayer;
    } else if(p_gcLayer.kind==LayerKind.CURVES){
        gcLayer=p_gcLayer;
    } else {
        throw ""+p_gcLayer+" ist weder String noch Kurvenebene";
    }

    // Neue Einstellungsebene Gradationskurve
    function __newCurvesLayer(layerName){
        // =======================================================
        var idMk = charIDToTypeID( "Mk  " );
        var desc8 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref1 = new ActionReference();
            var idAdjL = charIDToTypeID( "AdjL" );
            ref1.putClass( idAdjL );
        desc8.putReference( idnull, ref1 );
        var idUsng = charIDToTypeID( "Usng" );
            var desc9 = new ActionDescriptor();
            var idType = charIDToTypeID( "Type" );
                var desc10 = new ActionDescriptor();
                var idpresetKind = stringIDToTypeID( "presetKind" );
                var idpresetKindType = stringIDToTypeID( "presetKindType" );
                var idpresetKindDefault = stringIDToTypeID( "presetKindDefault" );
                desc10.putEnumerated( idpresetKind, idpresetKindType, idpresetKindDefault );
            var idCrvs = charIDToTypeID( "Crvs" );
            desc9.putObject( idType, idCrvs, desc10 );
        var idAdjL = charIDToTypeID( "AdjL" );
        desc8.putObject( idUsng, idAdjL, desc9 );
        executeAction( idMk, desc8, DialogModes.NO );

        // =======================================================
        var idslct = charIDToTypeID( "slct" );
        var desc11 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref2 = new ActionReference();
            var idChnl = charIDToTypeID( "Chnl" );
            var idChnl = charIDToTypeID( "Chnl" );
            var idRGB = charIDToTypeID( "RGB " );
            ref2.putEnumerated( idChnl, idChnl, idRGB );
        desc11.putReference( idnull, ref2 );
        var idMkVs = charIDToTypeID( "MkVs" );
        desc11.putBoolean( idMkVs, false );
        executeAction( idslct, desc11, DialogModes.NO );

        // =======================================================
        var idsetd = charIDToTypeID( "setd" );
        var desc12 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref3 = new ActionReference();
            var idLyr = charIDToTypeID( "Lyr " );
            var idOrdn = charIDToTypeID( "Ordn" );
            var idTrgt = charIDToTypeID( "Trgt" );
            ref3.putEnumerated( idLyr, idOrdn, idTrgt );
        desc12.putReference( idnull, ref3 );
        var idT = charIDToTypeID( "T   " );
            var desc13 = new ActionDescriptor();
            var idNm = charIDToTypeID( "Nm  " );
            desc13.putString( idNm, layerName );
        var idLyr = charIDToTypeID( "Lyr " );
        desc12.putObject( idT, idLyr, desc13 );
        executeAction( idsetd, desc12, DialogModes.NO );

    }

    ///////////////////////////////////////////////////////////////////////////////
    // Bei aktivierter Gradationskurven-Ebene : Kurvenpunkte in einen
    // Kanal setzen
    // points : Array von Array, z.B. [[0,0],[128,150],[255,255]]
    // chn    : Kanal. Optional. STandard ist der Graukanal; ansonsten 'r','g','b'
    function __setCurvePoints(points,chn){
        try{
            var idsetd = charIDToTypeID( "setd" );
            var desc95 = new ActionDescriptor();
            var idnull = charIDToTypeID( "null" );
                var ref59 = new ActionReference();
                var idAdjL = charIDToTypeID( "AdjL" );
                var idOrdn = charIDToTypeID( "Ordn" );
                var idTrgt = charIDToTypeID( "Trgt" );
                ref59.putEnumerated( idAdjL, idOrdn, idTrgt );
            desc95.putReference( idnull, ref59 );
            var idT = charIDToTypeID( "T   " );
                var desc96 = new ActionDescriptor();
                var idpresetKind = stringIDToTypeID( "presetKind" );
                var idpresetKindType = stringIDToTypeID( "presetKindType" );
                var idpresetKindCustom = stringIDToTypeID( "presetKindCustom" );
                desc96.putEnumerated( idpresetKind, idpresetKindType, idpresetKindCustom );
                var chnCode="Cmps";
                if("r"===chn){
                    chnCode="Rd  ";
                } else if ("g"===chn){
                    chnCode="Grn ";
                } else if ("b"===chn){
                    chnCode="Bl  ";
                } else if ("lab-l"===chn){
                    chnCode="Lght"
                } else if ("lab-a"===chn){
                    chnCode="A   "
                } else if ("lab-b"===chn){
                    chnCode="B   "
                }
                _putCurvePoints(desc96,chnCode,points);
            var idCrvs = charIDToTypeID( "Crvs" );
            desc95.putObject( idT, idCrvs, desc96 );
            executeAction( idsetd, desc95, DialogModes.NO );
        } catch(e) {
            alert("setCurvePoints:"+points.join(",")+" chn:"+chn);
            throw e;
        }
    }

    function _putCurvePoints(desc96,channel,points){
        if( points ){
            var idAdjs = charIDToTypeID( "Adjs" );
            var list25 = new ActionList();
                var desc97 = new ActionDescriptor();
                var idChnl = charIDToTypeID( "Chnl" );
                    var ref60 = new ActionReference();
                    var idChnl = charIDToTypeID( "Chnl" );
                    var idChnl = charIDToTypeID( "Chnl" );
                    var idRd = charIDToTypeID( channel );
                    ref60.putEnumerated( idChnl, idChnl, idRd );
                desc97.putReference( idChnl, ref60 );
                var idCrv = charIDToTypeID( "Crv " );
                    var list26 = new ActionList();
                    var idPnt = charIDToTypeID( "Pnt " );
                    
                    for(var j=0; j<points.length; j++){
                        var point=points[j];    
                        var desc98 = new ActionDescriptor();
                            var idHrzn = charIDToTypeID( "Hrzn" );
                            desc98.putDouble( idHrzn, point[0] );
                            var idVrtc = charIDToTypeID( "Vrtc" );
                            desc98.putDouble( idVrtc, point[1] );
                        list26.putObject( idPnt, desc98 );
                    }
                    
            desc97.putList( idCrv, list26 );
            var idCrvA = charIDToTypeID( "CrvA" );
            list25.putObject( idCrvA, desc97 );
            desc96.putList( idAdjs, list25 );
        }
    }
    
    
    function __ptCompare(xs,ys){
        return xs[0]-ys[0];
    }
    function __punkteBereinigen(xs){
        xs.sort(__ptCompare);
        var xsBereinigt=[xs[0]];
        var vorigesX=xs[0][0];
        for(var j=1; j<xs.length; j++){
            var actX=xs[j][0];
            if(actX>=vorigesX+MINDESTABSTAND){
                xsBereinigt.push(xs[j]);
                vorigesX=actX;
            }
        }
        return xsBereinigt;
    }

    function setCurvePoints(points,chn){
        pointsBereinigt=__punkteBereinigen(points);
        var currentActive=activeDocument.activeLayer;
        activeDocument.activeLayer=gcLayer;
        __setCurvePoints(pointsBereinigt,chn);
        activeDocument.activeLayer=currentActive;           
    }

    function reset(){
        var currentActive=activeDocument.activeLayer;
        __setCurvePoints([[0,0],[255,255]]);
        __setCurvePoints([[0,0],[255,255],"r"]);
        __setCurvePoints([[0,0],[255,255],"g"]);
        __setCurvePoints([[0,0],[255,255],"b"]);
    }

    function activate(){
        activeDocument.activeLayer=gcLayer;
    }

    return {
        'layer':gcLayer,
        'setCurvePoints':setCurvePoints,
        'activate' : activate,
        'reset' : reset
    }

}


//////////////////////////////////////////////////////////////////////
// MAIN
//

// Ebene mit dem archivierten look
var lookEbene=activeDocument.activeLayer;

// Look ebene ausblenden und die drei Farben aus den
// Messpunkten auslesen bzw auf neutral setzen
lookEbene.visible=false;

// Sicherstellen, dass drei Messpunkte da sind
// Drei Farben aus den Messpunkten bestimmen
var istFarben=[];
if( activeDocument.colorSamplers.length<3 ){
    var b=0;
    for( var j=0; j<3; j++ ){
        var farbe=new SolidColor();
        farbe.hsb.hue=0;
        farbe.hsb.saturation=0;
        farbe.hsb.brightness=b;
        b+=50;
        istFarben.push(farbe);
    }   
} else {
    for( var j=0; j<3; j++ ){
        istFarben.push(activeDocument.colorSamplers[j].color);
    }
}





// Sortieren
istFarben.sort(function(f1,f2){
    return f1.hsb.brightness-f2.hsb.brightness;
});

// Farben aus der Look-Ebene messen
lookEbene.visible=true;
// Falls 10 Messpunkte da sind, muss der letzte leider gelöscht
// werden
if( activeDocument.colorSamplers.length==10 ){
    activeDocument.colorSamplers[9].remove();
}
// Breite eines Farbquadrats: 1/3 der Breite der look Ebene
var qBreite = (lookEbene.bounds[2]-lookEbene.bounds[0])/3;
// Position der 1. Farbmessung
var x=lookEbene.bounds[0]+qBreite/2;
var y=lookEbene.bounds[3]-qBreite/2;
var sollFarben=[];
for( var j=0; j<3; j++ ){
    var mp=activeDocument.colorSamplers.add([x,y]);
    sollFarben.push(mp.color);
    mp.remove();
    // Messpunkt weiterschieben
    x+=qBreite;
}
// Look-Ebene ausblenden
lookEbene.visible=false;

// Gruppe für die Gradationskurven anlegen
var gruppe=activeDocument.layerSets.add();
gruppe.name=">"+lookEbene.name;

// Schwarzpunkt
var gkSchwarz=GradationsKurve("Schwarzpunkt");
gkSchwarz.setCurvePoints([
    [istFarben[0].rgb.red, sollFarben[0].rgb.red],
    [255,255]
],'r');
gkSchwarz.setCurvePoints([
    [istFarben[0].rgb.green, sollFarben[0].rgb.green],
    [255,255]
],'g');
gkSchwarz.setCurvePoints([
    [istFarben[0].rgb.blue, sollFarben[0].rgb.blue],
    [255,255]
],'b');
gkSchwarz.layer.move(gruppe, ElementPlacement.INSIDE);

// Graupunkt
var gkGrau=GradationsKurve("Graupunkt");
gkGrau.setCurvePoints([
    [0,0],
    [istFarben[1].rgb.red, sollFarben[1].rgb.red],
    [255,255]
],'r');
gkGrau.setCurvePoints([
    [0,0],
    [istFarben[1].rgb.green, sollFarben[1].rgb.green],
    [255,255]
],'g');
gkGrau.setCurvePoints([
    [0,0],
    [istFarben[1].rgb.blue, sollFarben[1].rgb.blue],
    [255,255]
],'b');
gkGrau.layer.move(gruppe, ElementPlacement.INSIDE);

// Weisspunkt
var gkWeiss=GradationsKurve("Weisspunkt");
gkWeiss.setCurvePoints([
    [0,0],
    [istFarben[2].rgb.red,sollFarben[2].rgb.red]
],'r');
gkWeiss.setCurvePoints([
    [0,0],
    [istFarben[2].rgb.green,sollFarben[2].rgb.green]
],'g');
gkWeiss.setCurvePoints([
    [0,0],
    [istFarben[2].rgb.blue,sollFarben[2].rgb.blue]
],'b');
gkWeiss.layer.move(gruppe,ElementPlacement.INSIDE);
