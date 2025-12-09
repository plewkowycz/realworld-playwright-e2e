export interface ApiUserRegistration {
  user: {
    username: string;
    email: string;
    password: string;
  };
}

export interface ApiUserResponse {
  user: {
    email: string;
    username: string;
    bio: string | null | '';
    image: string | null;
    token: string;
  };
}

export interface ApiUserLogin {
  user: {
    email: string;
    password: string;
  };
}
