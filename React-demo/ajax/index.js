import React from 'react';
import ReactDOM from 'react-dom';

class UserGithub extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            githubUrl: '',
            avatarUrl: '',
        }
    }
    componentDidMount() {
        $.get(this.props.path, (result) => {
            console.log(result);
            const data = result;
            if(data) {
                this.setState({
                    username: data.name,
                    githubUrl: data.html_url,
                    avatarUrl: data.avatar_url
                });
            }
        })
    }
    render() {
        return (
            <div>
                <h3>{this.state.username}</h3>
                <img src={this.state.avatarUrl}/>
                <a href={this.state.githubUrl}>Link</a>
            </div>
                )
    }
}

ReactDOM.render(<UserGithub path='https://api.github.com/users/sandytt'/>,document.getElementById('app'));