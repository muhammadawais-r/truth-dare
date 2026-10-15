import { PromptItem } from '../types/game';

export const SAMPLE_TRUTHS: string[] = [
  "What is the most embarrassing thing you've ever done in public?",
  "What is a secret talent or weird hobby you have that nobody knows about?",
  "If you had to switch lives with one person in this room for a week, who would it be?",
  "What is the biggest lie you ever told your parents or boss with a straight face?",
  "What is your silliest or most irrational fear?",
  "Have you ever stalked someone on social media and accidentally liked a photo from 3 years ago?",
  "What is the worst fashion or haircut decision you have ever made?",
  "What is the last thing you searched for in your private browser tabs?",
  "If you were granted three wishes right now, what is the most selfish one you'd pick?",
  "What is the most awkward text you have ever sent to the wrong person?"
];

export const SAMPLE_DARES: string[] = [
  "Do your best impression of another player until someone correctly guesses who it is.",
  "Speak in a dramatic Shakespearean accent for the next two rounds.",
  "Do 10 jumping jacks while loudly singing your favorite nursery rhyme.",
  "Show the last photo in your phone camera roll to everyone in the room.",
  "Try not to laugh or smile for 60 seconds while other players make silly faces at you.",
  "Balance a small object on your head while walking in a full circle around the room.",
  "Send an emoji-only text message to the third contact in your recent messages list.",
  "Perform a dramatic 30-second imaginary shampoo commercial.",
  "Talk like a movie trailer voiceover announcer for your next two turns.",
  "Let another player fix your hairstyle however they want for the rest of the game."
];

export function createPromptItem(text: string): PromptItem {
  return {
    id: 'prompt_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
    text: text.trim(),
    createdAt: Date.now()
  };
}
