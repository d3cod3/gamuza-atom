'use babel';

import GamuzaAtomView from './gamuza-atom-view';
import { CompositeDisposable } from 'atom';

var open = require('./open.js/open.js');
var path = require('path');
var os = require('os');
var fs = require('fs');
var remote = require('remote');
var dialog = remote.require('dialog');

var osc = require("./osc.js/platforms/osc-node.js");
var udpPort = new osc.UDPPort({
  localAddress: "127.0.0.1",
  localPort: 37999, // listening
  remoteAddress: "127.0.0.1",
  remotePort: 57999 // sending
});

function sendOSCToGAmuza(tag,data) {
  udpPort.send({
    address: tag,
    args: [data]
  });

  setTimeout(function() {
    udpPort.send({
      address: tag,
      args: [""]
    });
  }, 40);
}

function sendFastOSCToGAmuza(tag,data) {
  udpPort.send({
    address: tag,
    args: [data]
  });

  setTimeout(function() {
    udpPort.send({
      address: tag,
      args: [""]
    });
  }, 20);
}

export default {

  gamuzaAtomView: null,
  modalPanel: null,
  subscriptions: null,
  toolBar: null,

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

    // About GAmuza
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:aboutGAmuza': () => this.aboutGAmuza()
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

    // Console submenu
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:printConsole': () => this.printConsole()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:printAudioUnits': () => this.printAudioUnits()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:printAudioCodecs': () => this.printAudioCodecs()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:printOSCInfo': () => this.printOSCInfo()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:printOpenGLInfo': () => this.printOpenGLInfo()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:printCredits': () => this.printCredits()
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
      'gamuza-atom:activateMapper': () => this.activateMapper()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:loadMapperSettings': () => this.loadMapperSettings()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:saveMapperSettings': () => this.saveMapperSettings()
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

    // TOOLBAR only functions
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:newGAmuzaScript': () => this.newGAmuzaScript()
    }));

  },

  consumeToolBar(toolBar) {
    this.toolBar = toolBar("gamuza-atom");

    this.toolBar.addButton({
      icon:'power',
      callback: 'gamuza-atom:openGAmuza',
      tooltip: 'Launch GAmuza',
      iconset: 'ion'
    });

    this.toolBar.addSpacer();

    this.toolBar.addButton({
      icon:'play',
      callback: 'gamuza-atom:compileScript',
      tooltip: 'Compile Script',
      iconset: 'ion'
    });

    this.toolBar.addButton({
      icon:'stop',
      callback: 'gamuza-atom:clearScript',
      tooltip: 'Clear Script',
      iconset: 'ion'
    });

    this.toolBar.addButton({
      icon:'navicon-round',
      callback: 'gamuza-atom:clearConsole',
      tooltip: 'Clear Console',
      iconset: 'ion'
    });

    this.toolBar.addSpacer();

    this.toolBar.addButton({
      icon:'document-text',
      callback: 'gamuza-atom:newGAmuzaScript',
      tooltip: 'New GAmuza script',
      iconset: 'ion'
    });

    this.toolBar.addButton({
      icon:'folder',
      callback: 'application:open-file',
      tooltip: 'Open',
      iconset: 'ion'
    });

    this.toolBar.addButton({
      icon:'archive',
      callback: 'core:save',
      tooltip: 'Save',
      iconset: 'ion'
    });

    this.toolBar.addButton({
      icon:'search',
      callback: 'find-and-replace:show',
      tooltip: 'Find in Buffer',
      iconset: 'ion'
    });

    this.toolBar.addSpacer();

    this.toolBar.addButton({
      icon:'easel',
      callback: 'gamuza-atom:togglePreviewModule',
      tooltip: 'Preview',
      iconset: 'ion'
    });

    this.toolBar.addButton({
      icon:'ios-film',
      callback: 'gamuza-atom:toggleTimelineModule',
      tooltip: 'Timeline Module',
      iconset: 'ion'
    });

    this.toolBar.addButton({
      icon:'mic-c',
      callback: 'gamuza-atom:toggleAudioAnalysisModule',
      tooltip: 'Audio Analysis Module',
      iconset: 'ion'
    });

    this.toolBar.addButton({
      icon:'ios-infinite',
      callback: 'gamuza-atom:toggleArduinoModule',
      tooltip: 'Arduino Module',
      iconset: 'ion'
    });

    this.toolBar.addButton({
      icon:'cube',
      callback: 'gamuza-atom:toggleMapperModule',
      tooltip: 'Mapper Module',
      iconset: 'ion'
    });

    this.toolBar.addSpacer();

    this.toolBar.addButton({
      icon:'gear-a',
      callback: 'gamuza-atom:openGAmuzaPreferences',
      tooltip: 'GAmuza Preferences',
      iconset: 'ion'
    });

    this.toolBar.addButton({
      icon:'information-circled',
      callback: 'gamuza-atom:aboutGAmuza',
      tooltip: 'About GAmuza',
      iconset: 'ion'
    });

    this.toolBar.addSpacer();

    this.toolBar.addButton({
      icon:'ios-book',
      callback: 'gamuza-atom:openGABook',
      tooltip: 'GAmuza Book',
      iconset: 'ion'
    });

  },

  deactivate() {
    // Close the socket
    updPort.close();

    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.gamuzaAtomView.destroy();
    this.toolBar.removeItems();
  },

  serialize() {
    return {
      gamuzaAtomViewState: this.gamuzaAtomView.serialize()
    };
  },

  newGAmuzaScript() {
    // TODO -- OS variations
    dialog.showSaveDialog({defaultPath: path.join(os.homedir(), '/Documents/GAmuza/'), filters: [{name: 'GAmuza Script File', extensions: ['ga']}]},function(filename){
      if(filename!=null){
        // extract filename
        var realFN = filename.substr(filename.lastIndexOf('/')+1);
        // extract path
        var realPath = filename.substr(0,filename.lastIndexOf('/')+1);
        // create folder with filename
        var newScriptFolder = path.join(realPath,realFN.substr(0,realFN.lastIndexOf('.')));
        fs.mkdir(newScriptFolder);
        // save .ga main file inside folder
        // TODO -- OS variations
        var buffer = fs.readFile(path.join(os.homedir(), '/Documents/GAmuza/Examples/Basics/empty/empty.ga'),function(err,data){
          if(err) throw err;
          if(data!=null){
            fs.writeFile(path.join(newScriptFolder,realFN),data,function(error){
              if(error) throw err;
            });
          }
        });

        // create data folder
        fs.mkdir(path.join(newScriptFolder,'/data'));

        open(path.join(newScriptFolder,realFN),"Atom");
      }
    });
  },

  aboutGAmuza() {
    sendOSCToGAmuza("/GAabout","1");
  },

  openGAmuza(){
    open("","GAmuza",function(error){
      if(error != null){
        alert("You don't have GAmuza installed!\n\nDownload the last release at:\n\nhttp://gamuza.d3cod3.org/downloads/");
      }
    });

    // TODO -- OS variations
    open(path.join(os.homedir(), '/Documents/GAmuza/Examples/Basics/empty/empty.ga'),"Atom");

  },

  openGAmuzaPreferences() {
    sendOSCToGAmuza("/GApreferences","1");
  },

  compileScript() {

    var editor = atom.workspace.getActivePaneItem();
    var file = editor.buffer.file;
    var filePath = file.path;
    var finalPath = filePath.substr(0,filePath.lastIndexOf('/')+1);

    // Save buffer
    editor.buffer.save();
    // Send
    sendOSCToGAmuza("/GAcompileScript",finalPath);

  },

  clearScript() {
    sendOSCToGAmuza("/GAconsole","0");
  },

  clearConsole() {
    sendOSCToGAmuza("/GAconsole","1");
  },

  printConsole() {
    sendOSCToGAmuza("/GAconsole","2");
  },

  printAudioUnits() {
    sendOSCToGAmuza("/GAconsole","3");
  },

  printAudioCodecs() {
    sendOSCToGAmuza("/GAconsole","4");
  },

  printOSCInfo() {
    sendOSCToGAmuza("/GAconsole","5");
  },

  printOpenGLInfo() {
    sendOSCToGAmuza("/GAconsole","6");
  },

  printCredits() {
    sendOSCToGAmuza("/GAconsole","7");
  },

  togglePreviewModule() {
    sendOSCToGAmuza("/GAtoggleModule","0");
  },

  toggleTimelineModule() {
    sendOSCToGAmuza("/GAtoggleModule","1");
  },

  toggleAudioAnalysisModule() {
    sendOSCToGAmuza("/GAtoggleModule","2");
  },

  toggleArduinoModule() {
    sendOSCToGAmuza("/GAtoggleModule","3");
  },

  toggleMapperModule() {
    sendOSCToGAmuza("/GAtoggleModule","4");
  },

  hideAllModules() {
    sendOSCToGAmuza("/GAtoggleModule","-1");
  },

  toggleColorCorrection() {
    sendOSCToGAmuza("/GAtoggleTool","0");
  },

  toggleColorSelector() {
    sendOSCToGAmuza("/GAtoggleTool","1");
  },

  toggleLogger() {
    sendOSCToGAmuza("/GAtoggleTool","2");
  },

  toggleGridViewer() {
    sendOSCToGAmuza("/GAtoggleTool","3");
  },

  archiveSketch() {
    sendOSCToGAmuza("/GAtoggleTool","4");
  },

  exportToHTML() {
    sendOSCToGAmuza("/GAtoggleTool","5");
  },

  timelineCut() {
    sendOSCToGAmuza("/GAtimeline","cut");
  },

  timelineCopy() {
    sendOSCToGAmuza("/GAtimeline","copy");
  },

  timelinePaste() {
    sendOSCToGAmuza("/GAtimeline","paste");
  },

  activateMapper() {
    sendOSCToGAmuza("/GAmapperModule","activate");
  },

  loadMapperSettings() {
    sendOSCToGAmuza("/GAmapperModule","load");
  },

  saveMapperSettings() {
    sendOSCToGAmuza("/GAmapperModule","save");
  },

  openGAReference() {
    open("http://gamuza.d3cod3.org/reference/");
  },

  openGABook() {
    open("http://gamuza.d3cod3.org/books/GAmuza_LCC.pdf");
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
