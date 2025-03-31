"use client";

import { motion } from "framer-motion";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
      <motion.div
        animate={{
          rotateY: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `
            linear-gradient(
              45deg,
              #FF0018 0% 16.66%,
              #FFA52C 16.66% 33.33%,
              #FFFF41 33.33% 50%,
              #008018 50% 66.66%,
              #0000F9 66.66% 83.33%,
              #86007D 83.33% 100%
            )
          `,
          boxShadow: "0 0 20px rgba(0,0,0,0.1)"
        }}
        className="w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center"
      >
        <motion.div
          animate={{
            rotateY: -360,
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-10 h-10 md:w-16 md:h-16 bg-white rounded-full"
        />
      </motion.div>

      <motion.p
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="text-base md:text-lg font-medium text-center max-w-xs md:max-w-md"
      >
        Carregando... Estamos preparando seu perfil! ❤️
      </motion.p>

      <motion.div 
        className="flex gap-1 md:gap-2 mt-2 md:mt-4"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        {['🏳️‍🌈', '❤️', '🧡', '💛', '💚', '💙', '💜'].map((emoji, i) => (
          <motion.span
            key={i}
            animate={{
              y: [0, -8, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
            className="text-xl md:text-2xl"
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

export default Loading;