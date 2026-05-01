import type { HarResult } from "../types";

export const compareHarFiles = async (
  fileA: File,
  fileB: File
): Promise<HarResult> => {
  const formData = new FormData();
  formData.append("file1", fileA);
  formData.append("file2", fileB);

  const response = await fetch(
    "http://localhost:3000/upload",
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