
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Здравствуйте! Я помощник для подбора БАС. Опишите ваши требования, и я помогу подобрать оптимальную конфигурацию оборудования.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: userInput
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // In a real implementation, you would make an API call to an AI service
      // For now, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: generateResponse(userInput)
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Clear the input field
      setUserInput("");
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить ответ. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simple mock response generation - in production this would be replaced with a real AI service
  const generateResponse = (input: string): string => {
    if (input.toLowerCase().includes('доставк')) {
      return "На основе вашего запроса о доставке грузов, я рекомендую использовать БАС с грузоподъемностью от 3 кг. Такие модели как Курьер-600 или Перевозчик-800 будут оптимальным выбором. Стоимость решения начинается от 1,200,000 руб.";
    } else if (input.toLowerCase().includes('фото') || input.toLowerCase().includes('съемк')) {
      return "Для задач аэрофотосъемки рекомендую БАС серии Инспектор-300 с камерой высокого разрешения. Это позволит получать детальные снимки с высоты до 120 метров. Приблизительная стоимость: 850,000 руб.";
    } else {
      return "Спасибо за ваш запрос. На основании предоставленной информации я рекомендую БАС среднего класса с возможностью установки различной полезной нагрузки. Подходящие модели: Универсал-400 или Скаут-350. Приблизительная стоимость решения: 750,000 - 950,000 руб. в зависимости от конфигурации. Хотите узнать подробнее о технических характеристиках?";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-gray-200 rounded-tl-none'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center mb-1 text-sm font-medium">
                  <Bot size={16} className="mr-1" />
                  <span>Помощник БАС</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 rounded-tl-none">
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Обработка запроса...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <div className="flex space-x-2">
          <Textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder="Опишите ваши требования к беспилотной системе..."
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !userInput.trim()}
            className="shrink-0"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Нажмите Enter для отправки или Shift+Enter для переноса строки
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
