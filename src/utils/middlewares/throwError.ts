export const ErrData = (statusCode: number, message: string, data: any) => {
    let error: any = new Error(message);
    error.statusCode = statusCode;
    error.data = data;
    throw error;
}