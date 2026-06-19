/**
 * Photo Gallery Configuration
 *
 * All 12 photos from the Birthday/photos folder.
 * These appear in:
 *   - 3D photo frames on the café walls
 *   - The Gallery modal (browse with arrows)
 *   - The Surprise / Celebrate slideshow
 */

export const PHOTOS = [
  {
    id: 'photo_1',
    src: '/photos/1b473816-ad01-40f3-abd4-823a240b8568.jpeg',
    caption: 'A beautiful memory ✨',
    date: '',
    placeholder: '/photos/1b473816-ad01-40f3-abd4-823a240b8568.jpeg',
  },
  {
    id: 'photo_2',
    src: '/photos/1f40485d-b82a-4187-b4a5-8c7fcb452e8a.jpeg',
    caption: 'Together always 💛',
    date: '',
    placeholder: '/photos/1f40485d-b82a-4187-b4a5-8c7fcb452e8a.jpeg',
  },
  {
    id: 'photo_3',
    src: '/photos/3fa932b6-04a2-45f9-bb81-aaa27cef7ebb.jpeg',
    caption: 'The best adventures 🌟',
    date: '',
    placeholder: '/photos/3fa932b6-04a2-45f9-bb81-aaa27cef7ebb.jpeg',
  },
  {
    id: 'photo_4',
    src: '/photos/4050bff3-39f1-48e0-86e1-93e9c73054c2.jpeg',
    caption: 'Moments like these 🌸',
    date: '',
    placeholder: '/photos/4050bff3-39f1-48e0-86e1-93e9c73054c2.jpeg',
  },
  {
    id: 'photo_5',
    src: '/photos/6e65ef18-ce41-486f-a611-43f69868308f.jpeg',
    caption: 'Laughing until we cry 😂',
    date: '',
    placeholder: '/photos/6e65ef18-ce41-486f-a611-43f69868308f.jpeg',
  },
  {
    id: 'photo_6',
    src: '/photos/7d230936-93ce-41d7-b2a3-cd074717524a.jpeg',
    caption: 'Here\'s to many more 🥂',
    date: '',
    placeholder: '/photos/7d230936-93ce-41d7-b2a3-cd074717524a.jpeg',
  },
  {
    id: 'photo_7',
    src: '/photos/8e06cb2a-3081-4077-8c69-fe1d472b6e6a.jpeg',
    caption: 'Pure joy 🎉',
    date: '',
    placeholder: '/photos/8e06cb2a-3081-4077-8c69-fe1d472b6e6a.jpeg',
  },
  {
    id: 'photo_8',
    src: '/photos/b82eb43f-8075-44cc-b5ff-a1405160c34e.jpeg',
    caption: 'Cherished moments 💫',
    date: '',
    placeholder: '/photos/b82eb43f-8075-44cc-b5ff-a1405160c34e.jpeg',
  },
  {
    id: 'photo_9',
    src: '/photos/c04cc211-2a16-49ef-9400-36b560d7e3a2.jpeg',
    caption: 'Unforgettable 🌹',
    date: '',
    placeholder: '/photos/c04cc211-2a16-49ef-9400-36b560d7e3a2.jpeg',
  },
  {
    id: 'photo_10',
    src: '/photos/ce764dd6-0698-48ff-86fc-6a3560b6f6dc.jpeg',
    caption: 'Forever grateful 💕',
    date: '',
    placeholder: '/photos/ce764dd6-0698-48ff-86fc-6a3560b6f6dc.jpeg',
  },
  {
    id: 'photo_11',
    src: '/photos/de9c9e19-3b49-4d79-996a-bfb717ab405a_1.jpeg',
    caption: 'Smiles that light up the world ☀️',
    date: '',
    placeholder: '/photos/de9c9e19-3b49-4d79-996a-bfb717ab405a_1.jpeg',
  },
  {
    id: 'photo_12',
    src: '/photos/e43d46f8-4704-48f7-8ad0-6d067a8767f1.jpeg',
    caption: 'Making memories 🎂',
    date: '',
    placeholder: '/photos/e43d46f8-4704-48f7-8ad0-6d067a8767f1.jpeg',
  },
];

// Positions of photo frames on the café walls (used in 3D scene)
// [x, y, z, rotationY]
// Left wall inner surface ~x=-9.92, frame depth 0.04 → center at x=-9.88
// Back wall inner surface ~z=-9.92, frame depth 0.04 → center at z=-9.88
// Right wall inner surface ~x=9.92 → center at x=9.88
export const FRAME_POSITIONS = [
  // Left wall (6 frames, facing +X)
  [-9.88, 2.2,  5.5,  Math.PI / 2],
  [-9.88, 2.2,  7.5,  Math.PI / 2],
  [-9.88, 2.8, -7.0,  Math.PI / 2],
  [-9.88, 2.2, -5.0,  Math.PI / 2],

  // Back wall (4 frames, facing +Z)
  [-3.5,  2.2, -9.88, 0],
  [ 0.0,  2.2, -9.88, 0],
  [ 2.5,  2.2, -9.88, 0],
  [ 5.5,  2.2, -9.88, 0],

  // Right wall (4 frames, facing -X)
  [ 9.88, 2.2,  7.0, -Math.PI / 2],
  [ 9.88, 2.2,  4.5, -Math.PI / 2],
  [ 9.88, 2.8, -5.5, -Math.PI / 2],
  [ 9.88, 2.2, -7.5, -Math.PI / 2],
];
