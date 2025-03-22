/**
 * @file
 * Defines the Editing plugin.
 */

/**
 * @module morphem/MorphemEditing
 */

import {Plugin} from 'ckeditor5/src/core';
import MorphemCommand from "./command";

/**
 * The editing feature.
 *
 * It introduces the 'morphem' element in the model.
 *
 * @extends module:core/plugin~Plugin
 */
export default class MorphemEditing extends Plugin {

  /**
   * @inheritDoc
   */
  init() {
    this._defineSchema();
    this._defineConverters();

    const editor = this.editor;

    // Attaching the command to the editor.
    editor.commands.add(
      'morphem',
      new MorphemCommand(this.editor),
    );

    editor.model.document.on('change:data', () => {
      this._removeEmptySpans(editor, editor.model.document.getRoot());
    });
  }

  /**
   * Remove empty span containers
   * @param {CKEditor object} editor
   * @param {Element object} element
   */
  _removeEmptySpans(editor, element) {
    const spans = element.getChildren();

    spans.forEach(span => {
      if (span.is('element', 'morphem') && !span.childCount) {
        editor.model.change(writer => {
          writer.remove(span);
        });
      } else if (span.is('element')) {
        this._removeEmptySpans(editor, span);
      }
    });
  }

  /**
   * Registers schema.
   *
   * @private
   */
  _defineSchema() {
    const schema = this.editor.model.schema;
    const textFormatSettings = this.editor.config.get('morphem')

    // parent element.
    schema.register('morphem', {
      allowIn: [ 'paragraph' ],
      inheritAllFrom: '$inlineObject',

      isInline: true,
      isObject: false,
      isSelectable: true,

      allowAttributes: [
        'modelClass',
      ],
      allowChildren: [
        '$text',
        'morphemBase',
        'morphemEnding',
        'morphemBasePart', // root, suffix, prefix
      ],
    });
  }

  /**
   * Defines converters.
   */
  _defineConverters() {
    const {conversion} = this.editor;
    const textFormatSettings = this.editor.config.get('morphem')

    // bButton. View -> Model.
    conversion.for('upcast').elementToElement({
      view: {
        name: 'span',
        classes: [ textFormatSettings.morphemClass ],
        attributes: {
          ['class']: true,
        }
      },
      converterPriority: 'highest',
      model: (viewElement, conversionApi ) => {
        // Do not convert if the link does not have the 'btn' class.
        let classes = viewElement.getAttribute('class');
        if (!classes) {
           return null;
        }

        var attrs = {
          modelClass: classes,
        };

        return conversionApi.writer.createElement( 'morphem', attrs );
      },
    });


    // Morphem. Model -> View.
    conversion.for('downcast').elementToElement({
      model: 'morphem',
      view: (modelElement, { writer }) => {
        let htmlAttrs = {
          'class': modelElement.getAttribute('modelClass'),
        };
        return writer.createContainerElement('span', htmlAttrs );
      }
    });


  }
}
