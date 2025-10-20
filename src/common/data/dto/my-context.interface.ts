import { Context } from 'telegraf';

export interface MyContext extends Context {
  session: {
    testId?: string;
    currentQuestionIndex?: number;
    questions?: {
      id: string;
      text: string;
      options: { id: string; text: string }[];
    }[];
  };
}