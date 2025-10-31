import mongoose from "mongoose";

const approvalSchema = new mongoose.Schema({
  approvedBy: { type: String, required: true },
  approvedAt: { type: Date, default: Date.now },
  remarks: String,
});

const gatePassSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  department: { type: String, required: true },
  nicNo: { type: String, required: true },
  date: { type: Date, default: Date.now },
  timeOut: { type: String, required: true },
  timeIn: { type: String, required: true },
  place: { type: String, required: true },
  reason: { type: String, required: true },

  requestedBy: {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: String,
  },

  executiveApprovals: [approvalSchema],
  managerApproval: approvalSchema,

  status: {
    type: String,
    enum: ["Pending", "ExecutiveApproved", "FullyApproved", "Rejected"],
    default: "Pending",
  },

  createdAt: { type: Date, default: Date.now },
});

const GatePass = mongoose.model("GatePass", gatePassSchema);
export default GatePass;
