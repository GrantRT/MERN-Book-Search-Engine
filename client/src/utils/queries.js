import { gql } from '@apollo/client';

export const GET_ME = gql`
  query getMe {
    me {
      _id
      username
      email
      bookCount
      savedBooks
    }
  }
`;

// TODO: do i need to define the specifics of "savedBooks?"
