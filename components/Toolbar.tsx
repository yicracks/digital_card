import React, { useState } from 'react';
import { ElementType, STICKERS, BACKGROUNDS, CardLayout, BorderStyle } from '../types';
import { generateGreeting } from '../services/geminiService';

interface ToolbarProps {
  onAddText: (text: string) => void;
  onAddSticker: (sticker: string) => void;
  onSetBackground: (bg: string) => void;
  onSetLayout: (layout: CardLayout) => void;
  onSetBorder: (border: BorderStyle) => void;
  currentLayout: CardLayout;
  currentBorder: BorderStyle;
  isGenerating: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
    onAddText, 
    onAddSticker, 
    onSetBackground, 
    onSetLayout,
    onSetBorder,
    currentLayout,
    currentBorder,
    isGenerating 
}) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'stickers' | 'background' | 'ai'>('layout');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMagicWrite = async () => {
    if (!aiPrompt.trim()) return;
    setIsLoading(true);
    const text = await generateGreeting(aiPrompt);
    onAddText(text);
    setIsLoading(false);
    setAiPrompt('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-l border-gray-100 shadow-xl z-20 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('layout')}
          className={`flex-1 py-4 px-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'layout' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Layout
        </button>
        <button 
          onClick={() => setActiveTab('background')}
          className={`flex-1 py-4 px-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'background' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Style
        </button>
        <button 
          onClick={() => setActiveTab('stickers')}
          className={`flex-1 py-4 px-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'stickers' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Decor
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-4 px-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'ai' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Magic
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        
        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <div className="space-y-6">
             <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Card Format</h3>
              <div className="space-y-3">
                 <button 
                   onClick={() => onSetLayout('portrait')}
                   className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 hover:bg-gray-50 transition-all ${currentLayout === 'portrait' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200'}`}
                 >
                    <div className="w-6 h-8 border-2 border-current rounded-sm opacity-60"></div>
                    <span className="text-sm font-medium">Single Portrait</span>
                 </button>
                 <button 
                   onClick={() => onSetLayout('landscape')}
                   className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 hover:bg-gray-50 transition-all ${currentLayout === 'landscape' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200'}`}
                 >
                    <div className="w-8 h-6 border-2 border-current rounded-sm opacity-60"></div>
                    <span className="text-sm font-medium">Single Landscape</span>
                 </button>
                 <button 
                   onClick={() => onSetLayout('folded-h')}
                   className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 hover:bg-gray-50 transition-all ${currentLayout === 'folded-h' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200'}`}
                 >
                    <div className="w-10 h-6 border-2 border-current rounded-sm flex"><div className="w-1/2 border-r border-current"></div></div>
                    <span className="text-sm font-medium">Folded (Side-by-Side)</span>
                 </button>
                 <button 
                   onClick={() => onSetLayout('folded-v')}
                   className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 hover:bg-gray-50 transition-all ${currentLayout === 'folded-v' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200'}`}
                 >
                    <div className="w-6 h-10 border-2 border-current rounded-sm flex flex-col"><div className="h-1/2 border-b border-current"></div></div>
                    <span className="text-sm font-medium">Folded (Top-Bottom)</span>
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Stickers Tab */}
        {activeTab === 'stickers' && (
          <div className="space-y-6">
             <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Text</h3>
              <button 
                onClick={() => onAddText("Double click to edit")}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-serif hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <span>+ Add Text Block</span>
              </button>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Stickers</h3>
              <div className="grid grid-cols-4 gap-4">
                {STICKERS.map((sticker) => (
                  <button
                    key={sticker}
                    onClick={() => onAddSticker(sticker)}
                    className="aspect-square flex items-center justify-center text-3xl hover:bg-gray-50 rounded-xl transition-transform hover:scale-110"
                  >
                    {sticker}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Background Tab */}
        {activeTab === 'background' && (
          <div className="space-y-6">
            
            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Borders</h3>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => onSetBorder('none')} className={`px-3 py-1.5 text-xs rounded border ${currentBorder === 'none' ? 'bg-primary text-white border-primary' : 'border-gray-200'}`}>None</button>
                    <button onClick={() => onSetBorder('simple-gold')} className={`px-3 py-1.5 text-xs rounded border ${currentBorder === 'simple-gold' ? 'bg-primary text-white border-primary' : 'border-gray-200'}`}>Thin Gold</button>
                    <button onClick={() => onSetBorder('double-gold')} className={`px-3 py-1.5 text-xs rounded border ${currentBorder === 'double-gold' ? 'bg-primary text-white border-primary' : 'border-gray-200'}`}>Double Gold</button>
                    <button onClick={() => onSetBorder('modern-black')} className={`px-3 py-1.5 text-xs rounded border ${currentBorder === 'modern-black' ? 'bg-primary text-white border-primary' : 'border-gray-200'}`}>Modern</button>
                    <button onClick={() => onSetBorder('fancy-red')} className={`px-3 py-1.5 text-xs rounded border ${currentBorder === 'fancy-red' ? 'bg-primary text-white border-primary' : 'border-gray-200'}`}>Red Frame</button>
                </div>
            </div>

            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Paper & Color</h3>
                
                {/* Custom Color Input */}
                <div className="flex items-center gap-3 mb-4 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer relative">
                    <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden relative">
                        <input 
                            type="color" 
                            className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                            onChange={(e) => onSetBackground(e.target.value)}
                        />
                    </div>
                    <span className="text-sm text-gray-600">Custom Color</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                {BACKGROUNDS.map((bg, index) => (
                    <button
                    key={index}
                    onClick={() => onSetBackground(bg)}
                    className="h-20 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all ring-offset-2 hover:ring-2 ring-primary"
                    style={{ background: bg }}
                    />
                ))}
                </div>
            </div>
          </div>
        )}

        {/* AI Tab */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">AI Assistant</h3>
            <p className="text-sm text-gray-500 mb-4">Describe who the card is for, and Gemini will write a heartfelt message.</p>
            
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none h-32"
              placeholder="e.g., Birthday wish for my mom who loves gardening..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            
            <button 
              onClick={handleMagicWrite}
              disabled={isLoading || !aiPrompt.trim()}
              className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium shadow-lg shadow-primary/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Thinking...
                </>
              ) : (
                <>
                  <span>✨ Generate Message</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;