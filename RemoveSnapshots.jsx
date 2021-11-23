// Ein Skript, mit dem man Schnappschuesse im Dokument loeschen kann
// 
// Es wird festgestellt, wie viele Schnappschuesse insgesamt vorhanden
// sind -- der automatische Schnappschuss, der beim Oeffnen des Dokuments entsteht, bleibt
// dabei unberuecksichtigt.
// Interaktiv wird erfragt, wie viele entfernt werden sollen
// Es werden jeweils die aelteren Schnappschuesse entfernt


// Scripting Listener Geraffel....
// Schnappschuss mit gegebenem Namen auswaehlen
function selectSnapshotByName(snpName) {
    // =======================================================
    var idslct = charIDToTypeID("slct");
    var desc407 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref6 = new ActionReference();
    var idSnpS = charIDToTypeID("SnpS");
    ref6.putName(idSnpS, snpName);
    desc407.putReference(idnull, ref6);
    executeAction(idslct, desc407, DialogModes.NO);
}

// Ausgewaehlten Schnappschuss entfernen
function deleteSelectedSnapshot() {
    // =======================================================
    var idDlt = charIDToTypeID("Dlt ");
    var desc415 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref7 = new ActionReference();
    var idHstS = charIDToTypeID("HstS");
    var idCrnH = charIDToTypeID("CrnH");
    ref7.putProperty(idHstS, idCrnH);
    desc415.putReference(idnull, ref7);
    executeAction(idDlt, desc415, DialogModes.NO);
}

// Zurueck zum letzten STand im Protokoll
function selectLatestState() {
    // =======================================================
    var idslct = charIDToTypeID("slct");
    var desc417 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref8 = new ActionReference();
    var idHstS = charIDToTypeID("HstS");
    var idOrdn = charIDToTypeID("Ordn");
    var idLst = charIDToTypeID("Lst ");
    ref8.putEnumerated(idHstS, idOrdn, idLst);
    desc417.putReference(idnull, ref8);
    executeAction(idslct, desc417, DialogModes.NO);
}

// Funktion, um eine Zahl abzufragen
// Pruefung ob die Zahl zwischen 0 und maxIn  liegt.
// promptStr : Der Abfragestring
function inputNumber(promptStr,maxIn){
    while(true){
        var input=prompt(promptStr,maxIn);
        if(!input){
            return 0;
        } else {
            var n=parseInt(input);
            if(!isNaN(n) && n>=0){
                if( n>maxIn ){
                    alert("Zu viele - es werden nur "+maxIn+" Schnappschuesse entfernt");
                    return maxIn;
                }
                return n;
            }
            else{
                alert("\""+input+"\" ist keine gueltige Eingabe");
            }
        }
    }
}

// Hauptfunktion
function main(){
    try {
        // Protokoll auslesen und die Namen der Schnappschuesse aufsammeln
        var hs = activeDocument.historyStates;
        var snpNames = [];
        for(var j=0; j<hs.length; j++){
            var h=hs[j];
            if( h.snapshot ){
                snpNames.push(h.name);
            }
        }
        // Der erste Schnappschuss wird entfernt - dies ist 
        // nrmalerweise der automatische Schnappschuss, der beim
        // Oeffnen der Datei entsteht
        if(snpNames.length>0){
            snpNames.shift();
        }
        if( snpNames.length==0 ){
            alert("Keine Schnappschuesse gefunden.");
        }
        // ABfragen, wie viele geloescht werden sollen
        var prompt=""+snpNames.length+" Schnappschuesse gefunden\nWie viele loeschen?";
        var n=inputNumber(prompt,snpNames.length);

        if( n==0 ){
            // Fertig.
            return;
        }

        // Die ersten n Schnappschuesse entfernen
        for( var j=0; j<n; j++){
            selectSnapshotByName(snpNames[j]);
            deleteSelectedSnapshot();
        }
        // Zureuckkehren zum letzten Protokollstand
        selectLatestState();
    
    } catch (e) {
        alert(e);
    }
    
}

main();
