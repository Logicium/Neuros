var numbers = require('numbers');

var Neuron = function(){
    this.InhibitoryConductance = 0; //gi
    this.InhibitoryDrivingPotential = 0; //Ei
    this.ActionPotentialThreshold = 0;// O
    this.MembranePotential = 0; //Vm
    this.MembranePotentialPrevious = 0;
    this.ExcitatoryDrivingPotential = 0; //Ee
    this.ExcitatoryConductance = 0; //ge
    this.LeakConductance = 0;
    this.LeakDrivingPotential = 0;

    this.ExcitatoryCurrent = 0; //Ie
    this.InhibitoryCurrent = 0; //Ii
    this.LeakCurrent = 0; //Il

    this.NetCurrent = 0;//Inet

    this.RateConstant = 0;

    this.MaximumConductanceE = 0; //gBarE
    this.ConductanceRatioE = 0; //gE(t)
    this.MaximumConductanceI = 0; //gBarI
    this.ConductanceRatioI = 0;//gI(t)
    this.MaximumConductanceL = 0;//gBarL

    this.Activity =0;
    this.SynapticWeightStrength = 0;

    this.OutputActivationValue = 0;

    this.gain  = 1;
};

Neuron.prototype = {

    computeExcitatoryCurrent: function(){
        this.ExcitatoryCurrent = this.ExcitatoryConductance * (this.ExcitatoryDrivingPotential - this.MembranePotential);
        return this.ExcitatoryCurrent;
    },

    computeInhibitoryCurrent: function(){
        this.InhibitoryCurrent = this.InhibitoryConductance * (this.InhibitoryDrivingPotential - this.MembranePotential);
        return this.InhibitoryCurrent;
    },

    computeLeakCurrent: function(){
        this.LeakCurrent = this.LeakConductance * (this.LeakDrivingPotential - this.MembranePotential);
        return this.LeakCurrent;
    },

    computeNetCurrent: function(){
        this.NetCurrent = this.computeExcitatoryCurrent() + this.computeInhibitoryCurrent() + this.computeLeakCurrent();
        return this.NetCurrent;
    },

    updateMembranePotential: function(){
        this.MembranePotential = this.MembranePotentialPrevious + this.RateConstant * this.computeNetCurrent();
    },

    computeExcitatoryConductance : function(){return this.MaximumConductanceE*this.computeConductanceRatioE()},
    computeInhibitoryConductance: function(){return this.MaximumConductanceI * this.computeConductanceRatioI()},
    computeLeakConductance: function(){return this.MaximumConductanceL},

    computeConductanceRatioE : function(Neurons){
        var n = Neurons.length;
        var summation = 0;
        for(var i = 0;i<Neurons.length,i++;){
            var a = Neurons[i].Activity;
            var w = Neurons[i].SynapticWeightStrength;
            summation += a * w;
        }
        this.ConductanceRatioE =((1/n) * summation);
        return ((1/n) * summation);
    },
    computeConductanceRatioI: function(Neurons){
        var n = Neurons.length;
        var summation = 0;
        for(var i = 0;i<Neurons.length,i++;){
            var a = Neurons[i].Activity;
            var w = Neurons[i].SynapticWeightStrength;
            summation += a * w;
        }
        this.ConductanceRatioI =((1/n) * summation);
        return ((1/n) * summation);
    },

    computeEquilibriumMembranePotential: function(){
        this.MembranePotential  =
            ((this.computeExcitatoryConductance() /
            this.computeExcitatoryConductance+this.computeInhibitoryConductance()+this.computeLeakConductance()) *
            this.ExcitatoryDrivingPotential) +

            ((this.computeInhibitoryConductance() /
            this.computeExcitatoryConductance+this.computeInhibitoryConductance()+this.computeLeakConductance()) *
            this.InhibitoryDrivingPotential) +

            ((this.computeExcitatoryConductance() /
            this.computeExcitatoryConductance+this.computeInhibitoryConductance()+this.computeLeakConductance()) *
            this.LeakDrivingPotential)
    },

    computeActivationExcitationInput : function(){
       this.ActivationExcitationInput =
           ( this.computeInhibitoryConductance() *
           (this.InputDrivingPotential - this.ActionPotentialThreshold) +
           this.computeLeakConductance() * (this.LeakDrivingPotential - this.ActionPotentialThreshold)) /
           this.ActionPotentialThreshold - this.ExcitatoryDrivingPotential
    },

    computeRateCodedOutputActivationValue : function(){
        this.OutputActivationValue = this.xx1(this.computeExcitatoryConductance() - this.computeActivationExcitationInput());
        return this.OutputActivationValue;
    },

    xx1 : function(x){
        x = this.gain(x);
        return x / x + 1;
    },

    gain : function(x){
        return this.gain * x;
    }

};