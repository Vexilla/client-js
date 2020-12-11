import axios from "axios";

enum VexillaFeatureType {
  TOGGLE = "toggle",
  GRADUAL = "gradual",
}

export interface VexillaToggleFeature {
  type: VexillaFeatureType.TOGGLE;
  value: boolean;
}

export interface VexillaGradualFeature {
  type: VexillaFeatureType.GRADUAL;
  value: number;
}

export interface VexillaFeatureSet {
  [key: string]: VexillaToggleFeature | VexillaGradualFeature;
}

export interface VexillaEnvironment {
  [key: string]: VexillaFeatureSet;
}

export interface VexillaClientConfig {
  baseUrl: string;
  environment: string;
  customInstanceHash?: string;
}

export class VexillaClient {
  private baseUrl: string;
  private environment: string;
  private customInstanceHash: string;

  flags: VexillaFeatureSet;

  constructor(config: VexillaClientConfig) {
    this.baseUrl = config.baseUrl;
    this.environment = config.environment || "prod";
    this.customInstanceHash = config.customInstanceHash;
  }

  async getFlags(fileName: string) {
    const flagsResponse: any = await axios.get(`${this.baseUrl}/${fileName}`);
    const flags = flagsResponse.data;
    this.flags = flags.environments[this.environment];

    return this;
  }

  should(flagName: string, groupName = "untagged") {
    if (!this.flags) {
      return false;
    }

    let flag = this.flags[groupName][flagName];

    let _should = false;
    switch (flag.type) {
      case VexillaFeatureType.TOGGLE:
        _should = flag.value;
        break;

      case VexillaFeatureType.GRADUAL:
        flag = flag as VexillaToggleFeature;
        _should = this.getInstancePercentile() <= flag.value;
        break;

      default:
        throw Error(`Unsupported Feature Type: ${flag.type}`);
    }

    return _should;
  }

  private getInstancePercentile() {
    let instanceHash = "42";
    if (this.customInstanceHash) {
      instanceHash = this.customInstanceHash;
    }

    return this.magicInstanceHashingFunction(instanceHash);
  }

  private magicInstanceHashingFunction(instanceHash: string): number {
    return 42;
  }
}
