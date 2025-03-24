/**
 * @file
 * Defines the Command plugin.
 */

import { Command } from 'ckeditor5/src/core';
import { findByElementName } from './utils';

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
      const found = findByElementName(elm, [elemName]);

      if (found !== null) {
        // undo element
        this._unwrap_content(found, ['morphemBase', 'morphemPrefix', 'morphemRoot', 'morphemSuffix', 'morphemEnding']);
      } else {
        // do element
        const allowedParent = model.schema.findAllowedParent(position, elemName);
        if (!allowedParent) {
          console.warn(`Нельзя вставить ${elemName} в эту позицию - ${position.parent.name} !`);
          return;
        }
        this._wrap_content(elemName, selectedContent);
      }

    });
  }

  _unwrap_content(element, elmsToRemove = []) {
    const { model } = this.editor;
    if (element.is('element')) {
      elmsToRemove.push(element.name);
    }
    model.change((writer) => {
      this._unwrap_element(writer, element, elmsToRemove);
    });
  }

  _unwrap_element(writer, element, elmsToRemove) {
    // Получаем содержимое элемента
    const children = Array.from(element.getChildren());

    // Вставляем содержимое перед удаляемым элементом
    for (const child of children) {
      if (child.is('element') && elmsToRemove.includes(child.name)) {
        this._unwrap_element(writer, child, elmsToRemove);
      }
    }

    // Удаляем элемент
    writer.unwrap(element);
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

    // Фокусируем редактор
    this.editor.editing.view.focus();
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
