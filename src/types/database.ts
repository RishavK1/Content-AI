export interface Content {
  id: string;
  user_id: string;
  title: string;
  content: string;
  platform: 'instagram' | 'twitter' | 'linkedin' | 'youtube';
  type: 'caption' | 'script' | 'idea';
  created_at: string;
  updated_at: string;
}

export interface SavedContent {
  id: string;
  user_id: string;
  content_id: string;
  created_at: string;
  content?: Content;
}