/**
 * Kabod Crest E2E Test Suite - Browser Mock & VM Sandbox Helper
 * Enables execution of browser-targeted vanilla JS modules inside Node.js test runner.
 */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

class MockLocalStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(String(key)) ? this.store.get(String(key)) : null;
  }
  setItem(key, value) {
    this.store.set(String(key), String(value));
  }
  removeItem(key) {
    this.store.delete(String(key));
  }
  clear() {
    this.store.clear();
  }
  get length() {
    return this.store.size;
  }
  key(index) {
    return Array.from(this.store.keys())[index] || null;
  }
}

class MockElement {
  constructor(tagName = 'div', attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = new Map();
    this.listeners = new Map();
    this.children = [];
    this.parentNode = null;
    this.style = {};
    this._value = '';
    this.checked = false;
    this.disabled = false;
    this._textContent = '';
    this._innerHTML = '';

    for (const [k, v] of Object.entries(attributes)) {
      this.setAttribute(k, v);
    }
  }

  get id() {
    return this.getAttribute('id') || '';
  }
  set id(val) {
    this.setAttribute('id', val);
  }

  get className() {
    return this.getAttribute('class') || '';
  }
  set className(val) {
    this.setAttribute('class', val);
  }

  get classList() {
    const self = this;
    return {
      add(...classes) {
        const current = (self.getAttribute('class') || '').split(/\s+/).filter(Boolean);
        for (const c of classes) {
          if (!current.includes(c)) current.push(c);
        }
        self.setAttribute('class', current.join(' '));
      },
      remove(...classes) {
        const current = (self.getAttribute('class') || '').split(/\s+/).filter(Boolean);
        const filtered = current.filter(c => !classes.includes(c));
        self.setAttribute('class', filtered.join(' '));
      },
      toggle(cls, force) {
        const current = (self.getAttribute('class') || '').split(/\s+/).filter(Boolean);
        const exists = current.includes(cls);
        const shouldAdd = force !== undefined ? force : !exists;
        if (shouldAdd && !exists) {
          current.push(cls);
        } else if (!shouldAdd && exists) {
          const idx = current.indexOf(cls);
          current.splice(idx, 1);
        }
        self.setAttribute('class', current.join(' '));
        return shouldAdd;
      },
      contains(cls) {
        const current = (self.getAttribute('class') || '').split(/\s+/).filter(Boolean);
        return current.includes(cls);
      }
    };
  }

  get value() {
    return this._value;
  }
  set value(val) {
    this._value = String(val);
  }

  get textContent() {
    return this._textContent;
  }
  set textContent(val) {
    this._textContent = String(val);
  }

  get innerHTML() {
    return this._innerHTML;
  }
  set innerHTML(val) {
    this._innerHTML = String(val);
    // Rough parse of child elements if needed
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }
  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }
  hasAttribute(name) {
    return this.attributes.has(name);
  }
  removeAttribute(name) {
    this.attributes.delete(name);
  }

  addEventListener(type, handler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(handler);
  }

  removeEventListener(type, handler) {
    if (!this.listeners.has(type)) return;
    const list = this.listeners.get(type).filter(h => h !== handler);
    this.listeners.set(type, list);
  }

  dispatchEvent(event) {
    event.target = this;
    event.currentTarget = this;
    const list = this.listeners.get(event.type) || [];
    for (const h of list) {
      h.call(this, event);
    }
    return !event.defaultPrevented;
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentNode = null;
    }
    return child;
  }

  querySelector(selector) {
    const results = this.querySelectorAll(selector);
    return results.length > 0 ? results[0] : null;
  }

  querySelectorAll(selector) {
    const results = [];
    const walk = (el) => {
      for (const child of el.children) {
        if (matchesSelector(child, selector)) {
          results.push(child);
        }
        walk(child);
      }
    };
    walk(this);
    return results;
  }
}

function matchesSelector(el, selector) {
  selector = selector.trim();
  if (selector.startsWith('#')) {
    return el.id === selector.slice(1);
  }
  if (selector.startsWith('.')) {
    return el.classList.contains(selector.slice(1));
  }
  if (selector.startsWith('[') && selector.endsWith(']')) {
    const attrMatch = selector.slice(1, -1).split('=');
    const attrName = attrMatch[0].trim();
    if (attrMatch.length === 1) {
      return el.hasAttribute(attrName);
    }
    const rawVal = attrMatch[1].trim().replace(/^['"]|['"]$/g, '');
    return el.getAttribute(attrName) === rawVal;
  }
  return el.tagName.toLowerCase() === selector.toLowerCase();
}

class MockDocument extends MockElement {
  constructor() {
    super('#document');
    this.body = new MockElement('body');
    this.appendChild(this.body);
    this.elementMap = new Map();
  }

  registerElement(id, element) {
    this.elementMap.set(id, element);
    if (!element.getAttribute('id')) {
      element.setAttribute('id', id);
    }
  }

  getElementById(id) {
    if (this.elementMap.has(id)) {
      return this.elementMap.get(id);
    }
    const found = this.querySelector(`#${id}`);
    return found || null;
  }

  createElement(tagName) {
    return new MockElement(tagName);
  }

  querySelectorAll(selector) {
    const directResults = Array.from(this.elementMap.values()).filter(el => matchesSelector(el, selector));
    const treeResults = super.querySelectorAll(selector);
    const combined = new Set([...directResults, ...treeResults]);
    return Array.from(combined);
  }

  querySelector(selector) {
    const list = this.querySelectorAll(selector);
    return list.length > 0 ? list[0] : null;
  }
}

class MockCustomEvent {
  constructor(type, eventInitDict = {}) {
    this.type = type;
    this.detail = eventInitDict.detail || null;
    this.bubbles = !!eventInitDict.bubbles;
    this.cancelable = !!eventInitDict.cancelable;
    this.defaultPrevented = false;
    this.target = null;
    this.currentTarget = null;
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
}

function createBrowserEnvironment(options = {}) {
  const localStorage = new MockLocalStorage();
  const document = new MockDocument();
  const listeners = new Map();

  const window = {
    localStorage,
    document,
    location: {
      href: options.url || 'http://localhost:3000/',
      search: options.search || '',
      pathname: options.pathname || '/'
    },
    URLSearchParams: global.URLSearchParams,
    CustomEvent: MockCustomEvent,
    Event: MockCustomEvent,
    console: console,
    setTimeout: global.setTimeout,
    clearTimeout: global.clearTimeout,
    setInterval: global.setInterval,
    clearInterval: global.clearInterval,
    Math: Math,
    Date: Date,
    JSON: JSON,
    Array: Array,
    Object: Object,
    String: String,
    Number: Number,
    Boolean: Boolean,
    RegExp: RegExp,
    addEventListener(type, handler) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(handler);
    },
    removeEventListener(type, handler) {
      if (!listeners.has(type)) return;
      const list = listeners.get(type).filter(h => h !== handler);
      listeners.set(type, list);
    },
    dispatchEvent(event) {
      const list = listeners.get(event.type) || [];
      for (const h of list) {
        h(event);
      }
      return !event.defaultPrevented;
    },
    print() {
      this.printed = true;
    }
  };

  const sandbox = {
    window,
    document,
    localStorage,
    CustomEvent: MockCustomEvent,
    Event: MockCustomEvent,
    URLSearchParams: global.URLSearchParams,
    console,
    setTimeout: global.setTimeout,
    clearTimeout: global.clearTimeout,
    setInterval: global.setInterval,
    clearInterval: global.clearInterval,
    module: { exports: {} },
    exports: {}
  };

  sandbox.global = sandbox;
  sandbox.self = window;
  vm.createContext(sandbox);

  return { window, document, localStorage, sandbox };
}

function loadProjectScript(relativePath, env) {
  const fullPath = path.resolve(__dirname, '../../', relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Script file not found: ${fullPath}`);
  }
  const code = fs.readFileSync(fullPath, 'utf8');
  vm.runInContext(code, env.sandbox, { filename: fullPath });
}

module.exports = {
  MockLocalStorage,
  MockElement,
  MockDocument,
  MockCustomEvent,
  createBrowserEnvironment,
  loadProjectScript
};
