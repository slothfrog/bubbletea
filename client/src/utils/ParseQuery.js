// returns a json containing the path(string) and query params(json of strings)
export function parseQuery(queryString) {
    let query = {};
    if(queryString.length>1){
        const pairs =  queryString.slice(1).split('&')
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
    }
    return query
}