import { z } from 'zod';

export const UpdateApplicantStatusSchema = z.object({
  status: z.enum(['pending', 'shortlisted', 'rejected']),
});

