import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import Photos from "./Photos";

const mockPhotos = [
    {
        id: 0,
        src: 'photo-0.png',
        alt: 'photo-0',
    },
    {
        id: 1,
        src: 'photo-1.png',
        alt: 'photo-1',
    }
];

const mockOnClick = jest.fn(null);
const mockAddPhoto = jest.fn((files, metadata) => {
    console.debug('uploading files: ', files);//
});

beforeEach(() => {
    render(
        <Photos photos={mockPhotos} onClick={mockOnClick} addPhoto={mockAddPhoto}/>
    );
});

test('renders photos', () => {
    const photos = document.querySelectorAll('div.photo');
    console.log(photos);
    expect(photos.length).toBe(mockPhotos.length + 1);
});

test('renders add photo button', () => {
    const linkElement = screen.getByTitle(/add photo/i);
    expect(linkElement).toBeInTheDocument();
});

test('binds passed onClick function to current photo', () => {
    const photoElement = document.querySelectorAll('div.photo')[0];
    const photo = photoElement.querySelector('img');

    fireEvent.click(photoElement);
    expect(mockOnClick.mock.calls.length).toBe(1);

    const passedPhoto = mockOnClick.mock.calls[0][0];
    expect(passedPhoto).toBeDefined();
    expect(passedPhoto.alt).toStrictEqual(photo.alt);
});

test('calls passed addPhoto function when new image selected', () => {
    const inputElement = screen.getByTestId("photo-add");
    const file = new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'});

    fireEvent.change(inputElement, {
        target: {
            files: file,
        }
    })

    expect(mockAddPhoto.mock.calls.length).toBe(1);
    expect(mockAddPhoto.mock.calls[0][0]).toStrictEqual(file);
});
