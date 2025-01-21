export interface RegisterPayloadType {
    username: string, email: string, password: string, roleId: number, isVerified: boolean
}

export interface IInstitution {
    name: string;
    address: string;
    phone: string;
    email: string;
    headName: string
    headNIP: string;
    licenseDocument: string;
    description: string;
}