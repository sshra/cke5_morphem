/**
 * @file
 * Defines the UI plugin.
 */

/**
 * @module morphem/MorphemUI
 */

import { Plugin } from 'ckeditor5/src/core';
import { findByElementName } from './utils';
import FormView from './ui/formview';
import {
  ButtonView,
  ContextualBalloon
} from 'ckeditor5/src/ui';
import Icon from '../../../icons/morphem-btn.svg';

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
    // Create the balloon.
    this._balloon = this.editor.plugins.get( ContextualBalloon );
    this.formView = this._createFormView();

    this._addToolbarButtons();
    this._enterProcessor();
  }

/**
   * Creates the form view.
   *
   * @returns {FormView}
   *   The form view instance.
   *
   * @private
   */
  _createFormView() {
    // The FormView defined in src/ui/formview.js
    const textFormatSettings = this.editor.config.get('morphem')
    const formView = new FormView(this.editor.locale, textFormatSettings);

     this.listenTo(formView.saveButtonView, 'execute', () => {
      this._hideUI();
    });

    this.listenTo(formView.cancelButtonView, 'execute', () => {
      this.editor.execute('morphemCommand', { mode: 'off' })
      this._hideUI();
    });

    this.listenTo(formView.baseButtonView, 'execute', () => {
      this.editor.execute('morphemBaseCommand')
    });
    this.listenTo(formView.prefixButtonView, 'execute', () => {
      this.editor.execute('morphemPrefixCommand')
    });
    this.listenTo(formView.rootButtonView, 'execute', () => {
      this.editor.execute('morphemRootCommand')
    });
    this.listenTo(formView.suffixButtonView, 'execute', () => {
      this.editor.execute('morphemSuffixCommand')
    });
    this.listenTo(formView.endingButtonView, 'execute', () => {
      this.editor.execute('morphemEndingCommand')
    });
    this.listenTo(formView.postfixButtonView, 'execute', () => {
      this.editor.execute('morphemPostfixCommand')
    });

    return formView;
  }

  /**
   * Adds the {@link #FormView} to the balloon and sets the form values.
   *
   * @private
   */
  _addFormView() {

    if (this._balloon.hasView(this.formView)) {
      this._balloon.remove(this.formView);
    }

    this._balloon.add({
      view: this.formView,
      position: this._getBalloonPositionData(),
      balloonClassName: 'morphem_balloon',
    });

    this.editor.execute('morphemCommand', { mode: 'on' });

    // Reset the focus to the first form element.
    this.formView.focus();
  }


  /**
   * Shows the UI.
   *
   * @private
   */
  _showUI() {
    this._addFormView();
  }


  /**
   * Hide the UI.
   *
   * @private
   */
  _hideUI() {
    const formView = this.formView;

    // Without this a new form contains the old values.
    if (formView.element) {
      formView.element.reset();
    }

    if (this._balloon.hasView(formView)) {
      this._balloon.remove(formView);
    }

    // Focus the editing view after closing the form view.
    this.editor.editing.view.focus();
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

    // this._register_button('morphemBase', 'Morphem Base Button', 'morphemBaseCommand', IconBase);
    // this._register_button('morphemPrefix', 'Morphem Prefix Button', 'morphemPrefixCommand', IconPrefix);
    // this._register_button('morphemRoot', 'Morphem Root Button', 'morphemRootCommand', IconRoot);
    // this._register_button('morphemSuffix', 'Morphem Suffix Button', 'morphemSuffixCommand', IconSuffix);
    // this._register_button('morphemEnding', 'Morphem Ending Button', 'morphemEndingCommand', IconEnding);
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
        this._showUI();

/*        let values = {
          modelClass:  textFormatSettings.morphemClass,
        };
        this.editor.execute('morphemCommand', values);
*/
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

  /**
   * Gets balloon position.
   *
   * @returns {{target: (function(): *)}}
   *
   * @private
   */
  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    let target = null;

    // Set a target position by converting view selection range to DOM.
    target = () => view.domConverter.viewRangeToDom(
      viewDocument.selection.getFirstRange()
    );

    return {
      target
    };
  }

}
