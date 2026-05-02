export interface HarEntry {
  request?: {
    url?: string;
    method?: string;
    headers?: { name: string; value: string }[];
    postData?: {
      text?: string;
    };
  };
  response?: {
    status?: number;
    startedDateTime?: string;
    headers?: { name: string; value: string }[];
  };
}

export interface HarFile {
  log?: {
    entries?: HarEntry[];
  };
}

export interface DetailedRequest {
  method: string;
  baseUrl: string;
  queryParams: Record<string, string>;
  headers: Record<string, string>;
  body: string | undefined;
  status: number;
  time: string;
}

// -------------------- NEW BACKEND TYPES --------------------

export interface MissingRequest {
  key: string;
  file1Count: number;
  file2Count: number;
  difference: number;
}

export interface DetailedDiff {
  key: string;

  request: {
    headers: any;
    body: any;
  };

  response: {
    headers: any;
  };
}

export interface ModifiedRequest {
  key: string;
  file1: DetailedRequest;
  file2: DetailedRequest;
  diff: DetailedDiff;
}

export interface HarResult {
  message: string;

  summary: {
    file1TotalRequests: number;
    file2TotalRequests: number;
    missingRequestGroups: number;
    modifiedRequestPairs: number;
  };

  insights: {
    missingRequests: MissingRequest[];
    modifiedRequests: ModifiedRequest[];
  };

  aiReadySummary: {
    totalDifferences: number;
    biggestChangeArea: string;
  };

  sample: {
    missingRequests: MissingRequest[];
    modifiedRequests: ModifiedRequest[];
  };
}