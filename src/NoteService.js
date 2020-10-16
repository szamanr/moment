import Faker from 'faker';

class NoteService {
    /**
     * creates a dummy note with random title and content
     *
     * @returns {{title: *, content: *}}
     */
    getRandomNote() {
        return {
            title: Faker.lorem.words(),
            content: Faker.lorem.sentences(10),
        };
    }

    /**
     * generates a specified number of dummy notes
     *
     * @param count
     * @returns {[]}
     */
    generate(count) {
        let notes = [];

        for(let i = 0; i < count; i++) {
            notes.push(this.getRandomNote());
        }

        return notes;
    }
}

export default NoteService;
