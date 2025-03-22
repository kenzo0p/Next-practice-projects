import { IVideos } from "@/models/Video";
import { I18NProvider } from "next/dist/server/lib/i18n-provider";
export type VideoFormData = Omit<IVideos, "_id">;
type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;
    const defaultHeaders = {
      "content-type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getVideo() {
    return this.fetch<IVideos[]>("/videos");
  }

  async getAVideos(id: string) {
    return this.fetch<IVideos>(`/videos/${id}`);
  }

  async createVideo(videoData: VideoFormData) {
    return this.fetch("/videos", {
      method: "POST",
      body: videoData,
    });
  }
}

export const apiClient = new ApiClient();
