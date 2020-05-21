/* global MANIFEST*/
export class Bootloader {
  constructor() {
    this.state = {};
  }

  boot() {
    this.createReactFrame();
    console.log('Booted!');
    console.log(MANIFEST);
  }

  createReactFrame() {
    const frame = document.createElement('iframe');
    frame.id = 'react-frame';
    frame.setAttribute(
      'style',
      'position: absolute !important; opacity: 0 !important; width: 1px !important; height: 1px !important; top: 0 !important; left: 0 !important; border: none !important; display: block !important; z-index: -1 !important; pointer-events: none;'
    );
    frame.setAttribute('aria-hidden', 'true');
    frame.setAttribute('tabIndex', '-1');
    frame.setAttribute('title', 'React App');

    document.body.appendChild(frame);
    // frame.contentDocument.documentElement.innerHTML = `<!doctype html>
    //   <html lang="en">
    //     <head></head>
    //     <body></body>
    //   </html>`;

    const inlineElement = createInlineScriptElement(`MANIFEST=${JSON.stringify(MANIFEST)}`);
    const scriptElement = createScriptElement('/app.latest.js');
    frame.contentDocument.head.appendChild(inlineElement);
    frame.contentDocument.head.appendChild(scriptElement);
  }
}

function createScriptElement(src) {
  const el = document.createElement('script');
  el.type = 'text/javascript';
  el.charset = 'utf-8';
  el.src = src;
  return el;
}

function createInlineScriptElement(content) {
  const el = document.createElement('script');
  el.text = content;
  return el;
}

function createLinkElement(href) {
  const el = document.createElement('link');
  el.rel = 'stylesheet';
  el.href = href;
  return el;
}
