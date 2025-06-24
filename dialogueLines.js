const dialogueLines = [
    {
        character: 'Questgiver',
        id: 1,
        text: 'Hello there',
        options: [
            { option: 'Hello', nextLine: 2 },
            { option: 'Why are you in my room?', nextLine: 3 }
        ]
    },
    {
        character: 'Questgiver',
        id: 2,
        text: 'You can only exit through that door if you wear the glasses on the table over there.',
        options: [
            { option: 'Thanks for the info!', nextLine: 0 },
            { option: 'Why should i do as you say?', nextLine: 4 }
        ]
    },
    {
        character: 'Questgiver',
        id: 3,
        text: 'I am not really here, this is just your imagination',
        options: [
            { option: 'That\'s weird.', nextLine: 2 },
            { option: '*Leave', nextLine: 0 }
        ]
    },
    {
        character: 'Questgiver',
        id: 4,
        text: 'You don\'t have to, but you will not be able to leave that room if you don\'t.',
        options: [
            { option: 'I guess it\'s worth a try.', nextLine: 0 },
            { option: '*Leave', nextLine: 0 }
        ]
    }
]

export default dialogueLines;