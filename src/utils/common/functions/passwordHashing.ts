import bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
    let salt = await bcrypt.genSalt(12);
    let hash = await bcrypt.hash(password, salt);
    return hash;
}

export const comparePassword = async (enteredPassword: string, dbPassword: string): Promise<Boolean> => {
    let compareResult = await bcrypt.compare(enteredPassword, dbPassword);
    return compareResult;
}