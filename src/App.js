import React from 'react';
import './App.css';
import Header from "./Header";
import Photos from "./Photos";
import './global.css';
import {FaTrash} from 'react-icons/fa';

class App extends React.Component {
    fullscreenSize = {w: "400px", h: "400px"};

    constructor(props, context) {
        super(props, context);

        this.state = {isFullscreen: false, fullscreenElement: null, photos: []};
        this.setFullscreen = this.setFullscreen.bind(this);
        this.addPhoto = this.addPhoto.bind(this);
        this.removeMainPhoto = this.removeMainPhoto.bind(this);
    }

    componentDidMount() {
        const photos = [
            {src: this.props.photoService.getRandomPhotoSrc(), alt: 'default image 1'},
            {src: this.props.photoService.getRandomPhotoSrc(), alt: 'default image 2'},
            {src: this.props.photoService.getRandomPhotoSrc(), alt: 'default image 3'}
        ];
        this.setState({
            photos: photos
        })
    }

    /**
     * sets the chosen element to be displayed full-screen
     *
     * @param element
     * @param id
     */
    setFullscreen(element = null, id = null) {
        this.setState({
            fullscreenElement: element,
            fullscreenElementId: id
        });
    }

    /**
     * inserts a photo
     *
     * @param photo
     */
    addPhoto(photo) {
        this.setState({
            photos: this.state.photos.concat(photo)
        });
    }

    /**
     * removes a photo with given id
     *
     * @param id
     */
    removePhoto(id) {
        this.setState({
            photos: this.state.photos.slice(0, id).concat(this.state.photos.slice(id + 1))
        });
    }

    /**
     * removes the full-screen photo from the list
     */
    removeMainPhoto() {
        const id = this.state.fullscreenElementId;

        if (id === null) {
            return;
        }

        this.removePhoto(id);
        this.setFullscreen();
    }

    render() {
        let mainDiv = (
            <main id="main">
                <div className="top">
                    <Photos photos={this.state.photos} addPhoto={this.addPhoto} removePhoto={this.removePhoto}
                            setFullscreen={this.setFullscreen} photoService={this.props.photoService}/>
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
                <main id="main" className="fullscreen">
                    <span className="button danger" id="fullscreen-photo-remove" onClick={this.removeMainPhoto}><FaTrash /></span>
                    <card id="fullscreen-photo" className="photo" onClick={() => { this.setFullscreen() }}>
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
