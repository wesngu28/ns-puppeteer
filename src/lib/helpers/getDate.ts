export function getDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.toLocaleString('default', { month: 'long' });
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const formattedDate = `${month} ${day}, ${year}, ${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}` ;
    return formattedDate
}