export function getParam(p) {
    var url = new URL(window.location.href);
    return url.searchParams.get(p);
}