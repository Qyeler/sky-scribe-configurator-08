import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, List, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { SurveyQuestion, SurveySection as SurveySectionType, SurveyResponse } from "@/types/survey";
import { surveyQuestions, surveySections } from "@/data/surveyQuestions";
import SurveySection from "@/components/SurveySection";
import AIAssistant from "@/components/AIAssistant";

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("survey");
  const [activeSection, setActiveSection] = useState(1);
  const [responses, setResponses] = useState<SurveyResponse>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter questions for the current section
  const currentSectionQuestions = surveyQuestions.filter(q => q.section === activeSection);
  
  // Find the current section
  const currentSection = surveySections.find(s => s.id === activeSection);
  
  // Handle question responses
  const handleQuestionChange = (id: string, value: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Navigate to the next survey section
  const handleNextSection = () => {
    const nextSection = activeSection + 1;
    if (nextSection <= surveySections.length) {
      setActiveSection(nextSection);
      window.scrollTo(0, 0);
    } else {
      handleSubmitSurvey();
    }
  };
  
  // Navigate to the previous survey section
  const handlePreviousSection = () => {
    const prevSection = activeSection - 1;
    if (prevSection >= 1) {
      setActiveSection(prevSection);
      window.scrollTo(0, 0);
    }
  };
  
  // Submit the survey
  const handleSubmitSurvey = () => {
    setIsSubmitting(true);
    
    // In a real implementation, you would send the responses to a server
    // For now, we'll just simulate this with a delay
    setTimeout(() => {
      toast({
        title: "Запрос отправлен",
        description: "Специалист свяжется с вами в ближайшее время",
      });
      setIsSubmitting(false);
    }, 1500);
  };
  
  // Check if the current section has required questions that are not answered
  const currentSectionHasUnansweredRequired = () => {
    return currentSectionQuestions
      .filter(q => q.required)
      .some(q => {
        // If the question has skip logic and should not be shown, it's not required
        if (q.skipLogic) {
          const dependsOnValue = responses[q.skipLogic.dependsOn];
          if (!dependsOnValue) return false;
          
          // If the dependent value doesn't match any of the showWhen values, question isn't required
          if (Array.isArray(dependsOnValue)) {
            if (!q.skipLogic.showWhen.some(value => dependsOnValue.includes(value))) {
              return false;
            }
          } else if (!q.skipLogic.showWhen.includes(dependsOnValue)) {
            return false;
          }
        }
        
        // If we get here, the question is required and should be shown
        return !responses[q.id];
      });
  };
  
  const isLastSection = activeSection === surveySections.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - keeping this from the original design */}
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
            {/* Progress indicator */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Прогресс</span>
                <span className="text-sm text-gray-500">
                  Раздел {activeSection} из {surveySections.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all" 
                  style={{ width: `${(activeSection / surveySections.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Current section title */}
            {currentSection && (
              <SurveySection
                section={currentSection}
                questions={currentSectionQuestions}
                responses={responses}
                onQuestionChange={handleQuestionChange}
              />
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousSection}
                disabled={activeSection === 1}
              >
                Назад
              </Button>
              
              <Button
                onClick={handleNextSection}
                disabled={currentSectionHasUnansweredRequired() || isSubmitting}
              >
                {isLastSection ? (
                  isSubmitting ? "Обработка..." : "Отправить запрос"
                ) : (
                  "Далее"
                )}
              </Button>
            </div>
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
