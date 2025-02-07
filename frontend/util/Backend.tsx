import {useSession} from "@/components/Context";

const backendUrl = "https://lyrne.mrnavastar.me"

//TODO: add some form of caching to this class to reduce lookups and improve the app responsiveness

export async function fetchUserData(session: any): Promise<any> {
    if (!session.jwt) {
        throw new Error(`Invalid token: ${session.jwt}`);
    }

    try {
        const response = await fetch(backendUrl + "/api/private/user", {
            method: "GET",
            headers: {
                "Authorization": `${session.jwt}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

export async function updateUserData(data: any, session: any): Promise<any> {
    if (!session.jwt) {
        throw new Error(`Invalid token: ${session.jwt}`);
    }

    try {
        const response = await fetch(backendUrl + "/api/private/user", {
            method: "POST",
            headers: {
                "Authorization": `${session.jwt}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error pushing user data:", error);
        throw error;
    }
}