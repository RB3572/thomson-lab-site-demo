import { useEffect, useState } from 'react'

export interface CarouselImage {
  src: string
  alt?: string
}

const DEFAULT_IMAGES: CarouselImage[] = [
  { src: '/gallery/01.jpg', alt: 'Thomson Lab team, 2025' },
  { src: '/gallery/02.jpg', alt: 'Thesis defense celebration' },
  { src: '/gallery/03.jpg', alt: 'Lab members' },
  { src: '/gallery/04.jpg', alt: 'Lab members' },
  { src: '/gallery/05.jpg', alt: 'Lab members' },
  { src: '/gallery/06.jpg', alt: 'Lab outing' },
  { src: '/gallery/07.jpg', alt: 'Group photo' },
]

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d={dir === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  )
}

export default function ThumbnailCarousel({
  images = DEFAULT_IMAGES,
}: {
  images?: CarouselImage[]
}) {
  const [index, setIndex] = useState(0)
  const total = images.length
  const go = (i: number) => setIndex(((i % total) + total) % total)

  // Keep the active thumbnail scrolled into view.
  useEffect(() => {
    document
      .getElementById(`carousel-thumb-${index}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [index])

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl border border-white/10 bg-[#111111]/85 p-3 backdrop-blur-md sm:p-4">
      {/* Main image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black">
        {images.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt ?? ''}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <Chevron dir="left" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next image"
          className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <Chevron dir="right" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
          {index + 1} / {total}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((img, i) => (
          <button
            key={img.src}
            id={`carousel-thumb-${i}`}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to image ${i + 1}`}
            className={`relative h-24 shrink-0 overflow-hidden rounded-lg transition-all duration-500 ease-out ${
              i === index
                ? 'w-40 ring-2 ring-white'
                : 'w-16 opacity-55 hover:opacity-90'
            }`}
          >
            <img
              src={img.src}
              alt=""
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
