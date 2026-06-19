/**
 * Photo Gallery Configuration
 *
 * HOW TO ADD YOUR PHOTOS:
 * 1. Place your images in: client/public/photos/
 * 2. Update this file with the correct filenames, captions, and dates
 * 3. The images will appear both in the Gallery modal AND on frames around the café walls
 *
 * Supported formats: .jpg, .jpeg, .png, .webp
 */

export const PHOTOS = [
  {
    id: 'photo_1',
    src: '/photos/photo1.jpg',
    caption: 'A special memory ✨',
    date: 'January 2024',
    // Fallback placeholder if image not found:
    placeholder: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
  },
  {
    id: 'photo_2',
    src: '/photos/photo2.jpg',
    caption: 'Together always 💛',
    date: 'March 2024',
    placeholder: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80',
  },
  {
    id: 'photo_3',
    src: '/photos/photo3.jpg',
    caption: 'The best adventures 🌟',
    date: 'June 2024',
    placeholder: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
  },
  {
    id: 'photo_4',
    src: '/photos/photo4.jpg',
    caption: 'Moments like these 🌸',
    date: 'August 2024',
    placeholder: 'https://images.unsplash.com/photo-1533294455009-a77b7557d2d1?w=800&q=80',
  },
  {
    id: 'photo_5',
    src: '/photos/photo5.jpg',
    caption: 'Laughing until we cry 😂',
    date: 'October 2024',
    placeholder: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80',
  },
  {
    id: 'photo_6',
    src: '/photos/photo6.jpg',
    caption: 'Here\'s to many more 🥂',
    date: 'December 2024',
    placeholder: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=800&q=80',
  },
];

// Positions of photo frames on the café walls (used in 3D scene)
// [x, y, z, rotationY]
// Left wall inner surface ~x=-9.92, frame depth 0.04 → center at x=-9.88
// Back wall inner surface ~z=-9.92, frame depth 0.04 → center at z=-9.88
// Left wall solid sections: z=4 to z=10 (front) and z=-10 to z=-4 (back)
export const FRAME_POSITIONS = [
  [-9.88, 2.2, 5.5, Math.PI / 2],  // Left wall (front solid section)
  [-9.88, 2.2, 7.5, Math.PI / 2],  // Left wall (front solid section)
  [-9.88, 2.8, -7,  Math.PI / 2],  // Left wall (back solid section)
  [ 0,   2.2, -9.88, 0],           // Back wall center
  [ 2.5, 2.2, -9.88, 0],           // Back wall right-center
  [-2.5, 2.2, -9.88, 0],           // Back wall left-center
];
