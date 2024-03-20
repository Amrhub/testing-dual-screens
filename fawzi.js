const btn = document.getElementById('test')
btn.addEventListener('click', async () => {main()})
window.addEventListener('load', async () => {main()});

async function main() {
    let screenDetails;
    if (!('getScreenDetails' in self) || !('isExtended' in screen) || !('onchange' in screen)) {
        console.log("not supported");
    } else {
        screen.addEventListener('change', () => {});
        window.addEventListener('resize', () => {});

        permissionStatus = await navigator.permissions.query({ name: 'window-management' });

        console.log({permissionStatus})
        permissionStatus.addEventListener('change', (p) => {
            permissionStatus = p;
        });
    }

    if ('getScreenDetails' in self) {

        if (!screenDetails && ((permissionStatus && permissionStatus.state === 'granted') ||
            (permissionStatus && permissionStatus.state === 'prompt'))) {
            screenDetails = await getScreenDetails().catch(e => { console.error(e); return null; });
            if (screenDetails) {
                const currentScreenLeft = screenDetails.currentScreen.left;
                const otherScreen = screenDetails.screens.filter(screen => screen.left !== currentScreenLeft)[0];
                const currentScreen = screenDetails.screens.find(screen => screen.left === currentScreenLeft);
                window.open("https://dev-playerapp.intouch.com", undefined, getFeaturesFromOptions(currentScreen));
                window.open("https://dev-playerapp2.intouch.com", '_blank', getFeaturesFromOptions(otherScreen));
            }
        }
    }
}

function getFeaturesFromOptions(options) {
    return "left=" + options.left + ",top=" + options.top +
           ",width=" + options.width + ",height=" + options.height +
           (options.fullscreen ? ",fullscreen" : "");
  }
  