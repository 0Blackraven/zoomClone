declare const UsernameEmailAvailibility: (usernameEmail: string, emailOrNot: boolean) => Promise<boolean>;
declare const registerUser: (usernameEmail: string, emailOrNot: boolean, password: string) => Promise<any>;
declare const getUser: (usernameEmail: string, emailOrNot: boolean) => Promise<any>;
declare const updateTokens: (usernameEmail: string, emailOrNot: boolean, refreshToken?: string, accessToken?: string) => Promise<void>;
declare const changePassword: (usernameEmail: string, emailOrNot: boolean, password: string) => Promise<void>;
export { getUser, registerUser, UsernameEmailAvailibility, updateTokens, changePassword };
//# sourceMappingURL=userQueries.d.ts.map