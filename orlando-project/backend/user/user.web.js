import { Permissions, webMethod } from "wix-web-module";
import wixData from 'wix-data';
//  import { members } from "@wix/members";
import { members } from "wix-members.v2";
import { authentication } from "wix-members-backend";
import { elevate } from "wix-auth";


//  import { elevate } from 'wix-auth';

const dbNameofIntrestedUser = "UserListing"
const dbNameofMembers = "Members/FullData";

export const addIntrestedUser = webMethod(
    Permissions.Anyone,
    async (input) => {
        try {
            return await wixData.insert(dbNameofIntrestedUser, input)
        } catch (error) {
            throw new Error(error)
        }
    }
);

export const updateIntrestedUser = webMethod(
    Permissions.Anyone,
    async (IntrestedUserId, updatedData) => {
        try {
            let existingIntrestedUser = await wixData.get(dbNameofIntrestedUser, IntrestedUserId);

            if (!existingIntrestedUser) {
                throw new Error("IntrestedUser not found.");
            }

            // Merge existing data with updated data
            const updatedIntrestedUser = { ...existingIntrestedUser, ...updatedData };

            // Save the updated IntrestedUser
            await wixData.update(dbNameofIntrestedUser, updatedIntrestedUser);

            return `IntrestedUser ${IntrestedUserId} updated successfully.`;
        } catch (error) {
            throw new Error(`Error updating IntrestedUser: ${error.message}`);
        }
    }
);

export const getIntrestedUser = webMethod(
    Permissions.Anyone,
    async (id) => {
        try {
            const res = await wixData.get(dbNameofIntrestedUser, id)
            if (res) {
                return res
            } else {
                throw new Error("Not found")
            }
        } catch (error) {
            throw new Error(error)
        }
    }
);

export const getIntrestiedUserListByBrokerId = webMethod(
    Permissions.Anyone,
    async (id) => {
        try {
            const res = await wixData.query(dbNameofIntrestedUser)
                .eq("brokerId", id)
                .limit(1000)
                .find();

            if (res) {
                return res
            } else {
                throw new Error("Not found")
            }
        } catch (error) {
            throw new Error(error)
        }
    }
);

export const getPropertiesByBrokerSlug = webMethod(
    Permissions.Anyone,
    async (slug) => {
        try {
            const res = await wixData.query(dbNameofIntrestedUser)
                .eq("link-all-properties-1-title", "/" + slug)
                .find();

            if (res) {
                return res
            } else {
                throw new Error("Not found")
            }
        } catch (error) {
            throw new Error(error)
        }
    }
);

export const getBrokerPendingProperties = webMethod(
    Permissions.Anyone,
    async (id) => {
        try {
            const res = await wixData.query(dbNameofIntrestedUser)
                .eq("brokerId", id)
                .eq("status", "pending")
                .limit(1000)
                .find();

            if (res) {
                return res
            } else {
                throw new Error("Not found")
            }
        } catch (error) {
            throw new Error(error)
        }
    }
);

export const getBrokerActiveProperties = webMethod(
    Permissions.Anyone,
    async (id) => {
        try {
            const res = await wixData.query(dbNameofIntrestedUser)
                .eq("brokerId", id)
                .eq("status", "active")
                .limit(1000)
                .find();

            if (res) {
                return res
            } else {
                throw new Error("Not found")
            }
        } catch (error) {
            throw new Error(error)
        }
    }
);

export const deleteIntrestedUser = webMethod(
    Permissions.Anyone,
    async (IntrestedUserId) => {
        try {

            // delete IntrestedUser record
            const IntrestedUserDeletd = await wixData.remove(dbNameofIntrestedUser, IntrestedUserId);
            return IntrestedUserDeletd;

        } catch (error) {
            throw new Error(`Error deleteing IntrestedUser: ${error.message}`);
        }
    }
);

export const getAllMembers = webMethod(
    Permissions.Anyone,
    async () => {
        try {
            let options = { "suppressAuth": true };
            const usersData = await wixData.query(dbNameofMembers).find(options)
            return usersData
        } catch (error) {
            console.log("error", error)
            throw new Error(error)
        }
    }
);

export const approveMember = webMethod(
    Permissions.SiteMember,
    async (id) => {
        try {
            const response = await members.approveMember(id);
            return response
        } catch (error) {
            console.log("error", error)
            throw new Error(error)
        }
    }
);

export const approveMemberByEmail = webMethod(
    Permissions.Anyone,
    (email) => {
        return authentication
            .approveByEmail(email)
            .then((sessionToken) => {
                return {
                    sessionToken: sessionToken,
                    approved: true,
                };
            })
            .catch((error) => {
                return {
                    approved: false,
                    reason: error,
                };
            });
    },
);

export const blockMemberByEmail = webMethod(Permissions.Anyone, (email) => {
    return authentication
        .blockByEmail(email)
        .then(() => {
            return "Email blocked from site membership";
        })
        .catch((error) => {
            console.log(error)
            throw new Error("There is Error Please Try later");
        });
});

//  export const deleteMember = webMethod(Permissions.Anyone, (id) => {
//      let options = { id, "suppressAuth": true };
//      return members
//          .deleteMember(id, options)
//          .then(() => {
//              return "Member deleted";
//          })
//          .catch((error) => {
//              throw new Error(error);
//          });
//  });

const elevatedDeleteMember = elevate(members.deleteMember);


export const deleteMember = webMethod(
 Permissions.Anyone,
 async (_id) => {
   try {
     const deletedMember = await elevatedDeleteMember(_id);
     console.log("Deleted member:", deletedMember);

     return "Member deleted";
   } catch (error) {
    throw new Error(error);
     // Handle the error
   }
 },
);
