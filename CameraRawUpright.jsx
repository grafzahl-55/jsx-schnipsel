/*
Camera Raw Filter - Transform Values:
1 = Auto, 2 = Full, 3 = Level, 4 = Vertical
*/

transformCRF( transValue = 3 );

function transformCRF() {
    var actDesc = new ActionDescriptor();
    actDesc.putInteger(charIDToTypeID("PerU"), transValue);
    executeAction(stringIDToTypeID("Adobe Camera Raw Filter"), actDesc, DialogModes.NO);
}