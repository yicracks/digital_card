import React, { useState, useCallback } from 'react';
import CardCanvas from './components/CardCanvas';
import Toolbar from './components/Toolbar';
import { CardElement, ElementType, BACKGROUNDS, CardLayout, BorderStyle } from './types';

// Simple ID generator since we might not have 'uuid' package in this env
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [elements, setElements] = useState<CardElement[]>([
    {
      id: generateId(),
      type: ElementType.TEXT,
      content: "Happy Birthday!",
      x: 150,
      y: 200,
      fontSize: 42,
      color: '#1f2937',
      fontFamily: 'font-serif',
      rotation: 0,
      scale: 1,
      zIndex: 1
    }
  ]);
  const [background, setBackground] = useState<string>(BACKGROUNDS[6]); // Gradient default
  const [layout, setLayout] = useState<CardLayout>('portrait');
  const [border, setBorder] = useState<BorderStyle>('none');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleAddText = (text: string) => {
    const newElement: CardElement = {
      id: generateId(),
      type: ElementType.TEXT,
      content: text,
      x: 200, // Center-ish
      y: 300,
      fontSize: 24,
      color: '#1f2937',
      fontFamily: 'font-hand',
      rotation: 0,
      scale: 1,
      zIndex: elements.length + 1
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const handleAddSticker = (sticker: string) => {
    const newElement: CardElement = {
      id: generateId(),
      type: ElementType.STICKER,
      content: sticker,
      x: Math.random() * 300 + 100,
      y: Math.random() * 400 + 100,
      fontSize: 64, // Emoji size
      color: '#000',
      fontFamily: 'font-sans',
      rotation: (Math.random() - 0.5) * 30, // Random slight rotation
      scale: 1,
      zIndex: elements.length + 1
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const handleUpdateElement = useCallback((id: string, updates: Partial<CardElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  }, []);

  const handleDeleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedId(null);
  }, []);

  const handlePrint = () => {
    // Deselect everything before printing so no borders show
    setSelectedId(null);
    setTimeout(() => {
        window.print();
    }, 100);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden text-gray-800 font-sans">
      
      {/* Header for Mobile / Sidebar Title */}
      <div className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 z-30">
        <h1 className="text-xl font-serif font-bold text-primary">Lumina</h1>
        <button 
            onClick={handlePrint}
            className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-full"
        >
            Print
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative flex flex-col h-full bg-gray-50">
        <div className="absolute top-6 right-6 z-10 hidden md:block">
            <button 
                onClick={handlePrint}
                className="bg-white/80 backdrop-blur-md shadow-lg border border-white/20 hover:bg-white text-gray-800 px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 group"
            >
                <svg className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                Print / Save PDF
            </button>
        </div>

        <CardCanvas 
          elements={elements}
          background={background}
          layout={layout}
          borderStyle={border}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdate={handleUpdateElement}
          onDelete={handleDeleteElement}
        />
      </div>

      {/* Controls Sidebar */}
      <div className="h-1/3 md:h-full md:w-[350px] relative z-20">
         <Toolbar 
            onAddText={handleAddText} 
            onAddSticker={handleAddSticker}
            onSetBackground={setBackground}
            onSetLayout={setLayout}
            onSetBorder={setBorder}
            currentLayout={layout}
            currentBorder={border}
            isGenerating={false}
         />
      </div>

    </div>
  );
};

export default App;