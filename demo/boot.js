(function () {
  var GIVINGSETTINGS = window.givingSettings || {};
  var MEMORY_STORAGE_KEY = '__flowstate';
  var LINK_TRIGGER = '#givingflow';
  var LINK_PARAMS_KEYS = ['amount', 'fund', 'interval', 'interval_start'];

  var GIVING_FLOW_BUTTON_POSITION_LEFT = 'GIVING_FLOW_BUTTON_POSITION_LEFT';
  var GIVING_FLOW_BUTTON_POSITION_RIGHT = 'GIVING_FLOW_BUTTON_POSITION_RIGHT';
  var GIVING_FLOW_BUTTON_POSITION_TO_RULE = {
    [GIVING_FLOW_BUTTON_POSITION_LEFT]: 'left: ',
    [GIVING_FLOW_BUTTON_POSITION_RIGHT]: 'right: ',
  };
  var INTERVAL_EVERY_FIFTH_AND_TWENTIETH = 'Every 5th and 20th';

  var FLOW = {
    logo_file_url: '/logo-light.png',
    message_thankyou_title: 'Thank You!',
    message_thankyou_body:
      'We’re so grateful for you and your generosity towards our church, as we preach the Gospel and live on mission together.',
    color_mode: 'GIVING_FLOW_COLOR_MODE_DARK',
    color_flow: '#0CC5F2',
    color_button: '#0CC5F2',
    button_position: 'GIVING_FLOW_BUTTON_POSITION_RIGHT',
    button_offset_bottom: '20',
    button_offset_side: '20',
    memo_enabled: true,
    quick_intervals: [INTERVAL_EVERY_FIFTH_AND_TWENTIETH],
    trigger_icon: 'give',
  };

  var DESIGNATIONS = [
    { id: 'designation_cfc364c72b8f4ab7bfb1039e9230861b', name: 'General', visible: true },
    // BenS { id: 'designation_226cfcd459d6470eb69387c74fc6a09b', name: 'General', visible: true },
    {
      id: 'designation_2b3d1bcdf583464bb1346a114581336a',
      name: 'Foreign Missions — India',
      // BenS id: 'designation_1c3e347d33314d91b61cf40f1d28d121',
      // BenS name: 'LA Dream Center',
      visible: true,
    },
    {
      id: 'designation_3b3d1bcdf583464bb1346a114581336a',
      name: 'Zoe International',
      // BenS id: 'designation_33f60e80257a4778a7e7753e40d4b306',
      // BenS name: 'Test Designation',
      visible: false,
    },
    {
      id: 'designation_4b3d1bcdf583464bb1346a114581336a',
      name: 'Women’s Shelter LA',
      // BenS id: 'designation_34c0d06e6c0b428ebb05f43688bd1a0d',
      // BenS name: 'Debt Reduction',
      visible: false,
    },
    {
      id: 'designation_5b3d1bcdf583464bb1346a114581336a',
      name: 'Facilities & Maintenance',
      // BenS id: 'designation_3fd23323b2a94e0eafba2a607c407e7e',
      // BenS name: 'Hannah House Maternity Home',
      visible: true,
    },
    /* BenS  {
      id: 'designation_e0f0b68a53d741c692dc2ea69cd558fb',
      name: 'Project Share',
      visible: true,
    }, */
  ];

  var SOURCE_TYPES = ['card', 'ach_debit'];
  var MERCHANT_ID = 'merchant_93b0f09c6e2345618f61e8644d31d3d1';
  //var MERCHANT_ID = 'merchant_7c8549e2f81043fe843585048eab9a7f';

  var REBELPAY_ID = 'rpmerchant_da820628e5f9462383ff6739262d9a2e';

  var THEME = {};

  var PALETTE = {};

  var LINK_PARAMS = parseUrlParams(window.location);

  var FLOW_OPEN = false;

  function parseUrlParams(url) {
    if (!hasTrigger(url)) {
      return;
    }

    url = new URL(url);
    var params = new URLSearchParams(url.hash);

    return LINK_PARAMS_KEYS.reduce(function (acc, next) {
      if (params.get(next) === null) {
        return acc;
      }
      return Object.assign({}, acc, { [next]: params.get(next) });
    }, undefined);
  }

  function hasTrigger(url) {
    url = new URL(url);
    var params = new URLSearchParams(url.hash);

    return params.has(LINK_TRIGGER);
  }

  function sendTriggerConfig() {
    var contentWindow = document.getElementById('givingflow-trigger-frame').contentWindow;

    contentWindow.postMessage(
      {
        message: 'receive-params',
        payload: {
          Flow: FLOW,
          Designations: DESIGNATIONS,
          SourceTypes: SOURCE_TYPES,
          MerchantId: MERCHANT_ID,
          RebelPayId: REBELPAY_ID,
          LinkParams: LINK_PARAMS,
        },
      },
      '*'
    );

    contentWindow.postMessage(
      {
        type: 'MEMORY_STORAGE',
        message: 'LOAD_MEMORY_STORAGE',
        payload: window.localStorage.getItem(MEMORY_STORAGE_KEY),
      },
      '*'
    );
  }

  function sendGivingFlowConfig() {
    var contentWindow = document.getElementById('givingflow-frame').contentWindow;

    contentWindow.postMessage(
      {
        message: 'receive-params',
        payload: {
          Flow: FLOW,
          Designations: DESIGNATIONS,
          SourceTypes: SOURCE_TYPES,
          MerchantId: MERCHANT_ID,
          RebelPayId: REBELPAY_ID,
          LinkParams: LINK_PARAMS,
        },
      },
      '*'
    );

    LINK_PARAMS = undefined;

    contentWindow.postMessage(
      {
        type: 'MEMORY_STORAGE',
        message: 'LOAD_MEMORY_STORAGE',
        payload: window.localStorage.getItem(MEMORY_STORAGE_KEY),
      },
      '*'
    );
  }

  function loadTrigger() {
    var namespace = document.createElement('div');
    namespace.id = 'givingflow-trigger-container';
    namespace.className = 'givingflow';
    document.body.appendChild(namespace);
    var container = document.createElement('div');
    container.id = 'givingflow-trigger';
    container.className = 'givingflow-trigger';
    namespace.appendChild(container);
    var frame = document.createElement('iframe');
    frame.id = 'givingflow-trigger-frame';
    frame.className = 'givingflow-trigger-frame';
    frame.src = '/widget';
    container.appendChild(frame);
  }

  function showTrigger() {
    var container = document.getElementById('givingflow-trigger');
    container.style.background = PALETTE.Vibrant1;
    container.classList.add('givingflow-trigger-appear-active');
    container.style.display = 'block';

    setTimeout(function () {
      container.classList.remove('givingflow-trigger-appear-active');
    }, 500);
    setTimeout(function () {
      showTriggerMessage();
    }, 6000);
  }

  function loadFlow() {
    var namespace = document.createElement('div');
    namespace.id = 'givingflow-container';
    namespace.className = 'givingflow';
    document.body.appendChild(namespace);
    var container = document.createElement('div');
    container.id = 'givingflow';
    container.className = 'givingflow-frame-container';
    namespace.appendChild(container);
    var frame = document.createElement('iframe');
    frame.id = 'givingflow-frame';
    frame.name = 'givingflow-frame';
    frame.allowFullscreen = '1';
    frame.src = '/flows/1';
    container.appendChild(frame);
  }

  function unloadFlow(givingflow) {
    givingflow =
      typeof givingflow !== 'undefined'
        ? givingflow
        : document.getElementById('givingflow-container');
    givingflow.parentNode.removeChild(givingflow);
  }

  function showFlow() {
    FLOW_OPEN = true;
    unloadFlow();
    loadFlow();
    var container = document.getElementById('givingflow');
    container.style.background = THEME.Background.Color.Default.Background;
    container.classList.add('givingflow-frame-container-enter');
    container.style.display = 'block';
    setTimeout(function () {
      container.classList.add('givingflow-frame-container-enter-active');
    }, 10);
    setTimeout(function () {
      document.documentElement.classList.add('givingflow-active');
      container.classList.remove('givingflow-frame-container-enter');
      container.classList.remove('givingflow-frame-container-enter-active');
    }, 260);
  }

  function closeFlow() {
    document.documentElement.classList.remove('givingflow-active');
    var container = document.getElementById('givingflow');
    container.classList.add('givingflow-frame-container-exit');
    setTimeout(function () {
      container.classList.add('givingflow-frame-container-exit-active');
    }, 10);
    setTimeout(function () {
      container.style.display = 'none';
    }, 260);
    FLOW_OPEN = false;
  }

  function getParentAnchor(element) {
    while (element !== null) {
      if (element.tagName === 'A') {
        return element;
      }
      element = element.parentNode;
    }
    return null;
  }

  function handleLinkClick(e) {
    var anchor = getParentAnchor(e.target);

    if (anchor === null) {
      return;
    }

    var href = anchor.href;

    if (href === undefined) {
      return;
    }

    var url = new URL(href);
    var params = new URLSearchParams(url.hash);

    if (params.has(LINK_TRIGGER)) {
      LINK_PARAMS = parseUrlParams(href);
      showFlow();
      e.preventDefault();
    }
  }

  function registerClickHandler() {
    if (document.addEventListener) {
      document.addEventListener('click', handleLinkClick, false);
    } else {
      document.attachEvent('onclick', handleLinkClick);
    }
  }

  function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString();
  }

  function loadTriggerMessage() {
    var triggerMessage = document.createElement('div');
    triggerMessage.id = 'givingflow-trigger-message';
    triggerMessage.className = 'givingflow-trigger-message-container';
    var triggerMessageContent = document.createElement('div');
    triggerMessageContent.className = 'givingflow-trigger-message-content';
    var triggerMessageTitle = document.createElement('div');
    triggerMessageTitle.className = 'givingflow-trigger-message-title';
    var triggerMessageTitleText = document.createTextNode('Join our church in giving');
    triggerMessageTitle.appendChild(triggerMessageTitleText);
    var triggerMessageDescription = document.createElement('div');
    triggerMessageDescription.className = 'givingflow-trigger-message-description';
    var triggerMessageDescriptionText = document.createTextNode(
      'Once or recurring, and easily manage your account'
    );
    triggerMessageDescription.appendChild(triggerMessageDescriptionText);
    triggerMessageContent.appendChild(triggerMessageTitle);
    triggerMessageContent.appendChild(triggerMessageDescription);
    triggerMessage.appendChild(triggerMessageContent);
    var container = document.getElementById('givingflow-trigger-container');
    container.appendChild(triggerMessage);
    return triggerMessage;
  }

  function showTriggerMessage(triggerMessage) {
    triggerMessage =
      typeof triggerMessage !== 'undefined'
        ? triggerMessage
        : document.getElementById('givingflow-trigger-message');
    if (getCookie('givingflow_discovered')) {
      return;
    }
    triggerMessage.addEventListener('click', handleTriggerMessageClick);
    triggerMessage.style.color = PALETTE.Vibrant1;
    triggerMessage.classList.add('givingflow-trigger-message-enter');
    triggerMessage.style.display = 'block';
    setTimeout(function () {
      triggerMessage.classList.add('givingflow-trigger-message-enter-active');
    }, 10);
    setTimeout(function () {
      triggerMessage.classList.remove('givingflow-trigger-message-enter');
      triggerMessage.classList.remove('givingflow-trigger-message-enter-active');
    }, 260);
    setTimeout(function () {
      setCookie('givingflow_discovered', 1, 365);
    }, 2000);
    setTimeout(function () {
      hideTriggerMessage();
    }, 10000);
  }

  function hideTriggerMessage(triggerMessage) {
    triggerMessage =
      typeof triggerMessage !== 'undefined'
        ? triggerMessage
        : document.getElementById('givingflow-trigger-message');
    triggerMessage.classList.add('givingflow-trigger-message-exit');
    setTimeout(function () {
      triggerMessage.classList.add('givingflow-trigger-message-exit-active');
    }, 10);
    setTimeout(function () {
      triggerMessage.style.display = 'none';
      triggerMessage.classList.remove('givingflow-trigger-message-exit');
      triggerMessage.classList.remove('givingflow-trigger-message-exit-active');
      triggerMessage.removeEventListener('click', handleTriggerMessageClick);
    }, 260);
  }

  function handleTriggerMessageClick() {
    window.postMessage({ message: 'givingflow-trigger-clicked' }, '*');
  }

  function messageHandler(event) {
    switch (event.data.message) {
      case 'givingflow-palette-generated':
        THEME = event.data.payload.theme;
        PALETTE = event.data.payload.palette;

        // This is the earliest we can open the Giving Flow automaticly
        if (hasTrigger(window.location) && !FLOW_OPEN) {
          showFlow();
          FLOW_OPEN = true;
        }
        break;

      case 'givingflow-launcher-loaded':
      case 'givingflow-trigger-loaded':
        sendTriggerConfig();
        showTrigger();
        break;

      case 'givingflow-launcher-clicked':
      case 'givingflow-trigger-clicked':
        setCookie('givingflow_discovered', 1, 365);
        showFlow();
        break;

      case 'givingflow-loaded':
        sendGivingFlowConfig();
        break;

      case 'givingflow-close-clicked':
        closeFlow();
        break;

      case 'SAVE_MEMORY_STORAGE':
        window.localStorage.setItem(MEMORY_STORAGE_KEY, event.data.payload);
        break;

      default:
        break;
    }
  }

  window.addEventListener('message', messageHandler, false);

  (function () {
    var FLOW_BUTTON_POSITION_TO_PADDING = {
      [GIVING_FLOW_BUTTON_POSITION_RIGHT]: 'padding: 0 90px 0 35px;',
      [GIVING_FLOW_BUTTON_POSITION_LEFT]: 'padding: 0 30px 0 100px;',
    };

    var styleTag = document.createElement('style');
    styleTag.innerHTML = String.raw`
    @font-face {
      font-family: GivingFont;
      src: url(https://www.rebelgive.com/static/media/lineto-circular-book.c541f8e1.eot);
      src: url(https://www.rebelgive.com/static/media/lineto-circular-book.c541f8e1.eot?#iefix) format('embedded-FLOW_opentype'),
        url(https://www.rebelgive.com/static/media/lineto-circular-book.0415b07a.woff2) format('woff2'),
        url(https://www.rebelgive.com/static/media/lineto-circular-book.2ac8bef0.woff) format('woff');
      font-weight: 300;
      font-style: normal;
    }
    @font-face {
      font-family: GivingFont;
      src: url(https://www.rebelgive.com/static/media/lineto-circular-bold.6ca9638f.eot);
      src: url(https://www.rebelgive.com/static/media/lineto-circular-bold.6ca9638f.eot?#iefix) format('embedded-FLOW_opentype'),
        url(https://www.rebelgive.com/static/media/lineto-circular-bold.8bcdcb13.woff2) format('woff2'),
        url(https://www.rebelgive.com/static/media/lineto-circular-bold.926416f0.woff) format('woff');
      font-weight: 700;
      font-style: normal;
    }
    @-webkit-keyframes givingflow-trigger-appear {
      0% {
        opacity: 0;
        -webkit-transform: scale(0.25, 0.25);
        transform: scale(0.25, 0.25);
      }
      to {
        opacity: 1;
        -webkit-transform: scale(1, 1);
        transform: scale(1, 1);
      }
    }
    @keyframes givingflow-trigger-appear {
      0% {
        opacity: 0;
        -webkit-transform: scale(0.25, 0.25);
        transform: scale(0.25, 0.25);
      }
      to {
        opacity: 1;
        -webkit-transform: scale(1, 1);
        transform: scale(1, 1);
      }
    }
    @-webkit-keyframes fade-in {
      0% {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes fade-in {
      0% {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .givingflow-active {
      overflow: visible !important;
    }
    .givingflow-active > body {
      overflow: hidden;
      height: 100%;
      width: 100%;
      position: fixed;
    }
    .givingflow {
      position: fixed;
      width: 0px;
      height: 0px;
      bottom: 0px;
      right: 0px;
      z-index: 2147483647;
      font-family: 'GivingFont';
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      box-sizing: border-box;
      text-align: left;
    }
    .givingflow .givingflow-trigger-appear-active {
      -webkit-animation: givingflow-trigger-appear 500ms ease !important;
      animation: givingflow-trigger-appear 500ms ease !important;
    }
    .givingflow #givingflow,
    .givingflow #givingflow-trigger,
    .givingflow #givingflow-trigger-message {
      display: none;
    }
    .givingflow .givingflow-frame-container {
      position: fixed!important;
      z-index: 2147483647!important;
      width: 100%!important;
      height: 100%!important;
      max-height: none!important;
      top: 0!important;
      left: 0!important;
      right: 0!important;
      bottom: 0!important;
      border-radius: 0!important;
    }
    .givingflow .givingflow-frame-container > iframe {
      width: 100%!important;
      height: 100%!important;
      position: absolute;
      border: none;
    }
    .givingflow .givingflow-frame-container-enter {
      opacity: 0 !important;
      -webkit-transform: translateY(40px) !important;
      transform: translateY(40px) !important;
    }
    .givingflow .givingflow-frame-container-enter.givingflow-frame-container-enter-active,
    .givingflow .givingflow-frame-container-exit.givingflow-frame-container-exit-active {
      opacity: 1 !important;
      -webkit-transform: translateY(0) !important;
      transform: translateY(0) !important;
      -webkit-transition: opacity 250ms ease-out, -webkit-transform 250ms ease-out !important;
      transition: opacity 250ms ease-out, transform 250ms ease-out !important;
      transition: opacity 250ms ease-out, transform 250ms ease-out, -webkit-transform 250ms ease-out !important;
    }
    .givingflow .givingflow-frame-container-exit {
      opacity: 1 !important;
    }
    .givingflow .givingflow-frame-container-exit.givingflow-frame-container-exit-active {
      opacity: 0 !important;
      -webkit-transform: translateY(40px) !important;
      transform: translateY(40px) !important;
    }
    .givingflow .givingflow-trigger-message-enter {
      opacity: 0 !important;
      width: 0 !important;
    }
    .givingflow .givingflow-trigger-message-enter.givingflow-trigger-message-enter-active,
    .givingflow .givingflow-trigger-message-exit.givingflow-trigger-message-exit-active {
      opacity: 1 !important;
      width: 375px !important;
      -webkit-transition: opacity 250ms ease-out, width 350ms ease-out;
      transition: opacity 250ms ease-out, width 350ms ease-out;
    }
    .givingflow .givingflow-trigger-message-exit {
      opacity: 1 !important;
    }
    .givingflow .givingflow-trigger-message-exit.givingflow-trigger-message-exit-active {
      opacity: 0 !important;
      width: 0 !important;
    }
    .givingflow .givingflow-trigger {
      z-index: 2147483000!important;
      position: fixed!important;
      bottom: 20px;
      right: 20px;
      border-radius: 50%!important;
      border: none;
      overflow: hidden;
      -webkit-box-shadow: 5px 15px 30px rgba(0, 0, 0, 0.2);
      box-shadow: 5px 15px 30px rgba(0, 0, 0, 0.2);
      bottom: 20px;
      right: 20px;
      width: 70px;
      height: 70px;
      border-radius: 50%!important;
      ${GIVING_FLOW_BUTTON_POSITION_TO_RULE[FLOW.button_position] + FLOW.button_offset_side}px;
      bottom: ${FLOW.button_offset_bottom}px;
    }
    .givingflow .givingflow-trigger-frame {
      display: block;
      width: 100%;
      height: 100%;
      border: none;
    }
    .givingflow .givingflow-trigger-message-container {
      background: #FFFFFF;
      height: 70px;
      width: 325px;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 10px 0 rgba(0,0,0,0.10);
      border-radius: 40px;
      padding: 0 90px 0 35px;
      position: fixed!important;
      z-index: 2147482990!important;
      bottom: 20px;
      right: 20px;
      overflow: hidden;
      box-sizing: border-box;
      cursor: pointer;
      ${GIVING_FLOW_BUTTON_POSITION_TO_RULE[FLOW.button_position] + FLOW.button_offset_side}px;
      bottom: ${FLOW.button_offset_bottom}px;
      max-width: calc(100% - ${FLOW.button_offset_side * 2}px);
      ${FLOW_BUTTON_POSITION_TO_PADDING[FLOW.button_position]};
    }
    .givingflow .givingflow-trigger-message-content {
      display: flex;
      justify-content: center;
      flex-direction: column;
      height: 100%;
      line-height: 1em;
      white-space: wrap;
    }
    .givingflow .givingflow-trigger-message-title {
      font-family: inherit;
      font-weight: 700;
      font-size: 14px;
      color: inherit;
      letter-spacing: -0.5px;
      line-height: 1em;
    }
    .givingflow .givingflow-trigger-message-description {
      font-family: inherit;
      font-size: 11px;
      color: rgba(0,0,0,0.45);
      letter-spacing: -0.15px;
      line-height: 1em;
    }
    @media (min-width: 401px) {
      .givingflow .givingflow-trigger {
        height: 80px;
        width: 80px;
      }
      .givingflow .givingflow-trigger-message-container {
        height: 80px;
        width: 375px;
        max-width: 100%;
      }
      .givingflow .givingflow-trigger-message-content {
        white-space: nowrap;
      }
      .givingflow .givingflow-trigger-message-title {
        font-size: 18px;
      }
    }
  `;
    document.head.appendChild(styleTag);
  })();

  function ready(fn) {
    if (
      document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'
    ) {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    if ((GIVINGSETTINGS.trigger && GIVINGSETTINGS.trigger.visible) !== false) {
      loadTrigger();
      loadTriggerMessage();
    }
    loadFlow();
    registerClickHandler();
  });
})();
