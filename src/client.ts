import axios from "axios";

export interface VexillaToggleFeature {
  type: "toggle";
  value: boolean;
}

export interface VexillaGradualFeature {
  type: "gradual";
  value: number;
}

export interface VexillaFeatureSet {
  [key: string]: VexillaToggleFeature | VexillaGradualFeature;
}

export interface VexillaEnvironment {
  [key: string]: VexillaFeatureSet;
}

export class VexillaClient {
  baseUrl: string;
  environment: string;

  flags: VexillaFeatureSet;

  constructor(baseUrl: string, environment: string) {
    this.baseUrl = baseUrl;
    this.environment = environment;
  }

  async getFlags(fileName: string) {
    const flags: any = await axios.get(`${this.baseUrl}/${fileName}`);

    this.flags = flags[this.environment].features;

    return this;
  }
}
