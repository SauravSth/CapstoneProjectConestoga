import React, { useEffect, useState } from 'react';
import useBillSplitStore from '../../store/useBillSpiltStore';

const BillSplit = () => {
  const {
    totalBill,
    tipPercentage,
    numberOfPeople,
    setTotalBill,
    setTipPercentage,
    setNumberOfPeople,
  } = useBillSplitStore();
  const [totalWithTip, setTotalWithTip] = useState(0);
  const [splitAmount, setSplitAmount] = useState(0);

  useEffect(() => {
    const calculatedTotalWithTip =
      totalBill + (totalBill * tipPercentage) / 100;
    setTotalWithTip(calculatedTotalWithTip);
    setSplitAmount(calculatedTotalWithTip / numberOfPeople);
  }, [totalBill, tipPercentage, numberOfPeople]);

  return (
    <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center mb-4">Bill Splitter</h2>
      <div className="flex flex-col space-y-4">
        {/* Total Bill Input */}
        <label className="flex flex-col">
          <span className="font-medium">Total Bill ($):</span>
          <input
            type="number"
            min="0"
            className="p-2 border border-gray-300 rounded"
            value={totalBill}
            onChange={(e) => setTotalBill(parseFloat(e.target.value))}
          />
        </label>

        {/* Tip Percentage Input */}
        <label className="flex flex-col">
          <span className="font-medium">Tip Percentage (%):</span>
          <input
            type="number"
            min="0"
            className="p-2 border border-gray-300 rounded"
            value={tipPercentage}
            onChange={(e) => setTipPercentage(parseFloat(e.target.value))}
          />
        </label>

        {/* Number of People Input */}
        <label className="flex flex-col">
          <span className="font-medium">Number of People:</span>
          <input
            type="number"
            min="1"
            className="p-2 border border-gray-300 rounded"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
          />
        </label>

        {/* Display Results */}
        <div className="pt-4 border-t mt-4">
          <p className="text-lg font-semibold">
            Total with Tip: ${totalWithTip.toFixed(2)}
          </p>
          <p className="text-lg font-semibold">
            Amount per Person: ${splitAmount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillSplit;
