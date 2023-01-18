console.log("sss");
const regex = /(?<=(,bB))[\d[a-zA-Z0-9 ,].+?(?=(J,))/;
let socket = new WebSocket(
  "wss://oec-im-frontier-va.tiktokglobalshop.com/ws/v2?token=9ddeTDLAfaPX0tO7PqiGXOoo3zYTtRjdnEE1jooD3UR9wsXePw9Ly&aid=5341&fpid=92&device_id=7171619687384563973&access_key=227ff03fe2c9226b6f4c0ecf83cf99e7&device_platform=web&version_code=10000&websocket_switch_region=VN"
);

socket.onmessage = function (event) {
  var reader = new FileReader();
  // reader.readAsDataURL(event.data);
  reader.onload = function () {
    const str = reader.result
      .match(
        /[a-zA-Z0-9_. ,ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+/g
      )
      .toString();
    const check = regex.exec(str);
    const mess = check
      ?.filter((x) => x != ",bB" && x != "J,")
      .toString()
      .replaceAll(",", " ");
    let messageElem = document.createElement("div");
    messageElem.textContent = mess;
    document.getElementById("messages").prepend(messageElem);
    console.log(mess);
  };
  reader.readAsText(event.data);
};
