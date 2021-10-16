/*
    Eine Funktion, mit derm man innerhalb eines Skripts
    den Bildprozessor-Dialog aufrufen kann.

    Falls die Funktion den Wert "cancel" zurückgibt,
    hat der Benutzer den "Abbrechen"-Button gedrückt,
    andernfalls wurde der Bildprocessor ausgeführt,

    Beispiel:
    ---------

    var result = openImageProcessor();
    if( result=="cancel" ){
        // .. der Benutzer hat abgebrochen ... 
    } else {
        // ... Bildprozessor ist durchgelaufen ... 
    }

*/

function openImageProcessor(){
    var scriptFile="Image Processor.jsx";
    return $.evalFile(Folder.appPackage+"/Presets/Scripts/"+scriptFile);
}

