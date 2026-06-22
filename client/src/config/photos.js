/**
 * Photo Gallery Configuration
 *
 * 10 photos from the Birthday/photos folder (displayed in 3D frames on the walls AND the gallery),
 * plus 10 additional photos from the Birthday/photos2 folder (displayed ONLY in the gallery).
 */

export const PHOTOS = [
  {
    id: 'photo_1',
    src: '/photos/1b473816-ad01-40f3-abd4-823a240b8568.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos/1b473816-ad01-40f3-abd4-823a240b8568.jpeg',
  },
  {
    id: 'photo_2',
    src: '/photos/3fa932b6-04a2-45f9-bb81-aaa27cef7ebb.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos/3fa932b6-04a2-45f9-bb81-aaa27cef7ebb.jpeg',
  },
  {
    id: 'photo_3',
    src: '/photos/6e65ef18-ce41-486f-a611-43f69868308f.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos/6e65ef18-ce41-486f-a611-43f69868308f.jpeg',
  },
  {
    id: 'photo_4',
    src: '/photos/7d230936-93ce-41d7-b2a3-cd074717524a.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos/7d230936-93ce-41d7-b2a3-cd074717524a.jpeg',
  },
  {
    id: 'photo_5',
    src: '/photos/8e06cb2a-3081-4077-8c69-fe1d472b6e6a.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos/8e06cb2a-3081-4077-8c69-fe1d472b6e6a.jpeg',
  },
  {
    id: 'photo_6',
    src: '/photos/b82eb43f-8075-44cc-b5ff-a1405160c34e.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos/b82eb43f-8075-44cc-b5ff-a1405160c34e.jpeg',
  },
  {
    id: 'photo_7',
    src: '/photos/c04cc211-2a16-49ef-9400-36b560d7e3a2.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos/c04cc211-2a16-49ef-9400-36b560d7e3a2.jpeg',
  },
  {
    id: 'photo_8',
    src: '/photos/ce764dd6-0698-48ff-86fc-6a3560b6f6dc.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos/ce764dd6-0698-48ff-86fc-6a3560b6f6dc.jpeg',
  },
  {
    id: 'photo_9',
    src: '/photos/de9c9e19-3b49-4d79-996a-bfb717ab405a_1.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos/de9c9e19-3b49-4d79-996a-bfb717ab405a_1.jpeg',
  },
  {
    id: 'photo_10',
    src: '/photos/e43d46f8-4704-48f7-8ad0-6d067a8767f1.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos/e43d46f8-4704-48f7-8ad0-6d067a8767f1.jpeg',
  },
  // Photos from photos2 folder (only shown in gallery, not on café walls)
  {
    id: 'photo_11',
    src: '/photos2/0d45bd80-234f-44d4-b4eb-53d88fad17a2.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos2/0d45bd80-234f-44d4-b4eb-53d88fad17a2.jpeg',
  },
  {
    id: 'photo_12',
    src: '/photos2/1ebeb9dc-2663-4ba9-bc8e-0f78d754c725.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos2/1ebeb9dc-2663-4ba9-bc8e-0f78d754c725.jpeg',
  },
  {
    id: 'photo_13',
    src: '/photos2/7127c687-64f5-4ebe-949a-df17fbe3bc43.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos2/7127c687-64f5-4ebe-949a-df17fbe3bc43.jpeg',
  },
  {
    id: 'photo_14',
    src: '/photos2/853d5b6a-b584-4932-bbe7-72b292daf072.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos2/853d5b6a-b584-4932-bbe7-72b292daf072.jpeg',
  },
  {
    id: 'photo_15',
    src: '/photos2/c322f417-e6fe-4ac7-b776-45811599fd72.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos2/c322f417-e6fe-4ac7-b776-45811599fd72.jpeg',
  },
  {
    id: 'photo_16',
    src: '/photos2/cc63a56d-8b92-439b-98ac-b3ddf87ab8ab.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos2/cc63a56d-8b92-439b-98ac-b3ddf87ab8ab.jpeg',
  },
  {
    id: 'photo_17',
    src: '/photos2/dab5a9a6-b652-4d75-a5ba-9f50dae9d071.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos2/dab5a9a6-b652-4d75-a5ba-9f50dae9d071.jpeg',
  },
  {
    id: 'photo_18',
    src: '/photos2/e2654af1-b9df-4d08-b5ea-15e75921d581.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos2/e2654af1-b9df-4d08-b5ea-15e75921d581.jpeg',
  },
  {
    id: 'photo_19',
    src: '/photos2/e578a80f-9077-4ebe-9464-35a67a595ecc.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos2/e578a80f-9077-4ebe-9464-35a67a595ecc.jpeg',
  },
  {
    id: 'photo_20',
    src: '/photos2/f79ec38f-e703-43e0-9332-e88dc5093fb6.jpeg',
    caption: '',
    date: '',
    placeholder: '/photos2/f79ec38f-e703-43e0-9332-e88dc5093fb6.jpeg',
  },
];

// Positions of photo frames on the café walls (used in 3D scene)
// Only the first 10 photos (from /photos/) are displayed on the walls.
// [x, y, z, rotationY]
export const FRAME_POSITIONS = [
  // Left wall (3 frames, facing +X)
  [-9.88, 2.2,  5.5,  Math.PI / 2],
  [-9.88, 2.2,  7.5,  Math.PI / 2],
  [-9.88, 2.8, -7.0,  Math.PI / 2],

  // Back wall (4 frames, facing +Z)
  [-3.5,  2.2, -9.88, 0],
  [ 0.0,  2.2, -9.88, 0],
  [ 2.5,  2.2, -9.88, 0],
  [ 5.5,  2.2, -9.88, 0],

  // Right wall (3 frames, facing -X)
  [ 9.88, 2.2,  7.0, -Math.PI / 2],
  [ 9.88, 2.2,  4.5, -Math.PI / 2],
  [ 9.88, 2.8, -5.5, -Math.PI / 2],
];
