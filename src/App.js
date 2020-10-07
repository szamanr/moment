import React from 'react';
import './App.css';
import Header from "./Header";
import Photos from "./Photos";
import './global.css';
import {FaTrash} from 'react-icons/fa';

class App extends React.Component {
    focusedSize = {w: "400px", h: "400px"};

    defaultLayout = [
        [
            '[Photos]'
        ],
        [
            '[map]', '[notes]', '[player]'
        ],
    ];

    constructor(props, context) {
        super(props, context);

        this.state = {focusedElement: null, photos: [], layout: this.defaultLayout};

        this.setFocused = this.setFocused.bind(this);
        this.addPhoto = this.addPhoto.bind(this);
        this.removeFocusedPhoto = this.removeFocusedPhoto.bind(this);
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

        // TODO: remove. this is just to test if the layout can be modified dynamically.
        /*setTimeout(() => {
            this.setState({
                layout: [
                    [
                        '[map]', '[notes]', '[player]'
                    ],
                    [
                        '[Photos]'
                    ]
                ]
            });

            console.log('layout updated!');
        }, 3000)*/
    }

    /**
     * sets the chosen element to be focused, i.e. displayed as the only element in the main view
     *
     * @param element
     * @param id
     */
    setFocused(element = null, id = null) {
        this.setState({
            focusedElement: element,
            focusedElementId: id
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
     * removes the focused photo from the list
     */
    removeFocusedPhoto() {
        const id = this.state.focusedElementId;

        if (id === null) {
            return;
        }

        this.removePhoto(id);
        this.setFocused();
    }

    /**
     * initialises a component based on its name. pass components as '[ComponentTag]'.
     *
     * @param componentName
     * @returns {*}
     */
    initComponent(componentName) {
        switch (componentName) {
            case ('[Photos]'):
                return (
                    <Photos photos={this.state.photos} addPhoto={this.addPhoto} removePhoto={this.removePhoto}
                            setFocused={this.setFocused} photoService={this.props.photoService}/>
                );
            default:
                return componentName;
        }
    }

    render() {
        const content = (
            this.state.layout.map((row, index) => {
                return (
                    <div className="row" key={index}>
                        {row.map((component, index) => {
                            return (
                                <div className="box" key={index}>
                                    {this.initComponent(component)}
                                </div>
                            );
                        })}
                    </div>
                );
            })
        );

        let mainDiv = (
            <main id="main">
                {content}
            </main>
        );

        // TODO: for now only works for photos. make it possible to focused any element, such as map, notes.
        if (this.state.focusedElement) {
            mainDiv = (
                <main id="main" className="focused">
                    <div className="row">
                        <span className="button danger" id="focused-photo-remove"
                              onClick={this.removeFocusedPhoto}><FaTrash/></span>
                    </div>
                    <div className="row">
                        <card id="focused-photo" className="photo" onClick={() => {
                            this.setFocused()
                        }}>
                            <img src={this.state.focusedElement.src} alt={this.state.focusedElement.alt}
                                 width={this.focusedSize.w} height={this.focusedSize.h}
                            />
                        </card>
                    </div>
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
