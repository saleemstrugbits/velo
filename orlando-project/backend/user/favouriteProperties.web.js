import { Permissions, webMethod } from "wix-web-module";
import wixData from 'wix-data';

const dbName = "FavoriteProperties" //FavoriteProperties user table name

export const addFavoriteProperties = webMethod(
    Permissions.Anyone,
    async (input) => {
        try {
            return await wixData.insert(dbName, input)
        } catch (error) {
            throw new Error(error)
        }
    }
);

//  export const updateIntrestedProperty = webMethod(
//      Permissions.Anyone,
//      async (propertyId, updatedData) => {
//          try {
//              let existingProperty = await wixData.get(dbName, propertyId);

//              if (!existingProperty) {
//                  throw new Error("Property not found.");
//              }

//              // Merge existing data with updated data
//              const updatedProperty = { ...existingProperty, ...updatedData };

//              // Save the updated property
//              await wixData.update(dbName, updatedProperty);

//              return `Property ${propertyId} updated successfully.`;
//          } catch (error) {
//              throw new Error(`Error updating property: ${error.message}`);
//          }
//      }
//  );

//  export const getProperty = webMethod(
//      Permissions.Anyone,
//      async (id) => {
//          try {
//              const res = await wixData.get(dbName, id)
//              if (res) {
//                  return res
//              } else {
//                  throw new Error("Not found")
//              }
//          } catch (error) {
//              throw new Error(error)
//          }
//      }
//  );

export const getFavoriteProperties = webMethod(
    Permissions.Anyone,
    async () => {
        try {
            const res = await wixData.query(dbName)
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

//   export const getActiveProperties = webMethod(
//      Permissions.Anyone,
//      async () => {
//          try {
//              const res = await wixData.query(dbName)
//                  .eq("status", "Active")
//                  .find();

//              if (res) {
//                  return res
//              } else {
//                  throw new Error("Not found")
//              }
//          } catch (error) {
//              throw new Error(error)
//          }
//      }
//  );

export const findFavoriteProperties = webMethod(
    Permissions.Anyone,
    async (userId, propertyId) => {
        try {
            const res = await wixData.query(dbName)
                .eq("userId", userId)
                .eq("propertyId", propertyId)
                .find();

            if (res) {
                return res.items[0]
            } else {
                return "not Found"
            }
        } catch (error) {
            throw new Error(error)
        }
    }
);

//  export const getPropertiesByBrokerSlug = webMethod(
//      Permissions.Anyone,
//      async (slug) => {
//          try {
//              const res = await wixData.query(dbName)
//                  .eq("link-all-properties-1-title", "/" + slug)
//                  .find();

//              if (res) {
//                  return res
//              } else {
//                  throw new Error("Not found")
//              }
//          } catch (error) {
//              throw new Error(error)
//          }
//      }
//  );

//  export const getBrokerPendingProperties = webMethod(
//      Permissions.Anyone,
//      async (id) => {
//          try {
//              const res = await wixData.query(dbName)
//                  .eq("brokerId", id)
//                  .eq("status", "pending")
//                  .limit(1000)
//                  .find();

//              if (res) {
//                  return res
//              } else {
//                  throw new Error("Not found")
//              }
//          } catch (error) {
//              throw new Error(error)
//          }
//      }
//  );

//  export const getBrokerActiveProperties = webMethod(
//      Permissions.Anyone,
//      async (id) => {
//          try {
//              const res = await wixData.query(dbName)
//                  .eq("brokerId", id)
//                  .eq("status", "active")
//                  .limit(1000)
//                  .find();

//              if (res) {
//                  return res
//              } else {
//                  throw new Error("Not found")
//              }
//          } catch (error) {
//              throw new Error(error)
//          }
//      }
//  );

 export const deleteFavoriteProperties = webMethod(
     Permissions.Anyone,
     async (id) => {
         try {

             // delete property record
             const propertyDeletd = await wixData.remove(dbName, id);
             return propertyDeletd;

         } catch (error) {
             throw new Error(`Error deleteing property: ${error.message}`);
         }
     }
 );