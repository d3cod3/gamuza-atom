'use babel';

import GamuzaAtomView from './gamuza-atom-view';
import { CompositeDisposable } from 'atom';

export default {

  gamuzaAtomView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.gamuzaAtomView = new GamuzaAtomView(state.gamuzaAtomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.gamuzaAtomView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'gamuza-atom:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.gamuzaAtomView.destroy();
  },

  serialize() {
    return {
      gamuzaAtomViewState: this.gamuzaAtomView.serialize()
    };
  },

  toggle() {
    console.log('GamuzaAtom was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
