window.addEventListener(
  'message',
  function (e) {
    const dataSend = e.data;
    if (e.source == parent && dataSend?.type?.includes("NOBI_")) {
      chrome.runtime.sendMessage(dataSend)
    }
  },
  false
);