var socket;
var fishData = null;
connectWithSocket();
function connectWithSocket() {
  // console.log("socket service initialized ", 'http://192.168.1.116:4000');
  try {
    socket = io('https://game-uat.nunoerin.com/');
    // console.log("connected ", socket)
    getRoomId();
  }
  catch (e) {
    console.log("error ", e)
  }

}

function getRoomId() {
  var url = window.location.search.substring(1);
  console.log("url for p value is ", window.location)
  var pValue = url.split('=');
  if (pValue[0] == 'roomId')
    joinRoom(pValue[1]);
  // console.log("url is ", url)
}


function joinRoom(roomId) {
  console.log("joining room id ", roomId)
  socket.emit('joinRoom', { roomId: roomId, role: 'GamePresenter' }, (data) => {
    console.log("join room data ", data);
    addSocketListeners();
  });

}

function addSocketListeners() {
  console.log("adding socket listeners");

  this.socket.on('onGameEvent', (data) => {
    console.log("receiving data", data);
    // fishData = data;
    createCreature(data)

  });


}

