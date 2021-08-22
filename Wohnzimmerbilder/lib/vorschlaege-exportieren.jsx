// Konstanten
// ----------
// Name des SMartObj. mit dem Bilderstapel
// (wirdvon der Aktion angelegt)
var DUMMY_LAYER_NAME = "BEISPIELBILDER";
// JPEG-Qualitaet beim Export
var JPEG_QUALITY = 10;
// Bei mehreren Bilderstapeln: Trenner zwischen den einzelnen Ebenennamen
// im Namen der Export-Datei
var TRENNER="+";


// Erzeugt fuer dan aktuellen Dokumentzustand
// Eine Ebenenkomposition mit dem angegebenen
// Namen "compName"
function createLayerComposition(compName) {
    var layerComp = activeDocument.layerComps.add(compName, "Export", true, true, true);
}

// Aktuelle Ebene muss ein SmartObj. sein.
// Dieses wird zur Bearbeitung geoeffnet und wird
// dadurch zum aktiven Dokument
function editSmartObject() {
    var idplacedLayerEditContents = stringIDToTypeID("placedLayerEditContents");
    var desc250 = new ActionDescriptor();
    executeAction(idplacedLayerEditContents, desc250, DialogModes.NO);
}

// Errechnet eine Liste aller (auf oberster Ebene liegenden) Ebenen,
// deren Name den DUMMY_LAYERNAME enthaelt, und die Smartobjekte sind
function stapelFinden() {
    var stapelListe = [];
    for (var j = 0; j < activeDocument.artLayers.length; j++) {
        var y = activeDocument.artLayers[j];
        if ((y.name.indexOf(DUMMY_LAYER_NAME) >= 0) && (y.kind === LayerKind.SMARTOBJECT)) {
            stapelListe.push(y);
        }
    }
    return stapelListe;
}


// Ordner fuer den Export bestimmen, bzw. anlegen
// workFolder : Ordner, in dem das Arbeitsdokument liegt
// docName    : Name des Arbeitsdocuments
function createExportFolder(workFolder, docName) {
    // Suffix vom Dokumentnamen entfernen
    var pos = docName.lastIndexOf('.');
    if (pos > 0) {
        var docNameNoSuffix = docName.substring(0, pos);
    } else {
        var docNameNoSuffix = docName;
    }
    // Name des Exportverzeichnis: [Dokument name (ohne Suffix)]-export
    var exportFolder = new Folder(workFolder.fullName + "/" + docNameNoSuffix + "-export");
    exportFolder.create();
    return exportFolder;
}




// Liste der Bilderstapel wird rekursiv abgearbeitet
// Die gefundenen Ebenennamen sind in der Liste ebenenNamen aufgesammelt 
function rekursiverExport(workDoc, exportFolder, stapelDocs, ebenenNamen) {
    if (stapelDocs.length == 0) {
        // Fertig zum export
        activeDocument = workDoc;
        // Dateiname entsteht durch zusammenfuegen der aufgesammelten Ebenennamen
        // mit einem Trenner dazwischen
        var exportFileName = ebenenNamen.join(TRENNER) + ".jpg";
        var exportFile = new File(exportFolder.fullName + "/" + exportFileName);
        var jpegOptions = new JPEGSaveOptions();
        jpegOptions.embedColorProfile = true;
        jpegOptions.quality = JPEG_QUALITY;
        activeDocument.saveAs(exportFile, jpegOptions, true, Extension.LOWERCASE);
    } else {
        // Die Liste der zu verarbeitenden Stapeldokument ist noch nicht leer,
        // Wir arbeiten das erste Element der Liste ab; der Rest wird durch den
        // rekursiven Aufruf erledigt.
        var aktiverStapel = stapelDocs[0];
        var restDocs = stapelDocs.slice(1);
        // Ebenenkompositionen ...
        var comps = aktiverStapel.layerComps;
        for (var j = 0; j < comps.length; j++) {
            // Alle Ebenenkompositionen diese STapels abarbeiten
            activeDocument = aktiverStapel;
            var comp = comps[j];
            // Die j-te Ebenenkomposition abarbeiten
            comp.apply();
            // Liste der Ebenennamen erweitern
            var mehrEbenen = ebenenNamen.slice();  // Erstellt eine Kopie
            mehrEbenen.push(comp.name); // ... und fuegt den aktivierten Ebenennamen (=Name der Ebenenkomposition an)
            activeDocument.save();
            rekursiverExport(workDoc, exportFolder, restDocs, mehrEbenen);
        }

    }

}

// Einen Bilderstapel/SmartObj mit Bildvorschlaegen vorbereiten:
// Die Ebenen werden einzeln sichtbar gemacht und es werden die
// Ebenenkompositionen generiert, wo jeweils nur ein Bild sichtbat ist
function stapelDokVorbereiten() {
    // Zunaechst mal alle ebenen ausblenden
    for (var j = 0; j < activeDocument.artLayers.length; j++) {
        activeDocument.artLayers[j].visible = false;
    }
    // Eventuell vorhandene alte Ebenenkompositionen entfernen
    activeDocument.layerComps.removeAll();
    // Einzeln einblenden und die Ebenenkompositionen erstellen
    for (var j = 0; j < activeDocument.artLayers.length; j++) {
        var x = activeDocument.artLayers[j];
        x.visible = true;
        createLayerComposition(x.name);
        x.visible = false;
    }

}

// Hauptprogramm
function main() {
    // Nur zur Sicherheit - das Arbeitsdok nochmal speichern,
    // damit wir den Pfad wissen
    activeDocument.save();
    var workFolder = activeDocument.path;
    var exportFolder = createExportFolder(workFolder, activeDocument.name);
    // Arbeitsdok.  merken 
    var workDoc = activeDocument;
    // Alle Bilderstapel finden
    var stapelListe = stapelFinden();
    if (stapelListe.length === 0) {
        alert("Keine Bilderstapel gefunden");
        return;
    }
    // Alle SmartObj oeffnen 
    var stapelDomumente = [];
    for (var j = 0; j < stapelListe.length; j++) {
        workDoc.activeLayer = stapelListe[j];
        editSmartObject();
        var smartObj = activeDocument;
        stapelDomumente.push(smartObj);
        stapelDokVorbereiten();
        activeDocument = workDoc;
    }
    // Rekursiver export
    rekursiverExport(workDoc, exportFolder, stapelDomumente, []);
    // Alle SmartObj schliessen
    for (var j = 0; j < stapelDomumente.length; j++) {
        activeDocument = stapelDomumente[j];
        activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    }
    // Arbeitsdokument wieder aktivieren
    activeDocument = workDoc;
    alert("Export erledigt. \nSiehe " + exportFolder.fsName);
}




activeDocument.suspendHistory('Vorschlaege exportieren', 'main()');