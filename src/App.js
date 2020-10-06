import React from 'react';
import './App.css';
import Header from "./Header";
import Photos from "./Photos";
import './global.css';

class App extends React.Component {
    fullscreenSize = {w: "400px", h: "400px"};

    constructor(props, context) {
        super(props, context);

        this.state = {isFullscreen: false, fullscreenElement: null};
        this.setFullscreen = this.setFullscreen.bind(this);
        this.removeFullscreen = this.removeFullscreen.bind(this);
    }

    setFullscreen(element) {
        this.setState({fullscreenElement: element});
    }

    removeFullscreen() {
        this.setState({fullscreenElement: null});
    }

    render() {
        let mainDiv = (
            <main id="main">
                <div className="top">
                    <Photos setFullscreen={this.setFullscreen}/>
                </div>
                <div className="bottom">
                    <div className="box">[notes]</div>
                    <div className="box">[map]</div>
                    <div className="box">[player]</div>
                </div>
            </main>
        );

        if (this.state.fullscreenElement) {
            mainDiv = (
                <main id="main" className="isFullscreen">
                    <card id="fullscreenPhoto" className="photo" onClick={this.removeFullscreen}>
                        <img src={this.state.fullscreenElement.src} alt={this.state.fullscreenElement.alt}
                             width={this.fullscreenSize.w} height={this.fullscreenSize.h}
                        />
                    </card>
                </main>
            );
        }

        return (
            <div className="App">
                <Header className="Header"/>
                {mainDiv}
                <footer>
                    [footer]
                </footer>
            </div>
        );
    }
}

export default App;
