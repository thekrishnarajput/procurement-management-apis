export const Status = {
    // Status enums
    activeStatus: 1 as const,
    inactiveStatus: 2 as const,
    deletedStatus: 3 as const,
    blockedStatus: 5 as const,
} as const;


export const AssignUnassignStatus = {
    // Assign/Unassign status
    assignedStatus: 1 as const,
    unassignedStatus: 2 as const,
    changingProcurementManager: 3 as const
} as const;