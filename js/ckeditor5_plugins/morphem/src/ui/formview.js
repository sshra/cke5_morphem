/**
 * @file
 * Defines the FormView View class.
 */

/**
 * @module morphem/ui/FormView
 */

import {
  ButtonView,
  LabeledFieldView,
  View,
  createLabeledInputText,
  submitHandler,
  FormHeaderView,
} from "ckeditor5/src/ui";
import { icons } from "ckeditor5/src/core";
import { default as TagView } from './tag.js';

/**
 * The bButton FormView class.
 *
 * This view displays an editing form.
 *
 * @extends module:ui/view~View
 */
export default class FormView extends View {

  /**
   * @inheritDoc
   */
  constructor( locale, customSelectors = [] ) {
    super( locale );

    // Tools.
    this.baseButtonView = this._createButton(
      'Base', null, ['button', 'form-submit', 'ck-button-base']
    );
    this.prefixButtonView = this._createButton(
      'Prefix', null, ['button', 'form-submit', 'ck-button-prefix']
    );
    this.rootButtonView = this._createButton(
      'Root', null, ['button', 'form-submit', 'ck-button-root']
    );
    this.suffixButtonView = this._createButton(
      'Suffix', null, ['button', 'form-submit', 'ck-button-suffix']
    );
    this.endingButtonView = this._createButton(
      'Ending', null, ['button', 'form-submit', 'ck-button-ending']
    );
    this.postfixButtonView = this._createButton(
      'Postfix', null, ['button', 'form-submit', 'ck-button-postfix']
    );


    // Create the save button.
    this.saveButtonView = this._createButton(
      'Ok', icons.check, ['button', 'form-submit', 'ck-button-save']
    );

    // Create the cancel button.
    this.cancelButtonView = this._createButton(
      'Remove', icons.cancel, ['button', 'form-submit', 'ck-button-cancel']
    );

    this.childViewsCollection = this.createCollection([

      new TagView(this.locale, 'div', {
        attributes: {
          class: [],
          tabindex: '-1',
          style: 'margin: 5px 10px'
        },
        children: [
          new TagView(this.locale, 'strong', {
            text: 'Морфология слова',
          }),
        ]
      }),

      new TagView(this.locale, 'div', {
        attributes: {
          class: [],
          tabindex: '-1',
          style: 'margin: 5px'
        },
        children: [
          this.baseButtonView,
          this.prefixButtonView,
          this.rootButtonView,
          this.suffixButtonView,
          this.endingButtonView,
          this.postfixButtonView,
        ]
      }),

      new TagView(this.locale, 'div', {
        attributes: {
          class: [],
          tabindex: '-1',
          style: 'margin: 5px'
        },
        children: [
          this.saveButtonView,
          this.cancelButtonView
        ]
      }),
    ]);

    this.setTemplate( {
      tag: 'form',
      attributes: {
        class: [ 'ck', 'ck-bbutton-link-form', 'ck-reset_all-excluded' ],
        // https://github.com/ckeditor/ckeditor5-image/issues/40
        tabindex: '-1'
      },
      children: this.childViewsCollection
    } );

  }

  /**
   * @inheritDoc
   */
  render() {
    super.render();

    // Submit the form when the user clicked the save button
    // or pressed enter in the input.
    submitHandler( {
      view: this
    } );
  }

  /**
   * Focus on the first form element.
   */
  focus() {
    // this.childViewsCollection.get(1).children.get(0).focus();
  }

  /**
   * Creates an input field.
   *
   * @param {string} label
   *   Input field label.
   * @param {object} options
   *   Options.
   *
   * @returns {module:ui/labeledfield/labeledfieldview~LabeledFieldView}
   *   The labeled field view class instance.
   *
   * @private
   */
  _createInput(label, options = {}) {
    const labeledFieldView = new LabeledFieldView(this.locale, createLabeledInputText);
    labeledFieldView.label = label;

    // Sets the required attribute when needed.
    if (options.required && options.required === true) {
      labeledFieldView.fieldView.extendTemplate({
        attributes: {
          required: true,
          class: ['form-text', 'form-element']
        }
      });
    }

    labeledFieldView.setTemplate({
      tag: 'div',
      attributes: {
        class: [ 'form-item' ],
      },
      children: [labeledFieldView.template]
    });

    return labeledFieldView;
  }

  /**
   * Creates button.
   *
   * @param {string} label
   *   Button label.
   * @param {module:ui/icon/iconview~IconView} icon
   *   Button icon.
   * @param {string} className
   *   HTML class.
   *
   * @returns {module:ui/button/buttonview~ButtonView}
   *   The button view class instance.
   *
   * @private
   */
  _createButton( label, icon, className ) {
    const button = new ButtonView();

    button.set({
      label,
      icon,
      class: className,
      tooltip: true,
      withText: true
    });

    return button;
  }

}
