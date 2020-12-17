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
const mockAddPhoto = jest.fn(null);

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
    const photos = document.querySelectorAll('div.photo');
    fireEvent.click(photos[0]);
    expect(mockOnClick.mock.calls.length).toBe(1);
    expect(mockOnClick.mock.calls[0][0]).toBe(photos[0]);
});

xtest('opens image select dialog when button pressed', () => {
    // TODO
});

xtest('calls passed addPhoto function when new image selected', () => {
    // TODO
})
