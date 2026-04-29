export interface RequestEntry {
  status: number;
}

export interface WorstEndpointItem {
  url: string;
  file1: {
    failureRate: number;
  };
  file2?: {
    failureRate: number;
  };
}

export interface MismatchItem {
  url: string;
  file1Requests: RequestEntry[];
  file2Requests: RequestEntry[];
}

export interface SummaryData {
  file1TotalRequests: number;
  file2TotalRequests: number;
  statusMismatches: number;
  uniqueUrlsFile1: number;
}

export interface HarResult {
  summary: SummaryData;
  insights: {
    worstEndpoints: WorstEndpointItem[];
  };
  sample: {
    statusMismatches: MismatchItem[];
  };
}

export interface DiffRow {
  index: number;
  req1?: RequestEntry;
  req2?: RequestEntry;
  result: string;
}

export type WorstSortField = "url" | "failure";
export type MismatchSortField = "url" | "count";