import { defaultExtractionProfiles } from "./profiles.js";
import type { DocumentType, ExtractionProfile } from "./types.js";

export interface ExtractionProfileRegistry {
  getByDocumentType(documentType: DocumentType): ExtractionProfile;
  getById(profileId: string): ExtractionProfile;
  list(): readonly ExtractionProfile[];
}

export class InMemoryExtractionProfileRegistry implements ExtractionProfileRegistry {
  private readonly byDocumentType: Map<DocumentType, ExtractionProfile>;
  private readonly byId: Map<string, ExtractionProfile>;

  constructor(profiles: readonly ExtractionProfile[]) {
    this.byDocumentType = new Map();
    this.byId = new Map();
    for (const profile of profiles) {
      this.register(profile);
    }
  }

  static createDefault(): InMemoryExtractionProfileRegistry {
    return new InMemoryExtractionProfileRegistry(defaultExtractionProfiles);
  }

  getByDocumentType(documentType: DocumentType): ExtractionProfile {
    const profile = this.byDocumentType.get(documentType);
    if (!profile) {
      throw new Error(`No extraction profile registered for document type: ${documentType}`);
    }
    return profile;
  }

  getById(profileId: string): ExtractionProfile {
    const profile = this.byId.get(profileId);
    if (!profile) {
      throw new Error(`No extraction profile registered for profile id: ${profileId}`);
    }
    return profile;
  }

  list(): readonly ExtractionProfile[] {
    return [...this.byId.values()];
  }

  private register(profile: ExtractionProfile): void {
    if (this.byId.has(profile.id)) {
      throw new Error(`Duplicate extraction profile id: ${profile.id}`);
    }
    if (this.byDocumentType.has(profile.documentType)) {
      throw new Error(`Duplicate extraction profile document type: ${profile.documentType}`);
    }
    this.byId.set(profile.id, profile);
    this.byDocumentType.set(profile.documentType, profile);
  }
}
