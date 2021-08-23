// Konstanten
// ----------
// Name des SMartObj. mit dem Bilderstapel
// (wirdvon der Aktion angelegt)
var DUMMY_LAYER_NAME = "BEISPIELBILDER";


// Erzeugt fuer dan aktuellen Dokumentzustand
// Eine Ebenenkomposition mit dem angegebenen
// Namen "compName"
function createLayerComposition(compName) {
    var layerComp = activeDocument.layerComps.add(compName, "Export", true, true, true);
}

// Aktuelle Ebene muss ein SmartObj. sein.
// Dieses wird zur Bearbeitung geoeffnet und wird
// dadurch zum aktiven Dokument
function editSmartObject() {
    var idplacedLayerEditContents = stringIDToTypeID("placedLayerEditContents");
    var desc250 = new ActionDescriptor();
    executeAction(idplacedLayerEditContents, desc250, DialogModes.NO);
}

// Errechnet eine Liste aller (auf oberster Ebene liegenden) Ebenen,
// deren Name den DUMMY_LAYERNAME enthaelt, und die Smartobjekte sind
function stapelFinden() {
    var stapelListe = [];
    for (var j = 0; j < activeDocument.artLayers.length; j++) {
        var y = activeDocument.artLayers[j];
        if ((y.name.indexOf(DUMMY_LAYER_NAME) >= 0) && (y.kind === LayerKind.SMARTOBJECT)) {
            stapelListe.push(y);
        }
    }
    return stapelListe;
}



// Einen Bilderstapel/SmartObj mit Bildvorschlaegen vorbereiten:
// Die Ebenen werden einzeln sichtbar gemacht und es werden die
// Ebenenkompositionen generiert, wo jeweils nur ein Bild sichtbat ist
function stapelDokVorbereiten() {
    // Zunaechst mal alle ebenen ausblenden
    for (var j = 0; j < activeDocument.artLayers.length; j++) {
        activeDocument.artLayers[j].visible = false;
    }
    // Eventuell vorhandene alte Ebenenkompositionen entfernen
    activeDocument.layerComps.removeAll();
    // Einzeln einblenden und die Ebenenkompositionen erstellen
    for (var j = 0; j < activeDocument.artLayers.length; j++) {
        var x = activeDocument.artLayers[j];
        x.visible = true;
        createLayerComposition(x.name);
        x.visible = false;
    }
    // Alle Ebenen wieder sichtbar machen
    for (var j = 0; j < activeDocument.artLayers.length; j++) {
        activeDocument.artLayers[j].visible = true;
    }
    // Smartobj.speichern und schließen
    activeDocument.close(SaveOptions.SAVECHANGES);
}

// Hauptprogramm
function main() {
    
    // Arbeitsdok.  merken 
    var workDoc = activeDocument;
    // Alle Bilderstapel finden
    var stapelListe = stapelFinden();
    if (stapelListe.length === 0) {
        alert("Keine Bilderstapel gefunden");
        return;
    }
    // Alle SmartObj oeffnen und die Ebenenkompositionen erstellen
    for (var j = 0; j < stapelListe.length; j++) {
        workDoc.activeLayer = stapelListe[j];
        editSmartObject();
        var smartObj = activeDocument;
        stapelDokVorbereiten();
        activeDocument = workDoc;
    }
    
}




activeDocument.suspendHistory('Ebenenkompositionen erstellen', 'main()');