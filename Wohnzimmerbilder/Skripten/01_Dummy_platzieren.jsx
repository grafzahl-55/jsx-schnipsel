// Im aktuell geöffneten Abeitsdokument wird ein "Dummy" platziert.
// Er soll per Hand so skaliert werden, als sei das Quadrat ca. 50x50 cm gross

var GRUPPE = "BILDVORSCHLAEGE";
var DUMMY = "__DUMMY__";
var DUMMY_FARBE = [128, 128, 128];
var DUMMY_CM=50;

function placeDummy() {
    // Gruppe anlegen
    var grp = activeDocument.layerSets.add();
    grp.name = GRUPPE;
    // Dumy Ebene anlegen
    var dummy = grp.artLayers.add();
    dummy.name = DUMMY;
    // Quadrat auswählen ( 1/4 der Dokumentbreite)
    // Mit Farbe fuellen
    var w=activeDocument.width/4;
    activeDocument.selection.select([[0,0],[0,w],[w,w],[w,0]]);
    // Mit Farbe fuellen
    var col = new SolidColor();
    col.rgb.red = DUMMY_FARBE[0];
    col.rgb.green = DUMMY_FARBE[1];
    col.rgb.blue = DUMMY_FARBE[2];
    activeDocument.selection.fill(col);
    activeDocument.selection.deselect();
    
    // Transformationsdialog aufrufen
    transformDialog();
}

// Mit dem ScriptingListener herausgepopelt
function transformDialog() {
    var idTrnf = charIDToTypeID("Trnf");
    var desc490 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref24 = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref24.putEnumerated(idLyr, idOrdn, idTrgt);
    desc490.putReference(idnull, ref24);
    var idFTcs = charIDToTypeID("FTcs");
    var idQCSt = charIDToTypeID("QCSt");
    var idQcsa = charIDToTypeID("Qcsa");
    desc490.putEnumerated(idFTcs, idQCSt, idQcsa);
    var idOfst = charIDToTypeID("Ofst");
    var desc491 = new ActionDescriptor();
    var idHrzn = charIDToTypeID("Hrzn");
    var idPxl = charIDToTypeID("#Pxl");
    desc491.putUnitDouble(idHrzn, idPxl, 0);
    var idVrtc = charIDToTypeID("Vrtc");
    var idPxl = charIDToTypeID("#Pxl");
    desc491.putUnitDouble(idVrtc, idPxl, 0);
    var idOfst = charIDToTypeID("Ofst");
    desc490.putObject(idOfst, idOfst, desc491);
    var idIntr = charIDToTypeID("Intr");
    var idIntp = charIDToTypeID("Intp");
    var idBcbc = charIDToTypeID("Bcbc");
    desc490.putEnumerated(idIntr, idIntp, idBcbc);
    executeAction(idTrnf, desc490, DialogModes.ALL);
}


function main(){
    var rulerUnits=preferences.rulerUnits;
    preferences.rulerUnits=Units.PIXELS;
    try{
        placeDummy();
    } finally{
        preferences.rulerUnits=rulerUnits;    
    }
}

activeDocument.suspendHistory("Dummy platzieren","main()");