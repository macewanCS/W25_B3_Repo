const backendUrl = "https://lyrne.mrnavastar.me"

//TODO: add some form of caching to this class to reduce lookups and improve the app responsiveness

export async function makeBackendRequest(session: any, method: string, endpoint: string, body: any): Promise<any> {
    if (!session.jwt) {
        throw new Error(`Invalid token: ${session.jwt}`);
    }

    const response = await fetch(backendUrl + endpoint, {
        method: method,
        headers: {
            "Authorization": `${session.jwt}`,
            "Content-Type": "application/json"
        },
        body: body
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
}

export async function fetchUserData(session: any): Promise<any> {
    return makeBackendRequest(session, "GET", "/api/private/user", "")
}

export async function updateUserData(data: any, session: any): Promise<any> {
    return makeBackendRequest(session, "POST", "/api/private/user", JSON.stringify(data))
}

export async function fetchTutors(session: any): Promise<any> {
    return makeBackendRequest(session, "GET", "/api/private/tutors", "")
}

// Will return a json response with the filename that can be used to fetch the image
export async function uploadImage(session: any, image: any): Promise<any> {
    const form = new FormData();
    form.append('image', image);
    return makeBackendRequest(session, "POST", "/api/private/cdn/api/cdn/upload/image", form)
}

export async function getImage(session: any, imageName: string): Promise<any> {
    return makeBackendRequest(session, "GET", "/api/private/cdn/api/cdn/download/images/" + imageName, "");
}

// Will return a json response with the filename that can be used to fetch the document
export async function uploadDocument(session: any, image: any): Promise<any> {
    const form = new FormData();
    form.append('doc', image);
    return makeBackendRequest(session, "POST", "/api/private/cdn/api/cdn/upload/doc", form)
}

export async function getDocument(session: any, imageName: string): Promise<any> {
    return makeBackendRequest(session, "GET", "/api/private/cdn/api/cdn/download/docs/" + imageName, "");
}