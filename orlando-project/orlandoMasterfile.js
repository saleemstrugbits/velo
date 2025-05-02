// The code in this file will load on every page of your site
// import { path } from 'wix-location-frontend';
import { currentMember, authentication } from "wix-members-frontend";
import wixLocation from 'wix-location';
import { brokerDropDownData, adminDropDownData } from 'backend/header';

$w.onReady(async function () {
    try {
        const member = await currentMember.getMember();
        // console.log("member===", member);

        // console.log("path=======", wixLocation.path)
        const path = wixLocation.path;
        const routes = ['all-properties', 'favourite-properties']

        if (member) {

            const role = await currentMember.getRoles();
            const currentRole = role[0]?.title;
            $w('#profile').src = member?.profile?.profilePhoto?.url;
            $w('#name').text = member?.profile?.nickname;
            $w('#role').text = role[0]?.title
            if (currentRole == "broker") {

                $w('#manuDropDownRepeater').data = await brokerDropDownData();
                console.log("44", await brokerDropDownData())

                if (path.length > 0 && !path.includes("all-properties") && !path.includes("favourite-properties")) {
                    console.log("broker bar")
                    $w('#brokerSidebar')?.expand();

                    //logout 

                    $w('#logout').onClick(async () => {
                        try {
                            console.log("Logging out...");
                            await authentication.logout();
                            wixLocation.to("/login");
                            console.log("User logged out successfully!");
                        } catch (error) {
                            console.error("Logout failed:", error);
                        }
                    });

                }

                //broker dashboard
                const thePath = path[0] || "";
                console.log(thePath)
                if (thePath === "broker-dashboard") {
                    $w('#brokerDashBtn').style.backgroundColor = "#4fc1e9";
                    $w('#brokerDashBtn').style.color = "white";
                    $w('#brokerDashBtn').icon = "https://static.wixstatic.com/shapes/635f06_c1a641b033574967b976a38c11e614f6.svg";

                }
                if (thePath === "broker-all-properties") {
                    $w('#brokerPropertyDash').style.backgroundColor = "#4fc1e9";
                    $w('#brokerPropertyDash').style.color = "white";
                    $w('#brokerPropertyDash').icon = "https://static.wixstatic.com/shapes/635f06_d6040a3ede054ae0a0e83b4858121a1b.svg";
                }
                if (thePath === "broker-intrested-users") {
                    $w('#brokerIntrestedBtn').style.backgroundColor = "#4fc1e9";
                    $w('#brokerIntrestedBtn').style.color = "white";
                    $w('#brokerIntrestedBtn').icon = "https://static.wixstatic.com/shapes/635f06_1ca5a0913c5d490b84dac4481a6906cc.svg";
                }
                if (thePath === "members-area") {
                    $w('#brokerSetingBtn').style.backgroundColor = "#4fc1e9";
                    $w('#brokerSetingBtn').style.color = "white";
                    $w('#brokerSetingBtn').icon = "https://static.wixstatic.com/shapes/635f06_8a9e9111002f4bb090113b711af82463.svg";
                }

            }
            if (currentRole == "admin") {

                $w('#manuDropDownRepeater').data = adminDropDownData;

                if (path.length > 0 && !path.includes("all-properties") && !path.includes("favourite-properties")) {
                    console.log("adminside bar")
                    $w('#adminSidebar')?.expand();

                    //logout 

                    $w('#logout').onClick(async () => {
                        try {
                            console.log("Logging out...");
                            await authentication.logout();
                            wixLocation.to("/login");
                            console.log("User logged out successfully!");
                        } catch (error) {
                            console.error("Logout failed:", error);
                        }
                    });

                }
                console.log("admin login")

                //admin dashboard
                const thePath = path[0] || "";
                if (thePath === "admin-dashboard") {
                    $w('#adminDashBtn').style.backgroundColor = "#4fc1e9";
                    $w('#adminDashBtn').style.color = "white";
                    $w('#adminDashBtn').icon = "https://static.wixstatic.com/shapes/635f06_c1a641b033574967b976a38c11e614f6.svg";

                }
                if (thePath === "admin-broker-listing") {
                    $w('#adminPropertyDash').style.backgroundColor = "#4fc1e9";
                    $w('#adminPropertyDash').style.color = "white";
                    $w('#adminPropertyDash').icon = "https://static.wixstatic.com/shapes/635f06_d6040a3ede054ae0a0e83b4858121a1b.svg";
                }
                if (thePath === "admin-user-listing") {
                    $w('#adminIntrestedBtn').style.backgroundColor = "#4fc1e9";
                    $w('#adminIntrestedBtn').style.color = "white";
                    $w('#adminIntrestedBtn').icon = "https://static.wixstatic.com/shapes/635f06_295249e9003d4e1faa8d22c585106726.svg";
                }
                if (thePath === "admin-all-properties") {
                    $w('#allPropeties').style.backgroundColor = "#4fc1e9";
                    $w('#allPropeties').style.color = "white";
                    $w('#allPropeties').icon = "https://static.wixstatic.com/shapes/57ff9d_8aa66d3ec00b4a209189e00f60d85a13.svg";
                }
                if (thePath === "members-area") {
                    $w('#adminSetingBtn').style.backgroundColor = "#4fc1e9";
                    $w('#adminSetingBtn').style.color = "white";
                    $w('#adminSetingBtn').icon = "https://static.wixstatic.com/shapes/635f06_8a9e9111002f4bb090113b711af82463.svg";
                }
            }

            if (currentRole == "user") {
                $w('#membersLoginBar1')?.expand();
                $w('#membersLoginBar2')?.expand();
            }

            if (currentRole == "admin" || currentRole == "broker") {
                $w('#brokerMenu')?.expand();
                const brokerManuContainer = $w('#brokerManuContainer')
                $w('#brokerMenu').onClick(() => {
                    if (brokerManuContainer.collapsed) {
                        brokerManuContainer.expand();
                    } else {
                        brokerManuContainer.collapse();
                    }
                })
                $w('#manuDropDownRepeater').onItemReady(async ($item, itemData) => {
                    console.log("44")
                    $item('#dashbordProfile').src = itemData.iconUrl;
                    $item('#setting').text = itemData.label;
                     $item('#setting').onClick(()=>{
                        wixLocation.to(itemData.link)
                     })
                    console.log("item", itemData)
                })

            }

            $w('#profileImage').src = member?.profile?.profilePhoto?.url;
            $w('#fullName').text = member?.contactDetails.firstName;

            $w('#logoutStack').onClick(async () => {
                try {
                    console.log("Logging out...");
                    await authentication.logout();
                    console.log("User logged out successfully!");
                } catch (error) {
                    console.error("Logout failed:", error);
                }
            });

        }
        if (!member) {
            console.log("user not login")

            $w('#loginHeaderBtn').expand();
            // $w('#loginWhiteHeaderBtn').expand();
        }

    } catch (error) {
        console.error("Error in master file", error);
    }
});
