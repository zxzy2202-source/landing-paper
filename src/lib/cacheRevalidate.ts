import { revalidatePath, revalidateTag } from "next/cache";

function isStaticGenerationStoreMissing(error: unknown) {
  return (
    error instanceof Error &&
    error.message.includes("static generation store missing")
  );
}

export function safeRevalidateTag(tag: string) {
  try {
    revalidateTag(tag, "max");
  } catch (error) {
    if (!isStaticGenerationStoreMissing(error)) {
      throw error;
    }
  }
}

export function safeRevalidatePath(pathname: string) {
  try {
    revalidatePath(pathname);
  } catch (error) {
    if (!isStaticGenerationStoreMissing(error)) {
      throw error;
    }
  }
}
