import GatePass from "../models/gatePass.js";

// 🧍 Create a new Gate Pass
export async function createGatePass(req, res) {
  try {
    const data = req.body;

    // In a real app, you’d get the logged-in user info from req.user (auth middleware)
    const user = req.user || {
      id: data.userId || "TEMP123", // fallback for now
      name: data.employeeName,
      email: data.email || "unknown@example.com",
    };

    const gatePass = new GatePass({
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      department: data.department,
      nicNo: data.nicNo,
      date: data.date,
      timeOut: data.timeOut,
      timeIn: data.timeIn,
      place: data.place,
      reason: data.reason,
      requestedBy: {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
    });

    await gatePass.save();
    res.json({ message: "Gate pass created successfully", gatePass });
  } catch (error) {
    console.error("Error creating gate pass:", error);
    res.status(500).json({ message: "Gate pass creation failed", error: error.message });
  }
}

export async function ExecutiveApprovedGatePasses(req, res) {
  try {
    const { id } = req.params;
    const { approvedBy, remarks } = req.body;

    const gatePass = await GatePass.findById(id);
    if (!gatePass) return res.status(404).json({ message: "Gate pass not found" });

    gatePass.executiveApprovals.push({ approvedBy, remarks });
    gatePass.status = "ExecutiveApproved";
    await gatePass.save();

    res.json({ message: "Executive approved successfully", gatePass });
  } catch (error) {
    console.error("Error approving gate pass (executive):", error);
    res.status(500).json({ message: "Executive approval failed", error: error.message });
  }
}

export async function ManagerApprovedGatePasses(req, res) {
  try {
    const { id } = req.params;
    const { approvedBy, remarks } = req.body;

    const gatePass = await GatePass.findById(id);
    if (!gatePass) return res.status(404).json({ message: "Gate pass not found" });

    if (gatePass.executiveApprovals.length === 0) {
      return res.status(400).json({ message: "Manager can approve only after executive approval." });
    }

    gatePass.managerApproval = { approvedBy, remarks, approvedAt: new Date() };
    gatePass.status = "FullyApproved";
    await gatePass.save();

    res.json({ message: "Manager approved successfully", gatePass });
  } catch (error) {
    console.error("Error approving gate pass (manager):", error);
    res.status(500).json({ message: "Manager approval failed", error: error.message });
  }
}
