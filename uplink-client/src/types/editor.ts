import type { OutputData } from "@editorjs/editorjs";
import { z } from "zod";

export const EditorOutputSchema: z.ZodType<OutputData> = z.any();
export type EditorOutput = z.infer<typeof EditorOutputSchema>;