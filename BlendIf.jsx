// BlendIf Regler der aktuellen Ebene einstellen:
//
// Parameter:
//
// up : Obere Regler (für die aktuelle Ebene) in der Form
//      [ [a,b],[c,d] ] . Darf auch null sein - dann werden die oberen Regler auf Standard
//      gesetzt ( [[0,0],[255,255]] )
//
// low : Dito für die unteren Regler (darunterliegende Ebenen). Darf null sein.
//
// kanal : Der Kanal. Darf weggelassen werden, dann wird der Grauwert genommen
//         Ansonsten:
//         "Rd  " - Rotkanal
//         "Grn " - Grünkanal
//         "Bl  " - Blaukanal
//         Achtung diese Strings müssen immer 4 Zeichen lang sein, die Leerzeichen am Ende sind essentiell
//
function blendIf(up, low, kanal) {
    var aUp = [
        [0, 0],
        [255, 255]
    ];
    if (up) {
        aUp = up;
    }
    var aLo = [
        [0, 0],
        [255, 255]
    ];
    if (low) {
        aLo = low;
    }
    if (!kanal) {
        kanal = "Gry ";
    }

    var idsetd = charIDToTypeID("setd");
    var desc24 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref4 = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref4.putEnumerated(idLyr, idOrdn, idTrgt);
    desc24.putReference(idnull, ref4);
    var idT = charIDToTypeID("T   ");
    var desc25 = new ActionDescriptor();
    var idBlnd = charIDToTypeID("Blnd");
    var list3 = new ActionList();
    var desc26 = new ActionDescriptor();
    var idChnl = charIDToTypeID("Chnl");
    var ref5 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idChnl = charIDToTypeID("Chnl");
    var idGry = charIDToTypeID(kanal);
    ref5.putEnumerated(idChnl, idChnl, idGry);
    desc26.putReference(idChnl, ref5);
    var idSrcB = charIDToTypeID("SrcB");
    desc26.putInteger(idSrcB, aUp[0][0]);
    var idSrcl = charIDToTypeID("Srcl");
    desc26.putInteger(idSrcl, aUp[0][1]);
    var idSrcW = charIDToTypeID("SrcW");
    desc26.putInteger(idSrcW, aUp[1][0]);
    var idSrcm = charIDToTypeID("Srcm");
    desc26.putInteger(idSrcm, aUp[1][1]);
    var idDstB = charIDToTypeID("DstB");
    desc26.putInteger(idDstB, aLo[0][0]);
    var idDstl = charIDToTypeID("Dstl");
    desc26.putInteger(idDstl, aLo[0][1]);
    var idDstW = charIDToTypeID("DstW");
    desc26.putInteger(idDstW, aLo[1][0]);
    var idDstt = charIDToTypeID("Dstt");
    desc26.putInteger(idDstt, aLo[1][1]);
    var idBlnd = charIDToTypeID("Blnd");
    list3.putObject(idBlnd, desc26);
    desc25.putList(idBlnd, list3);
    var idLefx = charIDToTypeID("Lefx");
    var desc27 = new ActionDescriptor();
    var idScl = charIDToTypeID("Scl ");
    var idPrc = charIDToTypeID("#Prc");
    desc27.putUnitDouble(idScl, idPrc, 416.666667);
    var idLefx = charIDToTypeID("Lefx");
    desc25.putObject(idLefx, idLefx, desc27);
    var idLyr = charIDToTypeID("Lyr ");
    desc24.putObject(idT, idLyr, desc25);
    executeAction(idsetd, desc24, DialogModes.NO);
}


// Anwendungsbeispiel:
// 
blendIf(null,[[0,128],[255,255]]);
