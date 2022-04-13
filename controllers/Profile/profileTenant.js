import Tenant from "../../models/tenantModel.js";

async function EditProfileName ( req, res ) {
    try {
        const { tenant_id, profileName } = req.body;

        // Find Tenant
        const checkTenant = await Tenant.findOne({ tenant_id });

        if ( checkTenant ) {
            checkTenant.name = profileName;
            await checkTenant.save();

            return res.status(200).json({
                status  : "SUCCESS",
                message : "Profile name has been changed",
                data    : checkTenant,
              })
        } else {
            return res.status(404).json({
              status  : "FAILED",
              message : "Tenant is not found",
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
          status  : "FAILED",
          message : error.message 
        });
    }
}

async function EditProfileColor ( req, res ) {
    try {
        const { tenant_id, profileColor } = req.body;

        // Find Tenant
        const checkTenant = await Tenant.findOne({ tenant_id });

        if ( checkTenant ) {
            checkTenant.profileColor = profileColor;
            await checkTenant.save();

            return res.status(200).json({
                status  : "SUCCESS",
                message : "Profile Color has been changed",
                data    : checkTenant,
              })
        } else {
            return res.status(404).json({
              status  : "FAILED",
              message : "Tenant is not found",
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
          status  : "FAILED",
          message : error.message 
        });
    }
}

async function EditProfileAddress ( req, res ) {
  try {
      const { tenant_id, address } = req.body;

      // Find Tenant
      const checkTenant = await Tenant.findOne({ tenant_id });

      if ( checkTenant ) {
          checkTenant.address = address;
          await checkTenant.save();

          return res.status(200).json({
              status  : "SUCCESS",
              message : "Profile address has been changed",
              data    : checkTenant,
            })
      } else {
          return res.status(404).json({
            status  : "FAILED",
            message : "Tenant is not found",
          })
      }

  } catch (error) {
      console.log(error);
      res.status(500).json({ 
        status  : "FAILED",
        message : error.message 
      });
  }
}


async function EditTaxCharge ( req, res ) {
    try {
        const { tenant_id, charges } = req.body;

        // Find Tenant
        const checkTenant = await Tenant.findOne({ tenant_id });

        if ( checkTenant ) {
            checkTenant.taxCharge = charges;
            await checkTenant.save();

            return res.status(200).json({
                status  : "SUCCESS",
                message : "Tax charges has been changed",
                data    : checkTenant,
              })
        } else {
            return res.status(404).json({
              status  : "FAILED",
              message : "Tenant is not found",
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
          status  : "FAILED",
          message : error.message 
        });
    }
}

async function EditServiceCharge ( req, res ) {
  try {
      const { tenant_id, charges } = req.body;

      // Find Tenant
      const checkTenant = await Tenant.findOne({ tenant_id })

      if ( checkTenant ) {
          checkTenant.serviceCharge = charges;
          await checkTenant.save();

          return res.status(200).json({
              status  : "SUCCESS",
              message : "Service charges has been changed",
              data    : checkTenant,
            })
      } else {
          return res.status(404).json({
            status  : "FAILED",
            message : "Tenant is not found",
          })
        }

  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      status  : "FAILED",
      message : error.message 
    });
  }
}

async function EditOpeningHours ( req, res ) {
  try {
    const { tenant_id, day, is24Hours, isClosed, OpenHour, OpenMins, OpenTF, CloseHour, CloseMins, CloseTF } = req.body;
    // console.log(req.body);

    let index = 0;
    if ( day == "Monday" )    { index = 0 }
    else if ( day == "Tuesday" )   { index = 1 }
    else if ( day == "Wednesday" ) { index = 2 }
    else if ( day == "Thursday" )  { index = 3 }
    else if ( day == "Friday" )    { index = 4 }
    else if ( day == "Saturday" )  { index = 5 }
    else if ( day == "Sunday" )    { index = 6 }
    else { index = 7 }


    const checkTenant = await Tenant.findOne({ tenant_id }, {
      openingDays: { day : day }
    }) 

  

    if ( checkTenant ) {
      checkTenant.openingDays[index].is24Hours  = is24Hours;
      checkTenant.openingDays[index].isClosed   = isClosed;
      checkTenant.openingDays[index].OpenHour   = OpenHour;
      checkTenant.openingDays[index].OpenMins   = OpenMins;
      checkTenant.openingDays[index].OpenTF     = OpenTF;
      checkTenant.openingDays[index].CloseHour  = CloseHour;
      checkTenant.openingDays[index].CloseMins  = CloseMins;
      checkTenant.openingDays[index].CloseTF    = CloseTF;
      await checkTenant.save();
      
      return res.status(200).json({
        status  : "SUCCESS",
        message : "Service charges has been changed",
        data    : checkTenant
      })

    }
    console.log(checkTenant);

    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      status  : "FAILED",
      message : error.message 
    });
  }
}

export { EditProfileName, EditProfileColor, EditProfileAddress, EditTaxCharge , EditServiceCharge, EditOpeningHours };