// Erzeugt eine Verlaufsumsetzung aus Messpunkten
// Die "Boppel" werden an die Position gesetzt, die der Y-Luminanz der gemessenen Farbe entspricht
//
//
// #target photoshop;
function VerlaufsUmsetzung(p_name) {

    var layer;

    __newGradient();
    layer = activeDocument.activeLayer;
    layer.name = p_name;

    function __newGradient() {
        // =======================================================
        var idMk = charIDToTypeID("Mk  ");
        var desc85 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref17 = new ActionReference();
        var idAdjL = charIDToTypeID("AdjL");
        ref17.putClass(idAdjL);
        desc85.putReference(idnull, ref17);
        var idUsng = charIDToTypeID("Usng");
        var desc86 = new ActionDescriptor();
        var idType = charIDToTypeID("Type");
        var desc87 = new ActionDescriptor();
        var idGrad = charIDToTypeID("Grad");
        var desc88 = new ActionDescriptor();
        var idNm = charIDToTypeID("Nm  ");
        desc88.putString(idNm, "Vorder- zu Hintergrundfarbe");
        var idGrdF = charIDToTypeID("GrdF");
        var idGrdF = charIDToTypeID("GrdF");
        var idCstS = charIDToTypeID("CstS");
        desc88.putEnumerated(idGrdF, idGrdF, idCstS);
        var idIntr = charIDToTypeID("Intr");
        desc88.putDouble(idIntr, 4096.000000);
        var idClrs = charIDToTypeID("Clrs");
        var list10 = new ActionList();
        var desc89 = new ActionDescriptor();
        var idClr = charIDToTypeID("Clr ");
        var desc90 = new ActionDescriptor();
        var idRd = charIDToTypeID("Rd  ");
        desc90.putDouble(idRd, 0);
        var idGrn = charIDToTypeID("Grn ");
        desc90.putDouble(idGrn, 0);
        var idBl = charIDToTypeID("Bl  ");
        desc90.putDouble(idBl, 0);
        var idRGBC = charIDToTypeID("RGBC");
        desc89.putObject(idClr, idRGBC, desc90);
        var idType = charIDToTypeID("Type");
        var idClry = charIDToTypeID("Clry");
        var idUsrS = charIDToTypeID("UsrS");
        desc89.putEnumerated(idType, idClry, idUsrS);
        var idLctn = charIDToTypeID("Lctn");
        desc89.putInteger(idLctn, 0);
        var idMdpn = charIDToTypeID("Mdpn");
        desc89.putInteger(idMdpn, 50);
        var idClrt = charIDToTypeID("Clrt");
        list10.putObject(idClrt, desc89);
        var desc91 = new ActionDescriptor();
        var idClr = charIDToTypeID("Clr ");
        var desc92 = new ActionDescriptor();
        var idRd = charIDToTypeID("Rd  ");
        desc92.putDouble(idRd, 255);
        var idGrn = charIDToTypeID("Grn ");
        desc92.putDouble(idGrn, 255);
        var idBl = charIDToTypeID("Bl  ");
        desc92.putDouble(idBl, 255);
        var idRGBC = charIDToTypeID("RGBC");
        desc91.putObject(idClr, idRGBC, desc92);
        var idType = charIDToTypeID("Type");
        var idClry = charIDToTypeID("Clry");
        var idUsrS = charIDToTypeID("UsrS");
        desc91.putEnumerated(idType, idClry, idUsrS);
        var idLctn = charIDToTypeID("Lctn");
        desc91.putInteger(idLctn, 4096);
        var idMdpn = charIDToTypeID("Mdpn");
        desc91.putInteger(idMdpn, 50);
        var idClrt = charIDToTypeID("Clrt");
        list10.putObject(idClrt, desc91);
        desc88.putList(idClrs, list10);
        var idTrns = charIDToTypeID("Trns");
        var list11 = new ActionList();
        var desc93 = new ActionDescriptor();
        var idOpct = charIDToTypeID("Opct");
        var idPrc = charIDToTypeID("#Prc");
        desc93.putUnitDouble(idOpct, idPrc, 100.000000);
        var idLctn = charIDToTypeID("Lctn");
        desc93.putInteger(idLctn, 0);
        var idMdpn = charIDToTypeID("Mdpn");
        desc93.putInteger(idMdpn, 50);
        var idTrnS = charIDToTypeID("TrnS");
        list11.putObject(idTrnS, desc93);
        var desc94 = new ActionDescriptor();
        var idOpct = charIDToTypeID("Opct");
        var idPrc = charIDToTypeID("#Prc");
        desc94.putUnitDouble(idOpct, idPrc, 100.000000);
        var idLctn = charIDToTypeID("Lctn");
        desc94.putInteger(idLctn, 4096);
        var idMdpn = charIDToTypeID("Mdpn");
        desc94.putInteger(idMdpn, 50);
        var idTrnS = charIDToTypeID("TrnS");
        list11.putObject(idTrnS, desc94);
        desc88.putList(idTrns, list11);
        var idGrdn = charIDToTypeID("Grdn");
        desc87.putObject(idGrad, idGrdn, desc88);
        var idGdMp = charIDToTypeID("GdMp");
        desc86.putObject(idType, idGdMp, desc87);
        var idAdjL = charIDToTypeID("AdjL");
        desc85.putObject(idUsng, idAdjL, desc86);
        executeAction(idMk, desc85, DialogModes.NO);
    }


    function __setGradientColors(colors, steps) {
        // =======================================================
        var idsetd = charIDToTypeID("setd");
        var desc32 = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref3 = new ActionReference();
        var idAdjL = charIDToTypeID("AdjL");
        var idOrdn = charIDToTypeID("Ordn");
        var idTrgt = charIDToTypeID("Trgt");
        ref3.putEnumerated(idAdjL, idOrdn, idTrgt);
        desc32.putReference(idnull, ref3);
        var idT = charIDToTypeID("T   ");
        var desc33 = new ActionDescriptor();
        var idGrad = charIDToTypeID("Grad");
        var desc34 = new ActionDescriptor();
        var idNm = charIDToTypeID("Nm  ");
        desc34.putString(idNm, "Benutzerdefiniert");
        var idGrdF = charIDToTypeID("GrdF");
        var idGrdF = charIDToTypeID("GrdF");
        var idCstS = charIDToTypeID("CstS");
        desc34.putEnumerated(idGrdF, idGrdF, idCstS);
        var idIntr = charIDToTypeID("Intr");
        desc34.putDouble(idIntr, 4096.000000);
        var idClrs = charIDToTypeID("Clrs");
        var list3 = new ActionList();
        var idClr = charIDToTypeID("Clr ");
        var idClrt = charIDToTypeID("Clrt");
        var idRd = charIDToTypeID("Rd  ");
        var idGrn = charIDToTypeID("Grn ");
        var idBl = charIDToTypeID("Bl  ");
        var idRGBC = charIDToTypeID("RGBC");
        var idType = charIDToTypeID("Type");
        var idClry = charIDToTypeID("Clry");
        var idUsrS = charIDToTypeID("UsrS");
        var idLctn = charIDToTypeID("Lctn");
        var idMdpn = charIDToTypeID("Mdpn");
        for (var j = 0; j < colors.length; j++) {
            var rgb = colors[j].rgb;
            var s = steps[j] * 4096 / 100;
            var desc35 = new ActionDescriptor();
            var desc36 = new ActionDescriptor();
            desc36.putDouble(idRd, rgb.red);
            desc36.putDouble(idGrn, rgb.green);
            desc36.putDouble(idBl, rgb.blue);
            desc35.putObject(idClr, idRGBC, desc36);
            desc35.putEnumerated(idType, idClry, idUsrS);
            desc35.putInteger(idLctn, Math.floor(s));
            desc35.putInteger(idMdpn, 50);
            list3.putObject(idClrt, desc35);
        }
        desc34.putList(idClrs, list3);
        var idTrns = charIDToTypeID("Trns");
        var list4 = new ActionList();
        var desc45 = new ActionDescriptor();
        var idOpct = charIDToTypeID("Opct");
        var idPrc = charIDToTypeID("#Prc");
        desc45.putUnitDouble(idOpct, idPrc, 100.000000);
        var idLctn = charIDToTypeID("Lctn");
        desc45.putInteger(idLctn, 0);
        var idMdpn = charIDToTypeID("Mdpn");
        desc45.putInteger(idMdpn, 50);
        var idTrnS = charIDToTypeID("TrnS");
        list4.putObject(idTrnS, desc45);
        var desc46 = new ActionDescriptor();
        var idOpct = charIDToTypeID("Opct");
        var idPrc = charIDToTypeID("#Prc");
        desc46.putUnitDouble(idOpct, idPrc, 100.000000);
        var idLctn = charIDToTypeID("Lctn");
        desc46.putInteger(idLctn, 4096);
        var idMdpn = charIDToTypeID("Mdpn");
        desc46.putInteger(idMdpn, 50);
        var idTrnS = charIDToTypeID("TrnS");
        list4.putObject(idTrnS, desc46);
        desc34.putList(idTrns, list4);
        var idGrdn = charIDToTypeID("Grdn");
        desc33.putObject(idGrad, idGrdn, desc34);
        var idGdMp = charIDToTypeID("GdMp");
        desc32.putObject(idT, idGdMp, desc33);
        executeAction(idsetd, desc32, DialogModes.NO);
    }

    function setColors(colors, steps) {
        if (steps == null) {
            var n = 100 / (colors.length - 1);
            steps = [];
            for (var j = 0; j < colors.length; j++) {
                steps.push(j * n);
            }
        }
        if (colors.length != steps.length) {
            alert(colors);
            alert(steps);
            throw "Anzahl von Farben und Stufen muss uebereinstimmen";
        }
        __setGradientColors(colors, steps);
    }
    // Publik    
    return {
        "layer": layer,
        "setColors": setColors
    }

}

// Sicherstellen, dass nicht die Maske sondern die zugeh. Ebene markiert ist
function activateRGB() {
    var idslct = charIDToTypeID("slct");
    var desc17 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref11 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idRGB = charIDToTypeID("RGB ");
    ref11.putEnumerated(idChnl, idChnl, idRGB);
    desc17.putReference(idnull, ref11);
    var idMkVs = charIDToTypeID("MkVs");
    desc17.putBoolean(idMkVs, false);
    executeAction(idslct, desc17, DialogModes.NO);
}

// Y-Helligkeit im YCbCr-Farbmodell (Normiert auf 0..100)
function Y(col) {
    return (0.299 * col.rgb.red + 0.587 * col.rgb.green + 0.114 * col.rgb.blue) / 2.55;
}

function mp2vu() {
    var n=activeDocument.colorSamplers.length;
    if (n <= 0) {
        alert("Bitte Messpunkte setzen.");
        return;
    }

    // Neue VU
    var vu = VerlaufsUmsetzung("VU aus Messpunkten");
    // Erst mal unsichtbar schalten, damit die Messwerte nicht falsch sind
    vu.layer.visible = false;
    try{
        activateRGB();
    } catch(e){
        //
    }

    // Die aufgenommenen Farben
    var fs = [];
    for (var j = 0; j < n; j++) {
        fs.push(activeDocument.colorSamplers[j].color);
    }

    var boppel=[]; 
    for (var j = 0; j < n; j++){
        boppel.push(Y(fs[j]));
    }


    vu.setColors(fs,boppel);
    vu.layer.visible = true;

}

mp2vu();