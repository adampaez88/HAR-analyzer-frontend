import type { HarResult } from "../types";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export const compareHarFiles = async (
  fileA: File,
  fileB: File
): Promise<HarResult> => {
  const formData = new FormData();
  formData.append("file1", fileA);
  formData.append("file2", fileB);

  const response = await fetch(
    `${BASE_URL}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Upload failed"
    );
  }

  return data.data;
};