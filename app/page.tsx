'use client';
import Image from "next/image";
import { useCatStore } from "./store/catStore";
import { use, useEffect, useState } from "react";
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const setCatImage = useCatStore((state) => state.setCatImage);
  const catImage = useCatStore((state) => state.catImage);
  const setFavoriteCatImage = useCatStore((state) => state.setFavoriteCatImage);
  const favoriteCatImage = useCatStore((state) => state.favoriteCatImage);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);


  const fetchCatImage = async () => {
    try {
      const response = await fetch("https://api.thecatapi.com/v1/images/search?limit=10");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCatImage(data);
    } catch (error) {
      console.error("Failed to fetch cat image:", error);
    }
  }

  useEffect(() => {
    fetchCatImage();
  }, []);

  useEffect(() => {
    console.log('Current Index: ', currentIndex);
  }, [currentIndex]);

  const handleSwipeRight = () => {
    setDirection("right");
    console.log('Swiped right');
    if (catImage[currentIndex]) {
      setFavoriteCatImage(catImage[currentIndex]);
    }
    // Move to next image
    setCurrentIndex((prev) => {
      if (prev + 1 <= catImage.length) {
        return prev + 1;
      }
      return prev; // Stay on last image
    });

  };

  const handleSwipeLeft = () => {
    setDirection("left");
    console.log('Swiped left');
    // Just move to next image without favoriting
    setCurrentIndex((prev) => {
      if (prev + 1 <= catImage.length) {
        return prev + 1;
      }
      return prev; // Stay on last image
    });

  };

  const handlers = useSwipeable({
    onSwipedRight: handleSwipeRight,
    onSwipedLeft: handleSwipeLeft,

    trackMouse: true, // allows swipe detection with mouse too
    delta: 10,
  });

  return (
    <>
      {
        catImage.length - 1 >= currentIndex ?
          <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] select-none">
            <main className="flex flex-col gap-[32px] row-start-2 items-center text-center">
              <h2 className="justify-center text-2xl sm:text-3xl font-semibold text-center ">
                Welcome to the Cat Image Gallery
              </h2>
              <p className="text-lg sm:text-xl text-center sm:text-left">
                Swipe right to favorite your cat images!
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={catImage[currentIndex]?.id || currentIndex}
                  initial={{ x: direction === "right" ? 300 : -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction === "right" ? -300 : 300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  {...handlers}
                  className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] relative rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
                >
                  {catImage[currentIndex]?.url ? (
                    <Image
                      src={catImage[currentIndex].url}
                      alt={`Cat image ${currentIndex + 1}`}
                      fill
                      className="object-cover"
                      draggable={false}
                    />
                  ) : (
                    <p className="text-gray-500">Loading cat Image...</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
          </div> :
          <div className="grid grid-rows-[20px_1fr_20px]  items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] select-none">
            <main className=" flex flex-col gap-[32px] row-start-2 items-center text-center">
              <h2 className="justify-center text-2xl sm:text-3xl font-semibold text-center">
                Total Cat Images favorite {favoriteCatImage.length}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {
                  favoriteCatImage.map((cat, index) => (
                    <div
                      key={index}
                      className="flex grid grid-cols-2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] relative rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
                    >
                      <Image
                        src={cat.url}
                        alt={`Cat image ${index + 1}`}
                        fill
                        className="object-cover"
                        draggable={false}
                      />
                    </div>
                  ))}
              </div>
              <div />
            </main>
          </div >
      }
    </>
  );
}
