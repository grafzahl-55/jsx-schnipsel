// Erzeugt einen Blendenfleck an der Position des 1. Messpunkts
// (oder genau in der Mitte, wenn kein Messpunkt gesetzt ist)
// Der Blendenfleck wird auf einer separaten grauen Ebene angelegt,
// die bei 20% Fläche im Modus lineares Licht verrechnet wird.
//
//
//

function _blendenfleck(x, y) {
    var idLnsF = charIDToTypeID("LnsF");
    var desc27 = new ActionDescriptor();
    var idBrgh = charIDToTypeID("Brgh");
    desc27.putInteger(idBrgh, 100);
    var idFlrC = charIDToTypeID("FlrC");
    var desc28 = new ActionDescriptor();
    var idHrzn = charIDToTypeID("Hrzn");
    desc28.putDouble(idHrzn, x);
    var idVrtc = charIDToTypeID("Vrtc");
    desc28.putDouble(idVrtc, y);
    var idPnt = charIDToTypeID("Pnt ");
    desc27.putObject(idFlrC, idPnt, desc28);
    var idLns = charIDToTypeID("Lns ");
    var idLns = charIDToTypeID("Lns ");
    var idZm = charIDToTypeID("Zm  ");
    desc27.putEnumerated(idLns, idLns, idZm);
    executeAction(idLnsF, desc27, DialogModes.ALL);
}

// Erzeugt eine graue Farbflaeche mit vorgegebenem Namen
// Return: Die erzeugte Ebene
function graueFarbflaeche(ebenenName) {
    var idMk = charIDToTypeID("Mk  ");
    var desc212 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref123 = new ActionReference();
    var idcontentLayer = stringIDToTypeID("contentLayer");
    ref123.putClass(idcontentLayer);
    desc212.putReference(idnull, ref123);
    var idUsng = charIDToTypeID("Usng");
    var desc213 = new ActionDescriptor();
    var idType = charIDToTypeID("Type");
    var desc214 = new ActionDescriptor();

    var idClr = charIDToTypeID("Clr ");
    var desc215 = new ActionDescriptor();
    var idRd = charIDToTypeID("Rd  ");
    desc215.putDouble(idRd, 127.5);
    var idGrn = charIDToTypeID("Grn ");
    desc215.putDouble(idGrn, 127.5);
    var idBl = charIDToTypeID("Bl  ");
    desc215.putDouble(idBl, 127.5);
    var idRGBC = charIDToTypeID("RGBC");
    desc214.putObject(idClr, idRGBC, desc215);

    var idsolidColorLayer = stringIDToTypeID("solidColorLayer");
    desc213.putObject(idType, idsolidColorLayer, desc214);
    var idcontentLayer = stringIDToTypeID("contentLayer");
    desc212.putObject(idUsng, idcontentLayer, desc213);
    executeAction(idMk, desc212, DialogModes.NO);
    var ebene = activeDocument.activeLayer;
    ebene.name = ebenenName;
    return ebene;
}

// Konvertiert die aktuelle Ebene in ein Smart Objekt.
// Return: Die Smart-Objekt ebene
function convertToSmartObject() {
    var idnewPlacedLayer = stringIDToTypeID("newPlacedLayer");
    executeAction(idnewPlacedLayer, undefined, DialogModes.NO);
    return activeDocument.activeLayer;
}

function main() {
    var x = 0.5,
        y = 0.5;
    if (activeDocument.colorSamplers.length > 0) {
        var cs = activeDocument.colorSamplers[0];
        x = cs.position[0] / activeDocument.width;
        y = cs.position[1] / activeDocument.height;
    }
    var ff = graueFarbflaeche("Blendenfleck");
    var smartObj = convertToSmartObject();
    smartObj.blendMode = BlendMode.LINEARLIGHT;
    smartObj.fillOpacity=20;
    _blendenfleck(x, y);

}


activeDocument.suspendHistory('Blendenfleck (Skript)', 'main()');