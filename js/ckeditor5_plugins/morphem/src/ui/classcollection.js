/**
 * @file
 * Defines the ClassCollector class.
 */

/**
 * @module bButton/ui/ClassCollector
 */

/**
 * The ClassCollector class.
 * Encapsulate work with html classes
 */
export default class ClassCollector  {
    /**
     * get initial list of class names
     */
    constructor( names = [] ) {
      this.names = new Set( names );
    }

    /**
     * Add more names
     * @namesString string - it will parse all names from given namesString
     * returns @self for chaining
     */
    addFromString( namesString ) {
      const values = namesString.split(new RegExp('[^\\w\\d_-]+', 'i'));
      values.forEach(value => { this.names.add(value); });
      return this;
    }

    /**
     * Check if given name in the SET
     * returns @boolean
     */
    has(name) {
      return this.names.has(name);
    }

    /**
     * Removes given name from the SET
     * returns @self for chaining
     */
    remove(name) {
      this.names.delete(name);
      return this;
    }

    /**
     * build ClassName
     * returns @string
     */
    getClassName() {
      if (this.names.has('')) {
        this.names.delete('');
      }
      return [...this.names].sort().join(' ');
    }
}