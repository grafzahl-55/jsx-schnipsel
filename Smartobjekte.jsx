// Ein paar Hilfsfunktionen zum Thema Smartobjekt
// Vielleicht kann man das ja mal brauchen

/*
 * Konvertiert die aktuell aktive Ebene oder Gruppe in ein
 * Smartobjekt
 */
function convertToSmartObject(){
    var idnewPlacedLayer = stringIDToTypeID("newPlacedLayer");
    executeAction(idnewPlacedLayer, undefined, DialogModes.NO);
}

/*
 * Falls die aktive Ebene ein Smartobjekt ist, wird dieses
 * gerastert. Wenn nicht, dann passiert nichts.
 */
function rasterizeSmartObject(){
    if(activeDocument.activeLayer.kind===LayerKind.SMARTOBJECT){
         var idrasterizeLayer = stringIDToTypeID("rasterizeLayer");
        var desc13 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref1 = new ActionReference();
        var idLyr = charIDToTypeID("Lyr ");
        var idOrdn = charIDToTypeID("Ordn");
        var idTrgt = charIDToTypeID("Trgt");
        ref1.putEnumerated(idLyr, idOrdn, idTrgt);
        desc13.putReference(idnull, ref1);
        executeAction(idrasterizeLayer, desc13, DialogModes.NO);
    }
}

/*
 * Aktive Ebene muss ein SMartObjekt sein.
 * Das Smartobjekt wird als Dokument geoeffnet (so als haette man einen Doppelklick darauf gemacht)
 * Dadurch wird der Inhalt des SmartObj. zum nauen aktiven Dokument. 
 * Tip: Bevor man diese Funktion aufruft, empfiehlt es sich, sich das aktuelle
 * Dokument in einer Variablen zu merken. 
 * Zum Beispiel so:
 * 
 * var myDoc=activeDocument();
 * editSmartObject();
 * .... irgend etwas im SmartObjekt machen ... 
 * .... Das Smartobj. schließen... 
 * activeDocument.close(SaveOptions.SAVECHANGES);
 * ... Ist meist unnötig, aber zur Sicherheit: Das vorher aktive Dokument wieder aktiv machen
 * activeDocument=myDoc;
 */
function editSmartObject(){
    var idplacedLayerEditContents = stringIDToTypeID("placedLayerEditContents");
    var desc250 = new ActionDescriptor();
    executeAction(idplacedLayerEditContents, desc250, DialogModes.NO);
}

