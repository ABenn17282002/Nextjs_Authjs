export type FieldErrors = {
    name?: string[];
    email?: string[];
    password?: string[];
    ConfirmPassword?: string[];
};

export type RegisterActionState = {
    error: Partial<FieldErrors>;
    message: string;
    success: string | null;
};
