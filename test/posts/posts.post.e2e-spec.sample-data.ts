import { faker } from '@faker-js/faker';

export const completePost = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: 'Password123#',
};