// Angeregt durch einen Facebook Artikel:
// 
// Aufgabenstellung
// ----------------
// Voraussetzung:
// Im Dateisystem gibt es - unter festem, bekannten Pfad - eine PSD-Datei als
// Vorlage für eine Titelzeile. Diese PSD-Datei enthält unter anderem (auf oberster Ebene, 
// also nicht in einer Gruppe verpackt) eine Textebene.
//
// Das aktuelle Dokument hat einen Namen der nach dem Muster "20x20_KR_(irgendwas)_FA.jpg" aufgebaut ist.
//  
// Im aktuellen Dokument soll folgendes passieren:
// (1) Die Titel-Vorlage wird im aktuellen Dokument als eingebettetes Smart-Objekt platziert
// (2) Dieses Smart Objekt wird zum Editieren geöffnet.
// (3) Aus dem Dateinamen wird alles vor "...KA_" und alles nach "_FA..." entfernt und der Rest 
//     wird als Inhalt in die Textebene geschrieben
// (4) Das Smart Objekt wird gespeichert und geschlossen 
// (5) Das Smart Objekt wird in die linke obere Ecke geschoben und (proportional) so skaliert,
//     dass es die gesamte Breite einnimmt.


//////////////////////////////////////////////////////////////////////////////////
// Konstanten, die erst angepasst werden müssen:
// ----------------------------------------------
// Absoluter Pfad zur Vorlage der Titelzeile
var TITLE_LAYOUT = "c:/tmp/Titelzeile.psd";
// Name der Textebene (innerhalb obigen Dokuments), die den Titel aufnehmen soll
var TEXT_LAYER="Titelzeile";

//////////////////////////////////////////////////////////////////////////////////
// Inhalt der Titelzeile bestimmen
function getTitle(){
    return activeDocument.name
        .replace(/^.*KR_/, '')     // Anfang bis KR_ --> ersetzen durch "leer"     
        .replace(/_FA.*$/, '');    // _FA bis Ende --> ersetzen durch "leer"
}

// Ein Dokument als SmartObj platzieren
function placeDocument(fileName) {
    var idPlc = charIDToTypeID("Plc ");
    var desc1273 = new ActionDescriptor();
    var idIdnt = charIDToTypeID("Idnt");
    desc1273.putInteger(idIdnt, 112);
    var idnull = charIDToTypeID("null");
    desc1273.putPath(idnull, new File(fileName));
    var idFTcs = charIDToTypeID("FTcs");
    var idQCSt = charIDToTypeID("QCSt");
    var idQcsa = charIDToTypeID("Qcsa");
    desc1273.putEnumerated(idFTcs, idQCSt, idQcsa);
    var idOfst = charIDToTypeID("Ofst");
    var desc1274 = new ActionDescriptor();
    var idHrzn = charIDToTypeID("Hrzn");
    var idPxl = charIDToTypeID("#Pxl");
    desc1274.putUnitDouble(idHrzn, idPxl, 0.000000);
    var idVrtc = charIDToTypeID("Vrtc");
    var idPxl = charIDToTypeID("#Pxl");
    desc1274.putUnitDouble(idVrtc, idPxl, 0.000000);
    var idOfst = charIDToTypeID("Ofst");
    desc1273.putObject(idOfst, idOfst, desc1274);
    executeAction(idPlc, desc1273, DialogModes.NO);
}

// Smart Objekt zum editieren oeffnen
// Das Smart object muss hierbei die aktive Ebene sein
function editSmartObject() {
    var idplacedLayerEditContents = stringIDToTypeID("placedLayerEditContents");
    var desc250 = new ActionDescriptor();
    executeAction(idplacedLayerEditContents, desc250, DialogModes.NO);
}


// Hauptprogramm
function main() {
    // Titel bestimmen
    var title = getTitle();
    // Merken, welches das aktive Dokument ist
    var mainDocument = activeDocument;
    
    // Tiel-Layout als Smart Objekt platzieren 
    placeDocument(TITLE_LAYOUT);
    var smartObj = activeDocument.activeLayer;
    // Sicherstellen, dass das SMart Obj. im Ebenenstapel ganz oben liegt
    smartObj.move(activeDocument,ElementPlacement.PLACEATBEGINNING);
    editSmartObject();

    // Textebene bestimmen und den Textinhalt duch den Titel ersetzen
    var textLayer=activeDocument.artLayers[TEXT_LAYER];
    textLayer.textItem.contents=title;
    // Aenderungen im SmartObj speichern
    activeDocument.close(SaveOptions.SAVECHANGES);

    // Wahrscheinlich unnoetig, stellt abe sicher das das anfangs aktive Dokument
    // wieder aktiviert wird
    activeDocument=mainDocument;

    // Smartobj. in die linke obere Ecke schieben
    smartObj.translate(-smartObj.bounds[0],-smartObj.bounds[1]);

    // Smartobj. auf Dokumentbreite skalieren
    // Aktuelle Breite einer EBene : bounds[2]-bounds[0]
    // Skalierungsfaktor muss in Prozent angegeben werden, daher *100
    var scaleFactor=mainDocument.width/(smartObj.bounds[2]-smartObj.bounds[0])*100;
    smartObj.resize(scaleFactor,scaleFactor,AnchorPosition.TOPLEFT);

}

// Dadurch wird für die ganze Operation nur ein einziger Protokollschritt aufgenommen
// Ansonsten lönnte man hier auch einfach main() aufrufen.
activeDocument.suspendHistory("Titel einfuegen", "main()");