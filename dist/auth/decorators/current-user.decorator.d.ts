export interface CurrentUserPayload {
    id: number;
    email: string;
    role: string;
    fullName: string;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
