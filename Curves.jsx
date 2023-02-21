// Erstellen einer Gradationskurve in JSX
//
// Funktionsparameter
// layerName  : Name der Einstellungsebene
// curvePoints: Array mit den Kurvenpunkten
// 
// Beispiel für drei Kurvenpunkte
// curvePoints = [ [0,0], [128,64], [255, 255] ]

function makeCurve(layerName, curvePoints) {
    // Kurve erzeugen
    var idMk = charIDToTypeID("Mk  ");
    var desc251 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref2 = new ActionReference();
    var idAdjL = charIDToTypeID("AdjL");
    ref2.putClass(idAdjL);
    desc251.putReference(idnull, ref2);
    var idUsng = charIDToTypeID("Usng");
    var desc252 = new ActionDescriptor();
    var idNm = charIDToTypeID("Nm  ");
    desc252.putString(idNm, layerName);
    var idType = charIDToTypeID("Type");
    var desc253 = new ActionDescriptor();
    var idpresetKind = stringIDToTypeID("presetKind");
    var idpresetKindType = stringIDToTypeID("presetKindType");
    var idpresetKindDefault = stringIDToTypeID("presetKindDefault");
    desc253.putEnumerated(idpresetKind, idpresetKindType, idpresetKindDefault);
    var idCrvs = charIDToTypeID("Crvs");
    desc252.putObject(idType, idCrvs, desc253);
    var idAdjL = charIDToTypeID("AdjL");
    desc251.putObject(idUsng, idAdjL, desc252);
    executeAction(idMk, desc251, DialogModes.NO);

    // Punkte setzen
    var idsetd = charIDToTypeID( "setd" );
    var desc271 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref3 = new ActionReference();
    var idAdjL = charIDToTypeID("AdjL");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref3.putEnumerated(idAdjL, idOrdn, idTrgt);
    desc271.putReference(idnull, ref3);
    var idT = charIDToTypeID("T   ");
    var desc272 = new ActionDescriptor();
    var idpresetKind = stringIDToTypeID("presetKind");
    var idpresetKindType = stringIDToTypeID("presetKindType");
    var idpresetKindCustom = stringIDToTypeID("presetKindCustom");
    desc272.putEnumerated(idpresetKind, idpresetKindType, idpresetKindCustom);
    var idAdjs = charIDToTypeID("Adjs");
    var list7 = new ActionList();
    var desc273 = new ActionDescriptor();
    var idChnl = charIDToTypeID("Chnl");
    var ref4 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idChnl = charIDToTypeID("Chnl");
    var idCmps = charIDToTypeID("Cmps");
    ref4.putEnumerated(idChnl, idChnl, idCmps);
    desc273.putReference(idChnl, ref4);
    var idCrv = charIDToTypeID("Crv ");
    var list8 = new ActionList();
    var idHrzn = charIDToTypeID("Hrzn");
    var idVrtc = charIDToTypeID("Vrtc");
    var idPnt = charIDToTypeID("Pnt ");
    for (var j = 0; j < curvePoints.length; j++) {
        var desc274 = new ActionDescriptor();
        desc274.putDouble(idHrzn, curvePoints[j][0]);
        desc274.putDouble(idVrtc, curvePoints[j][1]);
        list8.putObject(idPnt, desc274);
    }
    var idCrvA = charIDToTypeID("CrvA");
    desc273.putList( idCrv, list8 );
    list7.putObject(idCrvA, desc273);
    desc272.putList(idAdjs, list7);
    var idCrvs = charIDToTypeID("Crvs");
    desc271.putObject(idT, idCrvs, desc272);
    executeAction(idsetd, desc271, DialogModes.NO);
}


// Beispielaufruf:

makeCurve("Demo",[ [0,0],[128,160], [255,255]]);
