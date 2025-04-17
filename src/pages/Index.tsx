
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, List } from "lucide-react";
import Logo from "@/components/Logo";
import { SurveyResponse } from "@/types/survey";
import AIAssistant from "@/components/AIAssistant";
import SurveyTabContent from "@/components/SurveyTabContent";

const Index = () => {
  const [activeTab, setActiveTab] = useState("survey");
  const [responses, setResponses] = useState<SurveyResponse>({});
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <h1 className="text-lg md:text-xl font-light tracking-wide text-gray-700">
            АВТОНОМНЫЕ АЭРОКОСМИЧЕСКИЕ СИСТЕМЫ
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 mb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="survey" className="flex items-center">
              <List className="mr-2" size={18} />
              Опрос
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center">
              <MessageSquare className="mr-2" size={18} />
              ИИ-помощник
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="survey" className="space-y-8">
            <SurveyTabContent 
              responses={responses}
              setResponses={setResponses}
            />
          </TabsContent>
          
          <TabsContent value="assistant" className="min-h-[70vh]">
            <div className="bg-white rounded-xl border shadow-sm p-6 min-h-[70vh] flex flex-col">
              <h2 className="text-xl font-medium mb-4 pb-2 border-b">
                ИИ-помощник для подбора БАС
              </h2>
              
              <AIAssistant />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
