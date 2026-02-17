import axios from 'axios';
import { config } from '../config';

// Types for Fanvue API
export interface FanvueMessage {
  text: string | null;
  mediaUuids?: string[];
  price?: number | null;
  templateUuid?: string | null;
}

export interface FanvueChat {
  id: string; // userUuid
  username: string;
  avatarUrl?: string;
  lastMessage?: string;
  unreadCount?: number;
}

export interface FanvueMedia {
  uuid: string;
  url: string;
  type: 'image' | 'video';
  tags?: string[];
  price?: number;
}

export class FanvueClient {
  private static baseUrl = config.fanvue.apiUrl;
  private static token = process.env.FANVUE_API_TOKEN || 'mock-token'; // In prod, this would be managed via OAuth flow

  private static async request(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data?: any) {
    if (config.testMode) {
      console.log(`[MOCK] ${method} ${endpoint}`, data ? JSON.stringify(data) : '');
      return this.getMockResponse(endpoint, method, data);
    }

    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'X-Fanvue-API-Version': '2025-06-26',
          'Content-Type': 'application/json',
        },
        data,
      });
      return response.data;
    } catch (error: any) {
      console.error(`Fanvue API Error [${method} ${endpoint}]:`, error.response?.data || error.message);
      throw error;
    }
  }

  // --- Actions ---

  static async sendMessage(creatorUuid: string, userUuid: string, text: string | null, mediaUuids: string[] = [], price: number | null = null) {
    const payload: FanvueMessage = {
      text,
      mediaUuids: mediaUuids.length > 0 ? mediaUuids : undefined,
      price: price ? price : undefined,
    };
    return this.request('POST', `/creators/${creatorUuid}/chats/${userUuid}/message`, payload);
  }

  static async sendMassMessage(creatorUuid: string, listUuids: string[], text: string | null, mediaUuids: string[] = [], price: number | null = null) {
    const payload = {
      listUuids,
      text,
      mediaUuids: mediaUuids.length > 0 ? mediaUuids : undefined,
      price: price ? price : undefined,
    };
    return this.request('POST', `/creators/${creatorUuid}/chats/mass-message`, payload);
  }

  static async getChats(creatorUuid: string): Promise<FanvueChat[]> {
    return this.request('GET', `/creators/${creatorUuid}/chats`);
  }

  static async getMessages(creatorUuid: string, userUuid: string): Promise<any[]> {
    return this.request('GET', `/creators/${creatorUuid}/chats/${userUuid}/messages`);
  }

  static async getCreatorMedia(creatorUuid: string): Promise<FanvueMedia[]> {
    return this.request('GET', `/creators/${creatorUuid}/media`);
  }

  static async getTopSpenders(creatorUuid: string): Promise<any> {
    return this.request('GET', `/creators/${creatorUuid}/insights/top-spenders`);
  }

  static async getEarnings(creatorUuid: string): Promise<any> {
    return this.request('GET', `/creators/${creatorUuid}/insights/earnings`);
  }

  // --- Mock Responses ---

  private static getMockResponse(endpoint: string, method: string, data: any): any {
    if (method === 'POST' && endpoint.includes('/message')) {
      return { messageUuid: 'mock-msg-' + Date.now() };
    }
    if (method === 'GET' && endpoint.includes('/chats') && !endpoint.includes('/messages')) {
      return [
        { id: 'user-1', username: 'Fan1', lastMessage: 'Hey', unreadCount: 1 },
        { id: 'user-2', username: 'Fan2', lastMessage: 'Pic?', unreadCount: 0 },
      ];
    }
    if (method === 'GET' && endpoint.includes('/messages')) {
      return [
        { id: 'msg-1', text: 'Hey', role: 'fan', createdAt: new Date().toISOString() },
        { id: 'msg-2', text: 'Hi babe', role: 'creator', createdAt: new Date().toISOString() },
      ];
    }
    if (method === 'GET' && endpoint.includes('/media')) {
      return [
        { uuid: 'media-1', url: 'https://mock.com/1.jpg', type: 'image', tags: ['lingerie'], price: 0 },
        { uuid: 'media-2', url: 'https://mock.com/2.mp4', type: 'video', tags: ['shower'], price: 10 },
      ];
    }
    return {};
  }
}
