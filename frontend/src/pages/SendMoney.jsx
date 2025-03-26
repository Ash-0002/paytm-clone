import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const presetAmounts = [100, 200, 500, 2000];
  const navigate = useNavigate();

  const handleTransfer = async () => {
    if (!amount || amount <= 0) {
      setStatusMessage("Please enter a valid amount.");
      return;
    }

    try {
      setIsTransferring(true);
      const response = await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        { to: id, amount: Number(amount) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        setStatusMessage("Transfer Successful!");
        resetForm();
      }
    } catch (error) {
      setStatusMessage(error.response?.data?.message || "Transfer Failed!");
      console.error("Transfer failed", error);
    } finally {
      setIsTransferring(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handlePresetAmount = (value) => {
    setAmount(value.toString());
  };

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border max-w-md p-6 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer w-10 h-10 bg-green-500 mr-4 rounded-full text-white flex items-center justify-center text-xs"
            >
              Back
            </button>
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>

          <div className="px-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">
                  {name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>

            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount (in Rs)
              </label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
                id="amount"
                placeholder="Enter Amount"
              />
            </div>

            <div className="flex space-x-4">
              {presetAmounts.map((value) => (
                <button
                  key={value}
                  onClick={() => handlePresetAmount(value)}
                  className="rounded-md text-xs font-medium h-10 w-16 bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  +{value}
                </button>
              ))}
            </div>

            <button
              onClick={!isTransferring ? handleTransfer : null}
              className="rounded-md text-sm font-medium h-10 w-full bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
              disabled={isTransferring}
            >
              {isTransferring ? "Transferring..." : "Transfer"}
            </button>

            {statusMessage && (
              <p
                className={`text-center mt-2 ${
                  statusMessage.includes("Successful")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {statusMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
