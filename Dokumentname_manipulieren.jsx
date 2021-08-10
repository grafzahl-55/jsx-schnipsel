// Aufgabe:
// Der Name des aktuellen PS-Dokuments soll aufgeteilt werden in:
// - Suffix , dh. die Dateiendung (z.B. ".psd") und
// - Praefix, d.h. alles vor dem letzen "."
// An das Preafix wird ein Wunschtext angehaengt und dann alles zu einem String hzusammengesetzt
//
// Beispiel: Aktuelles Dokument ist: "IMG0815.psd"
//           Wunschtext ist: "_bearbeitet"
//           Ergebnis:  "IMG0815_bearbeitet.psd"
//

function modifizierterName(wunschtext){
    var name = activeDocument.name;
    // Position des letzten auftauchenden "."
    var pos = name.lastIndexOf(".");
    var praefix = name.substring(0,pos);  // von Position 0 bis (exclusive) Position pos
    var suffix  = name.substring(pos);    // alles ab Position pos
    return praefix+wunschtext+suffix;
}

// Test:
alert(modifizierterName("_bearbeitet"));
