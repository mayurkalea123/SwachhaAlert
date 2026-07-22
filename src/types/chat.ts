export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  formSuggestion?: FormSuggestion;
}

export interface FormSuggestion {
  wasteType?: string;
  priority?: string;
  description?: string;
  location?: string;
  area?: string;
}
