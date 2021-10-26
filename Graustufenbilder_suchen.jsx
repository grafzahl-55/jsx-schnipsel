// Rekursiv ein Vrzeichnis nach Graustufenbildern durchsuchen
// 
// Das Ergebnis ist eine Protokolldatei mit den Namen aller
// gefundener Graustufenbilder. 
//
///////////////////////////////////////////////////////////////
//
// Nach dem Start werden zwei Dateidialoge angezeigt:
//
// (1) Auswahl des Verzeichnisses, das durchsucht werden soll
// (2) Speicherort der Protokolldatei
//
// Das Verzeichnis wird rekursiv, inklusive aller Unterverzeichnisse
// Nach Bilddateien durchsucht (Dateiendungen aus der EXTENSIONS Liste), siehe unten. 
// Jede der gefundenen Bilddateien wird darufhin untersicht, ob es sich um 
// ein Graustufenbild handelt. 
//
// Prozess zur Erkennung, ob eine Bild ein Graustufenbild ist:
// (i)   Datei wird geöffnet und auf die Hintergrundebene reduziert. 
// (ii)  Die Hintergrundebene wird dupliziert und das Duplikat wird entättigt. 
// (iii) Das Duplikat wird in den Modus "Differenz" gesetzt
// (iv)  Wenn es sich um ein Graustufenbild handelt muss nun das Ergebnis ein schwarz sein,
//       falls es irgendwo farbige Pixel gab sind diese im Ergebnis NICHT schwarz. 
//
// Wie wird festgestellt, ob ein Dokument rein schwarz ist?
// Die Histogrammdaten des Dokuments werden ermittelt. Dies ist ein Array mit 256 Elementen,
// an der k-ten Position steht die Anzahl aller Picel mit einer Helligkeit von k. 
// Ein Bild ist also dann rein schwarz, wenn ausschließlich an Position 0 ein Wert !=0 steht
// und alle weiteren Histogrammwerte =0 sind.
// Für die Praxis ist das zu "streng", deswegen wird eine gewisse Toleranz zugelassen  
//
/////////////////////////////////////////////////////////////////////////////////////////////////
//
// Liste der Dateindungen die als Bilddatei interpretiert wird. 
const EXTENSIONS=['psd','jpg','jpeg','psb','tif','tiff','png'];

// Maximale Abweichung, die beim Differenzvergleich als "sicher grau" toleriert wird. 
const DIFFERENCE_1 = 2;
// Maximale Abweichung, die einen "Verdachtsfall" kennzeichnet
const DIFFERENCE_2 = 5;
// Maximaler Anteil der "Abweichler" 
const MAX_QUOT = 0.001;
// Debug ausgabe?
const DEBUG=false;

/**
* Prüft ob ein Dokument ein Graustufenbild ist
* Input:
* docFile : Ein File-Objekt
* 
* Output : 
*    0 : Bild ist mit Sicherheit grau
*    1 : Bild ist "tolerabel" grau -->
*/
const GRAY=0;
const PROBABLY_GRAY=1;
const NOT_GRAY=2;
function isGrayscale(docFile,log){
    // Dokument öffnen
    var doc=app.open(docFile);
    activeDocument=doc;

    // Nur ein Kanal? Dann ist es Grau
    if(doc.componentChannels.length==1){
        return GRAY;
    }
    if(doc.componentChannels.length==4){
        // Bei CMYK--- keine AHnung
        return PROBABLY_GRAY;
    }

    // Auf Hintergund reduzieren
    doc.flatten();
    // Hintergrund duplizieren und entsaettigen
    var dup=doc.activeLayer.duplicate();
    dup.desaturate();
    // Auf Modus Differenz setzen
    dup.blendMode=BlendMode.DIFFERENCE;

    // Histogramm auslesen
    var hist=doc.histogram;
    // Ist zu Anfang "true". Wird "false" sobald wir im Histogramm einen
    // Wert >0 an einer Position >0 finden
    var maxDiff=0;
    var blackPixels=hist[0];
    var nonBlackPixels=0;
    for(var j=1; j<hist.length; j++){
        if(hist[j]>0){
            maxDiff=j;
            nonBlackPixels+=hist[j]; 
        }
    }
    // Dokument schließen - nicht speichern
    doc.close(SaveOptions.DONOTSAVECHANGES);
    // Auswertung
    var quot=nonBlackPixels/(nonBlackPixels+blackPixels);
    if(DEBUG){
        log.write("----------------------------------------\n");
        log.write(docFile.fsName+"\n");
        log.write("maxDiff="+maxDiff+" -- "+"quot="+quot+"\n");
        log.write("----------------------------------------\n");
    }
    if( quot<=MAX_QUOT ){
        if( maxDiff<=DIFFERENCE_1 ){
            return GRAY;
        }else if( maxDiff<=DIFFERENCE_2){
            return PROBABLY_GRAY;
        }
    }
    return NOT_GRAY;
}

/**
 * Ermittelt die Erweiterung einer Datei
 *
 * Input:
 * file : Irgendein File-Objekt
 *
 * Output:
 * Die Dateierweiterung, d.h. alles was nach dem letzten "." folgt
 */ 
function getExtension(file){
    var pos= file.name.lastIndexOf('.');
    if( pos>=0 ){
        return file.name.substring(pos+1).toLowerCase();
    }else{
        return "";
    }
}

/**
 * Test ob eine Datei eine zulaessige
 * (d.h. in EXTENSIONS enthaltene) Dateiendung besitzt
 *
 * INPUT
 * file das File Objekt
 *
 * OUTPUT
 * true/false
 */
function hasAdmissibleExtension(file){
    if(!file) return false;
    var ext=getExtension(file);
    if( ext==0 || ext.length==0){
        return false;
    }
    for(var j=0; j<EXTENSIONS.length; j++){
        if( ext==EXTENSIONS[j] ){
            return true;
        }
    }
    return false;
}

/**
 * Eine einzelne Datei verarbeiten
 *
 * Input:
 * file  : Die zu untersuchende Datei
 * log   : Die Protokolldatei
 */
function processFile(file,log){
    // Datei nur verarbeiten, wen die Erweiterung passt
    if( hasAdmissibleExtension(file) ){
        try{
            var b = isGrayscale(file,log);
            if(b==GRAY){
                // Gefundene Graustufenbilder in die Prtokolldatei schreiben
                log.write(file.fsName+"\n");
            } else if(b==PROBABLY_GRAY){
                log.write(file.fsName+" (VERDACHTSFALL)\n");
            }
        }catch(e){
            // Fehler ebenfalls protokollieren
            log.write(file.fsName+" **** ERROR *** "+e+"\n");  
        }
    }
}

/**
 * Ein Verzeichnis verarbeiten
 *
 * Input
 * fld   : Das Verzeichnis, das verarbeitet werden soll
 * log   : Die Protokolldatei
 */
function processFolder(fld,log){
    // Schleife über alle Dateien (Files und Folders) innerhalb von "fld"
    var files=fld.getFiles();
    for( var j=0; j<files.length; j++){
        var file=files[j];
        if( file instanceof File ){
            // Das ist eine einzelne Datei
            processFile(file,log);
        } else if( file instanceof Folder ){
            // Das iss ein Unterverzeichnis, deswegen rift sich
            // die Funktion hier selbst rekursiv auf.
            processFolder(file, log);
        }
    }
}

/**
 * Das Hauptprogramm
 */
function main(){
    // Dialog zur Verzeichnisauswahl
    var fld=Folder.selectDialog("Verzeichnis nach Graustufenbildern durchsuchen");
    if(!fld){
        // Hier hat der Benutzer abgebrochen
        return;
    }
    // Dialog zum Speicherort der Protokolldatei
    var log=File.saveDialog("Speicherort der Protokolldatei");
    if(!log){
        // Hier hat der Benutzer abgebrochen
        return;
    }

    try{
        // Protokolldatei zum Schreiben öffnen
        log.open("w");
        log.write("Graustufenbilder in "+fld.fsName+"\n\n");
        // Das angegebene Verzeichnis rekursiv durchsuchen
        processFolder(fld,log);
    } finally {
        // Am Schluss: Protokolldatei schließen. 
        log.close();
        alert("Fertig. \nProtokoll in: "+log.fsName);
    }
}

// Aufruf des Hauptprogramms und alert bei Fehlern
try{
    main();
} catch(e){
    alert(e);
}
