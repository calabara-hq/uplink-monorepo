
type ISODateString = string

export interface Session {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    expires: ISODateString;
}


export default async function getSession() {
    /*
    return await fetch(`${process.env.NEXT_PUBLIC_HUB_URL}/auth/session`)
        .then(res => res.json())
        .then(res => {

        })
        */
    return {
        status: 'unauthenticated',
        user: {
            address: '0x12345'
        }
    }
}