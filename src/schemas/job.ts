import { z } from 'zod';

export const JobSchema = z.object({
  positionName: z.string().min(1, "Position name is required"),
  jobOffer: z.string().min(1, "Job offer description is required"),
  contractType: z.string().min(1, "Contract type is required"),
  genderPref: z.string().optional(),
  disable: z.boolean(),
  ageLimit: z.string().optional(),
  experience: z.string().min(1, "Experience requirement is required"),
  annualSalary: z.string().min(1, "Annual salary is required"),
  monthly: z.string().optional(),
  hardSkills: z.array(z.string()),
  softSkills: z.array(z.string()),
});

export const JobSearchSchema = z.object({
  query: z.string().optional(),
  contractType: z.string().optional(),
  experience: z.string().optional(),
  // Add more search parameters as needed
});

