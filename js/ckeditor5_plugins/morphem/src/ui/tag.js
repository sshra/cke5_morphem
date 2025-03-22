/**
 * @file
 * Defines the TagView View class.
 */

/**
 * @module bButton/ui/TagView
 */

import {
  View,
} from "ckeditor5/src/ui";

/**
 * The TagView class.
 *
 * @extends module:ui/view~View
 */
export default class TagView extends View {

  /**
   * @inheritDoc
   */
  constructor( locale, tag, options = { attributes : {}}) {
    super( locale );

    this.setTemplate( {
      tag,
      attributes: options.attributes ? options.attributes : {},
      children: options.children
      ? options.children
      : options.text
        ? [ { text: options.text }]
        : []
    });

  }

  /**
   * @inheritDoc
   */
  render() {
    super.render();
  }

}
