// User type definition
export interface User {
  uid: string;
  handle?: string;
  email?: string;
  aura?: number;
  avatar?: string;
  friends?: string[];
  friendRequests?: string[];   // Incoming friend requests (UIDs)
  sentRequests?: string[];     // Outgoing pending requests (UIDs)
  joinedAt?: unknown;
  isNew?: boolean;
  needsCodename?: boolean;     // True if authenticated but no codename yet
}

// Transaction type
export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  reason: string;
  createdAt?: unknown;
}

// User list item (from Firestore)
export interface UserListItem {
  id: string;
  handle: string;
  email?: string;
  aura: number;
  avatar: string;
  friends?: string[];
  friendRequests?: string[];
  sentRequests?: string[];
}

// Chat Message
export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderHandle: string;
  senderAvatar: string;
  senderAura: number;
  sentiment?: 'roast' | 'glaze' | 'neutral';
  type: 'user' | 'system';
  createdAt: any; 
}
