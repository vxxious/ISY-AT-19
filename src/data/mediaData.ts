import photo1 from "@/assets/photos/photo1.jpg";
import photo2 from "@/assets/photos/photo2.jpg";
import photo3 from "@/assets/photos/photo3.jpg";
import photo4 from "@/assets/photos/photo4.jpg";
import photo5 from "@/assets/photos/photo5.jpg";
import photo6 from "@/assets/photos/photo6.jpg";

export interface MediaItem {
  type: "image" | "video";
  src: string;
  caption?: string;
}

export const slideshowMedia: MediaItem[] = [
  { type: "image", src: photo1, caption: "A quiet moment, just being you." },
  { type: "video", src: "/videos/video1.mp4", caption: "Living in the moment." },
  { type: "image", src: photo3, caption: "That energy no one can match." },
  { type: "image", src: photo4, caption: "Art in every frame." },
  { type: "video", src: "/videos/video2.mp4", caption: "pretty, Hot, Amazing." },
  { type: "image", src: photo5, caption: "Growing, glowing, always." },
];

export interface TimelineChapter {
  title: string;
  items: { src: string; text: string }[];
}

export const timelineChapters: TimelineChapter[] = [
  {
    title: "Throwing it back",
    items: [
      { src: photo5, text: "Pure, unfiltered, you." },
      { src: photo2, text: "sad lil funny face, but still special." },
    ],
  },
  {
    title: "Good Moments",
    items: [
      { src: photo3, text: "cute lil lip combo, 10/10 face card." },
      { src: photo4, text: "Colors, filters, and everything in between." },
    ],
  },
  {
    title: "Recent Memories",
    items: [
      { src: photo1, text: "10/10 face card, big cute ahh fore head still." },
      { src: photo6, text: "And here you are radiant, immaculate as always." },
    ],
  },
];

export const personalMessage= 'Isioma, you seem like such a kind and genuine person from everything I’ve seen. Your beauty and everything about you stands out in a calm and natural way, it’s simple but hard to ignore. I admire how effortlessly you are without doing too much. Nineteen looks like a fresh and exciting chapter for you. I hope this year brings you peace, growth, and moments that make you smile for real and keep chasing what matters to you. Happy birthday, wish you the best always.';