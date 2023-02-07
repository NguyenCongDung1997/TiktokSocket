/*! For license information please see background.js.LICENSE.txt */
(()=>{function t(n){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(n)}function n(){"use strict";n=function(){return e};var e={},r=Object.prototype,o=r.hasOwnProperty,i=Object.defineProperty||function(t,n,e){t[n]=e.value},a="function"==typeof Symbol?Symbol:{},c=a.iterator||"@@iterator",u=a.asyncIterator||"@@asyncIterator",l=a.toStringTag||"@@toStringTag";function h(t,n,e){return Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[n]}try{h({},"")}catch(t){h=function(t,n,e){return t[n]=e}}function s(t,n,e,r){var o=n&&n.prototype instanceof d?n:d,a=Object.create(o.prototype),c=new N(r||[]);return i(a,"_invoke",{value:_(t,e,c)}),a}function f(t,n,e){try{return{type:"normal",arg:t.call(n,e)}}catch(t){return{type:"throw",arg:t}}}e.wrap=s;var p={};function d(){}function v(){}function g(){}var y={};h(y,c,(function(){return this}));var m=Object.getPrototypeOf,w=m&&m(m(S([])));w&&w!==r&&o.call(w,c)&&(y=w);var b=g.prototype=d.prototype=Object.create(y);function k(t){["next","throw","return"].forEach((function(n){h(t,n,(function(t){return this._invoke(n,t)}))}))}function x(n,e){function r(i,a,c,u){var l=f(n[i],n,a);if("throw"!==l.type){var h=l.arg,s=h.value;return s&&"object"==t(s)&&o.call(s,"__await")?e.resolve(s.__await).then((function(t){r("next",t,c,u)}),(function(t){r("throw",t,c,u)})):e.resolve(s).then((function(t){h.value=t,c(h)}),(function(t){return r("throw",t,c,u)}))}u(l.arg)}var a;i(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function _(t,n,e){var r="suspendedStart";return function(o,i){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw i;return{value:void 0,done:!0}}for(e.method=o,e.arg=i;;){var a=e.delegate;if(a){var c=L(a,e);if(c){if(c===p)continue;return c}}if("next"===e.method)e.sent=e._sent=e.arg;else if("throw"===e.method){if("suspendedStart"===r)throw r="completed",e.arg;e.dispatchException(e.arg)}else"return"===e.method&&e.abrupt("return",e.arg);r="executing";var u=f(t,n,e);if("normal"===u.type){if(r=e.done?"completed":"suspendedYield",u.arg===p)continue;return{value:u.arg,done:e.done}}"throw"===u.type&&(r="completed",e.method="throw",e.arg=u.arg)}}}function L(t,n){var e=n.method,r=t.iterator[e];if(void 0===r)return n.delegate=null,"throw"===e&&t.iterator.return&&(n.method="return",n.arg=void 0,L(t,n),"throw"===n.method)||"return"!==e&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+e+"' method")),p;var o=f(r,t.iterator,n.arg);if("throw"===o.type)return n.method="throw",n.arg=o.arg,n.delegate=null,p;var i=o.arg;return i?i.done?(n[t.resultName]=i.value,n.next=t.nextLoc,"return"!==n.method&&(n.method="next",n.arg=void 0),n.delegate=null,p):i:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,p)}function T(t){var n={tryLoc:t[0]};1 in t&&(n.catchLoc=t[1]),2 in t&&(n.finallyLoc=t[2],n.afterLoc=t[3]),this.tryEntries.push(n)}function E(t){var n=t.completion||{};n.type="normal",delete n.arg,t.completion=n}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function S(t){if(t){var n=t[c];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var e=-1,r=function n(){for(;++e<t.length;)if(o.call(t,e))return n.value=t[e],n.done=!1,n;return n.value=void 0,n.done=!0,n};return r.next=r}}return{next:A}}function A(){return{value:void 0,done:!0}}return v.prototype=g,i(b,"constructor",{value:g,configurable:!0}),i(g,"constructor",{value:v,configurable:!0}),v.displayName=h(g,l,"GeneratorFunction"),e.isGeneratorFunction=function(t){var n="function"==typeof t&&t.constructor;return!!n&&(n===v||"GeneratorFunction"===(n.displayName||n.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,g):(t.__proto__=g,h(t,l,"GeneratorFunction")),t.prototype=Object.create(b),t},e.awrap=function(t){return{__await:t}},k(x.prototype),h(x.prototype,u,(function(){return this})),e.AsyncIterator=x,e.async=function(t,n,r,o,i){void 0===i&&(i=Promise);var a=new x(s(t,n,r,o),i);return e.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},k(b),h(b,l,"Generator"),h(b,c,(function(){return this})),h(b,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var n=Object(t),e=[];for(var r in n)e.push(r);return e.reverse(),function t(){for(;e.length;){var r=e.pop();if(r in n)return t.value=r,t.done=!1,t}return t.done=!0,t}},e.values=S,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(E),!t)for(var n in this)"t"===n.charAt(0)&&o.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var n=this;function e(e,r){return a.type="throw",a.arg=t,n.next=e,r&&(n.method="next",n.arg=void 0),!!r}for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r],a=i.completion;if("root"===i.tryLoc)return e("end");if(i.tryLoc<=this.prev){var c=o.call(i,"catchLoc"),u=o.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return e(i.catchLoc,!0);if(this.prev<i.finallyLoc)return e(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return e(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return e(i.finallyLoc)}}}},abrupt:function(t,n){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc<=this.prev&&o.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var i=r;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=n&&n<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=n,i?(this.method="next",this.next=i.finallyLoc,p):this.complete(a)},complete:function(t,n){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&n&&(this.next=n),p},finish:function(t){for(var n=this.tryEntries.length-1;n>=0;--n){var e=this.tryEntries[n];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),E(e),p}},catch:function(t){for(var n=this.tryEntries.length-1;n>=0;--n){var e=this.tryEntries[n];if(e.tryLoc===t){var r=e.completion;if("throw"===r.type){var o=r.arg;E(e)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,n,e){return this.delegate={iterator:S(t),resultName:n,nextLoc:e},"next"===this.method&&(this.arg=void 0),p}},e}function e(t){return function(t){if(Array.isArray(t))return r(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,n){if(t){if("string"==typeof t)return r(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?r(t,n):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function r(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);e<n;e++)r[e]=t[e];return r}function o(t,n,e,r,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void e(t)}c.done?n(u):Promise.resolve(u).then(r,o)}function i(t){return function(){var n=this,e=arguments;return new Promise((function(r,i){var a=t.apply(n,e);function c(t){o(a,r,i,c,u,"next",t)}function u(t){o(a,r,i,c,u,"throw",t)}c(void 0)}))}}var a,c,u="",l="",h="",s=[];chrome.cookies.getAll({domain:".ecrm.vn"},function(){var t=i(n().mark((function t(r){return n().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,r.forEach((function(t){"browser-id"==t.name&&(s=[].concat(e(s),[t.domain]))}));case 2:chrome.cookies.getAll({domain:".nobi.pro"},function(){var t=i(n().mark((function t(r){return n().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,r.forEach((function(t){"browser-id"==t.name&&(s=[].concat(e(s),[t.domain]))}));case 2:console.log(s);case 3:case"end":return t.stop()}}),t)})));return function(n){return t.apply(this,arguments)}}());case 3:case"end":return t.stop()}}),t)})));return function(n){return t.apply(this,arguments)}}());function f(t,n,e,r,o,i){return y(function(t,n){return t<<n|t>>>32-n}(y(y(n,t),y(r,i)),o),e)}function p(t,n,e,r,o,i,a){return f(n&e|~n&r,t,n,o,i,a)}function d(t,n,e,r,o,i,a){return f(n&r|e&~r,t,n,o,i,a)}function v(t,n,e,r,o,i,a){return f(n^e^r,t,n,o,i,a)}function g(t,n,e,r,o,i,a){return f(e^(n|~r),t,n,o,i,a)}function y(t,n){var e=(65535&t)+(65535&n);return(t>>16)+(n>>16)+(e>>16)<<16|65535&e}chrome.cookies.getAll({domain:".seller-vn.tiktok.com"},function(){var t=i(n().mark((function t(e){var r;return n().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.forEach((function(t){u+=t.name+"="+t.value+";"})),(r=new Headers).append("authority","seller-vn.tiktok.com"),r.append("accept","application/json, text/plain, */*"),r.append("accept-language","vi,en;q=0.9,fr-FR;q=0.8,fr;q=0.7,vi-VN;q=0.6,en-US;q=0.5"),r.append("content-type","application/json"),r.append("cookie",u),r.append("sec-ch-ua",'"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"'),r.append("sec-ch-ua-mobile","?0"),r.append("sec-ch-ua-platform",'"Windows"'),r.append("sec-fetch-dest","empty"),r.append("sec-fetch-mode","cors"),r.append("sec-fetch-site","same-origin"),r.append("user-agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"),fetch("https://seller-vn.tiktok.com/chat/api/seller/getShopAndCsInfo?PIGEON_BIZ_TYPE=1",{method:"GET",headers:r,redirect:"follow"}).then((function(t){return t.json()})).then((function(t){var n,e;a=t.data.outerShopId,c=t.data.customerServiceInfo.pigeonCid,console.log(a),e=function(t){for(var n,e="0123456789ABCDEF",r="",o=0;o<t.length;o++)n=t.charCodeAt(o),r+=e.charAt(n>>>4&15)+e.charAt(15&n);return r}(function(t){for(var n="",e=0;e<32*t.length;e+=8)n+=String.fromCharCode(t[e>>5]>>>e%32&255);return n}(function(t,n){t[n>>5]|=128<<n%32,t[14+(n+64>>>9<<4)]=n;for(var e=1732584193,r=-271733879,o=-1732584194,i=271733878,a=0;a<t.length;a+=16){var c=e,u=r,l=o,h=i;r=g(r=g(r=g(r=g(r=v(r=v(r=v(r=v(r=d(r=d(r=d(r=d(r=p(r=p(r=p(r=p(r,o=p(o,i=p(i,e=p(e,r,o,i,t[a+0],7,-680876936),r,o,t[a+1],12,-389564586),e,r,t[a+2],17,606105819),i,e,t[a+3],22,-1044525330),o=p(o,i=p(i,e=p(e,r,o,i,t[a+4],7,-176418897),r,o,t[a+5],12,1200080426),e,r,t[a+6],17,-1473231341),i,e,t[a+7],22,-45705983),o=p(o,i=p(i,e=p(e,r,o,i,t[a+8],7,1770035416),r,o,t[a+9],12,-1958414417),e,r,t[a+10],17,-42063),i,e,t[a+11],22,-1990404162),o=p(o,i=p(i,e=p(e,r,o,i,t[a+12],7,1804603682),r,o,t[a+13],12,-40341101),e,r,t[a+14],17,-1502002290),i,e,t[a+15],22,1236535329),o=d(o,i=d(i,e=d(e,r,o,i,t[a+1],5,-165796510),r,o,t[a+6],9,-1069501632),e,r,t[a+11],14,643717713),i,e,t[a+0],20,-373897302),o=d(o,i=d(i,e=d(e,r,o,i,t[a+5],5,-701558691),r,o,t[a+10],9,38016083),e,r,t[a+15],14,-660478335),i,e,t[a+4],20,-405537848),o=d(o,i=d(i,e=d(e,r,o,i,t[a+9],5,568446438),r,o,t[a+14],9,-1019803690),e,r,t[a+3],14,-187363961),i,e,t[a+8],20,1163531501),o=d(o,i=d(i,e=d(e,r,o,i,t[a+13],5,-1444681467),r,o,t[a+2],9,-51403784),e,r,t[a+7],14,1735328473),i,e,t[a+12],20,-1926607734),o=v(o,i=v(i,e=v(e,r,o,i,t[a+5],4,-378558),r,o,t[a+8],11,-2022574463),e,r,t[a+11],16,1839030562),i,e,t[a+14],23,-35309556),o=v(o,i=v(i,e=v(e,r,o,i,t[a+1],4,-1530992060),r,o,t[a+4],11,1272893353),e,r,t[a+7],16,-155497632),i,e,t[a+10],23,-1094730640),o=v(o,i=v(i,e=v(e,r,o,i,t[a+13],4,681279174),r,o,t[a+0],11,-358537222),e,r,t[a+3],16,-722521979),i,e,t[a+6],23,76029189),o=v(o,i=v(i,e=v(e,r,o,i,t[a+9],4,-640364487),r,o,t[a+12],11,-421815835),e,r,t[a+15],16,530742520),i,e,t[a+2],23,-995338651),o=g(o,i=g(i,e=g(e,r,o,i,t[a+0],6,-198630844),r,o,t[a+7],10,1126891415),e,r,t[a+14],15,-1416354905),i,e,t[a+5],21,-57434055),o=g(o,i=g(i,e=g(e,r,o,i,t[a+12],6,1700485571),r,o,t[a+3],10,-1894986606),e,r,t[a+10],15,-1051523),i,e,t[a+1],21,-2054922799),o=g(o,i=g(i,e=g(e,r,o,i,t[a+8],6,1873313359),r,o,t[a+15],10,-30611744),e,r,t[a+6],15,-1560198380),i,e,t[a+13],21,1309151649),o=g(o,i=g(i,e=g(e,r,o,i,t[a+4],6,-145523070),r,o,t[a+11],10,-1120210379),e,r,t[a+2],15,718787259),i,e,t[a+9],21,-343485551),e=y(e,c),r=y(r,u),o=y(o,l),i=y(i,h)}return Array(e,r,o,i)}(function(t){for(var n=Array(t.length>>2),e=0;e<n.length;e++)n[e]=0;for(e=0;e<8*t.length;e+=8)n[e>>5]|=(255&t.charCodeAt(e/8))<<e%32;return n}(n="92b42d99769353ce6304e74fb597e36e90"+c+"f8a69f1719916z"),8*n.length))),h=e.toLowerCase();var o={method:"GET",headers:r,redirect:"follow"};fetch("https://seller-vn.tiktok.com/chat/api/seller/token?PIGEON_BIZ_TYPE=1&oec_region=VN&aid=4068&oec_seller_id=".concat(a),o).then((function(t){return t.json()})).then((function(t){l=t.data.token,console.log("tokenSocket",l);var n=new WebSocket("wss://oec-im-frontier-va.tiktokglobalshop.com/ws/v2?token=".concat(l,"&aid=").concat(5341,"&fpid=").concat(92,"&device_id=").concat(c,"&access_key=").concat(h,"&device_platform=web&version_code=10000&websocket_switch_region=VN")),e=/(?<=(,bB))[\d[a-zA-Z0-9 ,].+?(?=(J,)|(J0,))/,o=/(?<=(,uname,))[\d[a-zA-Z0-9 ,].+?(?=(J,)|(J0,))/;n.onmessage=function(t){var n=new FileReader;n.onload=function(){var t=n.result.match(/[a-zA-Z0-9_. ,ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+/g).toString(),i=e.exec(t);if(null!=i){console.log(t);var c=null==i?void 0:i.filter((function(t){return",bB"!=t&&"J,"!=t&&"J0,"!=t&&void 0!==t})).toString().replaceAll(","," "),u=o.exec(t),l=null==u?void 0:u.filter((function(t){return",uname,"!=t&&"J,"!=t&&"J0,"!=t&&void 0!==t})).toString(),h=new RegExp("(?<!\\d[1-9]{1})((?:0|o|84|63)[\\.\\-\\s]?[1-9](?:[\\.\\-\\s]?[0-9o]){8,9}|(?:(?:\\+|00)\\d{1,4})[\\.\\-\\s]?[1-9](?:[\\.\\-\\s]?[0-9o]){6,9})(?!\\d)","gi").test(c),f=/(?:số|đường|quốc lộ|ngách|ngã|ngõ|hẻm|thôn|xóm|phường|xã|thị trấn|đội|ấp|khu|tòa nhà|tổ|chung cư|khách sạn|nhà|làng|thị xã|kiệt|số|đường|quốc lộ|địa chỉ|dc).+(?:Lào Cai|Điện Biên|Lai Châu|Sơn La|Yên Bái|Hoà Bình|Thái Nguyên|Lạng Sơn|Quảng Ninh|Bắc Giang|Phú Thọ|Vĩnh Phúc|Bắc Ninh|Hải Dương|Hải Phòng|Hưng Yên|Thái Bình|Hà Nam|Nam Định|Ninh Bình|Thanh Hóa|Nghệ An|Hà Tĩnh|Quảng Bình|Quảng Trị|Thừa Thiên Huế|Đà Nẵng|Quảng Nam|Quảng Ngãi|Bình Định|Phú Yên|Khánh Hòa|Ninh Thuận|Bình Thuận|Kon Tum|Gia Lai|Đắk Lắk|Đắk Nông|Lâm Đồng|Bình Phước|Tây Ninh|Bình Dương|Đồng Nai|Bà Rịa - Vũng Tàu|Bà Rịa-Vũng Tàu|HCM|Hồ Chí Minh|Long An|Tiền Giang|Bến Tre|Trà Vinh|Vĩnh Long|Đồng Tháp|An Giang|Kiên Giang|Cần Thơ|Hậu Giang|Sóc Trăng|Bạc Liêu|Cà Mau|Cao Bằng|Hà Giang|Hà Nội|Tuyên Quang|Bắc Kạn)/gi.test(c);if(h||f){var p=JSON.stringify({pagination_type:0,tab:0,version:2,list_condition:{sort_field:3,sort_type:0,usernames:["".concat(l)]},count:20,offset:0}),d={method:"POST",headers:r,body:p,redirect:"follow"};fetch("https://seller-vn.tiktok.com/api/v2/trade/orders/list?PIGEON_BIZ_TYPE=1&oec_region=VN&aid=4068&oec_seller_id=".concat(a,"&language=vi-VN&locale=vi-VN"),d).then((function(t){return t.json()})).then((function(t){var n,e;console.log("resOrder",t);var r=null===(n=t.data)||void 0===n||null===(e=n.main_orders[0])||void 0===e?void 0:e.main_order_id;console.log("orderId",r);var o=new Headers;o.append("Content-Type","application/json");var i=JSON.stringify({Username:"".concat(l),Message:"".concat(c),OrderId:"".concat(r),ShopId:"".concat(a)});console.log(i);var u={method:"POST",headers:o,body:i,redirect:"follow"};s.forEach((function(t){fetch("https://".concat(t,"/api/tiktok/extension"),u).then((function(t){return t.json()})).then((function(n){return console.log(t,n)})).catch((function(n){return console.log("error",t,n)}))}))})).catch((function(t){return console.log("error",t)}))}}},n.readAsText(t.data)}})).catch((function(t){return console.log("error",t)}))})).catch((function(t){return console.log("error",t)}));case 16:case"end":return t.stop()}}),t)})));return function(n){return t.apply(this,arguments)}}())})();