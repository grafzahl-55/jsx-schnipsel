// Das Skrip zu einem kleinen Experiment betreffs JPEG-Qualitaet
// Siehe dazu meinen Post: https://www.facebook.com/groups/rickmaschke/posts/1185761471864578/
//
// Was passiert hier?
// Es liegt eine Originaldatei im PSD-Format vor.
// Davon erzeugen wir eine Arbeitskopie im JPEG-Format 
// Die Arbitskopie wird N mal geöffnet und wieder als JPEG überspeichert. 
// Bei gewissen Zwischenschritten merken wir uns den Zwischenstand in einer extra JPEG-Datei
// um später zu beurteilen, wie sich die JPEG-Artefakte "vermehren". 
//
// Wer das selber probieren möchte: Die Konstanten nach eigenen Bedürfnissen anpassen

/////////////////////////////////////////////////////////////////////////////////
// KONSTANTEN
// -----------
// Orginaldatei
ORIGINAL="C:/tmp/jpg/Original.psd";
// JPEG-Arbeitskopie
WORKING_COPY="C:/tmp/jpg/Arbeitskopie.jpg";
// Zwischenstaende
INTERMEDIATE="C:/tmp/jpg/Zwischenstand_{N}.jpg";
// JPG - Qualitaet beim Speichern
JPEG_QUALITY=10
// Anzahl der Schritte. Hier insgesamt 100 Schritte
// Mit Zwischenständen bei 1,5,10,20,50 und 100
// Die Zahlen müssen hier schon geordnet sein.
STEPS=[1,5,10,20,50,100];

/////////////////////////////////////////////////////////////////////////////////
// Die letzte Zahl gibt an, wie oft das Ganze überhaupt wiederholt werden soll
LAST_STEP=STEPS[STEPS.length-1];

// Originaldatei in PS oeffnen
function openOriginal(){
    app.load(new File(ORIGINAL));
}

// Arbeitskopie mit vorgegeber JPEG-Qualitaet abspeichern
function saveCopy(){
    var options=new JPEGSaveOptions();
    options.quality=JPEG_QUALITY;
    options.embedColorProfile=true;
    activeDocument.saveAs(new File(WORKING_COPY),options,true,Extension.LOWERCASE);
}

// Dokument schließen (nicht speichern, das machen wir separat)
function closeDoc(){
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}

// Arbeitskopie öffnen
function openWorkingCopy(){
    app.load(new File(WORKING_COPY));
}

// Den Zwischenstand nach n Schritten speichern
function saveIntermediate(n){
    // Ersetze "{N}" durch die aktuelle Zahl n
    var filename=INTERMEDIATE.replace(/\{N\}/,""+n);
    var options=new JPEGSaveOptions();
    options.quality=JPEG_QUALITY;
    options.embedColorProfile=true;
    activeDocument.saveAs(new File(filename),options,true,Extension.LOWERCASE);
}

// Macht eigentlich nichts (eine leere Ebene wird hinzugefuegt und gleich wieder geloescht)
// aber PS soll "denken" dass etwas geänder wurde
function doNothing(){
    var x=activeDocument.artLayers.add();
    x.remove();
}

// Zwischen dem Schliessen und wieder Oeffnen der Date muss etwas Zeit vergehen
// Das ist wahnsinnig unelegeant hier - tot aber seinen Zweck
function wasteTime(){
    s=0;
    for(var i=0; i<5000000; i++){
        s+=i;
    }
}

// Hier geht's los
openOriginal();
saveCopy();
closeDoc();
for(var n=1; n<=LAST_STEP; n++){
    wasteTime();
    openWorkingCopy();
    doNothing();
    saveCopy();
    if( STEPS.indexOf(n)>=0 ){
        // Speicher Zwisachenstand, wenn der aktuelle Zaehler (n) in der Liste STEPS vorkommt
        saveIntermediate(n);
    }
    closeDoc();
}