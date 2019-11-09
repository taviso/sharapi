// This script just prints the message Hello World to the UI.

var message = new FeText("Message", 150, 350);
var app = new FeApp();
var layer;

message.AddHardCodedString("Hello, World!");
message.SetTextStyle("font0_16");

// Pick the top layer.
layer = app.GetProject().GetCurrentScreen().GetPageByIndex(0).GetLayerByIndex(0);

// Add our message.
layer.getFeParent().AddChild(message);
