// Export der Vorschlagbilder

var GRUPPE = "BILDVORSCHLAEGE";
var DUMMY = "__DUMMY__";

var gruppe=null;
// Initialisiert die Variable gruppe 
// Gibt im Erfolgsfall "true" zurueck, sonst "false"
function findGroup(){
    try{
        gruppe=activeDocument.layerSets[GRUPPE];
    }catch(e){
        alert("Gruppe "+GRUPPE+" nicht gefunden.");
        return false;
    }
    return true;
}

// Ein einzelnes Vorschaubild exportieren
// exportFolder - Verzeichnis, in das exportiert wird
// layer - Ebene die gerade sichtbar ist
function exportPreview(exportFolder,layer){
    var docName="Vorschlag_"+layer.name+".jpg";
    var docFile=new File(exportFolder.fullName+"/"+docName);
    var jpegOptions=new JPEGSaveOptions();
    jpegOptions.embedColorProfile=true;
    jpegOptions.quality=10;
    activeDocument.saveAs(docFile,jpegOptions,true,Extension.LOWERCASE);
}


function main(){
    if(!findGroup()){
        return;
    }
    var exportFolder=Folder.selectDialog("Ablageort der Vorschlagbilder");
    if(!exportFolder){
        // Benutzer hat den Dialog abgebrochen
        return;
    }
    // Alles in der Gruppe unsichtbar machen
    for( var j=0; j<gruppe.artLayers.length; j++){
        gruppe.artLayers[j].visible=false;
    }
    // Einzeln einschalten und exportieren
    var count=0;
    for( var j=0; j<gruppe.artLayers.length; j++){
        var layer=gruppe.artLayers[j];
        if( layer.name != DUMMY ){
            layer.visible=true;
            try{
                exportPreview(exportFolder, layer);
                count++;
            }finally{
                layer.visible=false;   
            }
        }
    }
    if(count==0){
        alert("Keine Vorschlagbilder gefunden");
    }else if(count==1){
        alert("1 Datei exportiert nach: "+exportFolder.fullName);
    }else{
        alert(""+count+" Dateien exportiert nach: "+exportFolder.fullName);
    }
}

activeDocument.suspendHistory("Vorschlagbilder exportieren","main()");