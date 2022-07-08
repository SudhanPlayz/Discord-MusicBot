export interface ICommand {
    name: string;
    description: string;
}

export interface IData {
    name: string;
    version: string;
    commands: ICommand[]
    inviteURL: string;
}

export const getData: () => Promise<IData> = () => {
    return new Promise(async (resolve, _reject) => {
        let data = await fetch("/api/data", {
            method: "GET"
        })
        resolve(await data.json())
    });
}