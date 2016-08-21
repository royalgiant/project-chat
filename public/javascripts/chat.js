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

// Seconds since Unix Epoch. Used to convert between the database
// timestamp and client JS timestamp. However it is much easier to
// just do it in postgresql queries, as they have a lot of good 
// date/time functions.
function getCurrUnixTime() {
    return Math.floor((new Date().getTime()) / 1000);
}

function convertToHHMI(unix_time) {
    var days = Math.floor(unix_time / 86400);
    var hours = Math.floor((unix_time - (days * 86400)) / 3600);
    var minutes = Math.floor((unix_time - ((hours * 3600) + (days * 86400))) / 60);
    hours -= timeZoneOffsetHours;
    if (hours < 0) {
        hours = 24 + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }

    return hours + ':' + minutes;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

var Chat = React.createClass({

	getInitialState: function() {
		// Handle socket chat message from other users
        socket.on('user connected', this.handleConnection);
        socket.on('user disconnected', this.handleConnection);
        socket.on('chat message', this.messageReceive);
        chatroom_id = $('div').attr('chatroom_id');
        return {
        	messages: [],
        	chatroom_id: chatroom_id
        };
	},
	componentDidMount: function() {
		this.messageListLoad();
	}, 
	messageListLoad: function() {
		var chatroom_id = this.state.chatroom_id;
		// On Chat load, grab all messages
        $.ajax({
            type: 'GET',
            url: '/messages/'+chatroom_id,
            success: function(data) {
                this.setState({messages: data});
            }.bind(this),
            failure: function(xhr, status, err) {
                console.err(url, status, err.toString());
            }.bind(this)
        });
	},
	// Called when app detects a new message from SocketIO
    messageReceive: function(msgInfo) {
        if (msgInfo.chatroom_id === this.state.chatroom_id) {
            // Create a new msgInfo for this current React app
            var newMsg = {
                user_name: msgInfo.user_name,
                message: msgInfo.message,
                created_at: msgInfo.created_at
            };
            // Here we are concatenating the new emitted message into our ChatApp's messages list
            var messages = this.state.messages;
            var newMessages = messages.concat(newMsg);
            this.setState({messages: newMessages});
        }
    },
	render: function() {
		return (
			<Grid fluid={true}>
				<Row className='chatApp'>
					<Col lg={12} className='messageList'>
						<MessagesList messages={this.state.messages} />
	                    <ChatForm chatroom_id={this.state.chatroom_id}/>
					</Col>
				</Row>
			</Grid>
		);
	}
});


var MessagesList = React.createClass({
    componentDidMount: function() {
        var messagesList = this.refs.messagesList;
    },
    render: function() {
        var messageNodes = this.props.messages.map(function(msg, i) {
            return (<Message msg={msg} key={i} />);
        });
        
        return (
            <ul className='messagesList' ref='messagesList'>
                {messageNodes}
            </ul>
        );
    }
});

var Message = React.createClass({
	componentDidMount: function() {
        var messageDOM = this.refs.message;
        messageDOM.scrollIntoView();
    },
    render: function() {
        var msg = this.props.msg;
        return (
            <li className='message' ref='message'>
                <span className='messageTime'>
                    { convertToHHMI(parseInt(msg.created_at)) } 
                </span>
                <b className='username'> {msg.user_name.replace(/\W+/g, " ")}</b> 
                <span className='messageText'>: {msg.message}</span>
            </li>
        );
    }
});

var ChatForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();

        // The DOM node for <input> chat message
        var msgDOMNode = this.refs.msg;

        if (msgDOMNode.value === '') {
            return;
        }

        var msgInfo = {
            chatroom_id: this.props.chatroom_id,
            message: msgDOMNode.value,
            user_name: getCookie('username'),
            created_at: getCurrUnixTime()
        };
     
        socket.emit('chat message', msgInfo);
        msgDOMNode.value = '';
    },
    render: function() {
        return (
            <form className='chatForm' onSubmit={this.handleSubmit}>
                <input className='input_field chat_input_field' type='text' maxLength={maxChatMessageLength} placeholder='Say something...' ref='msg'/>
            </form>
        );
    }
});

ReactDOM.render(
	<Chat uiLimit={uiLimit}/>,
	document.getElementById('app')
);