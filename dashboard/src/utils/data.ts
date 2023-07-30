// !TODO: move these to interfaces when needs to be used
export interface ICommand {
    name: string;
    description: string;
}

export interface IData {
    name: string;
    version: string;
    commands: ICommand[];
    inviteURL: string;
    loggedIn: boolean | null;
    redirect: string | null;
}

// export const getData: () => Promise<IData> = () => {
//     return new Promise(async (resolve, _reject) => {
//         let commands = await (apiCall("GET", "/commands", {
//             method: "GET"
//         })).then(async ({data} = {}) => {
//             return await data;
//         });
//         resolve(await commands)
//     });
// }
