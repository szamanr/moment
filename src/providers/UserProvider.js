import React, {Component, createContext} from "react";
import firebase from "firebase";

export const UserContext = createContext({user: null});

class UserProvider extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            user: null
        };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(authUser => {
            this.setState({
                user: authUser
            })
        })
    }

    render() {
        return (
            <UserContext.Provider value={this.state.user}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default UserProvider;
