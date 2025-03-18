const express = require("express");
const { authMiddleware } = require("../middleware");
const router = express.Router();
const { default: mongoose } = require("mongoose");
const { Account } = require("../db");

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.json({ balance: account.balance });
    } catch (error) {
        res.status(500).json({ message: "Error fetching balance", error: error.message });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { amount, to } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid transfer amount" });
        }

        if (req.userId === to) {
            return res.status(400).json({ message: "Cannot transfer to yourself" });
        }

        const account = await Account.findOne({ userId: req.userId }).session(session);
        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid Account" });
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).setOptions({ session });
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).setOptions({ session });

        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Transaction failed", error: error.message });
    } finally {
        session.endSession();
    }
});

module.exports = router;
