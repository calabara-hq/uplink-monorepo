// throw the not found error to be handled by the error handler

import { notFound } from "next/navigation"

const handleNotFound = (response: any) => {
    if (!response) notFound();
    return response;
}


export default handleNotFound;