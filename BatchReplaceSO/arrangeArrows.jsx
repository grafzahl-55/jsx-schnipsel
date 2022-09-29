// Namen der beteiligten Ebenen
const GRAPHICS = "tattoomotiv";
const ARROW_TOP = "masslinie_breite";
const ARROW_LEFT = "masslinie_hoehe";
const LABEL_TOP = "mass_breite";
const LABEL_LEFT = "mass_hoehe";

// Abstand der Pfeile in Prozent der Breite/Höhe
const FDELTA=0;
const FIX_OFFSET=15;



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

// Ebene finden und Fehlermeldung, wenn nicht gefunden
function findLayerInDoc(sName, doc) {
    const layer = findLayerByName(sName, doc);
    if (!layer) {
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
    const arTop = findLayerInDoc(ARROW_TOP, doc);
    const arLeft = findLayerInDoc(ARROW_LEFT, doc);
    const lblTop = findLayerInDoc(LABEL_TOP, doc);
    const lblLeft = findLayerInDoc(LABEL_LEFT, doc);

    // Abmessungen der Grafik
    const b0 = gr.bounds;
    const w0 = b0[2] - b0[0];
    const h0 = b0[3] - b0[1];

    ////////////////////////////////////////////////
    // Pfeil oben
    var b = arTop.bounds;
    var w = b[2] - b[0];
    var h = b[3] - b[1];
    var deltaY =   b0[1]- h0/100*FDELTA - FIX_OFFSET -b[3];
    // Linke Ecke bündig ausrichten
    arTop.translate(b0[0] - b[0], deltaY);
    // In x-Richtung skalieren
    arTop.resize(w0 / w * 100, 100, AnchorPosition.MIDDLELEFT);
    ////////////////////////////////////////////////
    // Schrift oben
    // Auf mittlere Position bringen
    b = lblTop.bounds;
    var delta = (b0[0] + b0[2]) / 2 - (b[0] + b[2]) / 2;
    lblTop.translate(delta, deltaY);

    ////////////////////////////////////////////////
    // Pfeil links
    b = arLeft.bounds;
    w = b[2] - b[0];
    h = b[3] - b[1];
    var deltaX=b0[0]-h/100*FDELTA - FIX_OFFSET -b[2]; 
    // Obere Ecke bündig ausrichten
    arLeft.translate(deltaX, b0[1] - b[1]);
    // In y-Richtung skalieren
    arLeft.resize(100, h0 / h * 100, AnchorPosition.TOPCENTER);

    ////////////////////////////////////////////////
    // Schrift links
    // Auf mittlere Position bringen
    b = lblLeft.bounds;
    var delta = (b0[1] + b0[3]) / 2 - (b[1] + b[3]) / 2;
    lblLeft.translate(deltaX, delta);
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
