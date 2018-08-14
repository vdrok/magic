export const restrictions = {
    teamManagement: {
        permissions: {
            value: ['ROLE_ADMIN'],
            message: "You don't have permission to manage the team"
        }
    },
    postApproval: {
       permissions: {
           value: ['ROLE_APPROVAL'],
           message: "You don't have permission to approve content"
       }
    },
    analytics: {
        permissions: {
            value: ['ROLE_ANALYTICS'],
            message: "You don't have permission to access analytics section"
        }
    }
};

export function isAllow(currentClient, restrictionsKey) {
    if (!restrictions[restrictionsKey]) {
        return false;
    }

    //@TODO. Current logged in users will not contain permissions array. Should we allow them?
    if (!currentClient || !currentClient.permissions) {
        return true;
    }

    if (currentClient.permissions.includes('ROLE_ADMIN')) {
        return true;
    }

    const {permissions} = restrictions[restrictionsKey]

    return permissions.value.filter(item => currentClient.permissions.includes(item)).length >= permissions.value.length;
}