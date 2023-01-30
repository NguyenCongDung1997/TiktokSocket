let strCookies = "";
chrome.cookies.getAll(
  {
    domain: ".seller-vn.tiktok.com",
  },
   function (cookies) {
     cookies.forEach((x) => {
        console.log(x);
      strCookies += x.name + "=" + x.value + ";";
    });
    console.log(strCookies);
}
);
// chrome.storage.local.get('channels', function (result) {
//     console.log(result);
// });
