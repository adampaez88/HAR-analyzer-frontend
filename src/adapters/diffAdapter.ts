export type DiffItem = {
  key: string;
  value?: any;
  from?: any;
  to?: any;
};

export type DiffSection = {
  added: DiffItem[];
  removed: DiffItem[];
  changed: DiffItem[];
};

export type NormalizedModifiedRequest = {
  key: string;

  file1: any;
  file2: any;

  timing?: {
    file1: number;
    file2: number;
    delta: number;
  };

  diff: {
    headers: DiffSection;
    body: DiffSection;
    cookies: DiffSection;

    responseHeaders: DiffSection;
    responseCookies: DiffSection;
  };
};

function empty(): DiffSection {
  return {
    added: [],
    removed: [],
    changed: [],
  };
}

export function adaptModifiedRequest(
  raw: any
): NormalizedModifiedRequest {
  return {
    key: raw.key,

    file1: raw.file1,
    file2: raw.file2,

    timing: raw.timing,

    diff: {
      headers:
        raw.diff?.request?.headers || empty(),

      body:
        raw.diff?.request?.body || empty(),

      cookies:
        raw.diff?.request?.cookies || empty(),

      responseHeaders:
        raw.diff?.response?.headers || empty(),

      responseCookies:
        raw.diff?.response?.cookies || empty(),
    },
  };
}

export function adaptModifiedRequests(
  requests: any[]
): NormalizedModifiedRequest[] {
  return requests.map(adaptModifiedRequest);
}