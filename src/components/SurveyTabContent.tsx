
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { SurveyResponse } from '@/types/survey';
import { surveyQuestions, surveySections } from '@/data/surveyQuestions';
import SurveySection from '@/components/SurveySection';
import SurveyProgress from '@/components/SurveyProgress';
import SurveyNavigation from '@/components/SurveyNavigation';

const SurveyTabContent: React.FC<{
  responses: SurveyResponse;
  setResponses: React.Dispatch<React.SetStateAction<SurveyResponse>>;
}> = ({ responses, setResponses }) => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState(1);
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
    <div className="space-y-8">
      <SurveyProgress 
        currentSection={activeSection} 
        totalSections={surveySections.length} 
      />
      
      {currentSection && (
        <SurveySection
          section={currentSection}
          questions={currentSectionQuestions}
          responses={responses}
          onQuestionChange={handleQuestionChange}
        />
      )}
      
      <SurveyNavigation 
        onPrevious={handlePreviousSection}
        onNext={handleNextSection}
        isPreviousDisabled={activeSection === 1}
        isNextDisabled={currentSectionHasUnansweredRequired() || isSubmitting}
        isLastSection={isLastSection}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default SurveyTabContent;
