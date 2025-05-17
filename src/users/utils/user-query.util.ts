import { UserSearchQuery } from '../dto/search-user.dto';

export const buildUserSearchQuery = (query: UserSearchQuery) => {
  const { firstName, lastName, age } = query;
  const values: any[] = [];
  const conditions: string[] = [];

  if (firstName) {
    values.push(`%${firstName}%`);
    conditions.push(`first_name ILIKE $${values.length}`);
  }

  if (lastName) {
    values.push(`%${lastName}%`);
    conditions.push(`last_name ILIKE $${values.length}`);
  }

  if (age !== undefined) {
    values.push(age);
    conditions.push(`age = $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  return { whereClause, values };
};
