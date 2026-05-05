export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  groupId?: string;
}

export interface Group {
  id: string;
  name: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  number?: string;
  position?: string;
}

export interface Match {
  id: string;
  teamAId: string;
  teamBId: string;
  scoreA: number;
  scoreB: number;
  date: string;
  time: string;
  status: 'scheduled' | 'live' | 'finished';
  stage: string;
}

export interface Gallery {
  id: string;
  url: string;
  caption?: string;
  date: string;
}
