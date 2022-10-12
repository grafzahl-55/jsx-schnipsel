// Namen der beteiligten Ebenen
const GRAPHICS = "tattoomotiv";
const LINE_TOP = "masslinie_breite";
const LINE_LEFT = "masslinie_hoehe";
const LABEL_TOP = "mass_breite";
const LABEL_LEFT = "mass_hoehe";
const ARROW_LEFT = "Pfeil_links";
const ARROW_RIGHT = "Pfeil_rechts";
const ARROW_UP = "Pfeil_oben";
const ARROW_DOWN = "Pfeil_unten";

// Abstand der Pfeile in Prozent der Breite/Höhe
const FDELTA=0;
// Fester Abstand in Pixeln
const FIX_OFFSET=30;

// Abstand Line zur Schrift
const LABEL_OFFSET=15;

// Falls Pfeile vorhanden, muss man die Linien etwas kürzer halten.
// ungefähr um die Breite eines Pfeils
const ARROW_SIZE=16;


// JPEG-Qualität für die Ausgabe
var SAVE_JPEG_COPY = true;
const JPEG_QUALITY = 12;

/*
 * Suffix ".XYZ" aus Namen entfernen
 */
function removeSuffix(name) {
    var pos = name.lastIndexOf('.');
    if (pos > 0) {
        return name.substring(0, pos);
    } else {
        return name;
    }
}


// Ebene nach Name finden
function findLayerByName(sName, parent) {
    if (!parent) parent = activeDocument;
    for (var j = 0; j < parent.layers.length; j++) {
        var y = parent.layers[j];
        if (y.name == sName) {
            return y;
        }
        if (y.typename == 'LayerSet') {
            var x = findLayerByName(sName, y);
            if (x) return x;
        }
    }
    return null;
}

// Ebene nach Namen finden 
// Falls Ebene nicht gefunden wird:
//    Falls optional = true : Liefert einfach null zurück
//    Falls optional = false : Gibt Fehlermeldung
function findLayerInDoc(sName, doc, optional) {
    const layer = findLayerByName(sName, doc);
    if (!optional && !layer) {
        alert("Ebene '" + sName + "' nicht gefunden in Dokument '" + doc.name + "'");
        throw ("Fehler bei der Bearbeitung");
    }
    return layer;
}

// Ein Dokument bearbeiten
function processDoc(doc) {
    if (!doc) return;
    // Beteiligte Ebenen suchen
    const gr = findLayerInDoc(GRAPHICS, doc);
    const lineTop  = findLayerInDoc(LINE_TOP, doc);
    const lineLeft = findLayerInDoc(LINE_LEFT, doc);
    const lblTop   = findLayerInDoc(LABEL_TOP, doc);
    const lblLeft  = findLayerInDoc(LABEL_LEFT, doc);
    // Die Pfeile sind optional
    const arLeft   = findLayerInDoc(ARROW_LEFT,doc,true);
    const arRight  = findLayerInDoc(ARROW_RIGHT,doc,true);
    const arUp     = findLayerInDoc(ARROW_UP,doc,true);
    const arDown   = findLayerInDoc(ARROW_DOWN,doc,true);


    // Abmessungen der Grafik
    const b0 = gr.bounds;
    const w0 = b0[2] - b0[0];
    const h0 = b0[3] - b0[1];

    ////////////////////////////////////////////////
    // Linie oben
    var b = lineTop.bounds;
    var w = b[2] - b[0];
    var h = b[3] - b[1];
    var deltaY =   b0[1]- h0/100*FDELTA - FIX_OFFSET -b[3];
    // Mitte bündig ausrichten
    lineTop.translate((b0[0]+b0[2])/2 - (b[0]+b[2])/2 , deltaY);
    // In x-Richtung skalieren // Ein paar Px abziehen wegen der Pfeile
    var factor=1;
    if( arLeft && arRight ){
        factor = (w0-ARROW_SIZE)/w*100;
    }else{
        factor = w0/w*100;
    }
    lineTop.resize(factor, 100, AnchorPosition.MIDDLECENTER);

    ////////////////////////////////////////////////
    // Schrift oben
    // Auf mittlere Position bringen
    b = lblTop.bounds;
    var delta = (b0[0] + b0[2]) / 2 - (b[0] + b[2]) / 2;
    var bL = lineTop.bounds;
    deltaY =   bL[1] - LABEL_OFFSET -b[3];
    lblTop.translate(delta, deltaY);

    // Pfeil nach links
    if( arLeft ){
        b = lineTop.bounds;
        var b1 = arLeft.bounds;
        var dx = b0[0]-b1[0];
        var dy = (b[1]+b[3])/2 - (b1[1]+b1[3])/2;
        arLeft.translate(dx,dy);
    }
    //PFeil nach rechts
    if( arRight ){
        b = lineTop.bounds;
        var b1 = arRight.bounds;
        var dx = b0[2]-b1[2];
        var dy = (b[1]+b[3])/2 - (b1[1]+b1[3])/2;
        arRight.translate(dx,dy);
    }

    ////////////////////////////////////////////////
    // Linie links
    b = lineLeft.bounds;
    w = b[2] - b[0];
    h = b[3] - b[1];
    var deltaX=b0[0]-h/100*FDELTA - FIX_OFFSET -b[2]; 
    // Mitte bündig ausrichten
    lineLeft.translate(deltaX, (b0[1]+b0[3])/2 - (b[1]+b[3])/2);
    // In y-Richtung skalieren
    if(arUp && arDown){
        factor = (h0-ARROW_SIZE)/h*100;
    }else{
        factor = h0 / h * 100;
    }
    lineLeft.resize(100, factor, AnchorPosition.MIDDLECENTER);

    ////////////////////////////////////////////////
    // Schrift links
    // Auf mittlere Position bringen
    b = lblLeft.bounds;
    bL = lineLeft.bounds;
    deltaX=bL[0]- LABEL_OFFSET -b[2]; 
    var delta = (b0[1] + b0[3]) / 2 - (b[1] + b[3]) / 2;
    lblLeft.translate(deltaX, delta);

    // Pfeil nach oben
    if( arUp ){
        b = lineLeft.bounds;
        var b1 = arUp.bounds;
        var dx = (b[0]+b[2])/2 - (b1[0]+b1[2])/2 
        var dy = b0[1] - b1[1];    
        arUp.translate(dx,dy);
    }
    //PFeil nach rechts
    if( arDown ){
        b = lineLeft.bounds;
        var b1 = arDown.bounds;
        var dx = (b[0]+b[2])/2 - (b1[0]+b1[2])/2; ;
        var dy = b0[3]-b1[3];
        arDown.translate(dx,dy);
    }

}


// Hauptroutine
function main() {

    var inputFiles = File.openDialog("Dateien bearbeiten", "*.psd", true);
    if (inputFiles == null || inputFiles.length == 0) {
        // Benutzer hat nichts ausgewählt
        return;
    }

    SAVE_JPEG_COPY = confirm("JPEG Kopien speichern?");
    if( SAVE_JPEG_COPY ){
        // Ausgabeverzeichnis auswählen
        var outputDir = Folder.selectDialog("JPEG Kopie speichern in");
        if (!outputDir) {
            // Benutzer hat abgebrochen
            return;
        }
    }
    
    var saveOpts = new JPEGSaveOptions();
    saveOpts.embedColorProfile = true;
    saveOpts.quality = JPEG_QUALITY;


    for (var j = 0; j < inputFiles.length; j++) {
        // Öffnen
        var doc = app.open(inputFiles[j]);
        processDoc(doc);
        if( SAVE_JPEG_COPY ){
            var outputName = removeSuffix(doc.name);
            var outputFile = new File(outputDir.fullName + "/" + outputName + ".jpg");
            // JPEG-Kopie speichern
            activeDocument.saveAs(outputFile, saveOpts, true, Extension.LOWERCASE);
        }
        
        doc.close(SaveOptions.SAVECHANGES);
    }
    alert("" + inputFiles.length + " Dateie(n) verarbeitet");
}

// Aufruf
// LIneal auf Pixel stellen
const rUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;
try {
    main();
} catch (e) {
    alert("Fehler:\n" + e);
} finally {
    app.preferences.rulerUnits = rUnits;
}
