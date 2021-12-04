
const NAME_FF  = 'FARBE';     // Name der Farbfläche
const NAME_TEXT = 'FARBNAME'; // Name der Textebene mit dem Farbnamen

// Erwartete Spaltenueberschriften
const KEY_NAME='FARBNAME';
const KEY_HEXCODE='HEXCODE';

// Kopie als PNG
function saveCopy(outputFolder,colorName,hexCode){
    var docName=colorName+"_"+hexCode+'.png';
    var outputFile=new File(outputFolder+"/"+docName);
    var options=new PNGSaveOptions();
    options.alphaChannels=true;
    activeDocument.saveAs(outputFile,options,true,Extension.LOWERCASE);
}


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


// CSV-Datei einlesen
function parseCSV(csvFile){
    csvFile.open('r');
    try{
        var headline=csvFile.readln();
        var headers=headline.split(',');
        var result=[];
        var line=csvFile.readln();
        while( line!=null && line.length>0 ){
            var data=line.split(',');
            if(data.length!=headers.length){
                throw "Illegale Zeile:'"+line+"' Ungueltige Anzahl von Spalten";
            }
            var record={};
            for(var j=0; j<headers.length; j++){
                var key=headers[j];
                var value=data[j];
                record[key]=value;
            }
            result.push(record);
            line=csvFile.readln();
        }
        return result;

    } finally {
        csvFile.close();
    }
    
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

// Dokument fuer einen Datensatz verarbeiten
function processDocument(outputFolder,textLayer,colorName,fillLayer,hexCode){
    textLayer.textItem.contents=colorName;
    var rgb=parseHexCode(hexCode);
    activeDocument.activeLayer=fillLayer;
    setSolidFill(rgb[0],rgb[1],rgb[2]);
    saveCopy(outputFolder,colorName,hexCode);
}


// Hauptprogramm
function main(){
    var templateFile=File.openDialog("Bitte die Vorlage laden");
    if( templateFile==null ){
        return;
    }
    app.open(templateFile);

    var csvFile=File.openDialog("Bitte die CSV-Datei auswaehlen",'*.csv');
    if(csvFile==null){
        return;
    }
    var dataSets=parseCSV(csvFile);
    alert("Gelesene Datensaetze:"+dataSets.length);
    var exportFolder=Folder.selectDialog('Bitte das Ausgabeverzeichnis auswaehlen');
    if(exportFolder==null){
        return;
    }

    // Textebene mit Farbnamen finden
    var textLayer = findLayerByName(NAME_TEXT);
    if( textLayer==null ){
        throw "Textebene "+NAME_TEXT+" nicht vorhanden";
    }
    var fillLayer = findLayerByName(NAME_FF);
    if( fillLayer==null ){
        throw "Farbflaeche "+NAME_FF+" nicht vorhanden";
    }

    for( var j=0; j<dataSets.length; j++){
        var colorName=dataSets[j][KEY_NAME];
        var hexCode=dataSets[j][KEY_HEXCODE];
        processDocument(exportFolder,textLayer,colorName,fillLayer,hexCode);
    }
    
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    alert("Export beendet.");

}

main();
