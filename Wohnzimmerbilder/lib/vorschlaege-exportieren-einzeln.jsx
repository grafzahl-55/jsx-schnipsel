// Konstanten
// ----------
// Name des SMartObj. mit dem Bilderstapel
// (wirdvon der Aktion angelegt)
var DUMMY_LAYER_NAME = "BEISPIELBILDER";
// JPEG-Qualitaet beim Export
var JPEG_QUALITY = 10;
// Bei mehreren Bilderstapeln: Trenner zwischen den einzelnen Ebenennamen
// im Namen der Export-Datei
var TRENNER = "_und_";
// Praefix fuer den Export Ordner
var FOLDER_PREFIX = "Ansichtsdateien_";
// ... und fuer die Einzelbilder
var FILE_PREFIX = "Ansichtsdatei_";
// ... und fuer die Druckdatendatei
var WORK_PREFIX = "Druckdaten_";



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
    var folderName = FOLDER_PREFIX + druckGroessen.join(TRENNER) + suffix;
    // Name des Exportverzeichnis: [Dokument name (ohne Suffix)]-export
    var exportFolder = new Folder(workFolder.fullName + "/" + folderName);
    // Folder.create() kann auch aufgerufen werden, wenn der Folder schon existiert,
    // Dann wird das einfach ignoriert.
    exportFolder.create();
    return exportFolder;
}




// Liste der Bilderstapel wird rekursiv abgearbeitet
// Die gefundenen Namensteile sind in der Liste ebenenNamen aufgesammelt 
function einzelnerExport(workDoc, exportFolder, stapelDocs, druckGroessen, suffix, stapelListe) {
    var visibility=[];
    for(var k=0; k<stapelListe.length; k++){
        visibility.push(stapelListe[k].visible);
        stapelListe[k].visible=false;
    }
    
    for(var k=0; k<stapelDocs.length; k++){
        stapelListe[k].visible=true;
        var aktiverStapel = stapelDocs[k];
        var druckGroesse = druckGroessen[k];
        var comps = aktiverStapel.layerComps;
        for (var j = 0; j < comps.length; j++) {
            // Alle Ebenenkompositionen diese Stapels abarbeiten
            activeDocument = aktiverStapel;
            var comp = comps[j];
            // Die j-te Ebenenkomposition abarbeiten
            comp.apply();
            activeDocument.save();    
            activeDocument=workDoc;
            var exportFileName = FILE_PREFIX +druckGroesse+"_"+comp.name + suffix + ".jpg";
            var exportFile = new File(exportFolder.fullName + "/" + exportFileName);
            var jpegOptions = new JPEGSaveOptions();
            jpegOptions.embedColorProfile = true;
            jpegOptions.quality = JPEG_QUALITY;
            activeDocument.saveAs(exportFile, jpegOptions, true, Extension.LOWERCASE);

           
        }
        stapelListe[k].visible=false;
        
        
        
    }
    for(var k=0; k<stapelListe.length; k++){
        stapelListe[k].visible=visibility[k];
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
        if (x.name != "__DUMMY__") {
            x.visible = true;
            createLayerComposition(x.name);
            x.visible = false;
        }
    }
    // Alle wieder einblenden
    for (var j = 0; j < activeDocument.artLayers.length; j++) {
        activeDocument.artLayers[j].visible = true;
    }

}

// Hauptprogramm
function main() {
    var rUnits = preferences.rulerUnits;
    preferences.rulerUnits = Units.PIXELS;
    // Arbeitsdok.  merken 
    var workDoc = activeDocument;
    var workDocWidth = workDoc.width.as("px");
    // Alle Bilderstapel finden
    var stapelListe = stapelFinden();
    if (stapelListe.length === 0) {
        alert("Keine Bilderstapel gefunden");
        return;
    }
    // Interaktive Abfrage des wahlfreien Namensteils
    var suffix = prompt("Wahlfreier Text?\n(Wird an Datei- und Ordnername angehaengt)", "");
    if (suffix == null) {
        // Benutzer hat abgebrochen...
        return;
    } else if (suffix.length > 0) {
        suffix = "_" + suffix;
    }

    // Alle SmartObj oeffnen, Druckgroessen bestimmen und 
    // Ebenenkompositionen erstellen
    var stapelDomumente = []; // Liste der SmartObj. als geoeffnete Dokumente
    var druckGroessen = []; // Druckgroesse in cm
    for (var j = 0; j < stapelListe.length; j++) {
        workDoc.activeLayer = stapelListe[j];
        editSmartObject();
        var smartObj = activeDocument;
        stapelDomumente.push(smartObj);
        stapelDokVorbereiten();
        var breite = Math.round(activeDocument.width.as("cm"));
        var hoehe = Math.round(activeDocument.height.as("cm"));
        druckGroessen.push("" + breite + "x" + hoehe);
        activeDocument = workDoc;
        workDoc.activeLayer.name=DUMMY_LAYER_NAME+"_"+breite+"x"+hoehe;
    }

    // Arbeitsverzeichnis ist das das Verzeichnis des "Wohntimmerbilds"
    var workFolder = activeDocument.path;
    // Jetzt speichern wir dieses Dokument als Druckdatendatei ab
    var docFileName = WORK_PREFIX + druckGroessen.join(TRENNER) + suffix + ".psb";
    var docFile = new File(workFolder.fullName + "/" + docFileName);
    /* Alt: Als PSD speichern 
    var saveOpts = new PhotoshopSaveOptions();
    saveOpts.alphaChannels = true;
    saveOpts.embedColorProfile = true;
    saveOpts.layers = true;
    activeDocument.saveAs(docFile, saveOpts, false, Extension.LOWERCASE);
    */
    // Neu: Als PSB
    saveAsPsb(docFile);
    //alert("SAVE!!!");
    var exportFolder = createExportFolder(workFolder, activeDocument.name, druckGroessen, suffix);

    // Die Auflösung der Stapeldokumente verringern
   
    for (var j = 0; j < stapelDomumente.length; j++) {
        activeDocument = stapelDomumente[j];
        // Aktuelle Pixelbreite
        var w=activeDocument.width.as("px");
        var scaleFactor=Math.round(w/workDocWidth);
        if(scaleFactor>1){
            activeDocument.resizeImage(activeDocument.width/scaleFactor,activeDocument.height/scaleFactor,
                    activeDocument.resolution/scaleFactor,ResampleMethod.AUTOMATIC);
            activeDocument.save();
        }
        
    }
    activeDocument=workDoc;
    


    
    einzelnerExport(workDoc, exportFolder, stapelDomumente, druckGroessen, suffix, stapelListe);
    // Alle SmartObj schliessen
    for (var j = 0; j < stapelDomumente.length; j++) {
        activeDocument = stapelDomumente[j];
        activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    }
    // Arbeitsdokument wieder aktivieren
    activeDocument = workDoc;
    alert("Export erledigt und Deruckdaten wurden gespeichert. \nSiehe " + exportFolder.fsName);
    workDoc.close(SaveOptions.DONOTSAVECHANGES);
    preferences.rulerUnits = rUnits;
}

function saveAsPsb(docFile) {
    var idsave = charIDToTypeID("save");
    var desc13 = new ActionDescriptor();
    var idAs = charIDToTypeID("As  ");
    var desc14 = new ActionDescriptor();
    var idmaximizeCompatibility = stringIDToTypeID("maximizeCompatibility");
    desc14.putBoolean(idmaximizeCompatibility, false);
    var idPhteight = charIDToTypeID("Pht8");
    desc13.putObject(idAs, idPhteight, desc14);
    var idIn = charIDToTypeID("In  ");
    desc13.putPath(idIn, docFile);
    var idDocI = charIDToTypeID("DocI");
    desc13.putInteger(idDocI, 525);
    var idCpy = charIDToTypeID("Cpy ");
    desc13.putBoolean(idCpy, false);
    var idLwCs = charIDToTypeID("LwCs");
    desc13.putBoolean(idLwCs, true);
    var idsaveStage = stringIDToTypeID("saveStage");
    var idsaveStageType = stringIDToTypeID("saveStageType");
    var idsaveBegin = stringIDToTypeID("saveBegin");
    desc13.putEnumerated(idsaveStage, idsaveStageType, idsaveBegin);
    executeAction(idsave, desc13, DialogModes.NO);
    
    // =======================================================
    var idsave = charIDToTypeID( "save" );
    var desc15 = new ActionDescriptor();
    var idAs = charIDToTypeID( "As  " );
        var desc16 = new ActionDescriptor();
        var idmaximizeCompatibility = stringIDToTypeID( "maximizeCompatibility" );
        desc16.putBoolean( idmaximizeCompatibility, false );
    var idPhteight = charIDToTypeID( "Pht8" );
    desc15.putObject( idAs, idPhteight, desc16 );
    var idIn = charIDToTypeID( "In  " );
    desc15.putPath( idIn,docFile );
    var idDocI = charIDToTypeID( "DocI" );
    desc15.putInteger( idDocI, 525 );
    var idCpy = charIDToTypeID( "Cpy " );
    desc15.putBoolean( idCpy, false );
    var idLwCs = charIDToTypeID( "LwCs" );
    desc15.putBoolean( idLwCs, true );
    var idsaveStage = stringIDToTypeID( "saveStage" );
    var idsaveStageType = stringIDToTypeID( "saveStageType" );
    var idsaveSucceeded = stringIDToTypeID( "saveSucceeded" );
    desc15.putEnumerated( idsaveStage, idsaveStageType, idsaveSucceeded );
    executeAction( idsave, desc15, DialogModes.NO );
    
}


activeDocument.suspendHistory('Vorschlaege exportieren', 'main()');
