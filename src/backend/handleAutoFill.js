import mainEntry from "../Entities/mainEntry";

export const handleFunctions = (value) => {
    const tempValue = {
      ...mainEntry, 
      ...value, 
      vendorRateGBP: value.vendorRateGBP?value.vendorRateGBP:"0",
      vendorResource: value.vendorResource?value.vendorResource:"0"
    }
    const sampleEntry = {...value};
    // Complexity and T-Shirt
    const systems = parseInt(sampleEntry.numOfSystems);
    if (systems >= 1 && systems <= 3) {

      tempValue.complexity = "Low" ;
      tempValue.tShirt = "Small";
      tempValue.hoursTo.developPerRequirement = 40;
      tempValue.hoursTo.performTestPerRequirement = 80;
      tempValue.hoursTo.performDesignPerRequirement = 40;
      tempValue.hoursTo.performPMperRequirement = 80;
      tempValue.hoursTo.performBAperRequirement = 8;

    }else if (systems === 4 || systems === 5) {

      tempValue.complexity = "Medium";
      tempValue.tShirt = "Medium";
      tempValue.hoursTo.developPerRequirement = 80;
      tempValue.hoursTo.performTestPerRequirement = 120;
      tempValue.hoursTo.performDesignPerRequirement = 80;
      tempValue.hoursTo.performPMperRequirement = 120;
      tempValue.hoursTo.performBAperRequirement = 16;

    }else if (systems >= 6 && systems <= 9) {

      tempValue.complexity = "High";
      tempValue.tShirt = "Large";
      tempValue.hoursTo.developPerRequirement = 120;
      tempValue.hoursTo.performTestPerRequirement = 160;
      tempValue.hoursTo.performDesignPerRequirement = 120;
      tempValue.hoursTo.performPMperRequirement = 160;
      tempValue.hoursTo.performBAperRequirement = 24;

    }else if (systems >= 10) {

      tempValue.complexity = "Very High";
      tempValue.tShirt = "XL";
      tempValue.hoursTo.developPerRequirement = 160;
      tempValue.hoursTo.performTestPerRequirement = 200;
      tempValue.hoursTo.performDesignPerRequirement = 200;
      tempValue.hoursTo.performPMperRequirement = 180;
      tempValue.hoursTo.performBAperRequirement = 32;

    }else {

      tempValue.complexity = "High";
      tempValue.tShirt = "Large";
      tempValue.hoursTo.developPerRequirement = 120;
      tempValue.hoursTo.performTestPerRequirement = 160;
      tempValue.hoursTo.performDesignPerRequirement = 120;
      tempValue.hoursTo.performPMperRequirement = 160;
      tempValue.hoursTo.performBAperRequirement = 24;

    }

    const tempSum = tempValue.hoursTo.developPerRequirement + tempValue.hoursTo.performTestPerRequirement + tempValue.hoursTo.performDesignPerRequirement;
    console.log(tempSum + " ########")
    tempValue.hoursTo.p40thirdPartyVendorPerRequirement = tempValue.thirdPartySystem.p40Effort? ((0.4 * tempSum) * tempValue.thirdPartySystem.p40Effort) : 0;
    tempValue.hoursTo.p20thirdPartyVendorPerRequirement = tempValue.thirdPartySystem.p20Effort? ((0.2 * tempSum) * tempValue.thirdPartySystem.p20Effort) : 0;
    tempValue.hoursTo.p10thirdPartyVendorPerRequirement = tempValue.thirdPartySystem.p10Effort? ((0.1 * tempSum) * tempValue.thirdPartySystem.p10Effort) : 0;
    
    const req = parseInt(sampleEntry.numOfRequirements);
    tempValue.estimatedTime.hours = 
    (req * tempValue.hoursTo.developPerRequirement) + 
    (req * tempValue.hoursTo.performTestPerRequirement) + 
    (req * tempValue.hoursTo.performDesignPerRequirement) +
    (req * tempValue.hoursTo.performPMperRequirement) +
    (req * tempValue.hoursTo.performBAperRequirement) + 
    (req * tempValue.hoursTo.p40thirdPartyVendorPerRequirement) + 
    (req * tempValue.hoursTo.p20thirdPartyVendorPerRequirement) + 
    (req * tempValue.hoursTo.p10thirdPartyVendorPerRequirement);

    tempValue.estimatedTime.days = Math.ceil(tempValue.estimatedTime.hours / 8);
    
    tempValue.estimatedTotalCost = 
    ((tempValue.resources.l6 * 100) + 
    (tempValue.resources.l5 * 155) + 
    (tempValue.resources.l4 * 285) + 
    (parseInt(tempValue.vendorResource) * parseInt(tempValue.vendorRateGBP))) 
    * 
    tempValue.estimatedTime.days

    return tempValue
  }