const btn = document.getElementById('test')
btn.addEventListener('click', async () => {main()})
window.addEventListener('load', async () => {main()});

async function main() {
    console.log("Trying Notification Permission version 1.0.0");
    let screenDetails;
    if (!('getScreenDetails' in self) || !('isExtended' in screen) || !('onchange' in screen)) {
        console.log("not supported");
    } else {
        screen.addEventListener('change', () => {});
        window.addEventListener('resize', () => {});

        try {
            console.log("🚀 querying window-management permission");
            windowManagementPermission = await navigator.permissions.query({ name: 'window-management' });
            navigationPermission = await navigator.permissions.query({ name: 'notifications' });
            console.log(`🚀 ~ window-management ~ permissionStatus:`, windowManagementPermission)
            console.log(`🚀 ~ notifications ~ permissionStatus:`, navigationPermission)
        } catch (error) {
            console.error({error});
        }
        windowManagementPermission.addEventListener('change', (p) => {
            windowManagementPermission = p;
            console.log({windowManagementPermission, navigationPermission})
        });
        navigationPermission.addEventListener('change', (p) => {
            navigationPermission = p;
            console.log({windowManagementPermission, navigationPermission})
        });
    }

    if ('getScreenDetails' in self) {

        if (!screenDetails && ((windowManagementPermission && windowManagementPermission.state === 'granted') ||
            (windowManagementPermission && windowManagementPermission.state === 'prompt'))) {
            console.log("🚀 getting screenDetails");
            screenDetails = await getScreenDetails().catch(e => { console.error(
                "🚀 ~ getScreenDetails ~ error", e); return null; });
            console.log("🚀 ~ screenDetails", screenDetails);
            if (screenDetails) {
                screenDetails.onscreenschange = (event) => {
                    console.log(`🚀 ~ screenDetails.onscreenschange ~ event:`, event)
                    console.log({
                        screensLength: event?.target?.screens?.length,
                    });
                }
                const currentScreen = screenDetails.screens.find(screen => screen.isPrimary);
                const otherScreen = screenDetails.screens.find(screen => !screen.isPrimary && screen.isExtended);
                console.log("🚀 ~ primaryScreen screenDetails", currentScreen);
                console.log("🚀 ~ secondaryScreen screenDetails", otherScreen);
                try {
                    window.open("https://dev-playerapp.intouch.com", undefined, getFeaturesFromOptions(currentScreen));
                    otherScreen && window.open("https://dev-playerapp2.intouch.com", '_blank', getFeaturesFromOptions(otherScreen));
                } catch (error) {
                    console.error({error})
                }
            }
        }
    }
}

function getFeaturesFromOptions(options) {
    return "left=" + options.left + ",top=" + options.top +
           ",width=" + options.width + ",height=" + options.height +
           (options.fullscreen ? ",fullscreen" : "");
}