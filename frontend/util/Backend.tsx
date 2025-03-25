const backendUrl = "https://lyrne.mrnavastar.me"

//TODO: add some form of caching to this class to reduce lookups and improve the app responsiveness

export async function makeBackendRequest(session: any, method: string, endpoint: string, body: any, params: string): Promise<any> {
    if (!session.jwt) {
        throw new Error(`Invalid token: ${session.jwt}`);
    }

    const response = await fetch(backendUrl + endpoint + params, {
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

export async function fetchSubjects(session: any): Promise<any[]> {
    return makeBackendRequest(session, "GET", "/api/subjects", "", "")
}

export async function fetchUserData(session: any): Promise<any> {
    return makeBackendRequest(session, "GET", "/api/private/user", "", "")
}

export async function updateUserData(data: any, session: any): Promise<any> {
    return makeBackendRequest(session, "POST", "/api/private/user", JSON.stringify(data), "")
}

export async function fetchTutors(session: any, offset: int, subject: string): Promise<any> {
    return makeBackendRequest(session, "GET", "/api/private/tutors", "", "?" + new URLSearchParams({
        offset: offset,
        subject: subject,
    }));
}

function parseCdnResponse(data: any) {
    return data["file_url"].replace("http://localhost:8080", "https://lyrne.mrnavastar.me/api/private/cdn");
}

export async function uploadImage(session: any, image: any): Promise<any> {
    const form = new FormData();
    form.append('image', image);
    return parseCdnResponse(makeBackendRequest(session, "POST", "/api/private/cdn/api/cdn/upload/image", form, ""))
}

export async function getImage(session: any, imageName: string): Promise<any> {
    return parseCdnResponse(makeBackendRequest(session, "GET", "/api/private/cdn/api/cdn/download/images/" + imageName, "", ""))
}

export async function uploadDocument(session: any, image: any): Promise<any> {
    const form = new FormData();
    form.append('doc', image);
    return parseCdnResponse(makeBackendRequest(session, "POST", "/api/private/cdn/api/cdn/upload/doc", form, ""))
}

export async function getDocument(session: any, imageName: string): Promise<any> {
    return parseCdnResponse(makeBackendRequest(session, "GET", "/api/private/cdn/api/cdn/download/docs/" + imageName, "", ""))
}
