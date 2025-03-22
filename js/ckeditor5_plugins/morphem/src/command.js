/**
 * @file
 * Defines the Command plugin.
 */

import { Command } from 'ckeditor5/src/core';

/**
 * The morphem command.
 *
 * @extends module:core/command~Command
 */
export default class MorphemCommand extends Command {

  elemName = 'morphem';

  /**
   * @inheritDoc
   */
  refresh() {
    // Toolbar button is always enabled.
    this.isEnabled = true;

    // Init the empty command value.
    this.value = null;

//     // Find the element in the selection.
//     const { selection } = this.editor.model.document;
//     const El = findElement(selection, 'morphem');
//     if (!El) {
//       return;
//     }

//     // Populate command value.
//     this.value = {};

//     // Process attributes
//     for (const [attrKey, attrValue] of El.getAttributes()) {
//       this.value[attrKey] = attrValue;
//     }
// console.log(this.value);

  }

  /**
   * @inheritDoc
   */
  execute(values) {
    const editor = this.editor;
    const { model } = editor;
    const elemName = 'morphem';

    model.change((writer) => {
      const selection = model.document.selection;
      const position = selection.getFirstPosition();
      const selectedContent = model.getSelectedContent(selection);

      let elm = position.parent;
      const found = this._findByElementName(elm, elemName);

      if (found !== null) {
        // undo element
        this._unwrap_content(elm);
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

  _findByElementName(elm, elementName) {
    let found = null;
    while (elm != null) {
      if (elm.hasOwnProperty('name')) {
        if (elm.name == elementName) {
          found = elm;
          break;
        }
      }
      elm = elm.parent;
    }
    return found;
  }

  _unwrap_content(element) {
    const { model } = this.editor;

    model.change((writer) => {

      // Create a new morphem.
      const position = writer.createPositionBefore(element);
      // Получаем все дочерние элементы (и текст)
      const children = Array.from(element.getChildren());

      // Вставляем дочерние элементы перед удаляемым
      children.forEach((child) => {
        writer.insert(child, position);
      });

      // Удаляем сам элемент
      writer.remove(element);
    });
  }

  _wrap_content(elementName, selectedContent) {
    const { model } = this.editor;

    model.change((writer) => {

      // Create a new morphem.
      const El = writer.createElement(elementName);

      // Проверяем, какие элементы можно вложить в El
      const validNodes = [];
      for (const node of selectedContent.getChildren()) {
        if (model.schema.checkChild(El, node)) {
          validNodes.push(node);
        }
      }
      // Если нет валидных элементов, ничего не делаем
      if (validNodes.length === 0) {
        console.warn(`В выделении нет элементов, которые можно вложить в ${elementName}!`);
        return;
      }

      // Вставляем валидные элементы внутрь нового span
      for (const node of validNodes) {
        writer.append(node, El);
      }
      model.insertContent( El );
    });
  }


  _mayInsertIntoPosition(elementName) {
    const editor = this.editor;
    const { model } = editor;

    const selectedContent = editor.model.getSelectedContent(
      editor.model.document.selection);

    // Проверяем, что выбанные элемент можно вложить в наш контейнер
    let inValidNodesCount = 0;
    let validNodesCount = 0;

    model.change( writer => {
      const El = writer.createElement(elementName);
      for (const node of selectedContent.getChildren()) {
        if (model.schema.checkChild(El, node)) {
          validNodesCount ++;
        } else {
          inValidNodesCount ++;
        }
      }
    });

    return (validNodesCount > 0 && inValidNodesCount == 0);
  }

}
