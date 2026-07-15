import { createClient } from "@/lib/supabase";

export type UploadTarget = "oficial" | "ejemplo";

export interface SessionUpload {
  filename: string;
  getBlob: () => Blob | Promise<Blob>;
}

export const uploadSession = async (
  target: UploadTarget,
  filename: string,
  blob: Blob,
) => {
  const { error } = await createClient()
    .storage.from("data")
    .upload(`${target}/${filename}`, blob, { upsert: true });
  if (error) throw new Error(error.message);
};

export const downloadSession = async (
  target: UploadTarget,
  filename: string,
): Promise<File> => {
  const { data, error } = await createClient()
    .storage.from("data")
    .download(`${target}/${filename}`);
  if (error) throw new Error(error.message);
  return new File([data], filename);
};

export const jsonBlob = (data: unknown) =>
  new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
