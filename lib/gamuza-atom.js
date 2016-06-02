'use babel';

import GamuzaAtomView from './gamuza-atom-view';
import { CompositeDisposable } from 'atom';

var open = require('./open.js/open.js');
var path = require('path');

var osc = require("./osc.js/platforms/osc-node.js");
var udpPort = new osc.UDPPort({
  localAddress: "127.0.0.1",
  localPort: 37999, // listening
  remoteAddress: "127.0.0.1",
  remotePort: 57999 // sending
});

export default {

  gamuzaAtomView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    // Open the socket
    udpPort.open();

    this.gamuzaAtomView = new GamuzaAtomView(state.gamuzaAtomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.gamuzaAtomView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register commands
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:toggle': () => this.toggle()
    }));

    // launch GAmuza
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:openGAmuza': () => this.openGAmuza()
    }));

    // GAmuza Preferences
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:openGAmuzaPreferences': () => this.openGAmuzaPreferences()
    }));

    // Script Submenu
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:compileScript': () => this.compileScript()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:clearScript': () => this.clearScript()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:clearConsole': () => this.clearConsole()
    }));

    // Modules Submenu
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:togglePreviewModule': () => this.togglePreviewModule()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:toggleTimelineModule': () => this.toggleTimelineModule()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:toggleAudioAnalysisModule': () => this.toggleAudioAnalysisModule()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:toggleArduinoModule': () => this.toggleArduinoModule()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:toggleMapperModule': () => this.toggleMapperModule()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:hideAllModules': () => this.hideAllModules()
    }));

    // Tools Submenu
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:toggleColorCorrection': () => this.toggleColorCorrection()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:toggleColorSelector': () => this.toggleColorSelector()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:toggleLogger': () => this.toggleLogger()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:toggleGridViewer': () => this.toggleGridViewer()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:archiveSketch': () => this.archiveSketch()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:exportToHTML': () => this.exportToHTML()
    }));

    // Timeline Submenu
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:timelineCut': () => this.timelineCut()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:timelineCopy': () => this.timelineCopy()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:timelinePaste': () => this.timelinePaste()
    }));

    // Video Submenu
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:editMapping': () => this.editMapping()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:resetMapping': () => this.resetMapping()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:keyboardControl': () => this.keyboardControl()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:editPointON': () => this.editPointON()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:editPointOFF': () => this.editPointOFF()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:gotoNorthPoint': () => this.gotoNorthPoint()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:gotoSouthPoint': () => this.gotoSouthPoint()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:gotoEastPoint': () => this.gotoEastPoint()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:gotoWestPoint': () => this.gotoWestPoint()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:loadMapping': () => this.loadMapping()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:saveMapping': () => this.saveMapping()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:activateMapper': () => this.activateMapper()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:loadMapperSettings': () => this.loadMapperSettings()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:saveMapperSettings': () => this.saveMapperSettings()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:toggleCursor': () => this.toggleCursor()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:toggleFullscreen': () => this.toggleFullscreen()
    }));

    // Help Submenu
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:openGAReference': () => this.openGAReference()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:openGABook': () => this.openGABook()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:openGAWeb': () => this.openGAWeb()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:openOFWeb': () => this.openOFWeb()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:openOFXWeb': () => this.openOFXWeb()
    }));

  },

  deactivate() {
    // Close the socket
    updPort.close();

    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.gamuzaAtomView.destroy();
  },

  serialize() {
    return {
      gamuzaAtomViewState: this.gamuzaAtomView.serialize()
    };
  },

  openGAmuza(){
    open(path.join(__dirname, 'empty.ga'),"GAmuza");
  },

  openGAmuzaPreferences() {
    udpPort.send({
      address: "/GApreferences",
      args: [1]
    });
  },

  compileScript() {

    var editor = atom.workspace.getActivePaneItem();
    var file = editor.buffer.file;
    var filePath = file.path;
    var finalPath = filePath.substr(0,filePath.lastIndexOf('/')+1);

    //console.log(finalPath);

    var msg = {
      address: "/GAfilePath",
      args: [finalPath]
    };

    //console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);

  },

  clearScript() {
    udpPort.send({
      address: "/GAclear",
      args: [0]
    });
  },

  clearConsole() {
    udpPort.send({
      address: "/GAclear",
      args: [1]
    });
  },

  togglePreviewModule() {
    udpPort.send({
      address: "/GAtoggleModule",
      args: [0]
    });
  },

  toggleTimelineModule() {
    udpPort.send({
      address: "/GAtoggleModule",
      args: [1]
    });

  },

  toggleAudioAnalysisModule() {
    udpPort.send({
      address: "/GAtoggleModule",
      args: [2]
    });

  },

  toggleArduinoModule() {
    udpPort.send({
      address: "/GAtoggleModule",
      args: [3]
    });
  },

  toggleMapperModule() {
    udpPort.send({
      address: "/GAtoggleModule",
      args: [4]
    });
  },

  hideAllModules() {
    udpPort.send({
      address: "/GAtoggleModule",
      args: [-1]
    });
  },

  toggleColorCorrection() {
    udpPort.send({
      address: "/GAtoggleTool",
      args: [0]
    });
  },

  toggleColorSelector() {
    udpPort.send({
      address: "/GAtoggleTool",
      args: [1]
    });
  },

  toggleLogger() {
    udpPort.send({
      address: "/GAtoggleTool",
      args: [2]
    });
  },

  toggleGridViewer() {
    udpPort.send({
      address: "/GAtoggleTool",
      args: [3]
    });
  },

  archiveSketch() {
    udpPort.send({
      address: "/GAtoggleTool",
      args: [4]
    });
  },

  exportToHTML() {
    udpPort.send({
      address: "/GAtoggleTool",
      args: [5]
    });
  },

  timelineCut() {
    udpPort.send({
      address: "/GAtimeline",
      args: [0]
    });
  },

  timelineCopy() {
    udpPort.send({
      address: "/GAtimeline",
      args: [1]
    });
  },

  timelinePaste() {
    udpPort.send({
      address: "/GAtimeline",
      args: [2]
    });
  },

  editMapping() {
    udpPort.send({
      address: "/GAmapping",
      args: [0]
    });
  },

  resetMapping() {
    udpPort.send({
      address: "/GAmapping",
      args: [1]
    });
  },

  keyboardControl() {
    udpPort.send({
      address: "/GAmapping",
      args: [2]
    });
  },

  editPointON() {
    udpPort.send({
      address: "/GAmapping",
      args: [3]
    });
  },

  editPointOFF() {
    udpPort.send({
      address: "/GAmapping",
      args: [4]
    });
  },

  gotoNorthPoint() {
    udpPort.send({
      address: "/GAmapping",
      args: [5]
    });
  },

  gotoSouthPoint() {
    udpPort.send({
      address: "/GAmapping",
      args: [6]
    });
  },

  gotoEastPoint() {
    udpPort.send({
      address: "/GAmapping",
      args: [7]
    });
  },

  gotoWestPoint() {
    udpPort.send({
      address: "/GAmapping",
      args: [8]
    });
  },

  loadMapping() {
    udpPort.send({
      address: "/GAmapping",
      args: [9]
    });
  },

  saveMapping() {
    udpPort.send({
      address: "/GAmapping",
      args: [10]
    });
  },

  activateMapper() {
    udpPort.send({
      address: "/GAmapperModule",
      args: [0]
    });
  },

  loadMapperSettings() {
    udpPort.send({
      address: "/GAmapperModule",
      args: [1]
    });
  },

  saveMapperSettings() {
    udpPort.send({
      address: "/GAmapperModule",
      args: [2]
    });
  },

  toggleCursor() {
    udpPort.send({
      address: "/GAtoggleCursor",
      args: [1]
    });
  },

  toggleFullscreen() {
    udpPort.send({
      address: "/GAtoggleFullscreen",
      args: [1]
    });
  },

  openGAReference() {
    open("http://gamuza.d3cod3.org/reference/");
  },

  openGABook() {
    // -- TODO, open online pdf
  },

  openGAWeb() {
    open("http://gamuza.d3cod3.org/");
  },

  openOFWeb() {
    open("http://openframeworks.cc/");
  },

  openOFXWeb() {
    open("http://ofxaddons.com/");
  }

};
