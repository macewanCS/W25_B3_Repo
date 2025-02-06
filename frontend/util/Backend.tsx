import {useSession} from "@/components/Context";

const backendUrl = "https://lyrne.mrnavastar.me"

export async function fetchUserData(): Promise<any> {
    const { signIn, session } = useSession();

    if (!session.jwt) {
        throw new Error(`Invalid token: ${session.jwt}`);
    }

    console.log(session.jwt);

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
