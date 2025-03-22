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
import Icon from '../../../icons/bb.svg';

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
    return [ ContextualBalloon ];
  }

  /**
   * @inheritDoc
   */
  init() {
    this._addToolbarButton();
//    this._handleSelection();
  }

  /**
   * Adds the toolbar button.
   *
   * @private
   */
  _addToolbarButton() {
    const editor = this.editor;

    editor.ui.componentFactory.add('morphem', (locale) => {
      const buttonView = new ButtonView(locale);

      // Create the toolbar button.
      buttonView.set({
        label: editor.t('Morphem Button'),
        icon: Icon,
        tooltip: true
      });

      // Bind button to the command.
      // The state on the button depends on the command values.
      const command = editor.commands.get('morphem');
      buttonView.bind( 'isEnabled' ).to( command, 'isEnabled' );
      buttonView.bind( 'isOn' ).to( command, 'value', value => !!value );

      // Execute the command when the button is clicked.
      this.listenTo(buttonView, 'execute', () => {

        let values = {
          modelClass:  textFormatSettings.morphemClass,
        };
        this.editor.execute('morphem', values);

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
