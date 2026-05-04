// src/adapters/diffAdapter.ts

import type { ModifiedRequest } from "../types";

/**
 * UI-safe normalized diff section
 */
export type NormalizedDiffSection = {
  added: any[];
  removed: any[];
  changed: {
    key: string;
    from: any;
    to: any;
  }[];
};

/**
 * Fully normalized request diff for UI
 */
export type NormalizedRequestDiff = {
  headers: NormalizedDiffSection;
  body: NormalizedDiffSection;
  responseHeaders: NormalizedDiffSection;
};

/**
 * Final UI model
 */
export type NormalizedModifiedRequest = {
  key: string;
  file1: any;
  file2: any;
  diff: NormalizedRequestDiff;
};

/**
 * Safe fallback
 */
const emptySection = (): NormalizedDiffSection => ({
  added: [],
  removed: [],
  changed: [],
});

/**
 * Normalize backend DiffResult → UI-safe section
 */
function normalizeSection(section: any): NormalizedDiffSection {
  if (!section) return emptySection();

  return {
    added: section.added ?? [],
    removed: section.removed ?? [],
    changed:
      section.changed?.map((c: any) => ({
        key: c.key,
        from: c.from,
        to: c.to,
      })) ?? [],
  };
}

/**
 * Convert backend ModifiedRequest → UI-safe structure
 */
export function adaptModifiedRequest(
  request: ModifiedRequest
): NormalizedModifiedRequest {
  return {
    key: request.key,
    file1: request.file1,
    file2: request.file2,
    diff: {
      headers: normalizeSection(request.diff?.request?.headers),
      body: normalizeSection(request.diff?.request?.body),
      responseHeaders: normalizeSection(
        request.diff?.response?.headers
      ),
    },
  };
}

/**
 * Batch adapter
 */
export function adaptModifiedRequests(
  requests: ModifiedRequest[]
): NormalizedModifiedRequest[] {
  return requests.map(adaptModifiedRequest);
}