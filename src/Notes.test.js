import React from 'react';
import {render, screen} from '@testing-library/react';
import Notes from "./Notes";
import userEvent from "@testing-library/user-event";

const mockNotes = [
    {
        id: 0,
        title: 'note 01',
        content: 'Lapsuss messis in cubiculum! Hippotoxotas mori in cubiculum!',
    },
    {
        id: 1,
        title: 'note 02',
        content: 'Cum poeta cantare, omnes advenaes reperire regius, bi-color fiscinaes.',
    }
];

const mockOnClick = jest.fn(null);
const mockAddNote = jest.fn(() => {
    console.debug('adding note.');//
});

beforeEach(() => {
    render(
        <Notes notes={mockNotes} addNote={mockAddNote} onClick={mockOnClick}/>
    );
});

test('renders notes', () => {
    const items = document.querySelectorAll('.note');
    expect(items.length).toBe(mockNotes.length + 1);
});

test('renders add note button', () => {
    const linkElement = screen.getByTitle(/add note/i);
    expect(linkElement).toBeInTheDocument();
});

test('binds passed onClick function to current note', () => {
    const item = document.querySelectorAll('.note')[0];
    userEvent.click(item);
    expect(mockOnClick.mock.calls.length).toBe(1);

    const clickedNote = mockOnClick.mock.calls[0][0];
    expect(clickedNote).toBeDefined();
    expect(clickedNote.title).toStrictEqual(item.textContent);
});

test('calls passed addNote function after clicking on new note button', () => {
    const linkElement = screen.getByTitle(/add note/i);

    userEvent.click(linkElement);
    userEvent.click(linkElement);
    userEvent.click(linkElement);

    expect(mockAddNote.mock.calls.length).toBe(3);
})
