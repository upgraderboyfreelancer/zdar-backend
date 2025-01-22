import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

/**
 * Function to get the candidate ID associated with a given user ID.
 * @param userId - The user ID for which to fetch the candidate ID.
 * @returns A promise that resolves to the candidate ID if it exists, or null if not.
 */
export const getCandidateIdByUserId = async (userId: string): Promise<string | null> => {
  try {
    const candidate = await db.candidate.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    return candidate?.id || null;
  } catch (error) {
    // console.error('Error fetching candidate ID:', error);
    throw new Error('Failed to fetch candidate ID');
  }
};



/**
 * Function to get the company ID associated with a given user ID.
 * @param userId - The user ID for which to fetch the company ID.
 * @returns A promise that resolves to the company ID if it exists, or null if not.
 */
export const getCompanyIdByUserId = async (userId: string): Promise<string | null> => {
  try {
    const company = await db.company.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    return company?.id || null;
  } catch (error) {
    // console.error('Error fetching company ID:', error);
    throw new Error('Failed to fetch company ID');
  }
};