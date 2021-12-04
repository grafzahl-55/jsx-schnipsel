// Liest den Textinhalt der Ebene HEXCODE
// wandelt den Hexcode in eine Farbe um
// und setzt diese als Farbe in die Farbebene FARBE
//
///////////////////////////////////////////////////////
// Konstanten
const NAME_HEX = 'HEXCODE'; // Name der Textebene, die den Hexcode der Farbe enthaelt
const NAME_FF  = 'FARBE';   // Name der Farbfläche

// Low-Level code zum setzen der Füllfarbe
// Dazu muss eine Farbfäche im Dokument aktiv sein
// (Mit dem ScriptingListener aufgenommen)
function setSolidFill(r,g,b) {
    var idsetd = charIDToTypeID("setd");
    var desc226 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref131 = new ActionReference();
    var idcontentLayer = stringIDToTypeID("contentLayer");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref131.putEnumerated(idcontentLayer, idOrdn, idTrgt);
    desc226.putReference(idnull, ref131);
    var idT = charIDToTypeID("T   ");
    var desc227 = new ActionDescriptor();
    var idClr = charIDToTypeID("Clr ");
    var desc228 = new ActionDescriptor();
    var idRd = charIDToTypeID("Rd  ");
    desc228.putDouble(idRd, r);
    var idGrn = charIDToTypeID("Grn ");
    desc228.putDouble(idGrn, g);
    var idBl = charIDToTypeID("Bl  ");
    desc228.putDouble(idBl, b);
    var idRGBC = charIDToTypeID("RGBC");
    desc227.putObject(idClr, idRGBC, desc228);
    var idsolidColorLayer = stringIDToTypeID("solidColorLayer");
    desc226.putObject(idT, idsolidColorLayer, desc227);
    executeAction(idsetd, desc226, DialogModes.NO);
}

// Hilfsfunktion, um das Dokument rekursiv nach eine
// Ebene mit bestimmtem Namen zu suchen
function findLayerByName(layerName,container){
    if(!container){
        container=app.activeDocument;
    }
    for(var j=0; j<container.layers.length; j++){
        if( container.layers[j].name===layerName ){
            return container.layers[j];
        }
    }
    for(var j=0; j<container.layerSets.length; j++){
        var found=findLayerByName(layerName,container.layerSets[j]);
        if( found ){
            return found;
        }
    }
    return null;
}

// 6-Stelligen Hexcode parsen
// Ergebnis: Array aus 3 Zahlen 0..255
function parseHexCode(hexCode){
    // Schmutz entfernen
    var hexCode1=hexCode.replace(/[^a-fA-F0-9]/g,'');
    if(hexCode1.length!=6){
        throw "Das ist kein gueltiger Hex-Code:"+hexCode;
    }
    var r = parseInt(hexCode1.substring(0,2),16);
    var g = parseInt(hexCode1.substring(2,4),16);
    var b = parseInt(hexCode1.substring(4,6),16);
    return [r,g,b];
}


function processDocument(){
    var hexCodeLayer = findLayerByName(NAME_HEX);
    if( hexCodeLayer==null ){
        throw "Ebene nicht gefunden:"+NAME_HEX;
    }
    var solidFillLayer = findLayerByName(NAME_FF);
    if( solidFillLayer==null ){
        throw "Ebene nicht gefunden:"+NAME_FF;
    }
    var hexCode=hexCodeLayer.textItem.contents;
    var rgb = parseHexCode(hexCode);
    activeDocument.activeLayer=solidFillLayer;
    setSolidFill(rgb[0],rgb[1],rgb[2]);
    // Hexcode-Ebene unsichtbar machen
    hexCodeLayer.visible=false;
}


function main(){
    try{
        processDocument();
    } catch(e){
        throw "Fehler in Dokument "+activeDocument.name+"\n"+e;
    }
}

activeDocument.suspendHistory("Hexcode2ff","main()");
