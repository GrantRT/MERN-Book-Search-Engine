import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation loginUser($email: String, $password: String) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String, $password: String, $email: String) {
    addUser(username: $username, password: $password, email: $email) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($input: SaveBookInput) {
    saveBook(input: $input) {
      _id
      username
      bookCount
      savedBooks {
        authors
        description
        title
        bookId
        image
        link
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String) {
    removeBook(bookId: $bookId) {
      _id
      username
      bookCount
      savedBooks {
        authors
        description
        title
        bookId
        image
        link
      }
    }
  }
`;
