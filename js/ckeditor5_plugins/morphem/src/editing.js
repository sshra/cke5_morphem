/**
 * @file
 * Defines the Editing plugin.
 */

/**
 * @module morphem/MorphemEditing
 */

import {Plugin} from 'ckeditor5/src/core';
import MorphemCommand from "./command";
import MorphemBaseCommand from "./commandBase";
import MorphemPrefixCommand from "./commandPrefix";
import MorphemRootCommand from "./commandRoot";
import MorphemSuffixCommand from "./commandSuffix";
import MorphemEndingCommand from "./commandEnding";

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
      'morphemCommand',
      new MorphemCommand(this.editor),
    );

    editor.commands.add(
      'morphemBaseCommand',
      new MorphemBaseCommand(this.editor),
    );

    editor.commands.add(
      'morphemPrefixCommand',
      new MorphemPrefixCommand(this.editor),
    );

    editor.commands.add(
      'morphemRootCommand',
      new MorphemRootCommand(this.editor),
    );

    editor.commands.add(
      'morphemSuffixCommand',
      new MorphemSuffixCommand(this.editor),
    );

    editor.commands.add(
      'morphemEndingCommand',
      new MorphemEndingCommand(this.editor),
    );

    editor.model.document.on('change:data', () => {
//      this._removeEmptySpans(editor, editor.model.document.getRoot());
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

    // parent element.
    schema.register('morphem', {
      allowIn: [ 'paragraph' ],
      inheritAllFrom: '$inline',

      isInline: true,
      isObject: false,
      isSelectable: true,

      allowAttributes: [
        'modelClass',
      ],
      allowChildren: [
        '$inline',
        '$text',
        'morphemBase',
        'morphemEnding',
        'morphemRoot',
        'morphemPrefix',
        'morphemSuffix',
      ],
    });


    // base element.
    schema.register('morphemBase', {
      allowIn: [ 'morphem' ],
      inheritAllFrom: '$inline',

      isInline: true,
      isObject: false,
      isSelectable: true,

      allowAttributes: [],
      allowChildren: [
        '$inline',
        '$text',
        'morphemRoot',
        'morphemPrefix',
        'morphemSuffix',
      ],
    });

    // ending
    schema.register('morphemEnding', {
      allowIn: [ 'morphem' ],
      inheritAllFrom: '$inline',

      isInline: true,
      isObject: false,
      isSelectable: true,

      allowAttributes: [
      ],
      allowChildren: [
        '$inline',
        '$text',
      ],
    });

    // morphemPrefix
    schema.register('morphemPrefix', {
      allowIn: [ 'morphem', 'morphemBase' ],
      inheritAllFrom: '$inline',

      isInline: true,
      isObject: false,
      isSelectable: true,

      allowAttributes: [
      ],
      allowChildren: [
        '$inline',
        '$text',
      ],
    });

    // morphemSuffix
    schema.register('morphemSuffix', {
      allowIn: [ 'morphem', 'morphemBase' ],
      inheritAllFrom: '$inline',

      isInline: true,
      isObject: false,
      isSelectable: true,

      allowAttributes: [
      ],
      allowChildren: [
        '$inline',
        '$text',
      ],
    });

    // morphemRoot
    schema.register('morphemRoot', {
      allowIn: [ 'morphem', 'morphemBase' ],
      inheritAllFrom: '$inline',

      isInline: true,
      isObject: false,
      isSelectable: true,

      allowAttributes: [
      ],
      allowChildren: [
        '$inline',
        '$text',
      ],
    });

  }

  /**
   * Defines converters.
   */
  _defineConverters() {
    const {conversion} = this.editor;
    const textFormatSettings = this.editor.config.get('morphem')

    // Morphem. View -> Model.
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
          'class': textFormatSettings.morphemClass,
        };
        return writer.createContainerElement('span', htmlAttrs );
      }
    });

    /************ BASE ************/

    // morphemBase. View -> Model.
    conversion.for('upcast').elementToElement({
      view: {
        name: 'span',
        classes: [ 'base' ],
        attributes: {
          ['class']: true,
        }
      },
      converterPriority: 'highest',
      model: (viewElement, conversionApi ) => {

        let classes = viewElement.getAttribute('class');
        if (!classes) {
           return null;
        }
        var attrs = {
          modelClass: classes,
        };

        return conversionApi.writer.createElement( 'morphemBase', attrs );
      },
    });

    // Model -> View.
    conversion.for('downcast').elementToElement({
      model: 'morphemBase',
      view: (modelElement, { writer }) => {
        let htmlAttrs = {
          'class': 'base',
        };
        return writer.createContainerElement('span', htmlAttrs );
      }
    });

    /************ PREFIX ************/

    // morphemPrefix. View -> Model.
    conversion.for('upcast').elementToElement({
      view: {
        name: 'span',
        classes: [ 'prefix' ],
        attributes: {
          ['class']: true,
        }
      },
      converterPriority: 'highest',
      model: (viewElement, conversionApi ) => {

        let classes = viewElement.getAttribute('class');
        if (!classes) {
           return null;
        }

        var attrs = {
          modelClass: classes,
        };

        return conversionApi.writer.createElement( 'morphemPrefix', attrs );
      },
    });

    // Model -> View.
    conversion.for('downcast').elementToElement({
      model: 'morphemPrefix',
      view: (modelElement, { writer }) => {
        let htmlAttrs = {
          'class': 'prefix',
        };
        return writer.createContainerElement('span', htmlAttrs );
      }
    });

    /************ ROOT ************/

    // morphemRoot. View -> Model.
    conversion.for('upcast').elementToElement({
      view: {
        name: 'span',
        classes: [ 'root' ],
        attributes: {
          ['class']: true,
        }
      },
      converterPriority: 'highest',
      model: (viewElement, conversionApi ) => {

        let classes = viewElement.getAttribute('class');
        if (!classes) {
           return null;
        }

        var attrs = {
          modelClass: classes,
        };

        return conversionApi.writer.createElement( 'morphemRoot', attrs );
      },
    });

    // Model -> View.
    conversion.for('downcast').elementToElement({
      model: 'morphemRoot',
      view: (modelElement, { writer }) => {
        let htmlAttrs = {
          'class': 'root',
        };
        return writer.createContainerElement('span', htmlAttrs );
      }
    });

    /************ Suffix ************/

    // morphemSuffix. View -> Model.
    conversion.for('upcast').elementToElement({
      view: {
        name: 'span',
        classes: [ 'suffix' ],
        attributes: {
          ['class']: true,
        }
      },
      converterPriority: 'highest',
      model: (viewElement, conversionApi ) => {

        let classes = viewElement.getAttribute('class');
        if (!classes) {
           return null;
        }

        var attrs = {
          modelClass: classes,
        };

        return conversionApi.writer.createElement( 'morphemSuffix', attrs );
      },
    });

    // Model -> View.
    conversion.for('downcast').elementToElement({
      model: 'morphemSuffix',
      view: (modelElement, { writer }) => {
        let htmlAttrs = {
          'class': 'suffix',
        };
        return writer.createContainerElement('span', htmlAttrs );
      }
    });


    /************ ENDING ************/

    // morphemEnding. View -> Model.
    conversion.for('upcast').elementToElement({
      view: {
        name: 'span',
        classes: [ 'ending' ],
        attributes: {
          ['class']: true,
        }
      },
      converterPriority: 'highest',
      model: (viewElement, conversionApi ) => {

        let classes = viewElement.getAttribute('class');
        if (!classes) {
           return null;
        }

        var attrs = {
          modelClass: classes,
        };

        return conversionApi.writer.createElement( 'morphemEnding', attrs );
      },
    });

    // Model -> View.
    conversion.for('downcast').elementToElement({
      model: 'morphemEnding',
      view: (modelElement, { writer }) => {
        let htmlAttrs = {
          'class': 'ending',
        };
        return writer.createContainerElement('span', htmlAttrs );
      }
    });

  }
}
