/**
 * @file
 * Defines the UI plugin.
 */

/**
 * @module morphem/MorphemUI
 */

import { Plugin } from 'ckeditor5/src/core';
import { findByElementName } from './utils';
import {
  ButtonView
} from 'ckeditor5/src/ui';
import Icon from '../../../icons/morphem-btn.svg';
import IconBase from '../../../icons/base-btn.svg';
import IconPrefix from '../../../icons/prefix-btn.svg';
import IconRoot from '../../../icons/root-btn.svg';
import IconSuffix from '../../../icons/suffix-btn.svg';
import IconEnding from '../../../icons/ending-btn.svg';


/**
 * The UI plugin. It introduces the `'bButton'` button and the forms.
 *
 * It uses the
 * {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon contextual balloon plugin}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class MorphemUI extends Plugin {

  /**
   * @inheritDoc
   */
  static get requires() {
    return [  ];
  }

  /**
   * @inheritDoc
   */
  init() {
    this._addToolbarButtons();
    this._enterProcessor();
  }

  _enterProcessor() {
    const editor = this.editor;
    const model = editor.model;

    editor.commands.get('enter').on('execute', (evt, options) => {
      const selection = model.document.selection;
      const position = selection.getFirstPosition();
      const parentElement = position.parent;

      const elm = findByElementName(parentElement, ['morphem']);

      if (elm !== null) {
        evt.stop(); // Отменяем стандартное разбиение элемента
        model.change(writer => {
          writer.setSelection(writer.createPositionAfter(parentElement.parent), 'in');
        });
        editor.execute('enter');
      }
    }, { priority: 'high' }); // Ставим высокий приоритет, чтобы перехватить стандартное поведение
  }

  /**
   * Adds the toolbar buttons.
   *
   * @private
   */
  _addToolbarButtons() {

    this._register_morphem_button();

    this._register_button('morphemBase', 'Morphem Base Button', 'morphemBaseCommand', IconBase);
    this._register_button('morphemPrefix', 'Morphem Prefix Button', 'morphemPrefixCommand', IconPrefix);
    this._register_button('morphemRoot', 'Morphem Root Button', 'morphemRootCommand', IconRoot);
    this._register_button('morphemSuffix', 'Morphem Suffix Button', 'morphemSuffixCommand', IconSuffix);
    this._register_button('morphemEnding', 'Morphem Ending Button', 'morphemEndingCommand', IconEnding);
  }

  /**
   * Morphem button
   */
  _register_morphem_button() {
    const editor = this.editor;

    editor.ui.componentFactory.add('morphem', (locale) => {
      const buttonView = new ButtonView(locale);
      const textFormatSettings = editor.config.get('morphem');

      // Create the toolbar button.
      buttonView.set({
        label: editor.t('Morphem Button'),
        icon: Icon,
        tooltip: true
      });

      // Bind button to the command.
      // The state on the button depends on the command values.
      const command = editor.commands.get('morphemCommand');
      buttonView.bind( 'isEnabled' ).to( command, 'isEnabled' );
      buttonView.bind( 'isOn' ).to( command, 'value', value => !!value );

      // Execute the command when the button is clicked.
      this.listenTo(buttonView, 'execute', () => {

        let values = {
          modelClass:  textFormatSettings.morphemClass,
        };
        this.editor.execute('morphemCommand', values);

      });

      return buttonView;
    });
  }

  /**
   * Morphem Base button
   */
  _register_button(componentName, label, commandName, icon) {
    const editor = this.editor;

    editor.ui.componentFactory.add(componentName, (locale) => {
      const buttonView = new ButtonView(locale);

      // Create the toolbar button.
      buttonView.set({
        label: editor.t(label),
        icon,
        tooltip: true
      });

      // Bind button to the command.
      // The state on the button depends on the command values.
      const command = editor.commands.get(commandName);
      buttonView.bind( 'isEnabled' ).to( command, 'isEnabled' );
      buttonView.bind( 'isOn' ).to( command, 'value', value => !!value );

      // Execute the command when the button is clicked.
      this.listenTo(buttonView, 'execute', () => {
        this.editor.execute(commandName, {});
      });

      return buttonView;
    });
  }

  /**
   * Handles the selection specific cases (right before or after the element).
   *
   * @private
   */
  _handleSelection() {
    const editor = this.editor;

    this.listenTo(editor.editing.view.document, 'selectionChange', (eventInfo, eventData) => {
      const selection = editor.model.document.selection;

      let el = selection.getSelectedElement() ?? selection.getFirstRange().getCommonAncestor();

      if (el.name !== "morphem") {
        this._hideUI();
      }

    });
  }



}
