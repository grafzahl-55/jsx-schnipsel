// Ruft den Camera Raf Filter auf und wendet die
// Automatische Tonwertkorrektur an
//
// Quelle:  https://community.adobe.com/t5/photoshop-ecosystem-discussions/is-there-any-jsx-to-execute-the-auto-tone-of-camera-raw/td-p/10167490

function acrAutoKorrektur(){
    // Camera Raw Filter - Auto
    var desc1 = new ActionDescriptor();
    desc1.putBoolean(charIDToTypeID("AuTn"), true); // AuTn = Auto
    executeAction(stringIDToTypeID('Adobe Camera Raw Filter'), desc1, DialogModes.NO);
}