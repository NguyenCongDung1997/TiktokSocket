//inject vào các hệ thống nobita

// if (!document.getElementById("nobita-ext")) {
  const iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('nobita.html');
  iframe.setAttribute('id', 'nobita-ext');
  iframe.setAttribute('style', 'display: none !important;');
  (document.body || document.documentElement).appendChild(iframe);

  //init event
  window.addEventListener(
    'message',
    function (e) {
      if (e.source == window || e.source == iframe.contentWindow) {
        iframe.contentWindow.postMessage(e.data, '*');
      }
    },
    false
  );
// }