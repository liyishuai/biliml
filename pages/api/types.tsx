type entryType = {
    mid: number;
    uname: string;
}

type listType = {
    list: entryType[];
}

type jsonResponse = {
    code: number;
    message: string;
    data: listType;
}
