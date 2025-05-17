export interface FriendRequest {
    id: number;
    requester_id: number;
    receiver_id: number;
    status: 'pending' | 'accepted' | 'declined';
    created_at: string;
  }
  
  export interface FriendPendingResponse {
    id: number;
    status: string;
    requester_id: number;
    first_name: string;
    last_name: string;
    age: number;
    email: string;
  }
  