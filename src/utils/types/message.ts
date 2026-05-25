export interface Message {
  id: number;
  text: string;
  time: string;
  sender: 'me' | 'them';
}

export interface Conversation {
  id: number;
  username: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  read: boolean;
  hasStory: boolean;
  messages: Message[];
}

export interface User {
  id: number;
  username: string;
  avatar: string;
}