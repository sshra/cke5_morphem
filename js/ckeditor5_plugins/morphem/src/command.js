/**
 * @file
 * Defines the Command plugin.
 */

import { Command } from 'ckeditor5/src/core';
import {
  findElement,
} from "./utils";

/**
 * The morphem command.
 *
 * @extends module:core/command~Command
 */
export default class MorphemCommand extends Command {

  /**
   * @inheritDoc
   */
  refresh() {
    // Toolbar button is always enabled.
    this.isEnabled = true;

    // Init the empty command value.
    this.value = null;

    // Find the element in the selection.
    const { selection } = this.editor.model.document;
    const El = findElement(selection, 'morphem');
    if (!El) {
      return;
    }

    // Populate command value.
    this.value = {};

    // Process attributes
    for (const [attrKey, attrValue] of El.getAttributes()) {
      this.value[attrKey] = attrValue;
    }


  }

  /**
   * @inheritDoc
   */
  execute(values) {
    const { model } = this.editor;

    model.change((writer) => {
      // Find an existing bButton if it is being edited.

      const selection = model.document.selection;
      const position = selection.getFirstPosition();

      if (position.parent.name == 'morphem') {
        writer.remove(position.parent);
      }

      // Create a new button.
      const El = writer.createElement('morphem');
      // Editing the model element and its children to match the form values.
      this._editElement(writer, El, values);
      // Insert a new button.
      model.insertContent(El);
    });
  }

  /**
   * (Re)create a bButton element using the new values.
   *
   * While editing, removes child elements, recreates them
   * and appends in a proper order.
   *
   * @param {Writer} writer
   *   Model writer.
   * @param {module:engine/model/element~Element} modelEl
   *   Model element.
   * @param {Array} values
   *   New values.
   *
   * @private
   */
  _editElement(writer, modelEl, values) {
    // Clear modelEl attributes.
    writer.clearAttributes(modelEl);

    // Set modelEl attributes.
    var modelAttrs = {};
    modelAttrs.bbLinkClass = values['bbLinkClass'];
    modelAttrs.bbLinkHref = values['bbLinkHref'];
    /*console.log(modelEl);
    console.log(values);*/

    const textFormatSettings = this.editor.config.get('morphem')

    writer.setAttributes(modelAttrs, modelEl);

    // Get modelEl children elements names.
    const children = [];
    Array.from(modelEl.getChildren()).forEach((el) => {
      children.push(el.name);
    });

    writer.appendText( values.bbLinkText, modelEl );
  }

  /**
   * Processes child text elements.
   *
   * @param {Writer} writer
   *   Model writer.
   * @param {Array} values
   *   New values.
   * @param {Array} children
   *   Child elements names array.
   * @param {module:engine/model/element~Element} modelEl
   *   Model element.
   * @param {string} childElName
   *   Processed child element name.
   *
   * @returns {null|*}
   *   Child element to append to modelEl, or null.
   *
   * @private
   */
  _processChildTextEl(writer, values, children, modelEl, childElName) {

    const childEl = this._processChildElement(
      writer,
      values[childElName],
      children,
      modelEl,
      childElName
    );

    if (childEl) {
      // Remove existing text if any.
      while (childEl.childCount) {
        const textNode = childEl.getChild(childEl.childCount - 1);
        if (textNode) {
          writer.remove(textNode);
        }
      }

      // Set new text.
      writer.appendText( values[childElName], childEl );
      return childEl;
    }

    return null;
  }

  /**
   * Processes child attribute elements.
   *
   * @param {Writer} writer
   *   Model writer.
   * @param {Array} values
   *   New values.
   * @param {Array} children
   *   Child elements names array.
   * @param {module:engine/model/element~Element} modelEl
   *   Model element.
   * @param {string} childElName
   *   Processed child element name.
   *
   * @returns {null|*}
   *   Child element to append to modelEl, or null.
   *
   * @private
   */
  _processChildAttrEl(writer, values, children, modelEl, childElName) {

    const childEl = this._processChildElement(
      writer,
      values[childElName],
      children,
      modelEl,
      childElName
    );

    if (childEl) {
      return childEl;
    }

    return null;
  }

  /**
   * Processes any child element.
   *
   * @param {Writer} writer
   *   Model writer.
   * @param {string} value
   *   New values.
   * @param {Array} children
   *   Child elements names array.
   * @param {module:engine/model/element~Element} modelEl
   *   Model element.
   * @param {string} childElName
   *   Processed child element name.
   *
   * @returns {null|*}
   *   Child element to append to modelEl, or null.
   *
   * @private
   */

  _processChildElement (writer, value, children, modelEl, childElName) {

    // Define an operation.
    const create = value && !children.includes(childElName);
    const edit = value && children.includes(childElName);
    const remove = !value && children.includes(childElName);

    var childEl = null;

    if (create) {
      childEl = writer.createElement(childElName, { value });
    } else if (edit || remove) {
      // Get updated children list to get the correct index.
      let childrenUpdated = [];
      Array.from(modelEl.getChildren()).forEach((el) => {
        childrenUpdated.push(el.name);
      });

      // Find child element;
      var childElIndex = childrenUpdated.indexOf(childElName);
      childEl = modelEl.getChild(childElIndex);
    }

    // Remove now and re-add later if needed
    // to comply with the child elements order.
    if (children.includes(childElName) && childEl) {
      writer.remove(childEl);
    }

    if (remove) {
      return null;
    } else {
      return childEl;
    }

  }

}
