import axios from "axios";
import Hasher from "./hasher";

export enum VexillaFeatureType {
  TOGGLE = "toggle",
  GRADUAL = "gradual",
  SELECTIVE = "selective",
}

export interface VexillaToggleFeature {
  type: VexillaFeatureType.TOGGLE;
  value: boolean;
}

export interface VexillaGradualFeature {
  type: VexillaFeatureType.GRADUAL;
  value: number;
  seed: number;
}

export interface VexillaSelectiveFeature {
  type: VexillaFeatureType.SELECTIVE;
}

export interface VexillaFeatureSet {
  [key: string]:
    | VexillaToggleFeature
    | VexillaGradualFeature
    | VexillaSelectiveFeature;
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
  private customInstanceHash = "";

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
        flag = flag as VexillaGradualFeature;
        _should = this.getInstancePercentile(flag.seed) <= flag.value;
        break;

      default:
        throw Error(`Unsupported Feature Type: ${flag.type}`);
    }

    return _should;
  }

  private getInstancePercentile(seed: number) {
    if (seed <= 0 || seed > 1) {
      throw new Error(
        "seed must be a number value greater than 0 and less than or equal to 1"
      );
    }

    if (!this.customInstanceHash) {
      throw new Error(
        "customInstanceHash config must be defined when using 'gradual' Feature Types"
      );
    }

    const hasher = new Hasher(seed);

    return hasher.hashString(this.customInstanceHash);
  }
}
