"use client"

import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const galleryImages = Array.from({ length: 16 }, (_, i) => 
    `/images/gesdipics/${i + 1}.jpeg`
  );

  const openImage = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeImage = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(prev => 
        prev === 0 ? galleryImages.length - 1 : prev! - 1
      );
    } else {
      setSelectedImageIndex(prev => 
        prev === galleryImages.length - 1 ? 0 : prev! + 1
      );
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Fixed background image */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/gesdi.jpg')" }}
      >
        {/* White overlay for a lighter effect */}
        <div className="absolute inset-0 bg-white/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl text-black font-bold text-center px-4">
          Grupo de Pesquisa e Estudos Gêneros, Sexualidades e Diferenças nos Vários <span className="italic">EspaçosTempos</span> da História e dos Cotidianos
        </h1>
        <div className="mt-8 text-2xl text-black text-center px-4">
          O GESDI é um grupo de pesquisa interdisciplinar que combate misoginia, machismo e LGBTQIAPN+fobia, analisando práticas de exclusão em contextos históricos e cotidianos. Formado por pesquisadores, professores e estudantes, investiga discriminações em espaços educacionais e sociais ligados a gênero, sexualidades e laicidade estatal – essencial para proteger minorias. Seus estudos identificam o avanço do conservadorismo brasileiro como catalisador da violência contra mulheres e LGBTQIAPN+. Diante desse cenário, o grupo fortalece seu papel ativo no combate diário a todas as formas de opressão, unindo produção acadêmica e militância política pela equidade social.</div>

        <Link href="http://localhost:3000/quem-somos">
          <button className="mt-8 px-6 py-3 font-bold text-lg rounded-lg rainbow-animation transition-all duration-300">
            <span className="text-white text-shadow-outline">Quem Somos</span>
          </button>
        </Link>
      </div>

      {/* Gallery Section */}
      <div className="relative z-10 bg-white/80 py-16 px-4 sm:px-6 lg:px-8 rounded-t-3xl rounded-b-3xl shadow-2xl mx-4 my-12">
        <h2 className="text-4xl font-bold text-center mb-12 rainbow-text">Nossa Galeria</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {galleryImages.map((imgSrc, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => openImage(index)}
            >
              <img
                src={imgSrc}
                alt={`Membro do GESDI ${index + 1}`}
                className="w-full h-80 object-cover object-top rounded-2xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeImage}
        >
          <div className="relative w-full max-w-4xl"> {/* Reduzido de max-w-6xl para max-w-4xl (aproximadamente 15% menor) */}
            {/* Navigation Button - Left */}
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-3 z-10 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Image Container */}
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={galleryImages[selectedImageIndex]}
                alt="Membro do GESDI"
                className="max-w-[85%] max-h-[85vh] object-contain rounded-lg" /* Reduzido para 85% do tamanho original */
              />
            </div>

            {/* Navigation Button - Right */}
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-3 z-10 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 z-10 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                closeImage();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .rainbow-animation {
          background: linear-gradient(
            270deg,
            #ff0080,
            #ff8c00,
            #ffd700,
            #32cd32,
            #00bfff,
            #8a2be2,
            #ff0080
          );
          background-size: 400% 400%;
          animation: rainbowAnimation 8s ease infinite;
        }

        .rainbow-text {
          background: linear-gradient(
            270deg,
            #ff0080,
            #ff8c00,
            #ffd700,
            #32cd32,
            #00bfff,
            #8a2be2,
            #ff0080
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 400% 400%;
          animation: rainbowAnimation 8s ease infinite;
        }

        @keyframes rainbowAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}