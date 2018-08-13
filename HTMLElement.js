function on(name, selector, fn) {
  if (typeof selector === 'function') {
    fn = selector;
    selector = undefined;
  }

  const a = (e) => {
    const { target } = e;
    if (!selector) {
      if (this === target || this.contains(target)) {
        fn.call(this, e);
      }
    } else {
      const elements = Array.from(this.querySelectorAll(selector));
      let index = elements.indexOf(target);
      if (index > -1) {
        fn.call(elements[index], e);
      } else {
        let result = elements.some((element, i) => {
          index = i;
          return element.contains(target);
        });

        result && fn.call(elements[index], e);
      }
    }
  }

  this.addEventListener(name, a);
  let _events = this._events = this._events || [];
  
  _events.push({
    name,
    selector,
    fn,
    a
  });

  return this;
}

function off() {
  let name;
  let selector;
  let fn;

  let filteredEvents = [];

  const _events = this._events;
  if (!_events) {
    return false;
  }

  if (arguments.length === 0) {
    _events.forEach((event, i) => {
      filteredEvents.push([i, event]);
    });
  }

  if (arguments.length === 1) {
    name = arguments[0];

    _events.forEach((event, i) => {
      event.name === name && filteredEvents.push([i, event]);
    });
  }
  
  if (arguments.length === 2) {
    name = arguments[0];
    fn = arguments[1];

    _events.forEach((event, i) => {
      event.name === name && event.fn === fn && filteredEvents.push([i, event]);
    });
  }

  if (arguments.length === 3) {
    name = arguments[0];
    selector = arguments[1];
    fn = arguments[2];

    _events.forEach((event, i) => {
      event.name === name && event.selector === selector && event.fn === fn && filteredEvents.push([i, event]);
    });
  }

  for (let i = filteredEvents.length - 1; i >= 0; i--) {
    let filteredEvent = filteredEvents[i];
    this.removeEventListener(filteredEvent[1].name, filteredEvent[1].a);
    _events.splice(filteredEvent[0], 1);
  }
}

HTMLElement.prototype.on = on;
HTMLElement.prototype.off = off;