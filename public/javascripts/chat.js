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

var Chat = React.createClass({
	getInitialState: function() {
		// Handle socket chat message from other users
        socket.on('user connected', this.handleConnection);
        socket.on('user disconnected', this.handleConnection);
        socket.on('chat message', this.messageReceive);
        return {
        	messages: []
        };
	},
	componentDidMount: function() {
		this.messageListLoad();
	}, 
	messageListLoad: function() {

	},
	render: function() {
		return (
			<Grid fluid={true}>
				<Row className='chatApp'>
					<Col lg={12} className='messageList'>
						<MessagesList messages={this.state.messages} />
	                    <ChatForm name={this.state.name} room={this.state.room}/>
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

var ChatForm = React.createClass({
    render: function() {
        return (
            <div>
                
            </div>
        );
    }
});

ReactDOM.render(
	<Chat uiLimit={uiLimit}/>,
	document.getElementById('app')
);