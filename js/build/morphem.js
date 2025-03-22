!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.CKEditor5=n():(e.CKEditor5=e.CKEditor5||{},e.CKEditor5.morphem=n())}(self,(()=>(()=>{var __webpack_modules__={"./js/ckeditor5_plugins/morphem/src/command.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MorphemCommand)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/**\n * @file\n * Defines the Command plugin.\n */\n\n\n\n/**\n * The morphem command.\n *\n * @extends module:core/command~Command\n */\nclass MorphemCommand extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Command {\n\n  elemName = 'morphem';\n\n  /**\n   * @inheritDoc\n   */\n  refresh() {\n    // Toolbar button is always enabled.\n    this.isEnabled = true;\n\n    // Init the empty command value.\n    this.value = null;\n\n//     // Find the element in the selection.\n//     const { selection } = this.editor.model.document;\n//     const El = findElement(selection, 'morphem');\n//     if (!El) {\n//       return;\n//     }\n\n//     // Populate command value.\n//     this.value = {};\n\n//     // Process attributes\n//     for (const [attrKey, attrValue] of El.getAttributes()) {\n//       this.value[attrKey] = attrValue;\n//     }\n// console.log(this.value);\n\n  }\n\n  /**\n   * @inheritDoc\n   */\n  execute(values) {\n    const editor = this.editor;\n    const { model } = editor;\n    const elemName = 'morphem';\n\n    model.change((writer) => {\n      const selection = model.document.selection;\n      const position = selection.getFirstPosition();\n      const selectedContent = model.getSelectedContent(selection);\n\n      let elm = position.parent;\n      const found = this._findByElementName(elm, elemName);\n\n      if (found !== null) {\n        // undo element\n        this._unwrap_content(elm);\n      } else {\n        // do element\n        const allowedParent = model.schema.findAllowedParent(position, elemName);\n        if (!allowedParent) {\n          console.warn(`Нельзя вставить ${elemName} в эту позицию!`);\n          return;\n        }\n        this._wrap_content(elemName, selectedContent);\n      }\n\n    });\n  }\n\n  _findByElementName(elm, elementName) {\n    let found = null;\n    while (elm != null) {\n      if (elm.hasOwnProperty('name')) {\n        if (elm.name == elementName) {\n          found = elm;\n          break;\n        }\n      }\n      elm = elm.parent;\n    }\n    return found;\n  }\n\n  _unwrap_content(element) {\n    const { model } = this.editor;\n\n    model.change((writer) => {\n\n      // Create a new morphem.\n      const position = writer.createPositionBefore(element);\n      // Получаем все дочерние элементы (и текст)\n      const children = Array.from(element.getChildren());\n\n      // Вставляем дочерние элементы перед удаляемым\n      children.forEach((child) => {\n        writer.insert(child, position);\n      });\n\n      // Удаляем сам элемент\n      writer.remove(element);\n    });\n  }\n\n  _wrap_content(elementName, selectedContent) {\n    const { model } = this.editor;\n\n    model.change((writer) => {\n\n      // Create a new morphem.\n      const El = writer.createElement(elementName);\n\n      // Проверяем, какие элементы можно вложить в El\n      const validNodes = [];\n      for (const node of selectedContent.getChildren()) {\n        if (model.schema.checkChild(El, node)) {\n          validNodes.push(node);\n        }\n      }\n      // Если нет валидных элементов, ничего не делаем\n      if (validNodes.length === 0) {\n        console.warn(`В выделении нет элементов, которые можно вложить в ${elementName}!`);\n        return;\n      }\n\n      // Вставляем валидные элементы внутрь нового span\n      for (const node of validNodes) {\n        writer.append(node, El);\n      }\n      model.insertContent( El );\n    });\n  }\n\n\n  _mayInsertIntoPosition(elementName) {\n    const editor = this.editor;\n    const { model } = editor;\n\n    const selectedContent = editor.model.getSelectedContent(\n      editor.model.document.selection);\n\n    // Проверяем, что выбанные элемент можно вложить в наш контейнер\n    let inValidNodesCount = 0;\n    let validNodesCount = 0;\n\n    model.change( writer => {\n      const El = writer.createElement(elementName);\n      for (const node of selectedContent.getChildren()) {\n        if (model.schema.checkChild(El, node)) {\n          validNodesCount ++;\n        } else {\n          inValidNodesCount ++;\n        }\n      }\n    });\n\n    return (validNodesCount > 0 && inValidNodesCount == 0);\n  }\n\n}\n\n\n//# sourceURL=webpack://CKEditor5.morphem/./js/ckeditor5_plugins/morphem/src/command.js?")},"./js/ckeditor5_plugins/morphem/src/commandBase.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (/* binding */ MorphemBaseCommand)\n/* harmony export */ });\n/* harmony import */ var _command__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./command */ "./js/ckeditor5_plugins/morphem/src/command.js");\n/**\n * @file\n * Defines the Command plugin.\n */\n\n\n\n/**\n * The morphem command.\n *\n * @extends module:core/command~Command\n */\nclass MorphemBaseCommand extends _command__WEBPACK_IMPORTED_MODULE_0__["default"] {\n\n  /**\n   * @inheritDoc\n   */\n  refresh() {\n    // Base is allowed only inside of \'morphem\'\n    const selection = this.editor.model.document.selection;\n    const position = selection.getFirstPosition();\n    let elm = position.parent;\n    const found = this._findByElementName(elm, "morphem");\n\n    this.isEnabled = found !== null;\n\n    // Init the empty command value.\n    this.value = null;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  execute(values) {\n    const editor = this.editor;\n    const { model } = editor;\n    const elemName = \'morphemBase\';\n\n    model.change((writer) => {\n      const selection = model.document.selection;\n      const position = selection.getFirstPosition();\n      const selectedContent = model.getSelectedContent(selection);\n\n      let elm = position.parent;\n      const found = this._findByElementName(elm, elemName);\n\n      if (found !== null) {\n        // undo element\n        this._unwrap_content(elm);\n      } else {\n        // do element\n        const allowedParent = model.schema.findAllowedParent(position, elemName);\n        if (!allowedParent) {\n          console.warn(`Нельзя вставить ${elemName} в эту позицию!`);\n          return;\n        }\n        this._wrap_content(elemName, selectedContent);\n      }\n\n    });\n  }\n\n}\n\n\n//# sourceURL=webpack://CKEditor5.morphem/./js/ckeditor5_plugins/morphem/src/commandBase.js?')},"./js/ckeditor5_plugins/morphem/src/commandEnding.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (/* binding */ MorphemEndingCommand)\n/* harmony export */ });\n/* harmony import */ var _command__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./command */ "./js/ckeditor5_plugins/morphem/src/command.js");\n/**\n * @file\n * Defines the Command plugin.\n */\n\n\n\n/**\n * The morphem command.\n *\n * @extends module:core/command~Command\n */\nclass MorphemEndingCommand extends _command__WEBPACK_IMPORTED_MODULE_0__["default"] {\n\n  /**\n   * @inheritDoc\n   */\n  refresh() {\n    // Ending is allowed only inside of \'morphem\'\n    const selection = this.editor.model.document.selection;\n    const position = selection.getFirstPosition();\n    let elm = position.parent;\n    const found = this._findByElementName(elm, "morphem");\n\n    this.isEnabled = found !== null;\n\n    // Init the empty command value.\n    this.value = null;\n  }\n\n  /**\n   * @inheritDoc\n   */\n  execute(values) {\n    const editor = this.editor;\n    const { model } = editor;\n    const elemName = \'morphemEnding\';\n\n    model.change((writer) => {\n\n      const selection = model.document.selection;\n      const position = selection.getFirstPosition();\n      const selectedContent = model.getSelectedContent(selection);\n\n      let elm = position.parent;\n      const found = this._findByElementName(elm, elemName);\n\n      if (found !== null) {\n        // undo element\n        this._unwrap_content(elm);\n      } else {\n        // do element\n        const allowedParent = model.schema.findAllowedParent(position, elemName);\n        if (!allowedParent) {\n          console.warn(`Нельзя вставить ${elemName} в эту позицию!`);\n          return;\n        }\n        this._wrap_content(elemName, selectedContent);\n      }\n\n    });\n  }\n\n}\n\n\n//# sourceURL=webpack://CKEditor5.morphem/./js/ckeditor5_plugins/morphem/src/commandEnding.js?')},"./js/ckeditor5_plugins/morphem/src/editing.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MorphemEditing)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/* harmony import */ var _command__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./command */ \"./js/ckeditor5_plugins/morphem/src/command.js\");\n/* harmony import */ var _commandBase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./commandBase */ \"./js/ckeditor5_plugins/morphem/src/commandBase.js\");\nObject(function webpackMissingModule() { var e = new Error(\"Cannot find module './commandPrefix'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\nObject(function webpackMissingModule() { var e = new Error(\"Cannot find module './commandRoot'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\nObject(function webpackMissingModule() { var e = new Error(\"Cannot find module './commandSuffix'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n/* harmony import */ var _commandEnding__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./commandEnding */ \"./js/ckeditor5_plugins/morphem/src/commandEnding.js\");\n/**\n * @file\n * Defines the Editing plugin.\n */\n\n/**\n * @module morphem/MorphemEditing\n */\n\n\n\n\n\n\n\n\n\n/**\n * The editing feature.\n *\n * It introduces the 'morphem' element in the model.\n *\n * @extends module:core/plugin~Plugin\n */\nclass MorphemEditing extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {\n\n  /**\n   * @inheritDoc\n   */\n  init() {\n    this._defineSchema();\n    this._defineConverters();\n\n    const editor = this.editor;\n\n    // Attaching the command to the editor.\n    editor.commands.add(\n      'morphemCommand',\n      new _command__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this.editor),\n    );\n\n    editor.commands.add(\n      'morphemBaseCommand',\n      new _commandBase__WEBPACK_IMPORTED_MODULE_2__[\"default\"](this.editor),\n    );\n\n    editor.commands.add(\n      'morphemPrefixCommand',\n      new Object(function webpackMissingModule() { var e = new Error(\"Cannot find module './commandPrefix'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.editor),\n    );\n\n    editor.commands.add(\n      'morphemRootCommand',\n      new Object(function webpackMissingModule() { var e = new Error(\"Cannot find module './commandRoot'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.editor),\n    );\n\n    editor.commands.add(\n      'morphemSuffixCommand',\n      new Object(function webpackMissingModule() { var e = new Error(\"Cannot find module './commandSuffix'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(this.editor),\n    );\n\n    editor.commands.add(\n      'morphemEndingCommand',\n      new _commandEnding__WEBPACK_IMPORTED_MODULE_4__[\"default\"](this.editor),\n    );\n\n\n\n\n    editor.model.document.on('change:data', () => {\n//      this._removeEmptySpans(editor, editor.model.document.getRoot());\n    });\n  }\n\n  /**\n   * Remove empty span containers\n   * @param {CKEditor object} editor\n   * @param {Element object} element\n   */\n  _removeEmptySpans(editor, element) {\n    const spans = element.getChildren();\n\n    spans.forEach(span => {\n      if (span.is('element', 'morphem') && !span.childCount) {\n        editor.model.change(writer => {\n          writer.remove(span);\n        });\n      } else if (span.is('element')) {\n        this._removeEmptySpans(editor, span);\n      }\n    });\n  }\n\n  /**\n   * Registers schema.\n   *\n   * @private\n   */\n  _defineSchema() {\n    const schema = this.editor.model.schema;\n\n    // parent element.\n    schema.register('morphem', {\n      allowIn: [ 'paragraph' ],\n      inheritAllFrom: '$inline',\n\n      isInline: true,\n      isObject: false,\n      isSelectable: true,\n\n      allowAttributes: [\n        'modelClass',\n      ],\n      allowChildren: [\n        '$inline',\n        '$text',\n        'morphemBase',\n        'morphemEnding',\n        'morphemRoot',\n        'morphemPrefix',\n        'morphemSuffix',\n      ],\n    });\n\n\n    // base element.\n    schema.register('morphemBase', {\n      allowIn: [ 'morphem' ],\n      inheritAllFrom: '$inline',\n\n      isInline: true,\n      isObject: false,\n      isSelectable: true,\n\n      allowAttributes: [],\n      allowChildren: [\n        '$inline',\n        '$text',\n        'morphemRoot',\n        'morphemPrefix',\n        'morphemSuffix',\n      ],\n    });\n\n    // ending\n    schema.register('morphemEnding', {\n      allowIn: [ 'morphem' ],\n      inheritAllFrom: '$inline',\n\n      isInline: true,\n      isObject: false,\n      isSelectable: true,\n\n      allowAttributes: [\n      ],\n      allowChildren: [\n        '$inline',\n        '$text',\n      ],\n    });\n\n    // morphemPrefix\n    schema.register('morphemPrefix', {\n      allowIn: [ 'morphem', 'morphemBase' ],\n      inheritAllFrom: '$inline',\n\n      isInline: true,\n      isObject: false,\n      isSelectable: true,\n\n      allowAttributes: [\n      ],\n      allowChildren: [\n        '$inline',\n        '$text',\n      ],\n    });\n\n    // morphemSuffix\n    schema.register('morphemSuffix', {\n      allowIn: [ 'morphem', 'morphemBase' ],\n      inheritAllFrom: '$inline',\n\n      isInline: true,\n      isObject: false,\n      isSelectable: true,\n\n      allowAttributes: [\n      ],\n      allowChildren: [\n        '$inline',\n        '$text',\n      ],\n    });\n\n    // morphemRoot\n    schema.register('morphemRoot', {\n      allowIn: [ 'morphem', 'morphemBase' ],\n      inheritAllFrom: '$inline',\n\n      isInline: true,\n      isObject: false,\n      isSelectable: true,\n\n      allowAttributes: [\n      ],\n      allowChildren: [\n        '$inline',\n        '$text',\n      ],\n    });\n\n  }\n\n  /**\n   * Defines converters.\n   */\n  _defineConverters() {\n    const {conversion} = this.editor;\n    const textFormatSettings = this.editor.config.get('morphem')\n\n    // Morphem. View -> Model.\n    conversion.for('upcast').elementToElement({\n      view: {\n        name: 'span',\n        classes: [ textFormatSettings.morphemClass ],\n        attributes: {\n          ['class']: true,\n        }\n      },\n      converterPriority: 'highest',\n      model: (viewElement, conversionApi ) => {\n\n        let classes = viewElement.getAttribute('class');\n        if (!classes) {\n           return null;\n        }\n\n        var attrs = {\n          modelClass: classes,\n        };\n\n        return conversionApi.writer.createElement( 'morphem', attrs );\n      },\n    });\n\n\n    // Morphem. Model -> View.\n    conversion.for('downcast').elementToElement({\n      model: 'morphem',\n      view: (modelElement, { writer }) => {\n        let htmlAttrs = {\n          'class': textFormatSettings.morphemClass,\n        };\n        return writer.createContainerElement('span', htmlAttrs );\n      }\n    });\n\n    /************ BASE ************/\n\n    // morphemBase. View -> Model.\n    conversion.for('upcast').elementToElement({\n      view: {\n        name: 'span',\n        classes: [ 'base' ],\n        attributes: {\n          ['class']: true,\n        }\n      },\n      converterPriority: 'highest',\n      model: (viewElement, conversionApi ) => {\n\n        let classes = viewElement.getAttribute('class');\n        if (!classes) {\n           return null;\n        }\n        var attrs = {\n          modelClass: classes,\n        };\n\n        return conversionApi.writer.createElement( 'morphemBase', attrs );\n      },\n    });\n\n    // Model -> View.\n    conversion.for('downcast').elementToElement({\n      model: 'morphemBase',\n      view: (modelElement, { writer }) => {\n        let htmlAttrs = {\n          'class': 'base',\n        };\n        return writer.createContainerElement('span', htmlAttrs );\n      }\n    });\n\n    /************ PREFIX ************/\n\n    // morphemPrefix. View -> Model.\n    conversion.for('upcast').elementToElement({\n      view: {\n        name: 'span',\n        classes: [ 'prefix' ],\n        attributes: {\n          ['class']: true,\n        }\n      },\n      converterPriority: 'highest',\n      model: (viewElement, conversionApi ) => {\n\n        let classes = viewElement.getAttribute('class');\n        if (!classes) {\n           return null;\n        }\n\n        var attrs = {\n          modelClass: classes,\n        };\n\n        return conversionApi.writer.createElement( 'morphemPrefix', attrs );\n      },\n    });\n\n    // Model -> View.\n    conversion.for('downcast').elementToElement({\n      model: 'morphemPrefix',\n      view: (modelElement, { writer }) => {\n        let htmlAttrs = {\n          'class': 'prefix',\n        };\n        return writer.createContainerElement('span', htmlAttrs );\n      }\n    });\n\n    /************ ROOT ************/\n\n    // morphemRoot. View -> Model.\n    conversion.for('upcast').elementToElement({\n      view: {\n        name: 'span',\n        classes: [ 'root' ],\n        attributes: {\n          ['class']: true,\n        }\n      },\n      converterPriority: 'highest',\n      model: (viewElement, conversionApi ) => {\n\n        let classes = viewElement.getAttribute('class');\n        if (!classes) {\n           return null;\n        }\n\n        var attrs = {\n          modelClass: classes,\n        };\n\n        return conversionApi.writer.createElement( 'morphemRoot', attrs );\n      },\n    });\n\n    // Model -> View.\n    conversion.for('downcast').elementToElement({\n      model: 'morphemRoot',\n      view: (modelElement, { writer }) => {\n        let htmlAttrs = {\n          'class': 'root',\n        };\n        return writer.createContainerElement('span', htmlAttrs );\n      }\n    });\n\n    /************ Suffix ************/\n\n    // morphemSuffix. View -> Model.\n    conversion.for('upcast').elementToElement({\n      view: {\n        name: 'span',\n        classes: [ 'suffix' ],\n        attributes: {\n          ['class']: true,\n        }\n      },\n      converterPriority: 'highest',\n      model: (viewElement, conversionApi ) => {\n\n        let classes = viewElement.getAttribute('class');\n        if (!classes) {\n           return null;\n        }\n\n        var attrs = {\n          modelClass: classes,\n        };\n\n        return conversionApi.writer.createElement( 'morphemsuffix', attrs );\n      },\n    });\n\n    // Model -> View.\n    conversion.for('downcast').elementToElement({\n      model: 'morphemsuffix',\n      view: (modelElement, { writer }) => {\n        let htmlAttrs = {\n          'class': 'suffix',\n        };\n        return writer.createContainerElement('span', htmlAttrs );\n      }\n    });\n\n\n    /************ ENDING ************/\n\n    // morphemEnding. View -> Model.\n    conversion.for('upcast').elementToElement({\n      view: {\n        name: 'span',\n        classes: [ 'ending' ],\n        attributes: {\n          ['class']: true,\n        }\n      },\n      converterPriority: 'highest',\n      model: (viewElement, conversionApi ) => {\n\n        let classes = viewElement.getAttribute('class');\n        if (!classes) {\n           return null;\n        }\n\n        var attrs = {\n          modelClass: classes,\n        };\n\n        return conversionApi.writer.createElement( 'morphemEnding', attrs );\n      },\n    });\n\n    // Model -> View.\n    conversion.for('downcast').elementToElement({\n      model: 'morphemEnding',\n      view: (modelElement, { writer }) => {\n        let htmlAttrs = {\n          'class': 'ending',\n        };\n        return writer.createContainerElement('span', htmlAttrs );\n      }\n    });\n\n  }\n}\n\n\n//# sourceURL=webpack://CKEditor5.morphem/./js/ckeditor5_plugins/morphem/src/editing.js?")},"./js/ckeditor5_plugins/morphem/src/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ "ckeditor5/src/core.js");\n/* harmony import */ var _editing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./editing */ "./js/ckeditor5_plugins/morphem/src/editing.js");\n/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui */ "./js/ckeditor5_plugins/morphem/src/ui.js");\n/**\n * @file\n * Defines the Morphem plugin.\n */\n\n/**\n * @module morphem/Morphem\n */\n\n\n\n\n\n/**\n * The Morphem plugin.\n *\n * This is a "glue" plugin that loads\n *\n * @extends module:core/plugin~Plugin\n */\nclass Morphem extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {\n\n  /**\n   * @inheritdoc\n   */\n  static get requires() {\n    return [_editing__WEBPACK_IMPORTED_MODULE_1__["default"], _ui__WEBPACK_IMPORTED_MODULE_2__["default"]];\n  }\n\n  /**\n   * @inheritdoc\n   */\n  static get pluginName() {\n    return \'plugMorphem\';\n  }\n\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  Morphem,\n});\n\n\n//# sourceURL=webpack://CKEditor5.morphem/./js/ckeditor5_plugins/morphem/src/index.js?')},"./js/ckeditor5_plugins/morphem/src/ui.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MorphemUI)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/* harmony import */ var ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ckeditor5/src/ui */ \"ckeditor5/src/ui.js\");\n/* harmony import */ var _icons_morphem_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../icons/morphem.svg */ \"./js/icons/morphem.svg\");\n/* harmony import */ var _icons_ending_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../icons/ending.svg */ \"./js/icons/ending.svg\");\n/**\n * @file\n * Defines the UI plugin.\n */\n\n/**\n * @module morphem/MorphemUI\n */\n\n\n\n\n\n\n/**\n * The UI plugin. It introduces the `'bButton'` button and the forms.\n *\n * It uses the\n * {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon contextual balloon plugin}.\n *\n * @extends module:core/plugin~Plugin\n */\nclass MorphemUI extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {\n\n  /**\n   * @inheritDoc\n   */\n  static get requires() {\n    return [  ];\n  }\n\n  /**\n   * @inheritDoc\n   */\n  init() {\n    this._addToolbarButtons();\n//    this._handleSelection();\n  }\n\n  /**\n   * Adds the toolbar buttons.\n   *\n   * @private\n   */\n  _addToolbarButtons() {\n\n    this._register_morphem_button();\n    this._register_morphemEnding_button();\n\n  }\n\n  /**\n   * Morphem button\n   */\n  _register_morphem_button() {\n    const editor = this.editor;\n\n    editor.ui.componentFactory.add('morphem', (locale) => {\n      const buttonView = new ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__.ButtonView(locale);\n      const textFormatSettings = editor.config.get('morphem');\n\n      // Create the toolbar button.\n      buttonView.set({\n        label: editor.t('Morphem Button'),\n        icon: _icons_morphem_svg__WEBPACK_IMPORTED_MODULE_2__[\"default\"],\n        tooltip: true\n      });\n\n      // Bind button to the command.\n      // The state on the button depends on the command values.\n      const command = editor.commands.get('morphemCommand');\n      buttonView.bind( 'isEnabled' ).to( command, 'isEnabled' );\n      buttonView.bind( 'isOn' ).to( command, 'value', value => !!value );\n\n      // Execute the command when the button is clicked.\n      this.listenTo(buttonView, 'execute', () => {\n\n        let values = {\n          modelClass:  textFormatSettings.morphemClass,\n        };\n        this.editor.execute('morphemCommand', values);\n\n      });\n\n      return buttonView;\n    });\n  }\n\n  /**\n   * Morphem Ending button\n   */\n  _register_morphemEnding_button() {\n    const editor = this.editor;\n\n    editor.ui.componentFactory.add('morphemEnding', (locale) => {\n      const buttonView = new ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__.ButtonView(locale);\n\n      // Create the toolbar button.\n      buttonView.set({\n        label: editor.t('Morphem Ending Button'),\n        icon: _icons_ending_svg__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n        tooltip: true\n      });\n\n      // Bind button to the command.\n      // The state on the button depends on the command values.\n      const command = editor.commands.get('morphemEndingCommand');\n      buttonView.bind( 'isEnabled' ).to( command, 'isEnabled' );\n      buttonView.bind( 'isOn' ).to( command, 'value', value => !!value );\n\n      // Execute the command when the button is clicked.\n      this.listenTo(buttonView, 'execute', () => {\n        this.editor.execute('morphemEndingCommand', {});\n      });\n\n      return buttonView;\n    });\n  }\n\n\n  /**\n   * Handles the selection specific cases (right before or after the element).\n   *\n   * @private\n   */\n  _handleSelection() {\n    const editor = this.editor;\n\n    this.listenTo(editor.editing.view.document, 'selectionChange', (eventInfo, eventData) => {\n      const selection = editor.model.document.selection;\n\n      let el = selection.getSelectedElement() ?? selection.getFirstRange().getCommonAncestor();\n\n      if (el.name !== \"morphem\") {\n        this._hideUI();\n      }\n\n    });\n  }\n\n\n\n}\n\n\n//# sourceURL=webpack://CKEditor5.morphem/./js/ckeditor5_plugins/morphem/src/ui.js?")},"./js/icons/ending.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 448 512\\">\\n<path d=\\"M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z\\"/>\\n</svg>");\n\n//# sourceURL=webpack://CKEditor5.morphem/./js/icons/ending.svg?')},"./js/icons/morphem.svg":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 640 512\\">\\n<path d=\\"M384 320H256c-17.7 0-32 14.3-32 32v128c0 17.7 14.3 32 32 32h128c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32zM192 32c0-17.7-14.3-32-32-32H32C14.3 0 0 14.3 0 32v128c0 17.7 14.3 32 32 32h95.7l73.2 128C212 301 232.4 288 256 288h.3L192 175.5V128h224V64H192V32zM608 0H480c-17.7 0-32 14.3-32 32v128c0 17.7 14.3 32 32 32h128c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32z\\"/>\\n</svg>");\n\n//# sourceURL=webpack://CKEditor5.morphem/./js/icons/morphem.svg?')},"ckeditor5/src/core.js":(module,__unused_webpack_exports,__webpack_require__)=>{eval('module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ "dll-reference CKEditor5.dll"))("./src/core.js");\n\n//# sourceURL=webpack://CKEditor5.morphem/delegated_./core.js_from_dll-reference_CKEditor5.dll?')},"ckeditor5/src/ui.js":(module,__unused_webpack_exports,__webpack_require__)=>{eval('module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ "dll-reference CKEditor5.dll"))("./src/ui.js");\n\n//# sourceURL=webpack://CKEditor5.morphem/delegated_./ui.js_from_dll-reference_CKEditor5.dll?')},"dll-reference CKEditor5.dll":e=>{"use strict";e.exports=CKEditor5.dll}},__webpack_module_cache__={};function __webpack_require__(e){var n=__webpack_module_cache__[e];if(void 0!==n)return n.exports;var t=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e](t,t.exports,__webpack_require__),t.exports}__webpack_require__.d=(e,n)=>{for(var t in n)__webpack_require__.o(n,t)&&!__webpack_require__.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},__webpack_require__.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var __webpack_exports__=__webpack_require__("./js/ckeditor5_plugins/morphem/src/index.js");return __webpack_exports__=__webpack_exports__.default,__webpack_exports__})()));