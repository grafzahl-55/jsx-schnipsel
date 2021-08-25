// Ein Beispiel, wie man mit ExtendScript verschiedene
// Ordner auf dem Desktop erstellt.
// Zur Verfuegung gestellt von Alexander Rodriguez
// Siehe: https://www.facebook.com/groups/pixelnerd/posts/2091926917622190
//

// Bemerkungen:
// ------------
// Das "~" kennzeichnet immer (Mac und Windows) den persoenlichen
// Ordner des gerade angemeldeten Benutzers. 
// Die Funktion f.create() kann man selbst dann problemlos aufrufen, 
// wenn es den Ordner bereits gibt. In dem Fall passiert einfach nichts. 
//

var f = new Folder("~/Desktop/Export");
f.create();
var f = new Folder("~/Desktop/Export/01_PSD");
f.create();
var f = new Folder("~/Desktop/Export/02_Druck");
f.create();
var f = new Folder("~/Desktop/Export/03_JPG");
f.create();
var f = new Folder("~/Desktop/Export/04_WEB");
f.create();
var f = new Folder("~/Desktop/Export/Hoch");
f.create();
var f = new Folder("~/Desktop/Export/Quer");
f.create();

// Eine Variante:
// --------------
// Wenn man den Export-Ordner und die Unterordner nicht auf dem Desktop haben
// moechte, sondern im gleichen Verzeichnis, in dem das aktuelle
// Dokument gespeichert ist, kann man so vorgehen:
//
// Export-Ordner erstellen
var exportFolder=new Folder(activeDocument.path+"/Export");
exportFolder.create();
// Unterordner Erstellen
var f=new Folder(exportFolder+"/01_PSD");
f.create();
var f=new Folder(exportFolder+"/02_Druck");
f.create();
// ... und so weiter



