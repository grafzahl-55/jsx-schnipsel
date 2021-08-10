// Aufgabe:
//
// Das aktuell aktive Dokument soll geschlossen werden (ohne Speichern)
// danach soll die Datei von der Fesplatte geloescht werden.
//
// Siehe auch: https://www.facebook.com/groups/rickmaschke/posts/1235967390177319/
//
// Obacht beim Ausprobieren!

function closeAndDeleteActiveDocument(){
    var docName=activeDocument.name;
    var docPath=activeDocument.path;
    var docFile=new File(docPath+"/"+docName);
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    docFile.remove();
}

closeAndDeleteActiveDocument();