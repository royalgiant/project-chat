
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
var FormGroup = ReactBootstrap.FormGroup;
var FormControl = ReactBootstrap.FormControl;
var FormHorizontal = ReactBootstrap.FormHorizontal;
var Checkbox = ReactBootstrap.Checkbox;
// Getting cookie for express and reactjs is crap, we have to resort to primitive methods
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

// This JS renders a Chat App for every chat room.
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
        return { 
            messages: [],
            rooms: [], 
            createRoomButton: false
        };
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
        let createRoomClose = () => this.setState({createRoomButton: false});
        
        return (
            <Grid fluid={true}>
                <Button onClick={this.createRoom} >Create Room</Button>
                {this.state.createRoomButton ? <RoomCreateForm onHide={createRoomClose} /> : null}
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

var ChatRoom = React.createClass({
    render: function() {
        return (
            <div>
                
            </div>
        );
    }
});

const RoomCreateForm = React.createClass({
    getInitialState: function(){
        return({newRoomNameValue: "", newGroupChatValue: false});
    },
    handleNewRoomNameChange(e) {
        this.setState({ newRoomNameValue: e.target.value });   
    },
    handleNewGroupChatChange(e) {
        this.setState({ newGroupChatValue: !this.state.newGroupChatValue } );
    },
    handleSubmit: function(e) {
        // Create the new room by posting to /chatrooms/insert
        $.ajax({
            type: 'POST',
            url: '/chatrooms/insert',
            data: { 
                    room_name: this.state.newRoomNameValue,
                    group_chat: this.state.newGroupChatValue,
                    users_names: getCookie('username'),
                    user_ids: getCookie('id')
                },
            success: function(data) {
                console.log(data);
            }.bind(this),
            failure: function(xhr, status, err) {
                console.err(url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Col sm={2} xsOffset={5}>
                        <FormControl 
                            type="text"
                            value={this.state.newRoomNameValue}
                            placeholder="New Chatroom Name"
                            onChange={this.handleNewRoomNameChange}
                        />
                    </Col>
                </FormGroup>

                <FormGroup>
                    <Col xsOffset={5} sm={2}>
                        <Checkbox onClick={this.handleNewGroupChatChange}>Group Chat?</Checkbox>
                    </Col>
                </FormGroup>

                <Col xsOffset={5} sm={2}>
                    <Button type="submit">
                      Submit
                    </Button>&nbsp;
                    <Button onClick={this.props.onHide}>
                      Cancel
                    </Button>
                </Col>
            </form>
        );
    }
});

var MessagesList = React.createClass({
    render: function() {
        return (
            <div>
            
            </div>
        );
    }
});

var ChatForm = React.createClass({
    render: function() {
        return (
            <div>
                
            </div>
        );
    }
});



ReactDOM.render(
	<ChatApp uiLimit={uiLimit}/>,
	document.getElementById('app')
);