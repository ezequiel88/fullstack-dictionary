export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignUpRequest extends SignInRequest {
    password: string;
}