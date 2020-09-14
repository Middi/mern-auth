import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';

import Axios from "axios";

export default class Facebook extends Component {

    state = {
        auth: false,
        name: '',
        picture: '',
        email: '',
    };

    // register = data => Axios({
    //     method: "POST",
    //     data: {
    //       username: data.name,
    //       referrer: 'facebook',
    //       email: data.email,
    //     },
    //     withCredentials: true,
    //     url: "http://localhost:5000/register",
    //   }).then((res) => console.log("registering...", res));


  register = (data) => {
      console.log('some data', data)
    Axios({
      method: "POST",
      data: {
        username: data.name,
        referrer: 'facebook',
        email: data.email,
      },
      withCredentials: true,
      url: "http://localhost:5000/register",
    })
    .then((res) => {
      console.log("registering...", res);
      
    });
  };


    responseFacebook = response => {
        console.log('facebook response', response);
        if(response.status !== 'unknown')
        this.setState({
            auth: true,
            name: response.name,
            picture: response.picture.data.url,
            email: response.email
        });
        
        this.register(this.state);
    }

    componentClicked = () => {
        console.log('Facebook btn clicked');
    }

    render(){
        let facebookData;

        this.state.auth ?
        facebookData = (
                <div style={{
                    width: '400px',
                    margin: 'auto',
                    background: '#f4f4f4',
                    padding: '20px',
                    color: '#000'
                }}>
                    <img src={this.state.picture} alt={this.state.name} />
                    <h2>Welcome {this.state.name}!</h2>
                </div>
            ) : 
            facebookData = (<FacebookLogin
                appId="325892208735803"
                autoLoad={true}
                fields="name,picture,email"
                onClick={this.componentClicked}
                callback={this.responseFacebook} />);

        return (
            <>
                {facebookData}
            </>
        );
    }
}