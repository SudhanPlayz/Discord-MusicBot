export interface IDashboard {
    commandsRan: number;
    users: number;
    servers: number;
    songsPlayed: number;
}

// export const getDashboard: () => Promise<IDashboard> = () => {
//     return new Promise(async (resolve, _reject) => {
//         let json = await apiCall("GET", "/dashboard", {
//             credentials: "same-origin",
//         }).then(async ({data}) => {
//             return await data;
//         });
//         resolve(json);
//     })
// }
