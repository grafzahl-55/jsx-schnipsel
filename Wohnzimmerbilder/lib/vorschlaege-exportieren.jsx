
// Konstanten
// ----------
// Name des SMartObj. mit dem Bilderstapel
// (wirdvon der Aktion angelegt)
var DUMMY_LAYER_NAME="BEISPIELBILDER";
// JPEG-Qualitaet beim Export
var JPEG_QUALITY=10;


// Erzeugt fuer dan aktuellen Dokumentzustand
// Eine Ebenenkomposition mit dem angegebenen
// Namen "compName"
function createLayerComposition(compName) {
    var idMk = charIDToTypeID("Mk  ");
    var desc233 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref3 = new ActionReference();
    var idcompsClass = stringIDToTypeID("compsClass");
    ref3.putClass(idcompsClass);
    desc233.putReference(idnull, ref3);
    var idUsng = charIDToTypeID("Usng");
    var desc234 = new ActionDescriptor();
    var iduseVisibility = stringIDToTypeID("useVisibility");
    desc234.putBoolean(iduseVisibility, true);
    var idusePosition = stringIDToTypeID("usePosition");
    desc234.putBoolean(idusePosition, false);
    var iduseAppearance = stringIDToTypeID("useAppearance");
    desc234.putBoolean(iduseAppearance, false);
    var iduseChildLayerCompState = stringIDToTypeID("useChildLayerCompState");
    desc234.putBoolean(iduseChildLayerCompState, true);
    var idTtl = charIDToTypeID("Ttl ");
    desc234.putString(idTtl, compName);
    var idcompsClass = stringIDToTypeID("compsClass");
    desc233.putObject(idUsng, idcompsClass, desc234);
    executeAction(idMk, desc233, DialogModes.NO);
}

// Aktuelle Ebene muss ein SmartObj. sein.
// Dieses wird zur Bearbeitung geoeffnet und wird
// dadurch zum aktiven Dokument
function editSmartObject() {
    var idplacedLayerEditContents = stringIDToTypeID("placedLayerEditContents");
    var desc250 = new ActionDescriptor();
    executeAction(idplacedLayerEditContents, desc250, DialogModes.NO);
}

// Macht das SmartObj. mit dem Bilderstapel zur aktiven Ebene
function activateDummyLayer(){
    try{
        activeDocument.activeLayer=activeDocument.artLayers[DUMMY_LAYER_NAME];
    } catch(e) {
        throw "Fehler: SmartObj mit Name "+DUMMY_LAYER_NAME+" nicht gefunden.";
    }
}

// Ordner fuer den Export bestimmen, bzw. anlegen
// workFolder : Ordner, in dem das Arbeitsdokument liegt
// docName    : Name des Arbeitsdocuments
function createExportFolder(workFolder,docName){
    // Suffix vom Dokumentnamen entfernen
    var pos = docName.lastIndexOf('.');
    if( pos>0 ){
        var docNameNoSuffix=docName.substring(0,pos);
    } else {
        var docNameNoSuffix=docName;   
    }
    // Name des Exportverzeichnis: [Dokument name (ohne Suffix)]-export
    var exportFolder=new Folder(workFolder.fullName+"/"+docNameNoSuffix+"-export");
    exportFolder.create();
    return exportFolder;
}

// Bestimmt den Dateinamen des exportierten Bilds aus dem Namen
// der sichbaren Ebene im SmartObj. 
function fileNameFromLayerName(layerName){
    // Mach's mir ganz einfach
    return layerName+".jpg";
}

// Exportiert den momentanen Zustand des Arbeitsdokuments als JPEG
// in den 
function exportJpeg(exportFolder, layerName){
    var fName=fileNameFromLayerName(layerName);
    var exportFile=new File(exportFolder.fullName+"/"+fName);
    var jpegOptions=new JPEGSaveOptions();
    jpegOptions.embedColorProfile=true;
    jpegOptions.quality=JPEG_QUALITY;
    activeDocument.saveAs(exportFile,jpegOptions,true,Extension.LOWERCASE);
}


// Hauptprogramm
function main(){
    // Nur zur Sicherheit - das Arbeitsdok nochmal speichern,
    // damit wir den Pfad wissen
    activeDocument.save();
    var workFolder=activeDocument.path;
    var exportFolder=createExportFolder(workFolder,activeDocument.name);
    // SmartObj mit dem Bilderstapel aktivieren
    activateDummyLayer();
    // Arbetsdok. und aktiviertes SmartObj. merken 
    var workDoc = activeDocument;
    var dummyLayer = activeDocument.activeLayer;
    // SmartObj oeffnen --- das macht den Inhalt des SmartObj zum aktiven Dokument
    editSmartObject();
    var smartObj = activeDocument;
    // Vorhandene Ebenenkompositionen loeschen
    smartObj.layerComps.removeAll();
    // Im ersten Schritt werden alle Ebenen im SmartObj unsichtbar gemacht
    for( var j=0; j<smartObj.layers.length; j++ ){
        smartObj.layers[j].visible=false;
    }
    // Jetzt werden sie einzeln sichtbar gemacht und
    // Ebenenkomposition wird erzeugt
    // Vorschau wird exportiert
    for( var j=0; j<smartObj.layers.length; j++ ){
        var lyr = smartObj.layers[j];
        lyr.visible=true;
        // Ebenenkomposition mit dem Namen der Ebene erstellen
        createLayerComposition(lyr.name);
        // SmartObj. speichern, damit sich diese Aenderung im Arbeitsdokument auswirkt
        smartObj.save();
        // Fuer den JPEG-Export nuesse wir zum Arbeitsdokument wechseln
        activeDocument=workDoc;
        exportJpeg(exportFolder,lyr.name);
        // Export ist erledigt --- zurueck zum smartObj wechseln und weiter in der Schleife
        activeDocument=smartObj;
        lyr.visible=false;
    }
    smartObj.close(SaveOptions.DONOTSAVECHANGES);
    activeDocument=workDoc;
    alert("Export erledigt. \nSiehe "+exportFolder.fsName);
}




main();