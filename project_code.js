'use strict';

const { Contract } = require('fabric-contract-api');

class HealthInsuranceContract extends Contract {
    async instantiate(ctx) {
        console.log('Chaincode instantiated');
    }

    // Data Structures
    Policy = class {
        constructor(policyID, policyholder, coverageLimit, hospital, insuranceProvider) {
            this.policyID = policyID;
            this.policyholder = policyholder;
            this.coverageLimit = coverageLimit;
            this.hospital = hospital;
            this.insuranceProvider = insuranceProvider;
            this.isActive = true;
        }
    };

    Claim = class {
        constructor(claimID, policyID, claimant, natureOfClaim, claimedAmount) {
            this.claimID = claimID;
            this.policyID = policyID;
            this.claimant = claimant;
            this.natureOfClaim = natureOfClaim;
            this.claimedAmount = claimedAmount;
            this.isApproved = false;
        }
    };

    Hospital = class {
        constructor(hospitalID, name, location) {
            this.hospitalID = hospitalID;
            this.name = name;
            this.location = location;
        }
    };

    InsuranceProvider = class {
        constructor(providerID, name, location) {
            this.providerID = providerID;
            this.name = name;
            this.location = location;
        }
    };

    // Functions
    async createPolicy(ctx, policyID, policyholder, coverageLimit, hospitalID, providerID) {
        // Check if hospital and insurance provider exist
        await this.getHospital(ctx, hospitalID);
        await this.getInsuranceProvider(ctx, providerID);

        const policy = new this.Policy(policyID, policyholder, coverageLimit, hospitalID, providerID);
        await ctx.stub.putState(Policy:${policyID}, Buffer.from(JSON.stringify(policy)));
    }

    async submitClaim(ctx, claimID, policyID, claimant, natureOfClaim, claimedAmount) {
        const policyBytes = await ctx.stub.getState(Policy:${policyID});
        if (!policyBytes || policyBytes.length === 0) {
            throw new Error(Policy with ID ${policyID} does not exist.);
        }

        const claim = new this.Claim(claimID, policyID, claimant, natureOfClaim, claimedAmount);
        await ctx.stub.putState(Claim:${claimID}, Buffer.from(JSON.stringify(claim)));
    }

    async getPolicy(ctx, policyID) {
        const policyBytes = await ctx.stub.getState(Policy:${policyID});
        if (!policyBytes || policyBytes.length === 0) {
            throw new Error(Policy with ID ${policyID} does not exist.);
        }

        return policyBytes.toString();
    }

    async getClaim(ctx, claimID) {
        const claimBytes = await ctx.stub.getState(Claim:${claimID});
        if (!claimBytes || claimBytes.length === 0) {
            throw new Error(Claim with ID ${claimID} does not exist.);
        }

        return claimBytes.toString();
    }

    async getHospital(ctx, hospitalID) {
        const hospitalBytes = await ctx.stub.getState(Hospital:${hospitalID});
        if (!hospitalBytes || hospitalBytes.length === 0) {
            throw new Error(Hospital with ID ${hospitalID} does not exist.);
        }

        return hospitalBytes.toString();
    }

    async getInsuranceProvider(ctx, providerID) {
        const providerBytes = await ctx.stub.getState(InsuranceProvider:${providerID});
        if (!providerBytes || providerBytes.length === 0) {
            throw new Error(Insurance Provider with ID ${providerID} does not exist.);
        }

        return providerBytes.toString();
    }

    async createHospital(ctx, hospitalID, name, location) {
        const hospital = new this.Hospital(hospitalID, name, location);
        await ctx.stub.putState(Hospital:${hospitalID}, Buffer.from(JSON.stringify(hospital)));
    }

    async createInsuranceProvider(ctx, providerID, name, location) {
        const provider = new this.InsuranceProvider(providerID, name, location);
        await ctx.stub.putState(InsuranceProvider:${providerID}, Buffer.from(JSON.stringify(provider)));
    }
}

module.exports = HealthInsuranceContract;