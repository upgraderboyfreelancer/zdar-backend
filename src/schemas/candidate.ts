import { z } from 'zod';

export const ApplyJobSchema = z.object({
  jobId: z.number(),
});

