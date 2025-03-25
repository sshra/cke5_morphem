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

    console.log(tag);
    console.log(options);

    if (options.text) {
      this.setTemplate( {
        tag,
        attributes: options.attributes ? options.attributes : {},
        children: options.children
        ? options.children
        : [ { text: options.text }]
      });
    } else {
      this.setTemplate( {
        tag,
        attributes: options.attributes ? options.attributes : {},
        children: options.children
        ? options.children
        : []
      });

    }

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
