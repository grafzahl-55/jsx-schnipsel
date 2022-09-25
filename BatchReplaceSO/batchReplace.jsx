
// JPEG-Qualität für die Ausgabe
const JPEG_QUALITY=12;

/*
 * Inhelt der aktuall ausgewählten Ebene (SmartObj!) ersetzen
*/
function replaceContent(file){
    // =======================================================
    var idplacedLayerReplaceContents = stringIDToTypeID( "placedLayerReplaceContents" );
    var desc257 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    desc257.putPath( idnull, file );
    var idLyrI = charIDToTypeID( "LyrI" );
    desc257.putInteger( idLyrI, 2 );
executeAction( idplacedLayerReplaceContents, desc257, DialogModes.NO );
}

/*
 * Suffix ".XYZ" aus Namen entfernen
 */
function removeSuffix(name){
    var pos=name.lastIndexOf('.');
    if(pos>0){
        return name.substring(0,pos);
    }else{
        return name;
    }
}


function main(){
    // Ist überhaupt ein Dokument geöffnet?
    if(!activeDocument) return;
    // Ist überhaupt eine Ebene markiert 
    // und ist diese eine SmartObj?
    var aLayer = activeDocument.activeLayer;
    if( (!aLayer) || (aLayer.kind != LayerKind.SMARTOBJECT) ){
        alert("Bitte ein SmartObjekt im Ebenenstapel auswählen");
        return;
    }

    // Eingabedateien auswählen
    var inputFiles = File.openDialog("Dateien zum Einfügen","*.*",true);
    if(inputFiles==null || inputFiles.length==0 ) {
        // Benutzer hat nichts ausgewählt
        return;
    }
    
    // Ausgabeverzeichnis auswählen
    var outputDir = Folder.selectDialog("Ausgabeverzeichnis");
    if(!outputDir){
        // Benutzer hat abgebrochen
        return;
    }

    var namePrefix = removeSuffix(activeDocument.name)+"_";

    var saveOpts = new JPEGSaveOptions();
    saveOpts.embedColorProfile = true;
    saveOpts.quality = JPEG_QUALITY;

    for( var i=0; i<inputFiles.length; i++ ){
        var file = inputFiles[i];
        replaceContent(file);
        var outputName = namePrefix+removeSuffix(file.name);
        var outputFile = new File(outputDir.fullName+"/"+outputName+".jpg");
        activeDocument.saveAs(outputFile,saveOpts,true,Extension.LOWERCASE); 
    }
    alert("Fertig.\n"+inputFiles.length+" Datei(en) exportiert");

}





try{
    main();
}catch(e){
    alert(e);
}