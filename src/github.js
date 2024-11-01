const LOCAL_URL = "http://127.0.0.1:5500/";
const PRODUCTION_URL = "https://exafrost.github.io/CSS-cheatpage/";

export function valid_domain() {
    const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    return isLocal ? LOCAL_URL : PRODUCTION_URL;
}

export function absolute_path() {
    const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    return isLocal ? "" : "/CSS-cheatpage";
}
