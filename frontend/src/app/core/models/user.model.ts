export interface User {
  id: number;
  nom: string;
  email: string;
  role: 'ADMIN' | 'PATIENT';
}

export interface ApiAuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    utilisateur: User;
  };
}
