// Drei kleine Funktionen, um per Skript eine bestimmte Zoomstufe
// einzustellen. 
//
// Code (teilweise) 'geklaut' und angepasst aus diesem Artikel:
// https://photography-berlin.blogspot.com/2013/09/photoshop-cs6-custom-zoom-percentage.html?fbclid=IwAR3WdknHVrt_oKywZ1fpb1hNaBhBGrqCJ2uGW-Nc9MTK0X4Q0P0aMX8--_s
//
// 
//////////////////////////////////////////////////////////////////////////////////
//
// Zoomstufe einstellen
// 
// INPUT
// zoom    : Gewünschte Zoomstufe in Prozent
//
function setZoomLevel(zoom) {
    if (zoom < 1) zoom = 1;
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("capp"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var getScreenResolution = executeActionGet(ref).getObjectValue(stringIDToTypeID('unitsPrefs')).getUnitDoubleValue(stringIDToTypeID('newDocPresetScreenResolution')) / 72;
    var docResolution = activeDocument.resolution;
    activeDocument.resizeImage(undefined, undefined, getScreenResolution / (zoom / 100), ResampleMethod.NONE);
    var desc = new ActionDescriptor();
    app.runMenuItem(app.charIDToTypeID('PrnS'));
    activeDocument.resizeImage(undefined, undefined, docResolution, ResampleMethod.NONE);
};


// 
// Dokument in Druckgröße anzeigen
// Nota bene: Dazu muss die Bildschirmauflösung in den Voreinstellungen
// korrekt eingetragen sein
//
// INPUT
// zoom   : Optional. Wenn gesetzt, wird zusätzlich um diesen Faktor (in Prozent) gezoomt. 
//          Wenn nicht angegeben wird auf die aktuelle Druckgröße gezoomt. 
//          Beispiel: zoomToPrintSize(50) : Zoome auf 50% der aktuellen Druckgröße 
//
function zoomToPrintSize(zoom) {
    if ((!zoom) || zoom == 100) {
        app.runMenuItem(app.charIDToTypeID('PrnS'));
    } else {
        var factor =zoom / 100;
        var currentRes = activeDocument.resolution;
        var tmpRes = currentRes / factor;
        activeDocument.resizeImage(null, null, tmpRes, ResampleMethod.NONE);
        app.runMenuItem(app.charIDToTypeID('PrnS'));
        activeDocument.resizeImage(null, null, currentRes, ResampleMethod.NONE);
    }
}



//
// Dokument in den Bildschirm einpassen
// (Ansicht --> Ganzes Bild)
function fitToScreen(){
     app.runMenuItem(app.charIDToTypeID('FtOn'));   
}


// Beispiele:
//
// setZoomLevel(75);     ==> Zoomstufe auf 75% einstellen
// zoomToPrintSize();    ==> Entspricht: Ansicht -> Druckformat 
// zoomToPrintSize(50);  ==> Ansicht im Druckformat, aber zusätzlich auf 50% verkleinert
// fitToScreen();        ==> Entspricht: Ansicht -> Ganzes Bild
//
