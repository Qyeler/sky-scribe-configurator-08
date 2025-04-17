
export type OptionValue = string;

export interface SurveyOption {
  id: string;
  text: string;
  value: OptionValue;
  additionalInfo?: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  section: number;
  options: SurveyOption[];
  multiple?: boolean;
  required?: boolean;
  additionalInfo?: string;
  skipLogic?: {
    dependsOn: string;
    showWhen: OptionValue[];
  };
}

export interface SurveySection {
  id: number;
  title: string;
  description?: string;
}

export interface SurveyResponse {
  [questionId: string]: OptionValue | OptionValue[];
}
