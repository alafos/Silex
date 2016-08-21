/**
 * Silex, live web creation
 * http://projects.silexlabs.org/?/silex/
 *
 * Copyright (c) 2012 Silex Labs
 * http://www.silexlabs.org/
 *
 * Silex is available under the GPL license
 * http://www.silexlabs.org/silex/silex-licensing/
 */

/**
 * @fileoverview
 *   This class is used to manage Prodotype components
 */

goog.provide('silex.model.Component');


/**
 * @constructor
 * @param  {silex.types.Model} model  model class which holds the other models
 * @param  {silex.types.View} view  view class which holds the other views
 */
silex.model.Component = function(model, view) {
  // store the model and the view
  /**
   * @type {silex.types.Model}
   */
  this.model = model;
  /**
   * @type {silex.types.View}
   */
  this.view = view;
  /**
   * @type {Prodotype}
   */
  this.prodotype = null;
};



/**
 * load the Prodotype library
 * @param {IFrameElement} iframe into which to load the UI
 * @param {function()} cbk
 */
silex.model.Component.prototype.initComponents = function(iframe) {
  const ui = iframe.contentDocument.body;
  const script = iframe.contentDocument.createElement('script');
  script.src='libs/prodotype/prodotype.js';
  script.onload = (e) => {
    this.prodotype = new iframe.contentWindow['Prodotype'](ui, './libs/prodotype/components');
    this.prodotype.ready(() => console.log('Prodotype ready'));
  }
  iframe.contentDocument.head.appendChild(script);
};


/**
 */
silex.model.Component.prototype.getComponentsDef = function() {
  return this.prodotype ? this.prodotype.componentsDef : {};
}

/**
 * @param {Element} element component just removed
 */
silex.model.Component.prototype.onComponentRemoved = function(element) {
  this.updateDepenedencies();
  this.view.componentDialog.redraw();
};


/**
 * @param {Element} element component just added
 * @param {string} type type of component
 */
silex.model.Component.prototype.onComponentAdded = function(element, type) {
  const name = this.prodotype.createName(type, this.model.element.getAllComponents().map(el => {
    return {
      'name': this.model.element.getComponentName(el),
    };
  }));
  this.model.element.setComponentData(element, {
    'name': name,
  });
  this.model.element.setComponentTemplateName(element, type);
  this.model.element.setComponentName(element, name);
  this.prodotype.decorate(type, {
    'name': name,
  })
  .then(html => {
    this.model.element.setInnerHtml(element, html);
    this.view.componentDialog.redraw();
    this.updateDepenedencies();
  });
};


/**
 * @return {Array.<Element>}
 */
silex.model.Component.prototype.getAllComponents = function() {
  // get all elements which are components
  const selector = `[${silex.model.Element.TYPE_ATTR}="${silex.model.Element.TYPE_COMPONENT}"]`;
  const components = this.model.body.getBodyElement().querySelectorAll(selector);
  // make an array out of it
  var arr = [];
  for (let idx=0; idx < components.length; idx++) arr.push(components[idx]);
  return arr;
};


/**
 * set/get data of the component
 * @param  {Element} element
 * @param  {Object} data  the json data
 */
silex.model.Component.prototype.setComponentData = function(element, data) {
  element.setAttribute(silex.model.Element.COMPONENT_DATA_ATTR, JSON.stringify(data));
};


/**
 * set/get template name of the component
 * @param  {Element} element
 * @param  {string} templateName  template name (@see prodotype)
 */
silex.model.Component.prototype.setComponentTemplateName = function(element, templateName) {
  element.setAttribute(silex.model.Element.TEMPLATE_NAME_ATTR, templateName);
};


/**
 * set/get name of the component
 * @param  {Element} element
 * @param  {string} name  template name (@see prodotype)
 */
silex.model.Component.prototype.setComponentName = function(element, name) {
  element.setAttribute(silex.model.Element.COMPONENT_NAME_ATTR, name);
};


/**
 * set/get data of the component
 * @param  {Element} element
 * @return {Object}
 */
silex.model.Component.prototype.getComponentData = function(element) {
  return /** @type {Object} */ (JSON.parse(element.getAttribute(silex.model.Element.COMPONENT_DATA_ATTR)));
};


/**
 * set/get data of the component
 * @param  {Element} element
 * @return {string}
 */
silex.model.Component.prototype.getComponentTemplateName = function(element) {
  return element.getAttribute(silex.model.Element.TEMPLATE_NAME_ATTR);
};


/**
 * set/get data of the component
 * @param  {Element} element
 * @return {string}
 */
silex.model.Component.prototype.getComponentName = function(element) {
  return element.getAttribute(silex.model.Element.COMPONENT_NAME_ATTR);
};


/**
 * update the dependencies of Prodotype components
 */
silex.model.Component.prototype.updateDepenedencies = function() {
  const head = this.model.head.getHeadElement();
  const components = this.getAllComponents().map(el => {
    return {
      'templateName': this.getComponentTemplateName(el),
    };
  });
  // removed unused dependencies (scripts and style sheets)
  const unused = this.prodotype.getUnusedDependencies(
    this.model.head.getHeadElement().querySelectorAll('[data-dependency]'),
    components
  );
  for(let idx=0; idx < unused.length; idx++) {
    const el = unused[idx];
    head.removeChild(el);
    console.log('removed', el);
  };
  // add missing dependencies (scripts and style sheets)
  let missing = this.prodotype.getMissingDependencies(head, components);
  for(let idx=0; idx < missing.length; idx++) {
    const el = missing[idx];
    el.setAttribute('data-dependency', '');
    head.appendChild(el);
    console.log('added', el);
  };
};


/**
 *
 */
silex.model.Component.prototype.resetSelection = function() {
  if(this.prodotype) {
    this.prodotype.edit();
  }
};
/**
 * @param {Element} element, the component to edit
 * @param {Object.<function()>} events
 */
silex.model.Component.prototype.edit = function(element, events) {
  if(element && this.prodotype) {
    this.prodotype.edit(
      this.model.element.getComponentData(element),
      this.model.element.getAllComponents().map(el => {
        const name = this.model.element.getComponentName(el);
        const templateName = this.model.element.getComponentTemplateName(el);
        return {
          'name': name,
          'templateName': templateName,
          'displayName': `${name} (${templateName})`,
        };
      }),
      this.model.element.getComponentTemplateName(element),
      events
    );
  }
};
