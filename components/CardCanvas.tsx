import React, { useRef, useState, useEffect } from 'react';
import { CardElement, ElementType, FONTS, COLORS, CardLayout, BorderStyle } from '../types';

interface CardCanvasProps {
  elements: CardElement[];
  background: string;
  layout: CardLayout;
  borderStyle: BorderStyle;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<CardElement>) => void;
  onDelete: (id: string) => void;
}

const CardCanvas: React.FC<CardCanvasProps> = ({ 
  elements, 
  background,
  layout,
  borderStyle,
  selectedId, 
  onSelect, 
  onUpdate,
  onDelete 
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Dimensions based on layout
  const getDimensions = () => {
    switch (layout) {
      case 'landscape': return { width: 800, height: 600 };
      case 'folded-h': return { width: 1000, height: 700 }; // Side by side pages
      case 'folded-v': return { width: 600, height: 1000 }; // Top bottom pages
      case 'portrait':
      default: return { width: 600, height: 800 };
    }
  };

  const { width, height } = getDimensions();

  // Scale canvas to fit in view if needed
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const handleResize = () => {
        if (canvasRef.current && canvasRef.current.parentElement) {
            const parentWidth = canvasRef.current.parentElement.clientWidth - 64; // padding
            const parentHeight = canvasRef.current.parentElement.clientHeight - 64;
            const scaleX = parentWidth / width;
            const scaleY = parentHeight / height;
            const newScale = Math.min(scaleX, scaleY, 1); // Never scale up past 1
            setScale(Math.max(newScale, 0.4)); // Don't get too small
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  // Handle outside click to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (canvasRef.current && !canvasRef.current.contains(e.target as Node)) {
        onSelect(null);
        setEditingId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onSelect]);

  const handleMouseDown = (e: React.MouseEvent, element: CardElement) => {
    e.stopPropagation();
    onSelect(element.id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - element.x * scale, // Adjust for scale
      y: e.clientY - element.y * scale
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      // Calculate position relative to unscaled canvas coordinate system
      const mouseX = (e.clientX - rect.left) / scale; 
      const mouseY = (e.clientY - rect.top) / scale;
      
      // We need to maintain the offset from where we clicked inside the element
      // But for simplicity in this scaled context, let's just move smoothly.
      // Re-calculating raw X/Y based on movement delta is often smoother for scaled canvas.
      
      // A simpler approach for scaled drag:
      // We stored the offset at start. Now we just set X/Y based on current mouse pos minus offset, adjusted by scale.
      // However, React state updates are async.
      
      onUpdate(selectedId, { 
          x: (e.clientX - dragOffset.x) / scale, // Approximate for now or refactor to delta-based
          y: (e.clientY - dragOffset.y) / scale
      });
    }
  };
  
  // Adjusted drag handler for scaled canvas to be more precise
  const handleMouseDownAdjusted = (e: React.MouseEvent, element: CardElement) => {
      e.stopPropagation();
      onSelect(element.id);
      setIsDragging(true);
      // Store the offset relative to the element's top-left, in CANVAS coordinates (unscaled)
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseXInCanvas = (e.clientX - rect.left) / scale;
        const mouseYInCanvas = (e.clientY - rect.top) / scale;
        setDragOffset({
            x: mouseXInCanvas - element.x,
            y: mouseYInCanvas - element.y
        });
      }
  };

  const handleMouseMoveAdjusted = (e: React.MouseEvent) => {
      if (isDragging && selectedId && canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          const mouseXInCanvas = (e.clientX - rect.left) / scale;
          const mouseYInCanvas = (e.clientY - rect.top) / scale;
          
          onUpdate(selectedId, {
              x: mouseXInCanvas - dragOffset.x,
              y: mouseYInCanvas - dragOffset.y
          });
      }
  };


  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (id: string) => {
    setEditingId(id);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, id: string) => {
    onUpdate(id, { content: e.target.value });
  };

  // Render Border Logic
  const renderBorder = () => {
      switch(borderStyle) {
          case 'simple-gold':
              return <div className="absolute inset-0 border-[12px] border-[#d4af37] pointer-events-none z-0" style={{boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.1)'}}></div>;
          case 'double-gold':
               return (
                <div className="absolute inset-2 border-4 border-[#d4af37] pointer-events-none z-0">
                    <div className="absolute inset-1 border border-[#d4af37]"></div>
                </div>
               );
          case 'modern-black':
               return <div className="absolute inset-6 border border-gray-800 pointer-events-none z-0"></div>;
          case 'fancy-red':
               return <div className="absolute inset-0 border-[8px] border-red-900/30 pointer-events-none z-0 mix-blend-multiply"></div>
          default:
              return null;
      }
  };

  // Render Fold Lines
  const renderFolds = () => {
      if (layout === 'folded-h') {
          return <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/10 z-0 pointer-events-none" style={{boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.5)'}}></div>
      }
      if (layout === 'folded-v') {
          return <div className="absolute top-1/2 left-0 right-0 h-px bg-black/10 z-0 pointer-events-none" style={{boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)'}}></div>
      }
      return null;
  };

  const renderElement = (el: CardElement) => {
    const isSelected = selectedId === el.id;
    const isEditing = editingId === el.id && el.type === ElementType.TEXT;

    const style: React.CSSProperties = {
      position: 'absolute',
      left: el.x,
      top: el.y,
      fontSize: `${el.fontSize}px`,
      color: el.color,
      zIndex: el.zIndex,
      transform: `rotate(${el.rotation}deg) scale(${el.scale})`,
      cursor: isDragging && isSelected ? 'grabbing' : 'grab',
      userSelect: 'none',
      whiteSpace: 'pre-wrap',
    };

    return (
      <div
        key={el.id}
        style={style}
        onMouseDown={(e) => handleMouseDownAdjusted(e, el)}
        onDoubleClick={() => handleDoubleClick(el.id)}
        className={`${el.fontFamily} group`}
      >
        {isSelected && !isEditing && (
          <div className="absolute -inset-4 border-2 border-primary border-dashed rounded-lg pointer-events-none no-print z-50">
             <div className="absolute -top-8 left-0 right-0 flex justify-center gap-2 pointer-events-auto">
                <button 
                  onMouseDown={(e) => { e.stopPropagation(); onUpdate(el.id, { scale: Math.max(0.5, el.scale - 0.1) }); }}
                  className="bg-white text-gray-600 rounded-full w-6 h-6 shadow hover:bg-gray-100 flex items-center justify-center text-xs"
                >-</button>
                 <button 
                  onMouseDown={(e) => { e.stopPropagation(); onDelete(el.id); }}
                  className="bg-red-500 text-white rounded-full w-6 h-6 shadow hover:bg-red-600 flex items-center justify-center text-xs"
                >×</button>
                 <button 
                  onMouseDown={(e) => { e.stopPropagation(); onUpdate(el.id, { scale: Math.min(3, el.scale + 0.1) }); }}
                  className="bg-white text-gray-600 rounded-full w-6 h-6 shadow hover:bg-gray-100 flex items-center justify-center text-xs"
                >+</button>
             </div>
             {el.type === ElementType.TEXT && (
                <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-1 pointer-events-auto bg-white p-1 rounded-lg shadow-xl w-max mx-auto">
                    {COLORS.map(c => (
                        <button 
                            key={c} 
                            style={{background: c}} 
                            className={`w-4 h-4 rounded-full border border-gray-100 ${el.color === c ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                            onClick={(e) => { e.stopPropagation(); onUpdate(el.id, { color: c }); }}
                        />
                    ))}
                    <div className="w-px bg-gray-200 mx-1"></div>
                    {FONTS.map(f => (
                         <button 
                            key={f.value}
                            className={`px-2 text-[10px] rounded ${el.fontFamily === f.value ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                            onClick={(e) => { e.stopPropagation(); onUpdate(el.id, { fontFamily: f.value }); }}
                         >
                            {f.name}
                         </button>
                    ))}
                </div>
             )}
          </div>
        )}
        
        {isEditing ? (
          <textarea
            autoFocus
            value={el.content}
            onChange={(e) => handleTextChange(e, el.id)}
            onBlur={() => setEditingId(null)}
            className="bg-transparent outline-none resize-none overflow-hidden text-center min-w-[200px]"
            style={{ 
                fontFamily: 'inherit', 
                fontSize: 'inherit', 
                color: 'inherit',
                lineHeight: 1.2
            }}
          />
        ) : (
            <div className="whitespace-pre-wrap text-center leading-tight min-w-[50px] min-h-[50px]">
                {el.content}
            </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="flex-1 bg-gray-100 overflow-hidden relative flex items-center justify-center p-8 select-none"
      onMouseMove={handleMouseMoveAdjusted}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        ref={canvasRef}
        className="relative bg-white shadow-2xl transition-all duration-300 mx-auto origin-center"
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          background: background,
          transform: `scale(${scale})`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
        }}
      >
        {renderBorder()}
        {renderFolds()}
        {elements.map(renderElement)}
      </div>
    </div>
  );
};

export default CardCanvas;