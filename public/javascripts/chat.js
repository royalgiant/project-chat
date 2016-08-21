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
    render: function() {
        return (
            <div>
            
            </div>
        );
    }
});

var Message = React.createClass({
	render: function() {
        return (
            <div>
            
            </div>
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