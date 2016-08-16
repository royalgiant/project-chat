// Used by room.jade. This JS renders a Chat App for every chat room.
var socket = io();
var limit = 200;
var uiLimit = 100;
var maxChatMessageLength = '400';
var timeZoneOffsetHours = new Date().getTimezoneOffset() / 60;
var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
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
        return { messages: [], rooms: [], createRoomButton: false };
	},
	componentDidMount: function() {
       	this.chatRoomListLoad(); // Get all the chatrooms available
    },
    chatRoomListLoad: function() {
        // On ChatApp load, grab all chatrooms
        $.ajax({
            type: 'GET',
            url: '/chatrooms',
            success: function(data) {
                this.setState({rooms: data});
            }.bind(this),
            failure: function(xhr, status, err) {
                console.err(url, status, err.toString());
            }.bind(this)
        });
    },
    createRoom: function(){
        this.setState({createRoomButton: true});
    },
    render: function() {
        return (
            <Grid fluid={true}>
                <Button onClick={this.createRoom}>Create Room</Button>
                {this.state.createRoomButton ? <RoomCreateForm /> : null}
                <Row className='chatApp'>
                    <Col lg={4} mdPush={5} className='chatRoomList'><ChatRoomsList rooms={this.state.rooms} name={this.state.name} /></Col>
                    <Col lg={8} mdPush={5} className='messageList'>
                        <MessagesList messages={this.state.messages} />
                        <ChatForm name={this.state.name} room={this.state.room}/>
                    </Col>
                </Row>
            </Grid>
        );
    }
});

var ChatRoomsList = React.createClass({
    render: function() {
        var roomNodes = this.props.rooms.map(function(room, i ){
            return(
                <ChatRoom roomName={room.room_name} key={i} room_id={room._id.$oid}/>
            );
        });
        return (
            <ul>
                {roomNodes}
            </ul>
        );
    }
});

var RoomCreateForm = React.createClass({
    render: function() {
        return (
            <div>
                Placeholder to room create form;
            </div>
        );
    }
});

ReactDOM.render(
	<ChatApp uiLimit={uiLimit}/>,
	document.getElementById('app')
);