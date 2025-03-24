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
export default class MorphemEndingCommand extends MorphemCommand {

  /**
   * @inheritDoc
   */
  refresh() {
    // Ending is allowed only inside of 'morphem'
    const selection = this.editor.model.document.selection;
    const position = selection.getFirstPosition();
    let elm = position.parent;
    const found = findByElementName(elm, ['morphem']);

    this.isEnabled = found !== null;

    // Init the empty command value.
    this.value = null;
  }

  /**
   * @inheritDoc
   */
  execute(values) {
    const editor = this.editor;
    const { model } = editor;
    const elemName = 'morphemEnding';

    model.change((writer) => {

      const selection = model.document.selection;
      const position = selection.getFirstPosition();
      const selectedContent = model.getSelectedContent(selection);

      let elm = position.parent;
      const found = findByElementName(elm, [elemName]);

      if (found !== null) {
        // undo element
        this._unwrap_content(found);
      } else {
        // do element
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
