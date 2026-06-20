import { getBaseUrl } from "../../stores/models-nb";

export interface MlpRequest {
  col1: any;
  col2: any;
  col3: any;
}

export interface LstmRequest {
  input: string;
}

export interface ModelsResponse {
  ans: number;
}

class ModelsNBService {
  static async healthCheck() {
    const response = await fetch(`${getBaseUrl()}/`);
    if (!response.ok) {
      throw new Error(`Error in health check: ${response.statusText}`);
    }
    return response.json();
  }

  static async mlp(data: MlpRequest): Promise<ModelsResponse> {
    const response = await fetch(`${getBaseUrl()}/mlp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error in MLP: ${response.statusText}`);
    }
    return response.json();
  }

  static async cnn(image: File | Blob): Promise<ModelsResponse> {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(`${getBaseUrl()}/cnn`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Error in CNN: ${response.statusText}`);
    }
    return response.json();
  }

  static async lstm(data: LstmRequest): Promise<ModelsResponse> {
    const response = await fetch(`${getBaseUrl()}/lstm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error in LSTM: ${response.statusText}`);
    }
    return response.json();
  }
}

export default ModelsNBService;
