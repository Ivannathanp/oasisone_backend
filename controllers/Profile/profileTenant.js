import Tenant from "../../models/tenantModel.js";

async function EditTaxCharge ( req, res ) {
    try {
        const { tenant_id, charges } = req.body;

        // Find Tenant
        const checkTenant = await Tenant.findOne({ tenant_id })

        if ( checkTenant ) {
            checkTenant.taxCharge = charges;
            await checkTenant.save();

            return res.status(200).json({
                status  : "SUCCESS",
                message : "Tax charges has been changed",
                data    : checkTenant,
              })
        } else {
            return res.status(401).json({
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
            return res.status(401).json({
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

export { EditTaxCharge , EditServiceCharge };