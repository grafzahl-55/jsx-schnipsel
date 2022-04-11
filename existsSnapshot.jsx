// Eine Funktion, die feststellt, ob es im aktiven Dokument einen
// mit einem bestimmten Namen gibt
function existsSnapshot(snapshotName){
    try{
        var snp=activeDocument.historyStates.getByName(snapshotName);
        return snp.snapshot;
    } catch(e){
        return false;
    }
}


// Beispielcode

if( existsSnapshot("MeinSchappschuss") ){
    alert("Beim Barte des Proheten - da ist er ja");
}else{
    alert("Nix da");
}

