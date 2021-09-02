// Erzeugt Ebenenkompositionen aus "Look-" Gruppen
// In den Ebenenkompositionen soll jeweils genau eine der
// Gruppen "eingeschaltet" sein

// Unser Hauptprogrammm
function main(){
    // Alle Gruppen auf oberster Hierarchiestufe
    var groups=activeDocument.layerSets;
    // Da merke ich mir, welche der Gruppe(n) zu Beginn sichtbar sind
    var wasVisible=[];
    // Zunaechst mal: Schleife über alle Gruppen mit:
    // - Merken ob diese Gruppe gerade sichtbar ist
    // - Gruppe unsichtbar schalten
    // - Falls eine Ebenenkomp. mit dem Namen der Gruppe existiert, diese loeschen
    for( var j=0; j<groups.length; j++ ){
        var group=groups[j];
        wasVisible.push(group.visible);
        group.visible=false;
        try{
            // Probiere die Ebenenkomposition mit dem Namen der Gruppe zu finden
            var lComp=activeDocument.layerComps[group.name];
            // Wenn das gut gegangen ist:
            lComp.remove();
        } catch(e){
            // Falls dabei ein Fehler passiert ist, dann scheint es eine
            // solche Ebenenkomp. nicht zu geben.
            // Ist uns egal - in diesem fall machen wir einfach nichts. 
        }
    }
    // Nochmals eine Schleife über alle Gruppen. Dieses mal jeweils:
    // Gruppe sichbar machen
    // Ebenenkomposition erstellen 
    // Gruppe wieder unsichtbar machen 
    for( var j=0; j<groups.length; j++ ){
        var group=groups[j];
        group.visible=true;
        activeDocument.layerComps.add(group.name,"Sichbarkeit: Nur Gruppe "+group.name,true,true,true);
        group.visible=false; 
    }
    // Sichtbarkeit der Gruppen so wiederherstellen, wie es zu Beginn war 
    for( var j=0; j<groups.length; j++ ){
        var group=groups[j];
        group.visible=wasVisible[j];
    }
}

// Das Hauptprogramm so aufrufen, dass nur ein Protokolleintrag
// generiert wird
activeDocument.suspendHistory("GroupsToLayerComps","main()");