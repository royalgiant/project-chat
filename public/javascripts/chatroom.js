// Flux Architecture
// ChatApp is the central state store. Notice that all other React
// components use props, not state. Whenever a state in ChatApp changes
// usually by recieving a socket message from other user, the props
// are updated automatically by React.js. This makes development simple,
// as ChatApp is the only React component that is dynamic.
var ChatApp = React.createClass({
	
	getInitialState: function() {
		// Handle socket chat message from other users
        socket.on('user connected', this.handleConnection);
        socket.on('user disconnected', this.handleConnection);
        socket.on('chat message', this.messageReceive);
        socket.on('switchedRoom', this.switchedRoomMessageHistory);
        return { messages: [], rooms: [], journals: []
        };
	},
	componentDidMount: function() {
       	this.chatRoomListLoad(); // Get all the chatrooms available
    },
    
});

ReactDOM.render(

	<ChatApp uiLimit={uiLimit}/>,
	document.getElementById('app')
);