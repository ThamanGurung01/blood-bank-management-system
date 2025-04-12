const EXPIRY_RULES = {
    "whole_blood": 42,
    "rbc": 42,
    "platelets": 5,
    "plasma": 365,
    "cryoprecipitate": 365,
  };

  type BloodComponent = keyof typeof EXPIRY_RULES;
  
  export function calculateExpiry(component: string | undefined, collectedAt: Date|undefined): Date {
    if(!component) throw new Error("Component type is required");
    if(!collectedAt) throw new Error("Collected date is required");
    const key = component.toLowerCase() as BloodComponent;
    const days = EXPIRY_RULES[key];
    if (days === undefined) throw new Error("Invalid component type");
    const date = new Date(collectedAt);
    date.setDate(date.getDate() + days);
    return date;
  }
  