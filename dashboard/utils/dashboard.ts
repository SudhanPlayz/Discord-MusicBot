export interface IDashboard {
    commandsRan: number;
    users: number;
    servers: number;
    songsPlayed: number;
}

export const getDashboard: () => Promise<IDashboard> = () => {
    return new Promise(async (resolve, _reject) => {
        let data = await fetch("/api/dashboard", {
            method: "GET",
	    credentials: "same-origin",
        });
        let json = await data.json();
        resolve(json);
    })
}
