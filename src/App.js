import React from 'react';
import './App.css';
import Header from "./Header";
import Notes from "./Notes";
import Photos from "./Photos";
import './global.css';
import {FaTimes, FaTrash} from 'react-icons/fa';

class App extends React.Component {
    defaultLayout = [
        {
            className: 'row double',
            components: [
                'Photos'
            ]
        },
        {
            className: 'row',
            components: [
                '[map]',
                'Notes',
                '[player]'
            ]
        },
    ];

    constructor(props, context) {
        super(props, context);

        this.state = {focusedElement: null, photos: [], layout: this.defaultLayout};

        this.setFocused = this.setFocused.bind(this);
        this.addPhoto = this.addPhoto.bind(this);
        this.removeFocusedElement = this.removeFocusedElement.bind(this);
    }

    componentDidMount() {
        const photos = [];

        for (let i = 0; i < 30; i++) {
            photos.push(
                {src: this.props.photoService.getRandomPhotoSrc(), alt: `default image ${i + 1}`}
            )
        }

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
     * @param type
     */
    setFocused(element = null, id = null, type = null) {
        this.setState({
            focusedElement: element,
            focusedElementId: id,
            focusedElementType: type,
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
     * removes an element with a given id from a given collection
     *
     * @param collection
     * @param id
     */
    remove(collection, id) {
        this.setState({
            [collection]: this.state[collection].slice(0, id).concat(this.state[collection].slice(id + 1))
        });
    }

    /**
     * removes the focused photo from the list
     */
    removeFocusedElement() {
        const id = this.state.focusedElementId;
        const collection = this.state.focusedElementType;

        if (id === null || collection === null) {
            return;
        }

        this.remove(collection, id);
        this.setFocused();
    }

    /**
     * initialises a component based on its name.
     *
     * @param componentName
     * @returns {*}
     */
    initComponent(componentName) {
        switch (componentName) {
            case ('Photos'):
                return (
                    <Photos photos={this.state.photos} addPhoto={this.addPhoto} removePhoto={this.remove}
                            setFocused={this.setFocused} photoService={this.props.photoService}/>
                );
            case ('Notes'):
                return (
                    <Notes setFocused={this.setFocused}/>
                );
            default:
                return componentName;
        }
    }

    /**
     * renders the focused element in a container corresponding to type
     *
     * @param element
     * @param type
     * @returns {*}
     */
    renderFocusedElement(element, type) {
        switch (type) {
            case 'photos':
                return (
                    <img className="photo" src={element.src} alt={element.alt}/>
                );
            case 'notes':
                return (
                    <div className="note">
                        <h3 className="title">{element.title}</h3>
                        <p className="content" dangerouslySetInnerHTML={{__html: element.content}}/>
                    </div>
                );
            default:
                return;
        }
    }

    render() {
        const content = (
            this.state.layout.map((row, index) => {
                return (
                    <div className={row.className} key={index}>
                        {row.components.map((component, index) => {
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

        if (this.state.focusedElement) {
            mainDiv = (
                <main id="main" className="focused">
                    <div id="focused-buttons" className="row">
                        {/* TODO: remove notes */}
                        <div className="button danger" id="focused-element-remove"
                             onClick={this.removeFocusedElement}><span><FaTrash/></span></div>
                        <div className="button" id="focused-element-close"
                             onClick={() => {
                                 this.setFocused()
                             }}><span><FaTimes/></span></div>
                    </div>
                    <div id="focused-element" className={"row " + this.state.focusedElementType}>
                        {this.renderFocusedElement(this.state.focusedElement, this.state.focusedElementType)}
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
