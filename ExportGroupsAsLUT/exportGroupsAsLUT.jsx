// Enthaelt die Hilfsfunktionen zum LUT-Export
// @include 'LutExport.jsx'

// KONSTANTEN
// ----------
// Das Zielverzeichnis 
var ZIEL="C:/tmp/lut-export"
// Formate - das Skript unterstuetzt zwei Exportformate
// .*cube und *.icc
var AS_CUBE=true;
var AS_ICC=true;

var COPYRIGHT="-";
var GRIDSIZE=32;

// Ersetzt im String nm alle "unerlaubten" Zeichen durch _
function nameBereinigen(nm){
    return nm.replace(/[^a-zA-Z0-9_-]/g,"_");
}

// Eine Gruppe als LUT exportieren:
// workDoc - das Urspruengliche Dokument (muss gerade aktiv sein)
// gridDoc - das Dokument mit der Farbpalette
// gruppe  - Die zu exportierende Gruppe 
function exportGroup(workDoc,gridDoc,gruppe){
    // Gruppe in das Grid-Dok. kopieren
    var gruppeKopie = gruppe.duplicate(gridDoc,ElementPlacement.PLACEATBEGINNING);
    // Grid-Dokument aktivieren 
    activeDocument=gridDoc;
    // Kopie der Gruppe sichtbar machen 
    gruppeKopie.visible=true;
    // Verläufe unsichtbar machen - fie eignen sich nicht im LUT-Export
    makeGradientsInvisible(gruppeKopie);
    // Name der LUT-Datei
    var lutName=nameBereinigen(gruppe.name);
    var lutPath=ZIEL+"/"+lutName;
    // Siehe LutExport.jsx
    $lutExport.exportGridAsLUT(lutPath, "Created from "+workDoc.name, COPYRIGHT, AS_ICC, AS_CUBE);
    // Kopie der Gruppe loeschen 
    gruppeKopie.remove();
    // Ursprungsdokument wieder aktivieren 
    activeDocument=workDoc;
}

// Alle Verläufe ausblenden
function makeGradientsInvisible(grp){
    for( var j=0; j<grp.layers.length; j++){
        var x=grp.layers[j];
        if( x.typename=="LayerSet" ){
            // Verschachtelte Gruppen rekursiv behandeln 
            makeGradientsInvisible(x);
        }else if( x.kind==LayerKind.GRADIENTFILL ){
            x.visible=false;
        }
    }
} 


// Alle offenen Gruppen schliessen
function collapseAllGroups(){
    var desc1 = new ActionDescriptor();
    executeAction(app.stringIDToTypeID('collapseAllGroupsEvent'), desc1,  DialogModes.NO);
}

function main(){
    // Zielverzeichnis erzeugen, wenn notwendig
    new Folder(ZIEL).create();
    // Das aktuelle Dokument (mit den Ebenen)
    var workDoc=activeDocument;
    // Muss im sRGB vorliegen, damit das Skript funktioniert 
    workDoc.convertProfile("sRGB IEC61966-2.1",Intent.PERCEPTUAL);
    // Ein neues Dokument mit der Farbpalette herstellen
    var gridDoc=$lutExport.createGrid("__TEMP__",GRIDSIZE);
    // Zureuck zum Ursprungsdok. 
    activeDocument=workDoc;
    for( var j=0; j<workDoc.layerSets.length; j++ ){
        var gruppe = workDoc.layerSets[j];
        exportGroup(workDoc,gridDoc,gruppe);
    }
    // GRID Dokument verwerfen 
    gridDoc.close(SaveOptions.DONOTSAVECHANGES);
    collapseAllGroups();
}

try{
    main();
}catch(e){
    alert(e);
}

// Hauptprogramm aufrufen
//activeDocument.suspendHistory("ExportGroupsAsLUT","main()");


