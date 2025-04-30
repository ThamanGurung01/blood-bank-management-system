export function getReceivingBloodGroups(bloodGroup: string): string[] {
    const receivingCompatibility: { [key: string]: string[] } = {
      "O-": ["O-"],
      "O+": ["O-", "O+"],
      "A-": ["O-", "A-"],
      "A+": ["O-", "O+", "A-", "A+"],
      "B-": ["O-", "B-"],
      "B+": ["O-", "O+", "B-", "B+"],
      "AB-": ["O-", "A-", "B-", "AB-"],
      "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    };
  
    const matches = receivingCompatibility[bloodGroup.toUpperCase()];
    console.log(matches); 
    if (!matches) {
      console.log("Invalid blood group provided.");
    }
    return matches;
  }
  
  