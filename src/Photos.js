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

        const newPhoto = {src: logo, alt: 'react logo'};
        this.setState({
            photos: this.state.photos.concat([newPhoto])
        });
    };
    addPhotoElement = (
        <card className="photo photo-add">
            <a href="" onClick={this.addPhotoDialog}>➕</a>
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
