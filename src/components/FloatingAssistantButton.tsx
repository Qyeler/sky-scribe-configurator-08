
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from 'lucide-react';
import AIAssistant from './AIAssistant';
import { Message } from '@/types/survey';

interface FloatingAssistantButtonProps {
  onTagsIdentified: (tags: string[]) => void;
  initialMessages?: Message[];
}

const FloatingAssistantButton: React.FC<FloatingAssistantButtonProps> = ({ 
  onTagsIdentified,
  initialMessages 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAssistant = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed right-5 bottom-20 w-[350px] md:w-[450px] z-50 bg-white rounded-lg shadow-xl border p-4">
          <AIAssistant 
            onTagsIdentified={onTagsIdentified} 
            floatingMode={true}
            initialMessages={initialMessages}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
      
      <Button
        className="fixed right-5 bottom-5 rounded-full w-14 h-14 shadow-lg z-40"
        onClick={toggleAssistant}
      >
        <MessageSquare size={24} />
      </Button>
    </>
  );
};

export default FloatingAssistantButton;
