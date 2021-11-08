// Speichert eine JPEG-Kopie des aktuellen Dokuments
// Für den Speicherort wird ein Dateidialog geöffnet
//
//////////////////////////////////////////////////////////
//
// Konstanten
//
const DEFAULT_FOLDER="/c/tmp/export";   // !!!! Anpassung notwendig !!!

const JPEG_QUALITY=12;


function saveJpegCopy(){
    var doc=activeDocument;
    if( !doc ){
        // Kein aktuelles Dokument offen
        return;
    }

    // Namen des JPEG File bestimmen
    var docName=activeDocument.name;
    var pos=docName.lastIndexOf('.');
    if(pos>0){
        docName=docName.substring(0,pos);
    }
    docName+=".jpg";
    
    var destFolder=new Folder(DEFAULT_FOLDER).selectDlg("Zielverzeichnis auswaehlen...");
    if(!destFolder){
        // Benutzer hat abgebrochen
        return;
    }
    var jpgFile=new File(destFolder+"/"+docName);
    
    const opts=new JPEGSaveOptions();
    opts.embedColorProfile=true;
    opts.quality=JPEG_QUALITY;
    activeDocument.saveAs(jpgFile,opts,true,Extension.LOWERCASE);
    alert("Kopie gespeichert:"+jpgFile);
    
}


saveJpegCopy();

