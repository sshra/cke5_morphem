/**
 * @file
 * Defines the UI plugin.
 */

/**
 * @module morphem/MorphemUI
 */

import { Plugin } from 'ckeditor5/src/core';
import {
  ButtonView
} from 'ckeditor5/src/ui';
import Icon from '../../../icons/morphem.svg';
import IconEnding from '../../../icons/ending.svg';

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
//    this._handleSelection();
  }

  /**
   * Adds the toolbar buttons.
   *
   * @private
   */
  _addToolbarButtons() {

    this._register_morphem_button();
    this._register_morphemEnding_button();

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
   * Morphem Ending button
   */
  _register_morphemEnding_button() {
    const editor = this.editor;

    editor.ui.componentFactory.add('morphemEnding', (locale) => {
      const buttonView = new ButtonView(locale);

      // Create the toolbar button.
      buttonView.set({
        label: editor.t('Morphem Ending Button'),
        icon: IconEnding,
        tooltip: true
      });

      // Bind button to the command.
      // The state on the button depends on the command values.
      const command = editor.commands.get('morphemEndingCommand');
      buttonView.bind( 'isEnabled' ).to( command, 'isEnabled' );
      buttonView.bind( 'isOn' ).to( command, 'value', value => !!value );

      // Execute the command when the button is clicked.
      this.listenTo(buttonView, 'execute', () => {
        this.editor.execute('morphemEndingCommand', {});
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
