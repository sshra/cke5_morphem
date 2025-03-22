/**
 * @file
 * Defines the Morphem plugin.
 */

/**
 * @module morphem/Morphem
 */

import { Plugin } from 'ckeditor5/src/core';
import MorphemEditing from './editing';
import MorphemUI from './ui';

/**
 * The Morphem plugin.
 *
 * This is a "glue" plugin that loads
 *
 * @extends module:core/plugin~Plugin
 */
class Morphem extends Plugin {

  /**
   * @inheritdoc
   */
  static get requires() {
    return [MorphemEditing, MorphemUI];
  }

  /**
   * @inheritdoc
   */
  static get pluginName() {
    return 'plugMorphem';
  }

}

export default {
  Morphem,
};
