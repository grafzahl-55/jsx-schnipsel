// Ruft den Camera Raw Filter auf und wendet den
// Automatischen Weißabgleich an
//
// Quelle:  https://community.adobe.com/t5/photoshop-ecosystem-discussions/is-there-any-jsx-to-execute-the-auto-tone-of-camera-raw/td-p/10167490

function acrAutoWB(){
    // Camera Raw Filter - Auto
    var desc1 = new ActionDescriptor();
    //desc1.putBoolean(charIDToTypeID("AuTn"), true); // AuTn = Auto
    var idWBal = charIDToTypeID( "WBal" );
    var idWBal = charIDToTypeID( "WBal" );
    var idAuto = charIDToTypeID( "Auto" );
    desc1.putEnumerated( idWBal, idWBal, idAuto );
    executeAction(stringIDToTypeID('Adobe Camera Raw Filter'), desc1, DialogModes.NO);
}

acrAutoWB();