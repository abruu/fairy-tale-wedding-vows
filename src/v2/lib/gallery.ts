/** The gallery photos, in display order. Files live in public/img/photos/ (g{n}-thumb.webp for the grid, g{n}.webp for the lightbox). */
export interface GalleryPhoto {
  thumb: string;
  full: string;
  /** Thumbnail size — reserves the grid space before the image arrives */
  width: number;
  height: number;
}

const photo = (n: number, width: number, height: number): GalleryPhoto => ({
  thumb: `/img/photos/g${n}-thumb.webp`,
  full: `/img/photos/g${n}.webp`,
  width,
  height,
});

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  photo(1, 675, 900),
  photo(2, 596, 900),
  photo(3, 675, 900),
  photo(4, 675, 900),
  photo(5, 675, 900),
  photo(6, 675, 900),
  photo(7, 675, 900),
  photo(8, 675, 900),
  photo(9, 675, 900),
  photo(10, 675, 900),
];

/** The photo behind the opening screen (public/img/opener-{800,1400}.webp). */
export const OPENER_PHOTO = {
  src: "/img/opener-1400.webp",
  srcSet: "/img/opener-800.webp 800w, /img/opener-1400.webp 1400w",
};
