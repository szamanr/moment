import React from "react";
import logo from './logo.svg';
import './Photos.css';

class Photos extends React.Component {
    size = {w: "150px", h: "150px"};

    constructor(props) {
        super(props);

        this.state = {photos: []};

        this.addPhotoDialog = this.addPhotoDialog.bind(this);
    }

    componentDidMount() {
        const photos = [
            {src: logo, alt: 'react logo'},
            {src: logo, alt: 'react logo'},
            {src: logo, alt: 'react logo'}
        ];
        this.setState({
            photos: photos
        })
    }

    /**
     * opens dialog for adding new photo
     * TODO: for now just adds a dummy photo immediately
     * @param e
     */
    addPhotoDialog = (e) => {
        e.preventDefault();

        const src = this.getRandomPhotoSrc();

        const newPhoto = {src: src, alt: 'react logo'};
        this.setState({
            photos: this.state.photos.concat([newPhoto])
        });
    };

    /**
     * returns a random photo from pre-defined list
     * @returns {string}
     */
    getRandomPhotoSrc() {
        const photos = ["6lm10a.png", "angular.png", "banana.jpg", "bedraggled.jpg", "cudgel.jpg", "dog-mask.jpg", "hal-cropped.jpg", "laravel.png", "trip01.png", "trip02.png", "trip03.png"];
        const photoId = Math.floor(Math.random() * photos.length);
        return photos[photoId];
    }

    addPhotoElement = (
        <card className="photo photo-add">
            <a href="javascript:void(0)" onClick={this.addPhotoDialog}>
                <span role="img" aria-label="add-photo">➕</span>
            </a>
        </card>
    );

    render() {
        const photoElements = this.state.photos.map(photo => {
            return (
                <card className="photo">
                    <img src={photo.src} width={this.size.w} height={this.size.h} alt={photo.alt}/>
                </card>
            );
        });

        return (
            <div className="photos">
                {photoElements}
                {this.addPhotoElement}
            </div>
        );
    }
}

export default Photos;
