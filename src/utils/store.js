const cards = [
  {
    id: 'card-1',
    title: 'I wonder how',
  },
  {
    id: 'card-2',
    title: 'I wonder why',
  },
  {
    id: 'card-3',
    title: 'Yesterday you told me about the blue blue sky',
  },
];

const data = {
  lists: {
    'list-1': {
      id: 'list-1',
      title: 'Lemon tree',
      cards,
    },
  },
  listIds: ['list-1'],
};

export default data;