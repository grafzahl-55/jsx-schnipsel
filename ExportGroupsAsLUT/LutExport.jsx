// Geklauter Code aus dem ExportColorLookup Originalskript von Photoshop

// Der neue Clou: Verzicht auf den IWLTBAP-Generator
// PS kann das alleine!
//
// "Grid" --> sRGB 16 Bit
// Zurückwandeln in ein LUT
// --> Hintergrundebene weiß, 1024x32
// --> Darüber die Enstellungen oder auch modifiziertes Grid
// --> Hintergrundebene aktivieren
// --> doRenderGrid
// --> doExportLUT
// --> Path: Muss dem Filesystem-Namen entsprechen, also NICHT /c/tmp/test, sondern c:/tmp/... 

$lutExport = function() {
    self = this;

    const keyExportLUT = app.charIDToTypeID("lut ");
    const keyFilePath = app.charIDToTypeID('fpth');
    const keyDescription = app.charIDToTypeID('dscr');
    const keyCopyright = app.charIDToTypeID('Cpyr');
    const keyDataPoints = app.charIDToTypeID('gPts');
    const keyWriteICC = app.charIDToTypeID('wICC');
    const keyWrite3DL = app.charIDToTypeID('w3DL');
    const keyWriteCUBE = app.charIDToTypeID('wCUB');
    const keyWriteCSP = app.charIDToTypeID('wCSP');
    const keyUseLowerCase = app.charIDToTypeID('lcFE');
    const keyRenderGrid = charIDToTypeID("3grd");
    const keyDataPoints2 = charIDToTypeID('grdP');
    const keyUsing = charIDToTypeID('Usng');
    const eventExport = charIDToTypeID('Expr');


    self.renderGrid = function(gridPoints) {
        var args = new ActionDescriptor();
        args.putInteger(keyDataPoints2, gridPoints);

        try {
            var result = executeAction(keyRenderGrid, args, DialogModes.NO);
        } catch (e) {
            if (e.number != 8007) { // don't report error on user cancel
                var str = "Unable to render color grid because ";
                alert(str + e + " : " + e.line);
            }
            return false;
        }

        return true;
    }

    self.exportLUTs = function(path, gGridPoints, gDescription, gCopyright, bFormatICC, bFormatCube) {

        var desc = new ActionDescriptor();
        var desc2 = new ActionDescriptor();

        desc2.putString(keyFilePath, path);
        desc2.putString(keyDescription, gDescription);
        desc2.putInteger(keyDataPoints, gGridPoints);

        // assemble the full copyright string, if needed
        var copyrightAssembled = gCopyright;
        if (gCopyright != "") {
            var theDate = new Date();
            // the year is from 1900 ????
            var theYear = (theDate.getYear() + 1900).toString();

            // Localization team says to just use the year
            var dateString = theYear;
            copyrightAssembled = "Copyright " + dateString + " " + gCopyright;
        }
        desc2.putString(keyCopyright, copyrightAssembled);

        desc2.putBoolean(keyWriteICC, bFormatICC);
        desc2.putBoolean(keyWrite3DL, false);
        desc2.putBoolean(keyWriteCUBE, bFormatCube);
        desc2.putBoolean(keyWriteCSP, false);
        // select output format
        desc2.putBoolean(keyUseLowerCase, true);


        desc.putObject(keyUsing, keyExportLUT, desc2);

        try {
            var resultDesc = executeAction(eventExport, desc, DialogModes.NO);
        } catch (e) {
            if (e.number != 8007) { // don't report error on user cancel
                var str = "Unable to run the Export Color Lookup plugin because ";
                alert(str + e + " : " + e.line);
            }
            return false;
        }

        return true;
    }

    // Erzeugt ein neues GRID Dokument
    self.createGrid = function(docName, gridPoints) {
        if (!docName) {
            docName = "__GRID__";
        }
        if (!gridPoints) {
            gridPoints = 32;
        }
        var width = new UnitValue(gridPoints * gridPoints, "px");
        var height = new UnitValue(gridPoints, "px");
        var gridDoc = app.documents.add(
            width,
            height,
            72, // resolution 
            docName,
            NewDocumentMode.RGB,
            DocumentFill.WHITE,
            1, // pixel aspect ratio 
            BitsPerChannelType.SIXTEEN,
            "sRGB IEC61966-2.1"
        );
        if (self.renderGrid(gridPoints)) {
            return gridDoc;
        } else {
            throw "ERROR";
        }


    }

    // Exportiert das modifizierte GRID als LUT
    // (Aktuelles Dokument)
    self.exportGridAsLUT = function(path, description, copyright, bFormatICC, bFormatCube) {
        var gridDoc = activeDocument;
        // Kontrolliere die Abmessung
        var width = gridDoc.width.as('px');
        var height = gridDoc.height.as('px');
        if (width != height * height) {
            alert("Das ist kein GRID.");
            return false;
        }
        var gridPoints = height;
        var tmpDoc = gridDoc.duplicate("__TMP_EXPORT_LUT__", true);
        activeDocument = tmpDoc;
        try {
            self.exportLUTs(path, gridPoints, description, copyright, bFormatICC, bFormatCube);
        } catch (e) {
            alert(e);

        } finally {
            tmpDoc.close(SaveOptions.DONOTSAVECHANGES);
        }
        activeDocument = gridDoc;
        return true;
    }


    self.exportLayerOrGroupAsLUT = function(path, gridPoints, description, copyright, bFormatICC, bFormatCube) {
        var currentDoc = activeDocument;
        var grp = activeDocument.activeLayer;
        var gridDoc = self.createGrid("__TMP_LUT_EXP__", gridPoints);
        activeDocument = currentDoc;
        grp.duplicate(gridDoc);
        activeDocument = gridDoc;
        try {
            self.exportLUTs(path, gridPoints, description, copyright, bFormatICC, bFormatCube);
        } finally {
            gridDoc.close(SaveOptions.DONOTSAVECHANGES);
        }
        activeDocument = currentDoc;
    }


    self.createDifferenceGridFromCurrentGroup = function() {
        var GRID_DOC_NAME = "__GRP2LUT__";

        // Zustand merken
        var currentDoc = activeDocument;
        var lookGroup = activeDocument.activeLayer;


        // Look Gruppe erst mal ausschalten und des VORHER-Dokument generieren
        lookGroup.visible = false;
        var docVorher = currentDoc.duplicate("__VORHER__", true);

        // Look Gruppe einschalten und NACHHER-Dokument erzeugen
        activeDocument = currentDoc;
        lookGroup.visible = true;
        var docNachher = currentDoc.duplicate("__NACHHER__", true);


        // GRID herstellen
        $lutExport.createGrid(GRID_DOC_NAME, 32);
        var gridDoc = activeDocument;
        // Hintegrundebene
        var gridBG = gridDoc.activeLayer;
        // 2xduplizieren für "gleicheFarben"
        var gridVorher = gridBG.duplicate();
        gridVorher.name = "VORHER";
        var gridNachher = gridVorher.duplicate();
        gridNachher.name = "NACHHER";

        // Gleiche Farbe mit VORHER
        gridNachher.visible = false;
        gridDoc.activeLayer = gridVorher;
        self.matchColor("__VORHER__");
        // Gleiche Farbe mit NACHHER
        gridNachher.visible = true;
        gridDoc.activeLayer = gridNachher;
        self.matchColor("__NACHHER__");

        // VORHER und NACHHER Dokument kann jetzt weg
        // Aktiviere das GRID
        docVorher.close(SaveOptions.DONOTSAVECHANGES);
        docNachher.close(SaveOptions.DONOTSAVECHANGES);

        // Aktiviere gridNachher für die Bildberechnungen
        activeDocument = gridDoc;
        activeDocument.activeLayer = gridNachher;
        self.applyImage();

        // Nun enthält gridNachher de UNTERSCHIED zwischen vorher und nachher. 
        // Die Wirkung der Gruppe erhalten wir also so:
        // Diese Ebene kommt in den Modus Lineares Licht und wird auf das originale
        // GRID angewendet
        gridVorher.visible = false;
        gridNachher.blendMode = BlendMode.LINEARLIGHT;
        gridDoc.flatten();





    }

    self.matchColor=function(srcName) {
        // =======================================================
        var idmatchColor = stringIDToTypeID("matchColor");
        var desc60 = new ActionDescriptor();
        var idLght = charIDToTypeID("Lght");
        desc60.putInteger(idLght, 100);
        var idClrR = charIDToTypeID("ClrR");
        desc60.putInteger(idClrR, 100);
        var idFade = charIDToTypeID("Fade");
        desc60.putInteger(idFade, 0);
        var idfsel = charIDToTypeID("fsel");
        desc60.putBoolean(idfsel, true);
        var idSrce = charIDToTypeID("Srce");
        var ref11 = new ActionReference();
        var idLyr = charIDToTypeID("Lyr ");
        var idBckg = charIDToTypeID("Bckg");
        ref11.putProperty(idLyr, idBckg);
        var idDcmn = charIDToTypeID("Dcmn");
        ref11.putName(idDcmn, srcName);
        desc60.putReference(idSrce, ref11);
        executeAction(idmatchColor, desc60, DialogModes.NO);

    }

    self.applyImage=function() {
        // =======================================================
        var idAppI = charIDToTypeID("AppI");
        var desc103 = new ActionDescriptor();
        var idWith = charIDToTypeID("With");
        var desc104 = new ActionDescriptor();
        var idT = charIDToTypeID("T   ");
        var ref22 = new ActionReference();
        var idChnl = charIDToTypeID("Chnl");
        var idChnl = charIDToTypeID("Chnl");
        var idRGB = charIDToTypeID("RGB ");
        ref22.putEnumerated(idChnl, idChnl, idRGB);
        var idLyr = charIDToTypeID("Lyr ");
        ref22.putName(idLyr, "VORHER");
        desc104.putReference(idT, ref22);
        var idClcl = charIDToTypeID("Clcl");
        var idClcn = charIDToTypeID("Clcn");
        var idSbtr = charIDToTypeID("Sbtr");
        desc104.putEnumerated(idClcl, idClcn, idSbtr);
        var idScl = charIDToTypeID("Scl ");
        desc104.putDouble(idScl, 2.000000);
        var idOfst = charIDToTypeID("Ofst");
        desc104.putInteger(idOfst, 128);
        var idClcl = charIDToTypeID("Clcl");
        desc103.putObject(idWith, idClcl, desc104);
        executeAction(idAppI, desc103, DialogModes.NO);
    }
    return self;
}();