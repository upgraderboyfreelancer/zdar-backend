import { z } from 'zod';

export const ProfileSchema = z.object({
  pic: z.string().min(1, { message: "Photo is required" }),
  linkedIn: z.string().url({ message: "Please enter a valid LinkedIn URL" }),
  countryName: z.string().min(1, { message: "Country is required" }),
  cityName: z.string().min(1, { message: "City is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  gender: z.string().min(1, { message: "Title is required" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  presentation: z.string().min(10, { message: "Presentation must be at least 10 characters" }),
  contractType: z.string().min(1, { message: "Contract type is required" }),
  sectorPref: z.string().min(1, { message: "Sector preference is required" }),
  positionName: z.string().min(1, { message: "Position is required" }),
  disability: z.string().min(1, { message: "This field is required" }),
  age: z.string().min(1, { message: "Age is required" }),
  experience: z.string().min(1, { message: "Experience is required" }),
  salaryExpectation: z.string().min(1, { message: "Salary expectation is required" }),
})