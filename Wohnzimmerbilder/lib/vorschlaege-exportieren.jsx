// Konstanten
// ----------
// Name des SMartObj. mit dem Bilderstapel
// (wirdvon der Aktion angelegt)
var DUMMY_LAYER_NAME = "BEISPIELBILDER";
// JPEG-Qualitaet beim Export
var JPEG_QUALITY = 10;
// Bei mehreren Bilderstapeln: Trenner zwischen den einzelnen Ebenennamen
// im Namen der Export-Datei
var TRENNER="_und_";
// Praefix fuer den Export Ordner
var FOLDER_PREFIX="Ansichtsdateien_";
// ... und fuer die Einzelbilder
var FILE_PREFIX="Ansichtsdatei_";



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
// druckGroessen : Array der einelnen Druckgroessen
// suffix : Per prompt eingegenes Suffix
function createExportFolder(workFolder, docName, druckGroessen, suffix) {
    // Suffix vom Dokumentnamen entfernen
    var pos = docName.lastIndexOf('.');
    if (pos > 0) {
        var docNameNoSuffix = docName.substring(0, pos);
    } else {
        var docNameNoSuffix = docName;
    }
    // Verzeichnisnamen zusammenbauen
    // FOLDER_PREFIX (Druckgroessen) suffix
    var folderName = FOLDER_PREFIX+druckGroessen.join(TRENNER)+suffix;
    // Name des Exportverzeichnis: [Dokument name (ohne Suffix)]-export
    var exportFolder = new Folder(workFolder.fullName + "/" +folderName);
    // Folder.create() kann auch aufgerufen werden, wenn der Folder schon existiert,
    // Dann wird das einfach ignoriert.
    exportFolder.create();
    return exportFolder;
}




// Liste der Bilderstapel wird rekursiv abgearbeitet
// Die gefundenen Namensteile sind in der Liste ebenenNamen aufgesammelt 
function rekursiverExport(workDoc, exportFolder, stapelDocs, druckGroessen, suffix,ebenenNamen) {
    if (stapelDocs.length == 0) {
        // Fertig zum export - die Liste der noch zu verarbeitenden Stapel ist leer.
        activeDocument = workDoc;
        // Dateiname entsteht durch zusammenfuegen der aufgesammelten Ebenennamen
        // mit einem Trenner dazwischen und dem Suffix dahinter
        var exportFileName = FILE_PREFIX+ebenenNamen.join(TRENNER) +suffix+ ".jpg";
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
        var aktiveGroesse = druckGroessen[0];
        var restGroessen = druckGroessen.slice(0);
        // Ebenenkompositionen ...
        var comps = aktiverStapel.layerComps;
        for (var j = 0; j < comps.length; j++) {
            // Alle Ebenenkompositionen diese Stapels abarbeiten
            activeDocument = aktiverStapel;
            var comp = comps[j];
            // Die j-te Ebenenkomposition abarbeiten
            comp.apply();
            // Liste der Namensteile erweitern
            var mehrEbenen = ebenenNamen.slice();  // Erstellt eine Kopie
            var namensteil=aktiveGroesse+"_"+comp.name;
            mehrEbenen.push(namensteil); // ... und fuegt den aktivierten Ebenennamen (=Name der Ebenenkomposition an)
            activeDocument.save();
            // Rekursiver Aufruf fuer die Liste der noch zu bearbeitenden Stapel
            rekursiverExport(workDoc, exportFolder, restDocs, restGroessen, suffix, mehrEbenen);
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
    // Arbeitsdok.  merken 
    var workDoc = activeDocument;
    // Alle Bilderstapel finden
    var stapelListe = stapelFinden();
    if (stapelListe.length === 0) {
        alert("Keine Bilderstapel gefunden");
        return;
    }
    // Interaktive Abfrage des wahlfreien Namensteils
    var suffix=prompt("Wahlfreier Text?\n(Wird an Datei- und Ordnername angehaengt)", "");
    if( suffix==null ){
        // Benutzer hat abgebrochen...
        return;
    } else if( suffix.length>0 ){
        suffix="_"+suffix;
    }

    // Alle SmartObj oeffnen, Druckgroessen bestimmen und 
    // Ebenenkompositionen erstellen
    var stapelDomumente = []; // Liste der SmartObj. als geoeffnete Dokumente
    var druckGroessen=[];     // Druckgroesse in cm
    for (var j = 0; j < stapelListe.length; j++) {
        workDoc.activeLayer = stapelListe[j];
        editSmartObject();
        var smartObj = activeDocument;
        stapelDomumente.push(smartObj);
        stapelDokVorbereiten();
        var breite=Math.round(activeDocument.width.as("cm"));
        var hoehe=Math.round(activeDocument.height.as("cm"));
        druckGroessen.push(""+breite+"x"+hoehe);
        activeDocument = workDoc;
    }

    // Nur zur Sicherheit - das Arbeitsdok nochmal speichern,
    // damit wir den Pfad wissen
    activeDocument.save();
    var workFolder = activeDocument.path;
    var exportFolder = createExportFolder(workFolder, activeDocument.name, druckGroessen, suffix);
    
    
    
    // Rekursiver export
    rekursiverExport(workDoc, exportFolder, stapelDomumente, druckGroessen, suffix,[]);
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