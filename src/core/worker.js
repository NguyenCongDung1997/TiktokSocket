const ports = [];

onconnect = function (e) {
  // mỗi tab kết nối với sharedworker sẽ mở 1 port.
  let port = e.ports[0];
  port.id = +new Date();
  port.isClosed = false;
  // lắng nghe các sự kiện từ các tab gửi cho sharedworker
  port.onmessage = (e) => {
    const currentPort = this;
    const index = ports.findIndex(x => x.id == currentPort.id);
    if (e.data.type == "closing") {
      ports[index].isClosed = true;
      console.log("close port");
      return;
    }
    if (!e.data.type || !e.data.type.includes("NOBI_")) return;
    for (let i = 0; i < ports.length; i++) {
      //gửi dữ liệu tới các port.
      //chỉ gửi dữ liệu tới các port (hay còn gọi là tab) ko phải là port gửi dữ liệu lên sharedworker
      i != index && !ports[i].isClosed && ports[i].postMessage(e.data);
    }
  };

  port.start();
  ports.push(port);
};
