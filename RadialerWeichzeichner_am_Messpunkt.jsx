// Radialer Weichzeichner an der Position des 1. Messpunkts
//


function _radialerWeichzeichner(x,y){
    // =======================================================
    var idRdlB = charIDToTypeID( "RdlB" );
    var desc51 = new ActionDescriptor();
    var idAmnt = charIDToTypeID( "Amnt" );
    desc51.putInteger( idAmnt, 10 );
    var idBlrM = charIDToTypeID( "BlrM" );
    var idBlrM = charIDToTypeID( "BlrM" );
    var idZm = charIDToTypeID( "Zm  " );
    desc51.putEnumerated( idBlrM, idBlrM, idZm );
    var idBlrQ = charIDToTypeID( "BlrQ" );
    var idBlrQ = charIDToTypeID( "BlrQ" );
    var idBst = charIDToTypeID( "Bst " );
    desc51.putEnumerated( idBlrQ, idBlrQ, idBst );
    var idCntr = charIDToTypeID( "Cntr" );
        var desc52 = new ActionDescriptor();
        var idHrzn = charIDToTypeID( "Hrzn" );
        desc52.putDouble( idHrzn, x );
        var idVrtc = charIDToTypeID( "Vrtc" );
        desc52.putDouble( idVrtc, y );
    var idPnt = charIDToTypeID( "Pnt " );
    desc51.putObject( idCntr, idPnt, desc52 );
    executeAction( idRdlB, desc51, DialogModes.ALL );

}

// Konvertiert die aktuelle Ebene in ein Smart Objekt.
// Return: Die Smart-Objekt ebene
function convertToSmartObject() {
    var idnewPlacedLayer = stringIDToTypeID("newPlacedLayer");
    executeAction(idnewPlacedLayer, undefined, DialogModes.NO);
    return activeDocument.activeLayer;
}

function main(){
    var x=0.5,y=0.5;
    if( activeDocument.colorSamplers.length>0 ){
        var cs=activeDocument.colorSamplers[0];
        x=cs.position[0]/activeDocument.width;
        y=cs.position[1]/activeDocument.height;
    }
    // Falls die aktive Ebene kein Smart Objekt ist...
    if( activeDocument.activeLayer.kind!=LayerKind.SMARTOBJECT){
        convertToSmartObject();
    }
    _radialerWeichzeichner(x,y);
}

activeDocument.suspendHistory('Radialer Weichzeichner', 'main()');
