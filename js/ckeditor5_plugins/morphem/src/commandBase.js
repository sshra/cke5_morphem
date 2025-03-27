/**
 * @file
 * Defines the Command plugin.
 */

import MorphemCommand from "./command";
import { findByElementName } from './utils';

/**
 * The morphem command.
 *
 * @extends module:core/command~Command
 */
export default class MorphemBaseCommand extends MorphemCommand {

  /**
   * @inheritDoc
   */
  refresh() {
    // Base is allowed only inside of 'morphem'
    const selection = this.editor.model.document.selection;
    const position = selection.getFirstPosition();
    let elm = position.parent;
    const found = findByElementName(elm, ['morphem']);

    this.isEnabled = found !== null;

    // Init the empty command value.
    this.value = null;
  }

  /**
   * @inheritDoc /modes : toggle, on, off
   */
  execute(mode = 'toggle') {
    const editor = this.editor;
    const { model } = editor;
    const elemName = 'morphemBase';

    model.change((writer) => {
      const selection = model.document.selection;
      const position = selection.getFirstPosition();
      const selectedContent = model.getSelectedContent(selection);

      let elm = position.parent;
      const found = findByElementName(elm, [elemName]);

      if (found !== null) {
        // undo element
        if (mode == 'on') {
          return; // nothing to do
        }
        this._unwrap_content(found, ['morphemPrefix', 'morphemRoot', 'morphemSuffix', 'morphemPostfix']);
      } else {
        // do element
        if (mode == 'off') {
          return; // nothing to do
        }
        const allowedParent = model.schema.findAllowedParent(position, elemName);
        if (!allowedParent) {
          console.warn(`Нельзя вставить ${elemName} в эту позицию!`);
          return;
        }
        this._wrap_content(elemName, selectedContent);
      }

    });
  }

}
