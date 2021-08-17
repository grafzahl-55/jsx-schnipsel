// Laden der Voschlag-Bilder

var GRUPPE = "BILDVORSCHLAEGE";
var DUMMY = "__DUMMY__";
var DUMMY_FARBE = [128, 128, 128];
var DUMMY_CM = 50;

// Diese Variablen werden in main(), bzw. der Funktion
//  findGroupAndDummyLayer initialisiert
var dummyLayer=null;
var gruppe=null;
var dummyWidthInPx=0;
var dummyCenterX=0;
var dummyCenterY=0;


// Oeffnet File-Dialog zur Auswahl von 1 oder mehreren Bildern
function openFiles() {
    var result = File.openDialog("Vorschlagsbilder platzieren", "Alle:*.*", true);
    return result;
}

// Das ist wieder beim ScriptingListener abgekupfert
// Der "low level code" wenn eine Datei als verknuepftes
// bzw. eingebettetes SmartObj. platziert wird. 
function placeSingleFile(file,asLinkedSmartObj) {
    var idPlc = charIDToTypeID("Plc ");
    var desc5599 = new ActionDescriptor();
    var idIdnt = charIDToTypeID("Idnt");
    desc5599.putInteger(idIdnt, 25);
    var idnull = charIDToTypeID("null");
    desc5599.putPath(idnull, file);

    if( asLinkedSmartObj){
        var idLnkd = charIDToTypeID("Lnkd");
        desc5599.putBoolean(idLnkd, true);
    }
    
    var idFTcs = charIDToTypeID("FTcs");
    var idQCSt = charIDToTypeID("QCSt");
    var idQcsa = charIDToTypeID("Qcsa");
    desc5599.putEnumerated(idFTcs, idQCSt, idQcsa);
    var idOfst = charIDToTypeID("Ofst");
    var desc5600 = new ActionDescriptor();
    var idHrzn = charIDToTypeID("Hrzn");
    var idRlt = charIDToTypeID("#Rlt");
    desc5600.putUnitDouble(idHrzn, idRlt, 0.000000);
    var idVrtc = charIDToTypeID("Vrtc");
    var idRlt = charIDToTypeID("#Rlt");
    desc5600.putUnitDouble(idVrtc, idRlt, 0.000000);
    var idOfst = charIDToTypeID("Ofst");
    desc5599.putObject(idOfst, idOfst, desc5600);
    executeAction(idPlc, desc5599, DialogModes.NO);
    return activeDocument.activeLayer;
}

// Initialisiert die Variablen gruppe und dummyLayer
// Gibt im Erfolgsfall "true" zurueck, sonst "false"
function findGroupAndDummyLayer(){
    try{
        gruppe=activeDocument.layerSets[GRUPPE];
    }catch(e){
        alert("Gruppe "+GRUPPE+" nicht gefunden.\nBitte erst das Skript \'01_Dummy_platzieren\'' laufen lassen.");
        return false;
    }
    try{
        dummyLayer=gruppe.artLayers[DUMMY];
        // Berechnung von Breite und Mittelpunkt der Dummy Ebene
        dummyWidthInPx=dummyLayer.bounds[2]-dummyLayer.bounds[0];
        dummyCenterX=(dummyLayer.bounds[2]+dummyLayer.bounds[0])/2;
        dummyCenterY=(dummyLayer.bounds[3]+dummyLayer.bounds[1])/2;
        return true;
    }catch(e){
        alert("Dummy Ebene nicht gefunden.\nBitte die Gruppe "+GRUPPE+" loeschen und das Skript  \'01_Dummy_platzieren\'' laufen lassen.");
        return false;
    }
    return true;
}

// Hier spielt die eigentlicge Musik:
// In dieser Funktion wird eine Datei (file) genommen,
// und das zugehörige Bild als (eingebettetes oder verknüpftes)
// Smart Obj. platziert. 
// Dieses Smart Obj. wird dann verschoben und skaliert
function placeAndScale(file){
    var asLinkedSmartObj=true;
    var layer=placeSingleFile(file, asLinkedSmartObj);
    // Jetzt muessen wir das Smart Obj. oeffnen, um an die tatsaechliche Druckabmessung heranzukommen
    var arbeitsDok=activeDocument;
    openSmartObject();
    // Nun ist das Smart Objekt das aktive Dokument
    // Lese jetzt Abmessungen in CM aus
    var druckBreiteInCm=activeDocument.width.as("cm");
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    activeDocument=arbeitsDok;  // .. und zurueck zu unserem Arbeitsdokument 
    
    // Jetziger Mittelpunkt der platzierten Ebene
    var layerCenterX=(layer.bounds[2]+layer.bounds[0])/2;
    var layerCenterY=(layer.bounds[3]+layer.bounds[1])/2;
    // Platzierte Ebene so verschieben, dass der Mittelpunkt im Mittelpunkt der Dummy-Datei liegt
    var deltaX=dummyCenterX-layerCenterX;
    var deltaY=dummyCenterY-layerCenterY;
    layer.translate(deltaX,deltaY);
     // Skalieren (und zwar mit der Mitte als Ankerpunkt weil der Mittelpunkt schon richtig ist)
    //
    // Wieviel Pixel des Arbeitsdokuments entsprechen 1 cm Druckbreite?
    // Antwort:
    // Dummybreite in Px / 50cm (btw. DUMMY-CM)
    //
    var pxPerCm=dummyWidthInPx/DUMMY_CM;
    // Sollbreite der platzierten Ebene (in Px)
    var sollBreiteInPx = pxPerCm*druckBreiteInCm;
    // Tatsaechliche Breite
    var istBreiteInPx = layer.bounds[2]-layer.bounds[0];
    // Das ergibt den Skalierungsfaktor (in Prozent)
    var scaleFactor = 100*sollBreiteInPx/istBreiteInPx;
    layer.resize(scaleFactor,scaleFactor,AnchorPosition.MIDDLECENTER);

    // Innerhalb der Gruppe - alle bis auf die eben platzierte Gruppe sichbar machen
    for(var j=0; j<gruppe.artLayers.length; j++){
        var y=gruppe.artLayers[j];
        if( y==layer ){
            y.visible=true;
        }else{
            y.visible=false;
        }
    }

}

// ScriptingListener... Oeffne ein Smart Obj.
function openSmartObject(){
    var idplacedLayerEditContents = stringIDToTypeID("placedLayerEditContents");
    var desc250 = new ActionDescriptor();
    executeAction(idplacedLayerEditContents, desc250, DialogModes.NO);
}


function main(){
    // Damit alles richtig laeuft, setze ich die Linealeinheiten
    // auf jeden Fall auf "Pixel"
    // Die derzeitige Einstellung wird später wiederhergestellt. 
    var rulerUnits=preferences.rulerUnits;
    preferences.rulerUnits=Units.PIXELS;
    try{

         // Gruppe und Dummy Ebene suchen
        // Wenn "false" zurueckkommt, nicht mehr weitermachen
        if(!findGroupAndDummyLayer()){
            return;
        }

        var files=openFiles();
        if( files==null ){
            // Benutzer hat abgebrochen...
            return;
        }

        for( var j=0; j<files.length; j++ ){
            // Aktiviere die Dummy-Ebene, damit alle platzierten
            // Smartobj. in der Gruppe entstehen
            activeDocument.activeLayer=dummyLayer;  
            var file=files[j];
            placeAndScale(file);
        }

    } finally{
        preferences.rulerUnits=rulerUnits;    
    }
}

activeDocument.suspendHistory("Vorschlagsbilder laden","main()");