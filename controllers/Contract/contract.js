import Contract from "../../models/contractModel.js";

async function CreateContract(req, res) {
  try {
    const { tenant_id } = req.params;
    const { start_Date, contract_Period } = req.body;

    // Find Tenant
    const checkTenant = await Contract.findOne({ tenant_id });

    if (!checkTenant) {
      const newContract = new Contract({
        tenant_id: tenant_id,
        start_Date: start_Date,
        contract_period: contract_Period,
      });
      await newContract.save();

      return res.status(200).json({
        status: "SUCCESS",
        message: "Contract has been created",
        data: checkTenant,
      });
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "Contract is not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

async function GetContractDetails(req, res) {
  try {
    const { tenant_id } = req.params;

    // Find Contract
    const checkTenant = await Contract.findOne({ tenant_id });

    if (checkTenant) {
      return res.status(200).json({
        status: "SUCCESS",
        message: "Contract has been found",
        data: checkTenant,
      });
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "Contract is not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

async function EditContract(req, res) {
  try {
    const { tenant_id } = req.params;
    const { start_Date, contract_Period } = req.body;

    // Find Tenant
    const checkTenant = await Contract.findOne({ tenant_id });

    if (checkTenant) {
      const updateContract = await Contract.updateOne(
        {
          tenant_id: tenant_id,
        },
        {
          $set: {
            start_Date: start_Date,
            contract_period: contract_Period,
          },
        }
      );

      if (updateContract) {
        const checkAfterUpdate = await Contract.findOne({
          tenant_id: tenant_id,
        });

        return res.status(200).json({
          status: "SUCCESS",
          message: "Contract has been updated",
          data: checkAfterUpdate,
        });
      } else {
        return res.status(404).json({
          status: "FAILED",
          message: "Contract failed to be updated",
        });
      }
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "Contract is not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

async function RemoveContract(req, res) {
  try {
    const { tenant_id } = req.params;
    const { start_Date, contract_Period } = req.body;

    // Find Tenant
    const checkTenant = await Contract.findOne({ tenant_id });

    if (checkTenant) {
      const deleteContract = await Contract.updateOne(
        {
          tenant_id: tenant_id,
        },
        {
          $pull: {
            tenant_id: tenant_id,
          },
        }
      );

      if (deleteContract) {
        return res.status(200).json({
          status: "SUCCESS",
          message: "Contract has been deleted",
        });
      } else {
        return res.status(404).json({
          status: "FAILED",
          message: "Contract failed to be deleted",
        });
      }
    } else {
      return res.status(404).json({
        status: "FAILED",
        message: "Contract is not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

export { CreateContract, GetContractDetails, EditContract, RemoveContract };
